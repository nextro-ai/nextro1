# LonsoLab: contexto para Claude

Este repo tiene un sitio web anterior de la agencia ("Nextro", React 19 + Vite + Tailwind; `npm run dev` / `npm run build`) y la documentación de negocio en `docs/lonsolab/`. **El sitio vigente es lonsolab.com** (no está en este repo).

## El negocio

- **LonsoLab** es una agencia de Córdoba que trabaja en forma remota con comercios y profesionales locales. La fundó Leo Alonso ("Terra") con su padre y su hermano mayor.
- **lonsolab.com** (visto el 08/10/2026):
  - Promesa: «Que te encuentren. Que te elijan.».
  - Servicios publicados: Google Maps desde $90.000/mes, Redes sociales desde $190.000/mes, Sitios web desde $450.000 (pago único). Packs: web + plan mensual −15%; pack completo −25% en la web y −20% en los planes.
  - Cómo vende: auditoría gratis por WhatsApp (respuesta en 24 h hábiles), con el formulario de contacto como alternativa.
  - Valores: «Nunca te pedimos contraseñas», mes a mes sin permanencia, informe mensual, sin prometer primeros puestos ni ventas.
  - Páginas: inicio, /maps, /redes, /web, /casos, /nosotros, /contacto.
- **Línea nueva en preparación:** sistemas de gestión a medida sobre Google Sheets + Apps Script (fichaje, turnos, sueldos por hora, propinas, cajas, hotel, portal del personal, copias y avisos, accesos, fidelización). El producto ancla es «Personnel Control». Ver `.claude/skills/sistemas-sheets`.
- **Contenido** (en desarrollo): fotos, reels, guiones, motion graphics y servicios para creadores (edits, clips para streamers e influencers).

## Reglas al trabajar para LonsoLab

- **Voseo**, respuestas cortas y concretas. Las decisiones de negocio son de Terra: preguntar con opciones y una recomendada. No re-explicarle el contexto en cada respuesta.
- **Cliente principal de sistemas = anónimo.** En todo lo que hable de sistemas se lo llama «Hotel boutique con restaurante y estacionamiento (Córdoba)». No se dice la localidad, no se lo pone al lado de casos con nombre ni se lo enlaza con ellos. Para nombrarlo hace falta el OK de los dueños.
- **Nunca publicar** nombres de empleados, códigos, correos, CUIL ni claves; IDs o enlaces de planillas, proyectos o apps de clientes; montos de clientes (sueldos, propinas, caja, facturación); cómo se reparte el pago de sueldos. Las horas y tarifas que se le cobran a cada cliente son internas.
- **No prometer lo que no está:** lo que está "en curso" no se presenta como terminado. Un proyecto en desarrollo para presentar a un organismo no convierte a ese organismo en cliente.
- **Marca blanca:** en textos, piezas, reportes, menús o PDF que vea un cliente no se nombran Claude, Anthropic ni los proveedores de IA o de software. Se dice "nuestro estudio", "nuestro flujo de producción", "planillas en la nube con automatizaciones", "apps a medida".
- **Datos personales:** el Drive tiene datos de empleados y huéspedes de clientes. No copiarlos a documentos, prompts ni commits. Describir funciones, no personas.
- **No gastar créditos de Higgsfield sin aprobación explícita**, con el costo a la vista. Por MCP siempre se cobran créditos, incluso en modelos "ilimitados": esas imágenes se generan a mano en higgsfield.ai.
- **Este repo es público en GitHub:** nada de lo anterior entra en commits.

## Skills del proyecto (`.claude/skills/`)

- `ver-video`: mirar y analizar reels o videos desde un link (descarga, transcripción, cortes y cuadros clave).
- `reel-motion`: reels y motion graphics por código, sin créditos (HTML animado → MP4).
- `cotizar-video-ia`: cotizar piezas con IA (créditos, horas, margen) en ARS y USD.
- `diagnostico-presencia`: la auditoría gratuita de presencia online, con el formato de LonsoLab.
- `sistemas-sheets`: sistemas de gestión con Sheets + Apps Script.
- `portal-aprobacion`: Sala de revisión, el portal donde el cliente comenta el video al segundo exacto y aprueba (código en `herramientas/portal-aprobacion/`).

## Documentos (`docs/lonsolab/`)

- `catalogo-de-servicios.md`: qué vendemos, cómo, a quién y a qué precio.
- `higgsfield-conviene.md`: decisión sobre el plan de Higgsfield (interno).
- `estrategia-de-contenido.md`: contenido para cada rubro y contenido propio de LonsoLab.

Lo que se descarga para analizar (videos de terceros) va al scratchpad o a `analisis-video/`, que está en `.gitignore`. No se sube al repo.
