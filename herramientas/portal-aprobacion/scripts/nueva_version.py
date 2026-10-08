#!/usr/bin/env python3
"""Suma un video a un proyecto de la Sala de revisión (crea el proyecto si no existe).

Prepara una copia liviana para revisar (H.264, máx. 1080 px de lado corto, inicio rápido,
sin metadatos como la ubicación del celular), saca un póster y actualiza
<web>/proyectos/<proyecto>/proyecto.json con la nueva versión. Nunca pisa una versión
anterior: la nueva siempre es la siguiente a la más alta.

<web> es la carpeta que publicás en Cloudflare Pages. Los proyectos de clientes van en una
copia de web/ FUERA de este repo (es público): pasala con --web o con la variable
SALA_REVISION_WEB. Dentro del repo solo se acepta el proyecto "demo".

Uso:
  python3 nueva_version.py <proyecto> <video> [--web carpeta] [--nota "qué cambió"] [--pieza "Reel ..."] [--cliente "..."] [--entrega 2026-10-15]

Ejemplo:
  export SALA_REVISION_WEB=~/LonsoLab/sala-revision-web
  python3 nueva_version.py reel-octubre-3f9a1c render_final.mp4 --pieza "Reel · Promo de octubre" --cliente "Panadería Ejemplo" --entrega 2026-10-15
  python3 nueva_version.py reel-octubre-3f9a1c "render v2.mp4" --nota "Más corto el cierre y logo al final"
"""
import argparse
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

WEB_REPO = Path(__file__).resolve().parent.parent / "web"
MAX_MB = 24  # Cloudflare Pages acepta archivos de hasta 25 MiB
# (lado corto máximo, CRF): se prueba en orden hasta que el archivo entra en MAX_MB.
INTENTOS = [(1080, 23), (1080, 26), (1080, 29), (1080, 32), (720, 30), (720, 34)]
FALTA_FFMPEG = ("Falta ffmpeg (trae ffprobe). Instalalo y probá de nuevo: "
                "Mac: brew install ffmpeg · Ubuntu: sudo apt install ffmpeg · Windows: winget install ffmpeg")


def run(cmd, que):
    """Corre ffmpeg/ffprobe. Si falla, corta con un mensaje claro y las últimas líneas del error."""
    try:
        return subprocess.run(cmd, check=True, capture_output=True, text=True, errors="replace")
    except FileNotFoundError:
        sys.exit(FALTA_FFMPEG)
    except subprocess.CalledProcessError as e:
        detalle = "\n".join("  " + l for l in (e.stderr or "").strip().splitlines()[-5:])
        sys.exit(f"ffmpeg no pudo {que}." + (f" Detalle:\n{detalle}" if detalle else ""))


def analizar(origen):
    """Devuelve True si el video tiene audio. Corta si el archivo no es un video."""
    r = run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(origen)],
            f"leer {origen.name} (¿es un video?)")
    try:
        info = json.loads(r.stdout or "{}")
    except ValueError:
        info = {}
    streams = info.get("streams") or []
    formato = (info.get("format") or {}).get("format_name", "")
    videos = [s for s in streams if s.get("codec_type") == "video" and not (s.get("disposition") or {}).get("attached_pic")]
    if not videos:
        sys.exit(f"{origen.name} no tiene imagen de video (¿es solo audio?).")
    if formato.endswith("_pipe") or formato == "image2":
        sys.exit(f"{origen.name} es una imagen, no un video.")
    return any(s.get("codec_type") == "audio" for s in streams)


def preparar(origen, destino, lado, crf, con_audio):
    # Lado corto a lo sumo `lado` px y siempre par (H.264 en yuv420p no acepta medidas impares).
    corto = "min({0},trunc({1}/2)*2)"
    vf = f"scale='if(gt(iw,ih),-2,{corto.format(lado, 'iw')})':'if(gt(iw,ih),{corto.format(lado, 'ih')},-2)'"
    audio = ["-map", "0:a:0", "-c:a", "aac", "-b:a", "128k", "-ac", "2"] if con_audio else ["-an"]
    run([
        "ffmpeg", "-nostdin", "-y", "-loglevel", "error", "-i", str(origen),
        "-map", "0:V:0", *audio, "-sn", "-dn", "-map_metadata", "-1", "-map_chapters", "-1",
        "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", str(destino),
    ], f"convertir {origen.name}")


