#!/usr/bin/env python3
"""Cotizador de piezas con IA para LonsoLab (video, reels, imágenes).

Precio = costo de herramienta (créditos × USD/crédito × (1 + margen de reintentos))
       + trabajo (horas × tarifa)
       + margen comercial.
Y se compara contra un piso de valor (lo que costaría producirlo con rodaje tradicional).

Ejemplos:
  # El caso del reel de referencia (3 min con tomas de 10 s en 1080p a 90 créditos, plan PLUS mensual):
  python3 cotizar.py --toma cinema4_10s_1080p:18 --plan plus_mensual --reintentos 0.5 --horas 10 --tarifa 22 --margen 0

  # Reel de 30 s para un comercio: 6 tomas Kling 720p + placas por código + 1 imagen NBP
  python3 cotizar.py --toma kling3_5s_720p:6 --imagen nbp_2k:1 --horas 3 --plan pro_promo

  # Ver la tabla de costos y planes
  python3 cotizar.py --listar
"""
import argparse

# Créditos aproximados por generación (octubre 2026). El número exacto aparece en el botón "Generate":
# confirmalo y actualizá esta tabla cuando cambie. Fuentes: informe interno higgsfield-conviene.md.
CREDITOS = {
    # video
    "kling3_5s_720p": 7,
    "kling3_5s_1080p": 10,
    "kling3_10s_720p": 20,
    "kling3_10s_1080p": 25,
    "seedance2_5s_720p": 22,
    "seedance2_5s_1080p": 45,
    "seedance2fast_5s_720p": 15,
    "seedance25_draft_5s_480p": 15,
    "seedance25_8s_720p": 52,
    "veo31fast_4s": 14,
    "veo31_4s": 35,
    "cinema4_10s_1080p": 90,   # dato del reel de referencia (sep-2026)
    "lipsync_10s_1080p": 20,
    # imagen
    "nbp_2k": 2,
    "nbp_4k": 4,
    "nb2_1k": 1.5,
    "gpt_image": 7,
    "ilimitado_web": 0,         # Seedream 4.5/5.0 Lite, Flux.2 Pro 1K, Nano Banana, Kling O1, GPT Image en la web con plan anual
}

# USD por crédito según cómo se compren (pago anual prorrateado, usando todos los créditos).
PLANES = {
    "pro_promo": 0.0333,      # PRO anual promo USD 20/mes, 600 cr
    "pro_lista_anual": 0.0383,
    "pro_mensual": 0.0483,    # USD 29, 600 cr
    "max1800_promo": 0.0278,  # USD 50/mes anual
    "max3600_promo": 0.0247,
    "plus_anual": 0.039,      # USD 39/mes, 1.000 cr
    "plus_mensual": 0.049,    # USD 49, 1.000 cr
    "ultra_anual": 0.033,
    "recarga": 0.0556,        # 18 cr por dólar, vencen a 90 días
}

DOLAR_DEFAULT = 1540  # ARS por USD (MEP 8-oct-2026). Actualizar.


def parsear(items):
    salida = []
    for it in items or []:
        nombre, _, cant = it.partition(":")
        if nombre not in CREDITOS:
            raise SystemExit(f"No conozco '{nombre}'. Opciones: {', '.join(CREDITOS)}")
        salida.append((nombre, float(cant or 1)))
    return salida


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--toma", action="append", help="tipo:cantidad de tomas de video generadas (repetible)")
    ap.add_argument("--imagen", action="append", help="tipo:cantidad de imágenes generadas (repetible)")
    ap.add_argument("--plan", default="pro_promo", choices=PLANES.keys())
    ap.add_argument("--reintentos", type=float, default=0.5, help="margen por regeneraciones y cambios (0.5 = +50%%)")
    ap.add_argument("--horas", type=float, default=0, help="horas de trabajo: guion, prompts, edición, motion, revisiones")
    ap.add_argument("--tarifa", type=float, default=14.3, help="USD por hora (piso interno ARS 22.000/h ≈ USD 14,3)")
    ap.add_argument("--margen", type=float, default=0.3, help="margen comercial sobre el costo total (0.3 = 30%%)")
    ap.add_argument("--dolar", type=float, default=DOLAR_DEFAULT, help="ARS por USD")
    ap.add_argument("--rodaje", type=float, default=0, help="USD que costaría con producción tradicional (para comparar)")
    ap.add_argument("--listar", action="store_true")
    a = ap.parse_args()

    if a.listar:
        print("Créditos aproximados por generación:")
        for k, v in CREDITOS.items():
            print(f"  {k:28s} {v:>6}")
        print("\nUSD por crédito según plan:")
        for k, v in PLANES.items():
            print(f"  {k:28s} {v:.4f}")
        return

    partes = parsear(a.toma) + parsear(a.imagen)
    creditos = sum(CREDITOS[n] * c for n, c in partes)
    creditos_con_reintentos = creditos * (1 + a.reintentos)
    usd_cr = PLANES[a.plan]
    herramienta = creditos_con_reintentos * usd_cr
    trabajo = a.horas * a.tarifa
    costo = herramienta + trabajo
    precio = costo * (1 + a.margen)

    def ars(usd):
        return f"ARS {usd * a.dolar:,.0f}".replace(",", ".")

    print("COTIZACIÓN (uso interno)")
    for n, c in partes:
        print(f"  {c:g} × {n} = {CREDITOS[n] * c:g} cr")
    print(f"Créditos base: {creditos:g}  ->  con {a.reintentos:.0%} de reintentos: {creditos_con_reintentos:,.0f} cr")
    print(f"Herramienta ({a.plan}, USD {usd_cr:.4f}/cr): USD {herramienta:,.2f}  ({ars(herramienta)})")
    print(f"Trabajo: {a.horas:g} h × USD {a.tarifa:g} = USD {trabajo:,.2f}  ({ars(trabajo)})")
    print(f"Costo total: USD {costo:,.2f}  ({ars(costo)})")
    print(f"PRECIO SUGERIDO (+{a.margen:.0%}): USD {precio:,.2f}  ({ars(precio)})")
    if precio:
        print(f"  Peso de la herramienta en el precio: {herramienta / precio:.0%}  (ideal: menos de 25-30%)")
    if a.rodaje:
        print(f"Contra rodaje tradicional (USD {a.rodaje:,.0f}): el cliente ahorra {1 - precio / a.rodaje:.0%}."
              " Si el ahorro es enorme, hay lugar para subir el precio por valor.")
    if a.plan == "recarga" or creditos_con_reintentos > 600:
        print("Ojo: supera los 600 cr mensuales del PRO; sumá recargas (vencen a 90 días) o cobralo como extra.")


if __name__ == "__main__":
    main()
