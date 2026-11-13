/**
 * Punto de entrada del script.
 * Se ejecuta al enviar el formulario y coordina el flujo completo:
 * parseo de datos, validaciones, cálculo de precios y generación del presupuesto.
 */

function doGet(e) {
  Session.getActiveUser()
  const action = e.parameter.action;
  
  // Caso 1: Servir HTML
  if (!action) {
    return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Caso 2: Servir PDF con CORS
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

  // Cualquier otro action
  return ContentService.createTextOutput("Acción desconocida")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*");
}


function submitDokumentua(rawData, doctype) {
  try {
    const work = "WORK"
    const env_data = CONFIG.ENVIRONMENTS[work];

    const pricing = new Pricing(env_data);
    const parsed = FormParser.parseFromObject(rawData, env_data, pricing);
    const prices = pricing.calculate(parsed);

    file = Docs.createDokumentua(env_data, parsed, prices, rawData, doctype);

    return file;
  } catch (err) {
    Logger.log(err);
    return { ok: false, error: err.message };
  }
}

function include(filename, params = {}) {
  const tpl = HtmlService.createTemplateFromFile(filename);

  // inyectamos variables
  Object.keys(params).forEach(key => {
    tpl[key] = params[key];
  });

  return tpl.evaluate().getContent();
}