def poster(video, destino):
    """Saca un cuadro (al segundo 1, o al principio si el video es más corto). Devuelve True si salió."""
    for t in ("1", "0"):
        subprocess.run([
            "ffmpeg", "-nostdin", "-y", "-loglevel", "error", "-ss", t, "-i", str(video), "-frames:v", "1",
            "-vf", "scale='if(gt(iw,ih),-2,540)':'if(gt(iw,ih),540,-2)'", "-q:v", "4", str(destino),
        ], capture_output=True)
        if destino.exists() and destino.stat().st_size > 0:
            return True
    return False


def va_al_repo_publico(carpeta):
    """True si `carpeta` queda dentro de este repo (público en GitHub) y git no la ignora."""
    try:
        r = subprocess.run(["git", "-C", str(Path(__file__).resolve().parent), "rev-parse", "--show-toplevel"],
                           capture_output=True, text=True)
        if r.returncode != 0:
            return False
        raiz = Path(r.stdout.strip()).resolve()
        carpeta.relative_to(raiz)
        r = subprocess.run(["git", "-C", str(raiz), "check-ignore", "-q", str(carpeta)], capture_output=True)
    except (FileNotFoundError, ValueError):
        return False
    return r.returncode == 1  # 1 = git no la ignora: terminaría en un commit


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("proyecto")
    ap.add_argument("video")
    ap.add_argument("--web", default=os.environ.get("SALA_REVISION_WEB"),
                    help="carpeta que publicás (copia de web/ fuera del repo). Por defecto, SALA_REVISION_WEB")
    ap.add_argument("--nota", default="", help="qué cambió, en lenguaje de cliente (se muestra en la página)")
    ap.add_argument("--pieza")
    ap.add_argument("--cliente")
    ap.add_argument("--entrega", help='AAAA-MM-DD ("" la saca)')
    a = ap.parse_args()

    slug = a.proyecto.strip().lower()
    if not re.fullmatch(r"[a-z0-9-]{2,60}", slug):
        sys.exit("El proyecto solo puede tener letras minúsculas, números y guiones (2 a 60), igual que en la hoja Proyectos.")
    origen = Path(a.video).expanduser()
    if not origen.is_file():
        sys.exit(f"{origen} es una carpeta, no un video." if origen.is_dir() else f"No encuentro el video {origen}")
    origen = origen.resolve()  # ruta absoluta: ffmpeg no confunde un nombre con "algo:" con un protocolo

    web = Path(a.web).expanduser().resolve() if a.web else WEB_REPO
    if not (web / "index.html").is_file():
        sys.exit(f"{web} no es la carpeta del portal (falta index.html). Copiá ahí herramientas/portal-aprobacion/web/.")
    carpeta = web / "proyectos" / slug
    if slug != "demo" and va_al_repo_publico(carpeta):
        sys.exit("No guardo videos de clientes dentro de este repo: es público en GitHub.\n"
                 "Usá tu copia de web/ fuera del repo: --web <carpeta> o export SALA_REVISION_WEB=<carpeta> (ver README).")

    meta_path = carpeta / "proyecto.json"
    if meta_path.exists():
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8-sig"))
        except (OSError, ValueError) as e:
            sys.exit(f"No pude leer {meta_path} ({e}). Arreglalo antes de sumar una versión: no lo piso.")
        if not isinstance(meta, dict) or not isinstance(meta.setdefault("versiones", []), list):
            sys.exit(f"{meta_path} no tiene el formato esperado (falta la lista \"versiones\"). No lo piso.")
    else:
        meta = {"estudio": "LonsoLab · Sala de revisión", "pieza": slug, "cliente": "", "versiones": []}
    if a.pieza and a.pieza.strip():
        meta["pieza"] = a.pieza.strip()
    if a.cliente is not None:
        meta["cliente"] = a.cliente.strip()
    if a.entrega is not None:
        entrega = a.entrega.strip()
        if not entrega:
            meta.pop("entrega", None)
        else:
            try:
                if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", entrega):
                    raise ValueError
                dt.date.fromisoformat(entrega)
            except ValueError:
                sys.exit(f"--entrega tiene que ser una fecha AAAA-MM-DD (por ejemplo 2026-10-15), no «{a.entrega}».")
            meta["entrega"] = entrega
    if slug != "demo":
        meta.pop("ejemplos", None)

    # La nueva versión es la siguiente a la más alta (aunque se haya borrado alguna del medio).
    numeros = [int(m.group(1)) for v in meta["versiones"] if isinstance(v, dict)
               for m in [re.fullmatch(r"v(\d{1,3})", str(v.get("id", "")))] if m]
    n = max(numeros, default=0) + 1
    if n > 999:
        sys.exit("El proyecto ya tiene 999 versiones: creá un proyecto nuevo.")
    vid = f"v{n}"
    destino, destino_jpg = carpeta / f"{vid}.mp4", carpeta / f"{vid}.jpg"
    for f in (destino, destino_jpg):
        if f.exists():
            sys.exit(f"Ya hay un {f.name} en {carpeta} que no figura en proyecto.json. No lo piso: "
                     "si sobra, borralo; si es una versión, sumala a proyecto.json.")
    nota = a.nota.strip()

    con_audio = analizar(origen)
    # Se trabaja en una carpeta temporal: si algo falla o se corta, no queda nada a medias para publicar.
    with tempfile.TemporaryDirectory(prefix="sala-revision-") as tmp:
        tmp_mp4, tmp_jpg = Path(tmp) / "video.mp4", Path(tmp) / "poster.jpg"
        for i, (lado, crf) in enumerate(INTENTOS, 1):
            print(f"Preparando la {vid} (intento {i} de {len(INTENTOS)}, {lado} px)…", flush=True)
            preparar(origen, tmp_mp4, lado, crf, con_audio)
            if tmp_mp4.stat().st_size <= MAX_MB * 1024 * 1024:
                break
        else:
            mb = tmp_mp4.stat().st_size / 1024 / 1024
            sys.exit(f"Aun comprimido a 720 px pesa {mb:.0f} MB y el límite es {MAX_MB} MB: "
                     "acortalo, partilo en dos o subilo a un almacenamiento aparte (ver README).")
        hay_poster = poster(tmp_mp4, tmp_jpg)

        carpeta.mkdir(parents=True, exist_ok=True)
        if destino.exists():
            sys.exit(f"Apareció un {destino.name} en {carpeta} mientras se preparaba el video. No lo piso.")
        shutil.move(str(tmp_mp4), str(destino))
        if hay_poster and not destino_jpg.exists():
            shutil.move(str(tmp_jpg), str(destino_jpg))
        else:
            hay_poster = False

    version = {"id": vid, "archivo": destino.name, "poster": destino_jpg.name, "fecha": dt.date.today().isoformat(), "nota": nota}
    if not hay_poster:
        del version["poster"]
    meta["versiones"].append(version)
    tmp_json = meta_path.with_name(meta_path.name + ".tmp")
    tmp_json.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp_json, meta_path)  # nunca queda un proyecto.json a medio escribir

    mb = destino.stat().st_size / 1024 / 1024
    print(f"Listo: {slug} {vid} ({mb:.1f} MB{', sin audio' if not con_audio else ''}) en {carpeta}")
    if not hay_poster:
        print("Aviso: no se pudo sacar el póster; la versión queda sin imagen de portada.")
    if n == 1:
        if meta["pieza"] == slug:
            print(f'Ojo: la página muestra «{slug}» como título. Cambialo en "pieza" de proyecto.json (o usá --pieza "Reel · ...").')
        print(f"Ahora: publicá {web} y mandale al cliente el link que te dio la planilla para «{slug}».")
        print(f"Si «{slug}» no está en la hoja Proyectos, el cliente ve el video pero no puede comentar ni aprobar.")
    else:
        print(f"Ahora: volvé a publicar {web}. El cliente usa el mismo link y ve la {vid}.")
        if not nota:
            print(f"Ojo: sin --nota el cliente no ve qué cambió en la {vid}. Podés escribirla en proyecto.json.")


if __name__ == "__main__":
    main()
