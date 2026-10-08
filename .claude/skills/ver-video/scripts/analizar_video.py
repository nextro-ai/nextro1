#!/usr/bin/env python3
"""Descarga un reel/video desde un link (o toma un archivo local) y lo prepara para analizarlo.

Genera, en una carpeta nueva por video:
  - video.mp4 + video.info.json (metadatos de la plataforma, si es un link)
  - meta.md            resumen: cuenta, caption, duración, vistas, likes, comentarios, engagement
  - transcripcion.txt  lo que se dice, con marcas de tiempo (y transcripcion.srt)
  - cortes.txt         segundos donde hay cambio de plano y ritmo de edición (cortes por segundo)
  - hoja_XX.jpg        hojas de contacto con cuadros clave y su segundo, para mirarlas con Read
  - cuadros/           cuadros individuales en buena resolución

Uso:
  python3 analizar_video.py <link_o_archivo> [--out CARPETA] [--modelo small] [--idioma es] [--max-cuadros 24] [--sin-audio]
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def ensure(module, pip_name):
    try:
        __import__(module)
    except ImportError:
        print(f"Instalando {pip_name}...", flush=True)
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", pip_name], check=True)


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, text=True, capture_output=True, **kw)


def slug(text):
    return re.sub(r"[^A-Za-z0-9_-]+", "-", text).strip("-")[:60] or "video"


def descargar(url, carpeta):
    ensure("yt_dlp", "yt-dlp")
    cmd = [
        sys.executable, "-m", "yt_dlp", "--no-playlist", "--write-info-json",
        "-f", "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/bv*+ba/b",
        "--merge-output-format", "mp4", "-o", str(carpeta / "video.%(ext)s"), url,
    ]
    res = subprocess.run(cmd, text=True, capture_output=True)
    if res.returncode != 0:
        sys.exit(
            "No se pudo descargar el video. Si es privado o pide iniciar sesión, pedile al usuario "
            "que mande el archivo directamente.\n" + res.stderr[-1500:]
        )
    videos = sorted(carpeta.glob("video.*"))
    videos = [v for v in videos if v.suffix in (".mp4", ".mkv", ".webm", ".mov")]
    if not videos:
        sys.exit("La descarga terminó pero no encontré el archivo de video.")
    return videos[0]


def duracion(video):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(video)])
    return float(out.stdout.strip() or 0)


def escribir_meta(carpeta, video, dur):
    info_path = carpeta / "video.info.json"
    info = json.loads(info_path.read_text()) if info_path.exists() else {}
    vistas = info.get("view_count")
    likes = info.get("like_count")
    comentarios = info.get("comment_count")
    lineas = [
        "# Metadatos",
        f"- Link: {info.get('webpage_url', video)}",
        f"- Cuenta: {info.get('uploader') or info.get('channel') or '?'} (@{info.get('uploader_id') or info.get('channel_id') or '?'})",
        f"- Fecha: {info.get('upload_date', '?')}",
        f"- Duración: {dur:.1f} s",
        f"- Vistas: {vistas if vistas is not None else 'no informado'}",
        f"- Likes: {likes if likes is not None else 'no informado'}",
        f"- Comentarios: {comentarios if comentarios is not None else 'no informado'}",
    ]
    if vistas and (likes is not None or comentarios is not None):
        er = ((likes or 0) + (comentarios or 0)) / vistas * 100
        lineas.append(f"- Engagement (likes+comentarios / vistas): {er:.2f} %")
    if likes and comentarios:
        lineas.append(f"- Relación comentarios/likes: {comentarios / likes:.2f} (alto = pide comentar, ej. 'comentá X')")
    musica = info.get("track") or info.get("artist")
    if musica:
        lineas.append(f"- Audio: {info.get('artist', '')} - {info.get('track', '')}")
    lineas += ["", "## Caption / descripción", "", (info.get("description") or info.get("title") or "(sin texto)").strip()]
    (carpeta / "meta.md").write_text("\n".join(lineas) + "\n")


def detectar_cortes(video, umbral=0.3):
    res = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(video), "-vf", f"select='gt(scene,{umbral})',showinfo", "-an", "-f", "null", "-"],
        text=True, capture_output=True,
    )
    cortes = []
    for t in (float(m) for m in re.findall(r"pts_time:([0-9.]+)", res.stderr)):
        # una transición de varios cuadros cuenta como un solo corte
        if not cortes or t - cortes[-1] > 0.4:
            cortes.append(t)
    return cortes


def elegir_tiempos(dur, cortes, maximo):
    # Siempre el arranque (el gancho), cada corte de plano y una muestra pareja para tramos sin cortes.
    tiempos = {0.0, 0.5, 1.5, 3.0}
    tiempos.update(round(c + 0.15, 2) for c in cortes)
    paso = max(dur / maximo, 1.0)
    t = 0.0
    while t < dur:
        tiempos.add(round(t, 2))
        t += paso
    tiempos = sorted(x for x in tiempos if x < max(dur - 0.05, 0.1))
    if len(tiempos) > maximo:
        # conserva el gancho (primeros 3 s) y reparte el resto
        gancho = [x for x in tiempos if x <= 3.0]
        resto = [x for x in tiempos if x > 3.0]
        cupo = max(maximo - len(gancho), 1)
        salto = len(resto) / cupo
        resto = [resto[int(i * salto)] for i in range(cupo)]
        tiempos = gancho + resto
    return tiempos


def extraer_cuadros(video, tiempos, carpeta):
    destino = carpeta / "cuadros"
    destino.mkdir(exist_ok=True)
    archivos = []
    for i, t in enumerate(tiempos):
        salida = destino / f"{i:02d}_{t:06.2f}s.jpg"
        etiqueta = f"{t:.1f}s"
        run([
            "ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t}", "-i", str(video), "-frames:v", "1",
            "-vf", f"scale=540:-2,drawtext=fontfile={FONT}:text='{etiqueta}':x=12:y=12:fontsize=34:"
                   "fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=8",
            "-q:v", "3", str(salida),
        ])
        archivos.append(salida)
    return archivos


def hojas_de_contacto(cuadros, carpeta, por_hoja=12, columnas=6):
    hojas = []
    for n in range(0, len(cuadros), por_hoja):
        grupo = cuadros[n:n + por_hoja]
        lista = carpeta / f"_lista_{n}.txt"
        lista.write_text("".join(f"file '{c.resolve()}'\nduration 1\n" for c in grupo))
        filas = (len(grupo) + columnas - 1) // columnas
        salida = carpeta / f"hoja_{n // por_hoja + 1:02d}.jpg"
        run([
            "ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lista),
            "-vf", f"scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=black,tile={columnas}x{filas}:padding=6:color=white",
            "-frames:v", "1", "-q:v", "3", str(salida),
        ])
        lista.unlink()
        hojas.append(salida)
    return hojas


def transcribir(video, carpeta, modelo, idioma):
    ensure("faster_whisper", "faster-whisper")
    from faster_whisper import WhisperModel

    audio = carpeta / "audio.wav"
    res = subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", str(audio)],
        text=True, capture_output=True,
    )
    if res.returncode != 0 or not audio.exists():
        (carpeta / "transcripcion.txt").write_text("(el video no tiene pista de audio)\n")
        return
    # Se pasa el audio ya decodificado (WAV 16 kHz mono) para no depender de la versión de PyAV.
    import wave
    import numpy as np
    with wave.open(str(audio), "rb") as w:
        muestras = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    model = WhisperModel(modelo, device="cpu", compute_type="int8")
    segmentos, info = model.transcribe(muestras, language=idioma, vad_filter=True)
    txt, srt = [], []
    for i, s in enumerate(segmentos, 1):
        txt.append(f"[{s.start:6.1f}s - {s.end:6.1f}s] {s.text.strip()}")
        srt.append(f"{i}\n{fmt_srt(s.start)} --> {fmt_srt(s.end)}\n{s.text.strip()}\n")
    encabezado = f"Idioma detectado: {info.language} (prob. {info.language_probability:.2f})\n\n"
    (carpeta / "transcripcion.txt").write_text(encabezado + ("\n".join(txt) or "(sin voz detectada: probablemente solo música)") + "\n")
    (carpeta / "transcripcion.srt").write_text("\n".join(srt))
    audio.unlink()


def fmt_srt(t):
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}".replace(".", ",")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("fuente", help="link de Instagram/TikTok/YouTube/etc. o ruta a un archivo de video")
    ap.add_argument("--out", help="carpeta de salida (nueva). Por defecto ./analisis-video/<id>")
    ap.add_argument("--modelo", default="small", help="modelo de transcripción: tiny, base, small, medium (más grande = más lento y preciso)")
    ap.add_argument("--idioma", default=None, help="código de idioma (es, en, pt). Vacío = detectar")
    ap.add_argument("--max-cuadros", type=int, default=24)
    ap.add_argument("--sin-audio", action="store_true", help="no transcribir")
    args = ap.parse_args()

    es_link = re.match(r"^https?://", args.fuente) is not None
    ident = slug(args.fuente.rstrip("/").split("?")[0].split("/")[-1]) if es_link else slug(Path(args.fuente).stem)
    carpeta = Path(args.out) if args.out else Path("analisis-video") / ident
    if carpeta.exists() and any(carpeta.iterdir()):
        sys.exit(f"La carpeta {carpeta} ya existe y no está vacía: usá --out con una carpeta nueva.")
    carpeta.mkdir(parents=True, exist_ok=True)

    if es_link:
        video = descargar(args.fuente, carpeta)
    else:
        origen = Path(args.fuente)
        if not origen.exists():
            sys.exit(f"No existe el archivo {origen}")
        video = carpeta / ("video" + origen.suffix)
        shutil.copy2(origen, video)

    dur = duracion(video)
    escribir_meta(carpeta, video, dur)

    cortes = detectar_cortes(video)
    ritmo = len(cortes) / dur if dur else 0
    (carpeta / "cortes.txt").write_text(
        f"Duración: {dur:.1f} s\nCambios de plano detectados: {len(cortes)}\n"
        f"Ritmo: {ritmo:.2f} cortes/seg (un plano cada {dur / max(len(cortes), 1):.1f} s en promedio)\n"
        "Segundos de cada corte: " + ", ".join(f"{c:.1f}" for c in cortes) + "\n"
    )

    cuadros = extraer_cuadros(video, elegir_tiempos(dur, cortes, args.max_cuadros), carpeta)
    hojas = hojas_de_contacto(cuadros, carpeta)

    if not args.sin_audio:
        transcribir(video, carpeta, args.modelo, args.idioma)

    print(f"LISTO: {carpeta.resolve()}")
    print(f"  meta.md, cortes.txt{'' if args.sin_audio else ', transcripcion.txt'}")
    for h in hojas:
        print(f"  {h.resolve()}")


if __name__ == "__main__":
    main()
