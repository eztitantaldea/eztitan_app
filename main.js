/**
 * Punto de entrada del script.
 * Se ejecuta al enviar el formulario y coordina el flujo completo:
 * parseo de datos, validaciones, cálculo de precios y generación del presupuesto.
 */
WORK = "WORK";
const url = ScriptApp.getService().getUrl()
if(url.includes('/dev')){
  WORK = "PLAY";
}

function doGet(e) {
  Session.getActiveUser()
  const action = e.parameter.action;
  const pricing = new Pricing()

  if (!action) {
    template = HtmlService.createTemplateFromFile('index')
    template.global = {
      "duraciones": Object.keys(pricing.prices.duraciones),
      "equipos": Object.keys(pricing.prices.equipos)
    }
    return template
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (action === "download") {
    const fileId = e.parameter.id;
    if (!fileId) {
      return ContentService.createTextOutput("No se proporcionó id")
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeader("Access-Control-Allow-Origin", "*");
    }

    try {
      const file = DriveApp.getFileById(fileId);
      const blob = file.getBlob();

      return ContentService
        .createTextOutput(blob.getBytes())
        .setMimeType(blob.getContentType())
        .setHeader("Access-Control-Allow-Origin", "*");

    } catch (err) {
      return ContentService.createTextOutput("Error: " + err.message)
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeader("Access-Control-Allow-Origin", "*");
    }
  }

  return ContentService.createTextOutput("Acción desconocida")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*");
}


function submitDokumentua(rawData, doctype) {
  try {
    const env_data = CONFIG.ENVIRONMENTS[WORK];
    const pricing = new Pricing()
    const parsed = FormParser.parseFromObject(rawData, env_data, pricing);
    const prices = pricing.calculate(parsed);

    file = Docs.createDokumentua(env_data, parsed, prices, rawData, doctype);

    return file;
  } catch (err) {
    Logger.log(err);
    return { ok: false, error: err.message };
  }
}

// function obtenerOpcionesPresupuestos() {
//   const idSpreadsheet = '1KZVGm5eMrM_cUnNtv4LYYjC1PaCvG3ZB-tCTFiR9AXU';
  
//   try {
//     const ss = SpreadsheetApp.openById(idSpreadsheet);
//     const hoja = ss.getSheetByName('2027');
//     const datos = hoja.getDataRange().getValues();

//     duraciones = obtenerDuraciones(hoja)
//     equipos = obtenerEkipoa(hoja)

//     return {duraciones, equipos}

//   } catch (error) {
//     console.error("Error en obtenerDatosPresupuesto: " + error.message);
//     throw new Error("No se pudo abrir el documento de Google Sheets.");
//   }
// }

function include(filename, params = {}) {
  const tpl = HtmlService.createTemplateFromFile(filename);

  // inyectamos variables
  Object.keys(params).forEach(key => {
    tpl[key] = params[key];
  });

  return tpl.evaluate().getContent();
}
