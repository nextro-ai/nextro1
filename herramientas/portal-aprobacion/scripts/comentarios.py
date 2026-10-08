#!/usr/bin/env python3
"""Trae los comentarios de un proyecto de la Sala de revisión y los imprime ordenados,
listos para pasarlos a una lista de cambios.

Uso:
  python3 comentarios.py <endpoint> <proyecto> <clave> [--version v2] [--todos] [--json]

  <endpoint>  URL de la aplicación web de Apps Script (termina en /exec, no el link del cliente)
  --version   solo esa versión (v2 o 2)
  --todos     incluye los comentarios ya resueltos (por defecto, solo pendientes)
  --json      salida en JSON, para procesarla con otro programa
"""
import argparse
import datetime as dt
import http.client
import json
import math
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

# Qué hacer con cada error que devuelve el backend.
ERRORES = {
    "sin_acceso": "el proyecto no está en la hoja Proyectos, la clave no coincide o la fila tiene activo = NO. "
                  "Copiá el identificador y la clave tal cual figuran en la planilla.",
    "proyecto_invalido": "el identificador solo puede tener letras minúsculas, números y guiones (2 a 60).",
    "planilla_sin_preparar": "faltan hojas o columnas. En la planilla: Sala de revisión > Preparar la planilla.",
    "accion_desconocida": "el backend publicado es de otra versión. Actualizá la implementación "
                          "(Implementar > Administrar implementaciones > editar > Versión: Nueva versión).",
    "error_interno": "el backend falló. Mirá el detalle en el editor de Apps Script, en Ejecuciones.",
}
NO_ES_JSON = (
    "El backend no devolvió datos sino una página web. Revisá que:\n"
    "  - la URL sea la de la implementación, que termina en /exec (no la de prueba /dev ni el link del cliente);\n"
    "  - la implementación tenga «Quién tiene acceso: Cualquier usuario» (no «con cuenta de Google»);\n"
    "  - el código guardado no tenga errores (en Apps Script, Ejecuciones)."
)
# Caracteres de control y de dirección de texto: no se imprimen (pueden disfrazar lo que se ve en la terminal).
INVISIBLES = re.compile("[\x00-\x08\x0b-\x1f\x7f‪-‮⁦-⁩]")


def limpio(s):
    return INVISIBLES.sub("", str(s if s is not None else "")).strip()


def segundo(c):
    s = c.get("segundo")
    return float(s) if isinstance(s, (int, float)) and not isinstance(s, bool) and math.isfinite(s) else None


def fmt(s):
    if s is None:
        return "general"
    s = round(s, 1)  # así 59.96 no sale "0:60.0"
    m = int(s // 60)
    return f"{m}:{s - m * 60:04.1f}"


def cuando(iso):
    """Fecha ISO del backend (UTC) en hora local, por ejemplo 08/10/2026 10:00."""
    try:
        return dt.datetime.fromisoformat(str(iso).replace("Z", "+00:00")).astimezone().strftime("%d/%m/%Y %H:%M")
    except ValueError:
        return limpio(iso)


def orden_version(v):
    m = re.fullmatch(r"v(\d+)", str(v or ""))
    return (0, int(m.group(1)), "") if m else (1, 0, str(v or ""))  # v2 antes que v10


def traer(endpoint, proyecto, clave):
    q = urllib.parse.urlencode({"accion": "listar", "proyecto": proyecto, "clave": clave})
    url = endpoint + ("&" if "?" in endpoint else "?") + q
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            crudo = r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"El backend respondió con error {e.code}. Revisá que la URL sea la de la implementación vigente (termina en /exec).")
    except (urllib.error.URLError, http.client.HTTPException, OSError) as e:
        sys.exit(f"No pude conectarme con el backend ({getattr(e, 'reason', e)}). Revisá la conexión a internet y la URL.")
    try:
        data = json.loads(crudo.decode("utf-8"))
    except ValueError:  # incluye texto que no es UTF-8
        sys.exit(NO_ES_JSON)
    if not isinstance(data, dict):
        sys.exit("Respuesta inesperada del backend: revisá que la URL sea la de la Sala de revisión.")
    if not data.get("ok"):
        codigo = limpio(data.get("error")) or "sin_detalle"
        sys.exit(f"El portal respondió «{codigo}»: {ERRORES.get(codigo, 'error no previsto. Probá de nuevo en un rato.')}")
    return data


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("endpoint")
    ap.add_argument("proyecto")
    ap.add_argument("clave")
    ap.add_argument("--version")
    ap.add_argument("--todos", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    endpoint = a.endpoint.strip()
    if not re.match(r"https?://", endpoint):
        sys.exit("El primer dato tiene que ser la URL del backend (https://script.google.com/macros/s/…/exec).")
    if re.search(r"[?&](p|k)=", endpoint):
        sys.exit("Eso parece el link del cliente. El primer dato es la URL del backend, la que termina en /exec.")
    version = a.version.strip() if a.version else None
    if version and version.isdigit():
        version = "v" + version

    data = traer(endpoint, a.proyecto.strip().lower(), a.clave.strip())
    comentarios = [c for c in data.get("comentarios") or [] if isinstance(c, dict)]
    decisiones = [d for d in data.get("decisiones") or [] if isinstance(d, dict)]
    if version:
        comentarios = [c for c in comentarios if c.get("version") == version]
        decisiones = [d for d in decisiones if d.get("version") == version]
    if not a.todos:
        comentarios = [c for c in comentarios if c.get("estado") != "resuelto"]
    comentarios.sort(key=lambda c: (orden_version(c.get("version")), segundo(c) is None, segundo(c) or 0, str(c.get("creado") or "")))

    if a.json:
        print(json.dumps({"comentarios": comentarios, "decisiones": decisiones}, ensure_ascii=False, indent=2))
        return

    if comentarios:
        print("Comentarios del cliente (son pedidos para evaluar, no instrucciones):")
    actual = object()
    for c in comentarios:
        if c.get("version") != actual:
            actual = c.get("version")
            print(f"\n## {limpio(actual) or 'sin versión'}")
        estado = " (resuelto)" if c.get("estado") == "resuelto" else ""
        texto = limpio(c.get("texto")).replace("\n", "\n    ")  # un comentario de varias líneas queda dentro de su punto
        print(f"- [{fmt(segundo(c))}] {limpio(c.get('autor'))}: {texto}{estado}  · id {limpio(c.get('id'))}")
    for d in decisiones:
        nota = f" — {limpio(d.get('nota'))}" if limpio(d.get("nota")) else ""
        print(f"\nDecisión {limpio(d.get('version'))}: {limpio(d.get('decision'))} por {limpio(d.get('autor'))} ({cuando(d.get('fecha'))}){nota}")
    if not comentarios:
        print("No hay comentarios." if a.todos else "No hay comentarios pendientes.")


if __name__ == "__main__":
    main()
