---
name: cotizar-video-ia
description: Cotizar videos, reels e imágenes hechos con IA para clientes de LonsoLab. Calcula créditos de generación por plan, margen de reintentos, horas de trabajo y margen comercial, en USD y ARS, y lo compara contra una producción tradicional. Usar cuando el usuario pregunte "cuánto cobro por...", "cuántos créditos gasta...", "me alcanza el plan para...", o arme un presupuesto con contenido generado.
---

# Cotizar piezas con IA

## Fórmula (la del reel de referencia de @roshicontent, mejorada)

1. **Créditos base** = suma de cada toma o imagen generada × su costo en créditos.
2. **+ reintentos**: +50% por defecto (regenerar, corregir errores, cambios del cliente). Bajalo a +30% si los fotogramas ya están aprobados antes de animar, y subilo a +100% con modelos inestables (Seedance tuvo 27% de fallas en la prueba de julio).
3. **Costo de herramienta** = créditos × USD por crédito del plan (ver `--listar`).
4. **Trabajo** = horas × tarifa. El piso interno es ARS 22.000 por hora (≈ USD 14,3). Contá guion, prompts, armado de fotogramas, edición, motion, sonido, revisiones y entrega.
5. **Precio** = (herramienta + trabajo) × (1 + margen). Margen por defecto: 30%.
6. **Control de valor**: compará contra lo que saldría con rodaje (equipo, locación, actores). Si el cliente ahorra más del 80%, se puede subir el precio por valor sin dejar de ser conveniente.

Referencia de mercado (reel de roshicontent, sep-2026): video de 3 min = 18 tomas de 10 s en 1080p a 90 créditos = 1.620 cr ≈ USD 80, +50% = USD 120 de herramienta, + USD 200-230 de trabajo = **USD 350**. Un rodaje real equivalente cuesta más de USD 2.000. En los comentarios le dijeron que cobra barato.

## Calculadora

```bash
python3 .claude/skills/cotizar-video-ia/scripts/cotizar.py --listar
python3 .claude/skills/cotizar-video-ia/scripts/cotizar.py --toma kling3_5s_720p:6 --imagen nbp_2k:2 --horas 3 --plan pro_promo
python3 .claude/skills/cotizar-video-ia/scripts/cotizar.py --toma kling3_5s_720p:18 --toma seedance2fast_5s_720p:6 --horas 12 --rodaje 2000
```

Opciones: `--plan` (pro_promo, pro_mensual, max1800_promo, plus_mensual, recarga…), `--reintentos 0.5`, `--horas`, `--tarifa` (USD/h), `--margen 0.3`, `--dolar 1540`, `--rodaje` (USD).

**La tabla de créditos es aproximada (octubre 2026).** El costo exacto aparece en el botón "Generate" de Higgsfield: cuando lo veas distinto, actualizá `CREDITOS` en el script. El dólar (`DOLAR_DEFAULT`) también hay que actualizarlo.

## Cómo bajar el costo sin bajar la calidad

- **Elegir bien el modelo cambia el costo 10 veces:** el mismo video de 3 min sale ~USD 120 de herramienta con tomas de 10 s en 1080p a 90 cr, y ~USD 11 con Kling 3.0 en 720p más algunas tomas Seedance Fast. Usá 1080p o 4K solo en las tomas que lo justifican, y escalá el resto.
- **Fotogramas primero:** armar las imágenes inicial y final con los modelos de imagen **ilimitados en la web** (con plan anual, 0 créditos) y recién animar lo aprobado. Por MCP siempre se cobran créditos, incluso en modelos ilimitados: las imágenes "ilimitadas" se generan a mano en higgsfield.ai.
- **Borrador barato:** Seedance 2.5 en draft 480p (~3 cr/s) y pasar a 1080p solo la toma aprobada.
- **Lo que no necesita IA, sin créditos:** placas, textos, precios, listas, logo animado, subtítulos y cierres con la skill `reel-motion`; el corte, el ritmo y el sonido, con ffmpeg o Descript.
- **Audio en la edición**, no generado (salvo voz o doblaje).

## Qué entregar al usuario

- Desglose interno (créditos, herramienta, horas, margen) y precio sugerido en ARS y USD.
- Una versión para el cliente **sin** créditos ni herramientas: qué incluye, duración, cantidad de versiones, rondas de cambios incluidas (2), plazo y condiciones (50% de anticipo, presupuesto válido 15 días).
- Si la pieza no entra en los créditos del mes (PRO = 600 cr), avisá y proponé cobrarla como extra o reprogramarla después de la recarga (los créditos del plan se renuevan cada 30 días y no se acumulan).
