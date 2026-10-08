/**
 * Sala de revisión · backend
 * Guarda comentarios y decisiones de aprobación en esta planilla.
 * Se publica como aplicación web: Implementar > Nueva implementación > Aplicación web,
 * "Ejecutar como: yo" y "Quién tiene acceso: cualquier usuario".
 *
 * Hojas:
 *   Proyectos   → una fila por pieza en revisión (proyecto, clave, cliente, aviso_email, activo)
 *   Comentarios → lo que deja el cliente, pegado a un segundo del video
 *   Decisiones  → "aprobado" o "cambios" por versión
 *
 * Las columnas se buscan por su nombre: podés moverlas o agregar columnas propias (notas internas)
 * y no se mezclan los datos. Las columnas agregadas a mano nunca se muestran en la página.
 */

const HOJAS = {
  Proyectos: ['proyecto', 'clave', 'cliente', 'aviso_email', 'activo', 'creado'],
  Comentarios: ['id', 'proyecto', 'version', 'segundo', 'autor', 'texto', 'estado', 'creado', 'actualizado'],
  Decisiones: ['id', 'proyecto', 'version', 'decision', 'autor', 'nota', 'fecha'],
};

const LIMITES = {
  autor: 80, texto: 2000, nota: 1000, cliente: 120, segundoMax: 36000,
  comentariosPorProyecto: 1000,
  decisionesPorProyecto: 100,
  escriturasPorHora: 200, // por proyecto: frena un script, un link filtrado o un botón trabado
  pedido: 20000,          // tamaño máximo de un POST (caracteres)
  claveMin: 8,            // una clave vacía o más corta en la planilla nunca da acceso
};
const AVISO_CADA_MIN = 10; // como mucho un mail de "comentarios nuevos" cada 10 minutos por proyecto
const RESERVA_MAILS = 20;  // cupo diario de mails que se guarda para aprobaciones y pedidos de cambios
const URL_PORTAL = 'https://revision.lonsolab.com/'; // si cambia el dominio de la página, cambialo acá
const AVISOS_ = [];        // mails del pedido actual: se mandan al final, fuera del bloqueo

// ---------- Menú en la planilla ----------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Sala de revisión')
    .addItem('Preparar la planilla', 'instalar')
    .addItem('Nuevo proyecto…', 'nuevoProyecto')
    .addToUi();
}

function instalar() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(HOJAS).forEach((nombre) => {
    let sh = ss.getSheetByName(nombre);
    if (!sh) sh = ss.insertSheet(nombre);
    // Si la hoja ya tiene encabezados, no los pisa (correría los datos): solo suma al final los que falten.
    const actuales = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map((k) => String(k).trim()) : [];
    let ancho = actuales.length;
    while (ancho && !actuales[ancho - 1]) ancho--;
    const faltan = HOJAS[nombre].filter((k) => actuales.indexOf(k) === -1);
    if (faltan.length) sh.getRange(1, ancho + 1, 1, faltan.length).setValues([faltan]);
    sh.getRange(1, 1, 1, ancho + faltan.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  SpreadsheetApp.getActive().toast('Planilla lista. Ahora: Implementar > Nueva implementación > Aplicación web.');
}

function nuevoProyecto() {
  const ui = SpreadsheetApp.getUi();
  const r1 = ui.prompt('Nuevo proyecto', 'Nombre corto del proyecto (letras, números y guiones), por ejemplo reel-octubre:', ui.ButtonSet.OK_CANCEL);
  if (r1.getSelectedButton() !== ui.Button.OK) return;
  const base = String(r1.getResponseText()).trim().toLowerCase();
  if (!/^[a-z0-9-]{2,50}$/.test(base)) { ui.alert('El nombre solo puede tener letras minúsculas, números y guiones (hasta 50).'); return; }
  // Final al azar: los videos son archivos públicos y así su dirección no se puede adivinar.
  const slug = base + '-' + Utilities.getUuid().replace(/-/g, '').slice(0, 6);
  if (buscarProyecto_(slug)) { ui.alert('Ya existe un proyecto con ese identificador.'); return; }
  const r2 = ui.prompt('Nuevo proyecto', 'Nombre del cliente (para tu referencia):', ui.ButtonSet.OK_CANCEL);
  if (r2.getSelectedButton() !== ui.Button.OK) return;
  const clave = Utilities.getUuid().replace(/-/g, '').slice(0, 12);
  agregarFila_(tabla_('Proyectos'), {
    proyecto: slug, clave: clave, cliente: limpiar_(r2.getResponseText(), LIMITES.cliente),
    aviso_email: Session.getActiveUser().getEmail() || '', activo: 'SI', creado: new Date(),
  });
  ui.alert('Proyecto creado', 'Identificador (usalo igual en nueva_version.py): ' + slug +
    '\n\nLink para el cliente:\n' + URL_PORTAL + '?p=' + slug + '&k=' + clave +
    '\n\nMandáselo solo a quien decide: cualquiera que tenga el link puede comentar y aprobar.', ui.ButtonSet.OK);
}

// ---------- Aplicación web ----------

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.accion !== 'listar') throw fallo_('accion_desconocida');
    const proyecto = validarProyecto_(p.proyecto, p.clave);
    return json_({
      ok: true,
      comentarios: leer_('Comentarios', proyecto.proyecto),
      decisiones: leer_('Decisiones', proyecto.proyecto),
    });
  } catch (err) {
    return error_(err);
  }
}

