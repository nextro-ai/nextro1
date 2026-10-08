# LonsoLab: por dónde empezar

**Para Terra, papá y el hermano · 8 de octubre de 2026**

> **Repo público.** Acá no van el nombre del cliente de sistemas, nombres de empleados o prospectos, correos, IDs ni links a archivos, montos de clientes ni las horas y tarifas que se le cobran a cada uno. Lo [en curso] no se presenta como hecho, y en todo lo que ve un cliente no se nombran herramientas ni proveedores de IA. Reglas completas: [`CLAUDE.md`](../../CLAUDE.md) y [catálogo §8](catalogo-de-servicios.md#8-reglas-marca-blanca-publicación-ética-y-datos).
>
> **Qué manda:** lo publicado en lonsolab.com → el catálogo → la estrategia y el memo. Si un precio no coincide, manda el catálogo.

## Qué hay y para qué sirve

| | Qué es | Usalo cuando… |
|---|---|---|
| [Catálogo de servicios](catalogo-de-servicios.md) | Qué vendemos, a quién, cómo y a qué precio (publicado y propuesto): fichas, packs, proceso comercial, textos para /sistemas, /contenido y /creadores, reglas y decisiones D1 a D14 | Cotizás, armás una propuesta o una página |
| [Estrategia de contenido](estrategia-de-contenido.md) | Fábrica de contenido, guías por rubro, creadores, contenido propio (90 días, 23 posts, guiones), portfolio, ética y pasos del 9 al 23/10 | Planificás la semana o producís para un cliente o para LonsoLab |
| [Memo de Higgsfield](higgsfield-conviene.md) | Si conviene la promo, créditos por pieza, punto de equilibrio y plan B (uso interno) | Antes de comprar o de gastar un crédito |
| Skill [`ver-video`](../../.claude/skills/ver-video/SKILL.md) | Baja un reel desde un link, lo transcribe y arma cortes y cuadros clave | Analizás una referencia o la competencia de un prospecto |
| Skill [`reel-motion`](../../.claude/skills/reel-motion/SKILL.md) | Reels y motion por código (HTML → MP4), sin créditos | Placas, tarjetas, precios, subtítulos, cierres con CTA |
| Skill [`cotizar-video-ia`](../../.claude/skills/cotizar-video-ia/SKILL.md) | Créditos, reintentos, horas y margen, en ARS y USD | Antes de presupuestar o generar una pieza con IA |
| Skill [`diagnostico-presencia`](../../.claude/skills/diagnostico-presencia/SKILL.md) | La auditoría gratis con el formato de LonsoLab: informe, resumen para compartir y planilla interna | Alguien pide el diagnóstico o comenta DIAGNÓSTICO |
| Skill [`sistemas-sheets`](../../.claude/skills/sistemas-sheets/SKILL.md) | Sistemas de gestión a medida en planillas con automatizaciones: diseño, presupuesto y textos de /sistemas | Un negocio con personal por turnos quiere ordenarse |
| Skill [`portal-aprobacion`](../../.claude/skills/portal-aprobacion/SKILL.md) | Sala de revisión: el cliente comenta el video al segundo y aprueba. Código e instalación en [`herramientas/portal-aprobacion`](../../herramientas/portal-aprobacion/README.md). [en prueba] | Mandás una pieza a aprobar o aplicás los cambios pedidos |

Las skills se usan pidiéndoselo a Claude en este repo: «analizá este reel», «cotizame un video de 30 s», «diagnosticá tal negocio», «subí la v2 a la sala de revisión».

## Higgsfield: la respuesta corta

- **Sí, con condiciones, y solo el PRO anual de USD 240** (≈ ARS 37.300 por mes con dólares propios e IVA).
- **Fecha límite: viernes 9/10 a las 11:00, hora de Argentina.** La promo cierra el 9/10 a las 23:59, sin zona horaria confirmada.
- **Comprá solo si se cumplen las tres:** el checkout muestra USD 240 en total; pagás con dólares propios; hay al menos 1 cliente que paga contenido generado todos los meses ([memo §1.1](higgsfield-conviene.md#11-qué-cuenta-como-cliente-que-paga-contenido-generado)).
- **Si falta alguna, no se compra.** Hoy no figura ningún cliente así confirmado: completá el dato antes de decidir. Para un trabajo pago puntual, PRO mensual (USD 29) ese mes o el plan B (USD 20 a 38 por mes, sin compromiso).
- **No al MAX.** Y por MCP siempre se cobran créditos, aun en los modelos «ilimitados»: lo ilimitado se hace a mano en higgsfield.ai, y ningún crédito se gasta sin el OK de Terra con el costo a la vista.

## Líneas de servicio y precio «desde»

| Línea | Desde | Estado |
|---|---|---|
| Google Maps | $90.000 por mes | **Publicado** |
| Redes sociales | $190.000 por mes · Redes 2: $320.000 · Redes completo: $600.000 | **Publicado** (los dos escalones nuevos, propuesta) |
| Sitios web | $450.000, pago único · tienda $480.000 · institucional $550.000 · a medida desde $1.200.000 · mantenimiento desde $35.000 por mes | **Publicado** (lo demás, propuesta) |
| Packs | Web + un plan mensual −15 % · pack completo −25 % en la web y −20 % en los planes | **Publicado** |
| Auditoría | Gratis, por WhatsApp, respuesta en 24 h hábiles | **Publicado** |
| Sistemas para tu negocio | Diagnóstico gratis · módulo desde $450.000 · Personnel Control desde $1.200.000 · soporte desde $90.000 por mes | Propuesta |
| Contenido | Foto $8.000 (mínimo 10) · reel $45.000 · video generativo $180.000 (3 min: $690.000) | Propuesta |
| Creadores | Clip $25.000 (USD 25 desde afuera) | Propuesta |
| Consultoría liviana e infraestructura | — | En plan: no se vende todavía |

Todo mes a mes y sin permanencia. Detalle y USD: [catálogo §4.1](catalogo-de-servicios.md#41-lista-de-precios-publicado-y-propuesta).

## Decisiones de Terra

| Decisión | Recomendada | Dónde |
|---|---|---|
| Comprar Higgsfield (antes del vie 9/10 a las 11:00) | Solo el PRO anual y solo con las 3 condiciones; si no, no comprar | Memo §1 y §7.1 |
| Historial del repo público (D13) | Branch limpio con un solo commit antes de mergear a main, y borrar el viejo del remoto | Catálogo §9 |
| Nombre de la línea nueva (D1) | «Sistemas para tu negocio» (/sistemas) | Catálogo §9 |
| Precios de las líneas nuevas (D3) | En la web, solo los «desde»; el detalle, en la propuesta | Catálogo §9 |
| Tarifa del cliente de sistemas (D5) | Está muy por debajo del piso de $22.000 por hora: trabajos nuevos con la fórmula del catálogo desde noviembre | Catálogo §4.3 y §9 |
| Dónde va el caso de sistemas (D8) | Solo en /sistemas, anónimo | Catálogo §9 |
| Sala de revisión (D11) | Instalarla ya (unos 20 minutos) y estrenarla con las piezas spec | Catálogo §9 · estrategia §3.7 |
| Sitio Nextro (D12) | Archivar el código y, si sigue publicado, redirigirlo a lonsolab.com | Catálogo §7.5 |
| Firma de diagnósticos (D14) | El padre; si no puede, «Equipo LonsoLab» | Catálogo §9 |
| Bajada para bios y firmas | «Presencia online y sistemas para negocios» | Catálogo §1.3 |
| Cadencia del contenido propio | Modo base: 2 reels, 1 carrusel, 1 LinkedIn y 1 post en Google por semana | Estrategia §6.6 |
| Material de clientes de sistemas en el contenido propio | No usarlo: solo demos con datos ficticios | Estrategia §7.1 |

Las demás (D2 puesta en marcha, D4 sistemas y packs, D6 video de 3 min, D7 entrada de sistemas, D9 ajuste por IPC, D10 entregas a creadores) tienen su recomendada en el catálogo §9.

## Próximas 2 semanas (9 al 23/10)

| Cuándo | Qué | Quién |
|---|---|---|
| Vie 9/10, antes de las 11:00 | Higgsfield: comprar o no, con las 3 condiciones | Terra |
| Vie 9/10 | Las decisiones de arriba, en una página | Terra |
| Sáb 10 a lun 12/10 | Mensaje automático de DIAGNÓSTICO, respuesta automática de WhatsApp, links precargados y bios | Hermano (revisa Terra) |
| Mar 13/10 | Perfil de Empresa de Google de LonsoLab (si no existe) y tablero | Hermano |
| Mié 14 y jue 15/10 | Publicar el reel demo y el primer carrusel; lectura a las 48 h | Hermano |
| Semana del 12/10 | Terra cumple las entregas del cliente de sistemas del 15 y 16/10: no se le asigna contenido nuevo | Terra |
| 15 y 16/10 | Lista de 10 negocios para spec y 15 creadores; el padre visita 3 | Padre y hermano |
| Sáb 17/10 | Grabación 1 | Los tres |
| 19 al 23/10 | Plantillas de trabajo, 2 variantes de las tarjetas (sistemas y web), copias demo de sistemas con datos ficticios y, si se elige, la Sala de revisión | Terra y hermano |
| 19 al 23/10 | Borradores de autorización de imagen y voz y del permiso spec, para un abogado | Padre |
| 20 al 22/10 | Plantilla de diagnóstico exprés y 2 primeras entregas | Terra y padre |
| Vie 23/10 | Revisión: metas, horas por pieza y comentarios con la palabra clave | Los tres |

**Sin fecha todavía:** condición fiscal con el contador (IVA en los precios) · revisar /maps, /redes y /web y alinear el catálogo · demo de Personnel Control · revisión legal del contrato tipo y del acuerdo de datos. Detalle: [estrategia §9](estrategia-de-contenido.md#9-próximos-pasos-9-al-23-de-octubre-uso-interno) y pendientes del [catálogo §9](catalogo-de-servicios.md#9-supuestos-decisiones-y-pendientes).
