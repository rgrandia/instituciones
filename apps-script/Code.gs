/**
 * Buzón de propuestas de cambio para el visualizador de instituciones.
 *
 * Recibe las propuestas que se envían desde la web y las añade como filas
 * en la pestaña "Propuestas" de esta misma hoja (la crea si no existe).
 * Nunca toca la pestaña LISTA: los cambios los aplicas tú a mano.
 *
 * Instalación: ver README.md, apartado "Activar el buzón".
 */

const PROPOSALS_SHEET = 'Propuestas';

// Si es true, te llega un correo (a la cuenta que despliega el script)
// cada vez que entra una propuesta.
const NOTIFY_BY_EMAIL = true;

// Límite de longitud por campo, para que nadie llene la hoja con basura.
const MAX_LEN = 2000;

const HEADERS = [
  'Fecha', 'Estado', 'Tipo', 'Código afectado', 'Campo',
  'Valor actual', 'Valor propuesto', 'Justificación / fuente',
  'Nombre', 'Email', 'Datos completos (JSON)',
];

const TYPES = ['Modificación', 'Alta', 'Baja', 'Duplicado', 'Otro'];

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Campo trampa: los humanos no lo ven, los bots lo rellenan.
    if (data.website) return json({ ok: true });

    const tipo = TYPES.indexOf(data.tipo) >= 0 ? data.tipo : 'Otro';
    const propuesto = clean(data.propuesto);
    const justificacion = clean(data.justificacion);
    if (!propuesto && !justificacion) {
      return json({ ok: false, error: 'La propuesta está vacía.' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getProposalsSheet();
      sheet.appendRow([
        new Date(), 'Pendiente', tipo,
        clean(data.codigo), clean(data.campo),
        clean(data.actual), propuesto, justificacion,
        clean(data.nombre), clean(data.email),
        clean(JSON.stringify(data.fila || {})),
      ]);
    } finally {
      lock.releaseLock();
    }

    if (NOTIFY_BY_EMAIL) notify(tipo, data, propuesto, justificacion);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

const LIST_SHEET = 'LISTA';

// ?accion=lista devuelve la pestaña LISTA para el visualizador (así la hoja
// puede seguir siendo privada). Sin parámetros, solo confirma que responde.
function doGet(e) {
  if (e && e.parameter && e.parameter.accion === 'lista') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LIST_SHEET);
    if (!sheet) return json({ ok: false, error: 'No existe la pestaña ' + LIST_SHEET });
    const values = sheet.getDataRange().getValues();
    const headers = values.shift().map(String);
    const rows = values.map((row) => row.map((v) =>
      typeof v === 'boolean' ? v : v instanceof Date ? Utilities.formatDate(v, 'Europe/Madrid', 'yyyy-MM-dd') : String(v)));
    return json({ ok: true, headers: headers, rows: rows });
  }
  return json({ ok: true, servicio: 'buzón de instituciones' });
}

function getProposalsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(PROPOSALS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(PROPOSALS_SHEET);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.getRange('B2:B').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Pendiente', 'Aceptada', 'Rechazada', 'Aplicada'])
        .build());
  }
  return sheet;
}

function notify(tipo, data, propuesto, justificacion) {
  const to = Session.getEffectiveUser().getEmail();
  if (!to) return;
  const body = [
    'Tipo: ' + tipo,
    'Código: ' + clean(data.codigo),
    'Campo: ' + clean(data.campo),
    'Valor actual: ' + clean(data.actual),
    'Valor propuesto: ' + propuesto,
    'Justificación: ' + justificacion,
    'Enviada por: ' + clean(data.nombre) + ' <' + clean(data.email) + '>',
    '',
    SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  ].join('\n');
  MailApp.sendEmail(to, '[Instituciones] Nueva propuesta: ' + tipo + ' ' + clean(data.codigo), body);
}

// Recorta, limita longitud y neutraliza fórmulas (=, +, -, @) para que una
// propuesta no se ejecute como fórmula al abrir la hoja.
function clean(v) {
  let s = v == null ? '' : String(v).trim().slice(0, MAX_LEN);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