function doPost(e) {
  const crudo = (e && e.postData && e.postData.contents) || '{}';
  if (crudo.length > LIMITES.pedido) return json_({ ok: false, error: 'pedido_muy_grande' });
  let body;
  try {
    body = JSON.parse(crudo);
  } catch (err) {
    return json_({ ok: false, error: 'json_invalido' });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json_({ ok: false, error: 'json_invalido' });
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ ok: false, error: 'ocupado' });
  let res;
  AVISOS_.length = 0;
  try {
    const proyecto = validarProyecto_(body.proyecto, body.clave);
    controlarTasa_(proyecto);
    switch (body.accion) {
      case 'comentar': res = comentar_(proyecto, body); break;
      case 'estado': res = cambiarEstado_(proyecto, body); break;
      case 'decidir': res = decidir_(proyecto, body); break;
      default: throw fallo_('accion_desconocida');
    }
    SpreadsheetApp.flush(); // que lo escrito quede guardado antes de soltar el bloqueo
  } catch (err) {
    return error_(err);
  } finally {
    lock.releaseLock();
  }
  mandarAvisos_();
  return json_(res);
}

// ---------- Acciones ----------

function comentar_(proyecto, b) {
  const version = validarVersion_(b.version);
  const autor = limpiar_(b.autor, LIMITES.autor, true);
  const texto = limpiar_(b.texto, LIMITES.texto);
  if (!autor) throw fallo_('falta_autor');
  if (!texto) throw fallo_('falta_texto');
  let segundo = '';
  if (b.segundo !== null && b.segundo !== undefined && b.segundo !== '') {
    const s = (typeof b.segundo === 'number' || typeof b.segundo === 'string') ? Number(b.segundo) : NaN;
    if (!isFinite(s) || s < 0 || s > LIMITES.segundoMax) throw fallo_('segundo_invalido');
    segundo = Math.round(s * 10) / 10;
  }
  const t = tabla_('Comentarios');
  if (contarFilas_(t, proyecto.proyecto) >= LIMITES.comentariosPorProyecto) throw fallo_('limite_de_comentarios');
  const id = Utilities.getUuid();
  const ahora = new Date();
  agregarFila_(t, { id: id, proyecto: proyecto.proyecto, version: version, segundo: segundo, autor: autor, texto: texto, estado: 'abierto', creado: ahora, actualizado: ahora });
  avisar_(proyecto, 'Comentarios nuevos en ' + proyecto.proyecto,
    autor + ' comentó la ' + version + (segundo === '' ? '' : ' en ' + segundo + ' s') + ':\n\n' + texto,
    'aviso:' + proyecto.proyecto, '1', true);
  return { ok: true, id: id };
}

function cambiarEstado_(proyecto, b) {
  const estado = b.estado === 'resuelto' ? 'resuelto' : (b.estado === 'abierto' ? 'abierto' : null);
  if (!estado) throw fallo_('estado_invalido');
  const id = typeof b.id === 'string' ? b.id : '';
  // Sin id no se busca: si no, una fila cargada a mano sin id se tomaría como la buscada.
  if (!id || id.length > 64) throw fallo_('comentario_no_encontrado');
  const t = tabla_('Comentarios');
  for (let i = 1; i < t.datos.length; i++) {
    if (txt_(t.datos[i][t.col.id]) === id && txt_(t.datos[i][t.col.proyecto]) === proyecto.proyecto) {
      t.sh.getRange(i + 1, t.col.estado + 1).setValue(estado);
      t.sh.getRange(i + 1, t.col.actualizado + 1).setValue(new Date());
      return { ok: true };
    }
  }
  throw fallo_('comentario_no_encontrado');
}

