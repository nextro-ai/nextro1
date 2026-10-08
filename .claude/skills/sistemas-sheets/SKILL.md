---
name: sistemas-sheets
description: Diseñar, construir, mantener y vender sistemas de gestión a medida sobre Google Sheets + Apps Script (+ pantallas web y apps) para negocios con personal por turnos (gastronomía, hotelería, comercios): control de horario en tablet, turnos, sueldos por hora, propinas, cajas y cierres, hotel (ocupación, limpieza, mozos), portal del personal, copias y avisos, accesos por persona, fidelización. Usar cuando Terra pida un sistema, una planilla automatizada, un script, un reporte automático, o armar la página, los casos o los textos del servicio "Sistemas" de lonsolab.com.
---

# Sistemas de gestión a medida (Sheets + Apps Script)

El caso de referencia es el **cliente principal, que va siempre anónimo**: «Hotel boutique con restaurante y estacionamiento (Córdoba)», con unas 45 a 58 personas según el mes. Ver las reglas de publicación al final.

## Módulos (cada uno sale de un trabajo real)

| Módulo | Para qué | Estado en el caso de referencia |
|---|---|---|
| **Control de horario** | Tablet en la entrada: código, entrada o salida, horas del mes al salir. Arma jornadas solo (incluye turnos de noche), resumen mensual, detecta marcas que faltan y guía la corrección. Altas y bajas (también temporales con vencimiento), archivado mensual sin borrar, modo prueba | En uso todos los días (~1.800 marcas, 840 jornadas y 6.400 horas al mes; 44 personas) |
| **Turnos** | Grilla semanal por sector "pintando" con pinceles, copiar la semana anterior, PDF apaisado para WhatsApp, planificado contra real con las horas del fichaje | En uso |
| **Sueldos por hora** | Horas × valor hora (por categoría o persona, con fecha "desde") o sueldo fijo. Novedades (adelantos, vacaciones, aguinaldo, bonos, descuentos), "Preparar el pago" en 4 pasos, recibos (A4, PDF o WhatsApp), Excel para el contador, cierre del mes que congela lo pagado | En uso desde 05/10/2026. Dio igual al peso que la planilla manual en 40 de 43 personas, y las 3 diferencias eran errores de la planilla |
| **Propinas** | Cierre del día con propinas por medio de pago, reparto automático por horas del fichaje, roles (mozos / no mozos con pozo del 10% / no participa), quincenas con histórico y retenciones | En uso desde 16/09/2026. Recibo por persona: **en curso** |
| **Cajas y cierres** | Cierres por turno y sector, arqueos, gastos con foto, proveedores, roles. "Control de caja": declarado contra contado por día (OK / Revisar / Grave) y quién cerró cada turno con diferencia | En uso. En el primer análisis de 86 días aparecieron 20 días con diferencias graves |
| **Estacionamiento** | Cobro desde el celular, caja por jornada con turnos, egresos del lavador al cerrar, y el cierre da igual al efectivo | En uso |
| **Hotel** | Panel de recepción por habitación (libre, ocupada, llega hoy, sale hoy, bloqueada), aviso de habitaciones sin liberar, plan de limpieza que se propone solo y las mucamas firman desde el celular, panel de mozos, ocupación, ADR y RevPAR en PDF | En uso |
| **Portal del personal** | Una sola dirección: «¿Quién sos?» y cada puesto abre su app. Se trata como público: nada sensible ahí | En uso |
| **Copias y avisos** | Copia completa semanal. Chequeo diario de 6 procesos y mail **solo si algo falla**. Vive en un proyecto aparte | Instalado 07/10/2026 (40 pruebas) |
| **Accesos** | Código del fichaje + clave propia de 4-6 números guardada con hash, permisos por persona, registro de quién cambió qué, bloqueo temporal tras intentos fallidos | Probado (56 pruebas). **Se activa el 16/10/2026** |
| **Ordenar planillas** | Diagnóstico y simplificación de lo que el negocio ya tiene | Hecho en el caso de referencia |
| **Fidelización** | Club de cumpleaños (bebida gratis en el mes del cumpleaños), con alta pública desde redes | En uso en una cafetería (pedir permiso antes de nombrarla) |

**Producto ancla: «Personnel Control»** = fichaje + horas planificadas contra reales + costo laboral por sector y turno.

## Cómo se construye

- **Todo vive en la cuenta de Google del negocio:** el sistema es del cliente. Encaja con «nunca te pedimos contraseñas».
- **Pruebas antes de tocar lo que está en uso:** pruebas automáticas y pantallas probadas en el navegador. Modo prueba con datos ficticios.
- **Antes de reescribir datos:** copia de respaldo y vista previa con los números reales. No se borra nada: se archiva.
- **Se cuadra contra lo que ya usaba el negocio** (por ejemplo, la planilla de sueldos) antes de reemplazarlo, con un período en paralelo.
- Hoja `CONFIG` con los parámetros (porcentajes, horarios, sectores, mails, nombre del negocio). Nada fijo en el código.
- Columnas leídas **por encabezado**, no por posición. Validaciones y listas desplegables en vez de texto libre.
- Claves en la configuración privada del script (Propiedades), nunca en celdas ni en el código. Claves personales con hash.
- Triggers livianos (si no hay datos nuevos, no hacen nada), escalonados, con aviso de fallas.
- Pantallas simples para personal sin experiencia, pensadas para celular y tablet: claras en administración, oscuras para el personal y con botón de modo claro.
- Código versionado (clasp + Git), un manual por módulo y una pestaña **GUÍA** en cada planilla (qué mirar, cómo hacer, qué hace solo, cómo no romper nada).