function decidir_(proyecto, b) {
  const version = validarVersion_(b.version);
  const decision = b.decision === 'aprobado' ? 'aprobado' : (b.decision === 'cambios' ? 'cambios' : null);
  if (!decision) throw fallo_('decision_invalida');
  const autor = limpiar_(b.autor, LIMITES.autor, true);
  if (!autor) throw fallo_('falta_autor');
  const nota = limpiar_(b.nota, LIMITES.nota);
  const t = tabla_('Decisiones');
  if (contarFilas_(t, proyecto.proyecto) >= LIMITES.decisionesPorProyecto) throw fallo_('limite_de_decisiones');
  const id = Utilities.getUuid();
  agregarFila_(t, { id: id, proyecto: proyecto.proyecto, version: version, decision: decision, autor: autor, nota: nota, fecha: new Date() });
  // Un doble clic no manda dos mails; si cambia de "cambios" a "aprobado" (o al revés), sí avisa.
  avisar_(proyecto, (decision === 'aprobado' ? 'Aprobado: ' : 'Piden cambios: ') + proyecto.proyecto + ' ' + version,
    autor + (decision === 'aprobado' ? ' aprobó la ' : ' pidió cambios en la ') + version + (nota ? '.\n\nMensaje: ' + nota : '.'),
    'aviso:' + proyecto.proyecto + ':' + version, decision, false);
  return { ok: true, id: id };
}

// ---------- Ayudas ----------

function validarProyecto_(slug, clave) {
  slug = String(slug || '').toLowerCase();
  if (!/^[a-z0-9-]{2,60}$/.test(slug)) throw fallo_('proyecto_invalido');
  const p = buscarProyecto_(slug);
  const guardada = p ? txt_(p.clave).trim() : '';
  // Mismo mensaje para "no existe", "clave incorrecta" y "desactivado": no revela qué proyectos hay.
  if (!p || guardada.length < LIMITES.claveMin || guardada !== String(clave || '') || inactivo_(p.activo)) throw fallo_('sin_acceso');
  return p;
}

// "NO", "no ", FALSO o una casilla destildada cortan el acceso.
function inactivo_(v) {
  return v === false || /^(no|false|falso|0)$/i.test(txt_(v).trim());
}

function buscarProyecto_(slug) {
  const t = tabla_('Proyectos');
  const datos = t.datos, col = t.col;
  for (let i = 1; i < datos.length; i++) {
    if (txt_(datos[i][col.proyecto]).trim().toLowerCase() === slug) {
      return { proyecto: slug, clave: datos[i][col.clave], cliente: datos[i][col.cliente], aviso: datos[i][col.aviso_email], activo: datos[i][col.activo] };
    }
  }
  return null;
}

function validarVersion_(v) {
  v = typeof v === 'string' ? v : '';
  if (!/^v\d{1,3}$/.test(v)) throw fallo_('version_invalida');
  return v;
}

// Frena ráfagas de escrituras en un proyecto. Corre dentro del bloqueo, así que el conteo no se pisa.
function controlarTasa_(proyecto) {
  let n = 0;
  try {
    const cache = CacheService.getScriptCache();
    const k = 'tasa:' + proyecto.proyecto + ':' + Math.floor(Date.now() / 3600000);
    n = Number(cache.get(k) || 0);
    if (n < LIMITES.escriturasPorHora) cache.put(k, String(n + 1), 3700);
  } catch (err) {
    console.warn('Caché no disponible: ' + err.message); // sin caché no se frena al cliente
    return;
  }
  if (n >= LIMITES.escriturasPorHora) throw fallo_('demasiados_pedidos');
}

function leer_(nombre, slug) {
  const t = tabla_(nombre);
  // Solo las columnas del sistema: lo que agregues a mano en la planilla no sale a la página.
  const campos = HOJAS[nombre].filter((k) => k !== 'proyecto');
  const out = [];
  for (let i = 1; i < t.datos.length; i++) {
    const fila = t.datos[i];
    if (txt_(fila[t.col.proyecto]) !== slug) continue;
    const o = {};
    campos.forEach((k) => { o[k] = txt_(fila[t.col[k]]); });
    if ('segundo' in o) o.segundo = o.segundo === '' ? null : Number(o.segundo);
    out.push(o);
  }
  return out;
}