## Límites honestos (para preguntas frecuentes)

- Corre sobre Google Sheets y Apps Script: cada operación tarda unos segundos y Google tiene cuotas diarias (en cuentas comunes, ≈90 min/día de triggers, 6 min por ejecución, ≈100 destinatarios de mail por día; verificar la página de cuotas vigente). Para negocios grandes conviene Google Workspace.
- Si se usa una app de terceros para alguna parte (por ejemplo, la caja), puede cobrar por usuario: lo paga el cliente.
- No reemplaza al contador ni al sistema de facturación.

## Datos personales (Ley 25.326)

- LonsoLab trata los datos por cuenta del cliente: acuerdo de confidencialidad y encargo de tratamiento con cada uno. Se informa al personal para qué se usa el fichaje.
- El personal entra por apps o el portal, **nunca como editor** de las planillas. Las pestañas ocultas no son seguridad. Sueldos con acceso restringido.
- No guardar datos sensibles (diagnósticos médicos) en notas. Revisión trimestral de accesos.

## Reglas de publicación (web, casos, redes, este repo público)

- El cliente principal **no se nombra** en nada sobre sistemas ni se dice la localidad. No va al lado de casos con nombre ni enlazado a ellos.
- **Nunca publicar:** nombres de empleados, códigos, correos, CUIL, claves; IDs o enlaces de planillas, proyectos o apps; montos (sueldos, propinas, caja, facturación); cómo se reparte el pago de sueldos. En la web: «liquidación por horas, novedades, recibos y cierre del mes».
- Los números de uso se publican **redondeados** (como en la tabla de arriba). Lo que está "en curso" no se presenta como terminado.
- Las horas y la tarifa que se le cobran a cada cliente son internas.
- Marca blanca: ningún menú, celda, PDF ni pie de reporte nombra herramientas ni proveedores. Los reportes firman como "Panel [Negocio]".

## Para vender

- Modelo: **precio por proyecto + soporte mensual**, mes a mes y sin permanencia, como el resto de lonsolab.com. Entrada con un diagnóstico gratis, igual que la auditoría de Maps.
- Frases de trabajo: «Tu equipo ficha en una tablet. A fin de mes, las horas, los sueldos y las propinas ya están hechos.» · «Cada caja cierra igual que el efectivo. Y si no, sabés qué turno y quién.» · «Sin planillas a mano: un sistema a medida, en tu propia cuenta de Google.»
- Precios de lista sugeridos y referencias de mercado: `docs/lonsolab/catalogo-de-servicios.md`.

## Cómo presupuestar y rendir cuentas (formato que ya usa Terra)

**Presupuesto del mes** (PDF de 1-2 páginas, con la identidad del cliente):
1. Encabezado con tres números grandes: cantidad de trabajos (y cuántos imprescindibles, cuántos convienen, extras hechos, sin cargo), horas totales y total del mes con la forma de pago.
2. Tabla de trabajos: número, nombre y una línea de qué resuelve · horas · precio · prioridad (**IMPRESCINDIBLE / CONVIENE / HECHO / SIN CARGO**) · cuándo (semana o fecha). Subtotales por prioridad.
3. Nota de cálculo: horas de las especificaciones × tarifa hora vigente; cada precio redondeado **para abajo** a múltiplos de $5.000; lo adelantado fuera del presupuesto anterior entra acá y no se cobra dos veces.
4. "El mes, semana por semana": qué se hace en cada semana y por qué ese orden (dependencias, cierres de quincena).
5. "Lo que hace falta para arrancar": lo que tiene que dar el cliente (claves que elige y carga él, permisos, listas, datos), numerado por trabajo.
6. "Queda para más adelante": próximos trabajos con horas y precio de referencia, y el ahorro que generan (por ejemplo, dejar de pagar una licencia por usuario).
7. Detalle de las ampliaciones ya hechas, por versión y con horas.

**Cierre del mes** (PDF): "X de X tareas terminadas", horas, total, y cada tarea con *cómo quedó* en una o dos líneas (qué cambió para quien lo usa). Al final, "Fuera del presupuesto": lo hecho además, que se suma al presupuesto siguiente.

**Proyecto web** (formato que ya usa Terra para proyectos web): qué ya funciona y se conserva, qué suma el proyecto, tres números (inversión, plazo en días, fecha de entrega si se aprueba hoy), cambios agrupados por lo que resuelven, cómo queda la portada de arriba hacia abajo (SE CONSERVA / NUEVO), plan de respaldo si una integración falla, y **dos semanas de seguimiento** con las correcciones incluidas.

Reglas:
- La tarifa por hora y las horas de cada cliente son **internas**: no van a la web, a casos ni a este repo público.
- **La tarifa que se viene usando en sistemas está muy por debajo del piso de mercado** (piso propuesto: ARS 22.000/h, ajustado por IPC). Antes de presupuestar a un cliente nuevo, cotizá con el piso.
- Los arreglos de algo ya entregado que falla son sin cargo. Lo que fue simplificación no se cobra dos veces.