function contarFilas_(t, slug) {
  let n = 0;
  for (let i = 1; i < t.datos.length; i++) if (txt_(t.datos[i][t.col.proyecto]) === slug) n++;
  return n;
}

function limpiar_(s, max, unaLinea) {
  s = (typeof s === 'string' || typeof s === 'number') ? String(s) : '';
  // Saca caracteres de control y de dirección de texto (sirven para disfrazar lo que se lee en la planilla o el mail).
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‪-‮⁦-⁩]/g, '');
  if (unaLinea) s = s.replace(/\s+/g, ' ');
  // Si el corte deja medio emoji, lo saca.
  return s.trim().slice(0, max).replace(/[\uD800-\uDBFF]$/, '');
}

// Texto para escribir en una celda. El apóstrofo inicial hace que la planilla lo guarde tal cual:
// sin tomarlo como fórmula (=, +, -, @), número, fecha ni porcentaje ("1/2", "10%", "2026-10").
// No queda como parte del valor.
function celda_(v) {
  return (typeof v === 'string' && v !== '') ? "'" + v : v;
}

// Valor de una celda como texto (fechas en ISO), sin el apóstrofo de "forzar texto" si viniera.
function txt_(v) {
  if (v instanceof Date) return v.toISOString();
  v = String(v == null ? '' : v);
  return v.charAt(0) === "'" ? v.slice(1) : v;
}

// Decide (dentro del bloqueo) si corresponde avisar. No avisa de nuevo si en los últimos
// minutos ya se avisó lo mismo (clave → valor). El mail sale después, con mandarAvisos_().
function avisar_(proyecto, asunto, cuerpo, clave, valor, prescindible) {
  const to = txt_(proyecto.aviso).trim();
  if (!to) return;
  try {
    const cache = CacheService.getScriptCache();
    if (cache.get(clave) === valor) return;
    cache.put(clave, valor, AVISO_CADA_MIN * 60);
  } catch (err) {
    console.warn('Caché no disponible: ' + err.message);
  }
  AVISOS_.push({ to: to, asunto: asunto, cuerpo: cuerpo, prescindible: prescindible });
}

function mandarAvisos_() {
  AVISOS_.forEach((a) => {
    try {
      // Los avisos de comentarios le dejan el último cupo diario de mails a las aprobaciones y pedidos de cambios.
      if (a.prescindible && MailApp.getRemainingDailyQuota() <= RESERVA_MAILS) return;
      MailApp.sendEmail({ to: a.to, subject: '[Sala de revisión] ' + a.asunto, body: a.cuerpo + '\n\nAbrí la planilla para ver todos los comentarios.' });
    } catch (err) {
      console.warn('No se pudo mandar el aviso: ' + err.message);
    }
  });
  AVISOS_.length = 0;
}

function hoja_(nombre) {
  const sh = SpreadsheetApp.getActive().getSheetByName(nombre);
  if (!sh) throw fallo_('planilla_sin_preparar');
  return sh;
}

// Lee una hoja entera y verifica que estén todas las columnas que usa el sistema.
function tabla_(nombre) {
  const sh = hoja_(nombre);
  const datos = sh.getDataRange().getValues();
  const col = indices_(datos[0]);
  HOJAS[nombre].forEach((k) => { if (!(k in col)) throw fallo_('planilla_sin_preparar'); });
  return { sh: sh, datos: datos, col: col };
}

// Agrega una fila poniendo cada dato bajo su encabezado, aunque las columnas se hayan movido.
function agregarFila_(t, valores) {
  const fila = t.datos[0].map(() => '');
  Object.keys(valores).forEach((k) => { fila[t.col[k]] = celda_(valores[k]); });
  t.sh.appendRow(fila);
}

function indices_(encabezados) {
  const m = {};
  encabezados.forEach((k, i) => { m[String(k).trim()] = i; });
  return m;
}

// Error con un código que se le puede devolver a la página.
function fallo_(codigo) {
  const err = new Error(codigo);
  err.publico = true;
  return err;
}

// Cualquier otro error (de la planilla, de Google) queda en el registro y afuera sale "error_interno".
function error_(err) {
  if (err && err.publico) return json_({ ok: false, error: err.message });
  console.error(err && err.stack ? err.stack : String(err));
  return json_({ ok: false, error: 'error_interno' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
