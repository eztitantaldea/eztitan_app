/**
 * Generación del presupuesto en Google Docs.
 * Crea una copia de la plantilla, reemplaza los marcadores
 * y exporta el resultado final en PDF.
 */

const Docs = {
  createDokumentua(env_data, data, pricing, rawData, doctype){
    let folderId = "";
    let templateId = "";

    switch (doctype.toUpperCase()) {
      case "AURREKONTUA":
        folderId = env_data.FOLDER_ID.AURREKONTUA;
        templateId = env_data.TEMPLATE_ID.AURREKONTUA[data.ekipo.type]
        break;

      case "FAKTURA":
        folderId = env_data.FOLDER_ID.FAKTURA;
        templateId = env_data.TEMPLATE_ID.FAKTURA;
        break;

      case "KONTRATUA":
        folderId = env_data.FOLDER_ID.KONTRATUA;
        templateId = env_data.TEMPLATE_ID.KONTRATUA;
        break;
    }
  
    let folder = DriveApp.getFolderById(folderId);

    const map = {
      '{{HERRIA}}': data.herria,
      '{{PROBINTZIA}}': data.probintzia,
      '{{EGUNA}}': data.date.eguna,
      '{{HILABETEA}}': data.date.hilabetea,
      '{{MES}}': data.date.mes,
      '{{URTEA}}': data.date.urtea,
      '{{ORDUAK}}': data.iraupena,
      '{{EKIPOA}}': CONFIG.TEXTS.EKIPOA.TABLE[data.ekipo.type],
      '{{EKIPO_PREZIOA}}': Utils.formatEuro(data.ekipo.price),
      '{{IRAUPEN_PREZIOA}}': Utils.formatEuro(pricing.iraupenPrezioa),
      '{{SUBTOTALA}}': Utils.formatEuro(pricing.subtotala),
      '{{IVA}}': Utils.formatEuro(pricing.iva),
      '{{TOTALA}}': Utils.formatEuro(pricing.totala),
    };

    const MAX_GEHIGARRIAK = 3;
    for (let i = 0; i < MAX_GEHIGARRIAK; i++) {
      const g = data.data_gehigarriak[i] || {};
      map[`{{GEHIGARRI_${i + 1}}}`] = g.text || "";
      map[`{{G_PREZIO_${i + 1}}}`] = g.price != null ? Utils.formatEuro(g.price) : "";
    }

    let nombreFinal = ''
    let descriptionData = {}
    if(doctype === 'aurrekontua'){
      [descriptionData, nombreFinal, folder] = this.createAurrekontua(data, rawData, folderId)
    }else if(doctype === 'faktura'){
      [nombreFinal, folder] = this.createFaktura(rawData, map, folderId)
    }else if(doctype === 'kontratua'){
      nombreFinal = this.createKontratua(map, rawData, data)
    }
    const copy = DriveApp.getFileById(templateId).makeCopy(nombreFinal, folder);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();
    Object.entries(map).forEach(([k, v]) => body.replaceText(k, v || ''));
    doc.saveAndClose();

    const pdfFile = folder.createFile(copy.getAs(MimeType.PDF)).setName(`${nombreFinal}.pdf`);
    pdfFile.setDescription(JSON.stringify(descriptionData));

    if (!data.word) copy.setTrashed(true);

    return {
      id: pdfFile.getId(),
      name: nombreFinal,
      viewUrl: `https://drive.google.com/file/d/${pdfFile.getId()}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${pdfFile.getId()}`
    };
  },

  createAurrekontua(data, rawData, folderId) {
    let nombreFinal = data.dokumentuIzena;
    if (data.incluirIraupena) nombreFinal += ` - ${data.iraupena}h`;
    if (data.incluirEkipoa) nombreFinal += ` - ${CONFIG.TEXTS.EKIPOA.TITLE[data.ekipo.type]}`;
    if (data.incluirHaizeak) nombreFinal += ` - Haizeak`;
    
    emitido_folder = getOrCreateEmitidoFolder(folderId, data.date.urtea, "")

    const descriptionData = { ...rawData };

    delete descriptionData.word;
    delete descriptionData.incluirEkipoa;
    delete descriptionData.incluirHaizeak;
    delete descriptionData.incluirIraupena;

    return [descriptionData, nombreFinal, emitido_folder]
  },
  
  createFaktura(rawData, map, folderId) {
    const hoy = new Date();
    const dd = String(hoy.getDate()).padStart(2, '0');
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const yyyy = hoy.getFullYear();

    num_fakt = getNextFacturaNumber(folderId)
    const { year, quarter } = getCurrentYearAndQuarter();
    emitido_folder = getOrCreateEmitidoFolder(folderId, year, quarter)


    map['{{FAKTURA_ZBK}}'] = num_fakt
    map['{{DATA_ESP}}'] = `${dd}-${mm}-${yyyy}`
    map['{{DATA_EUS}}'] = `${yyyy}-${mm}-${dd}`
    map['{{BEZEROA}}'] = rawData.bezeroa;
    map['{{IFK}}'] = rawData.ifk;
    map['{{HELBIDEA}}'] = rawData.helbidea;

    let nombreFinal = `${num_fakt} ${rawData.herria}`;
    return [nombreFinal, emitido_folder]
  },

  createKontratua(map, rawData, data) {
    let nombreFinal = data.dokumentuIzena;

    const hoy = new Date();
    const dd = String(hoy.getDate())
    const mm = CONFIG.TEXTS.MESES.ES[hoy.getMonth()];
    const yyyy = hoy.getFullYear();

    map['{{BEZEROA}}'] = rawData.bezeroa;
    map['{{IFK}}'] = rawData.ifk;
    map['{{HELBIDEA}}'] = rawData.helbidea;
    map['{{REPRESENTANTE}}'] = rawData.ordezkaria;
    map['{{ACTUAL_EGUNA}}'] = dd;
    map['{{ACTUAL_MES}}'] = mm;
    map['{{ACTUAL_URTEA}}'] = yyyy;
    map['{{DATA}}'] = `${data.date.eguna}/${data.date.hila}/${data.date.urtea}`;
    map['{{IRAUPENA}}'] = Number(data.iraupena)*60

    const [pase1, pase2] = rawData.ordutegia;

    const [inicio1, fin1] = pase1;
    const [inicio2, fin2] = pase2;

    let text = ""
    // Hay un solo pase
    if (!inicio2 || !fin2) {
      text = `desde las ${inicio1}h hasta las ${fin1}h (con un descanso de 30 minutos incluído).`;
    } else {
    // Hay dos pases
      text = `desde las ${inicio1}h hasta las ${fin1}h y desde las ${inicio2}h hasta las ${fin2}h.`;
    }

    map['{{ORDUTEGIA_TEXT}}'] = text

    return nombreFinal
  }
};

function getOrCreateEmitidoFolder(folderID, year, quarter) {
  const root = DriveApp.getFolderById(folderID);

  const quarters_text = {
    1: '1er trimestre',
    2: '2o trimestre',
    3: '3er trimestre',
    4: '4o trimestre'
  };

  emitidoFolder = getOrCreateSubfolder(root, String(year));
  if(quarter){
    emitidoFolder = getOrCreateSubfolder(emitidoFolder, quarters_text[quarter]);
    emitidoFolder = getOrCreateSubfolder(emitidoFolder, 'Emitidos');
  }

  return emitidoFolder;
}

function getOrCreateSubfolder(parentFolder, name) {
  const folders = parentFolder.getFoldersByName(name);
  return folders.hasNext()
    ? folders.next()
    : parentFolder.createFolder(name);
}


function getCurrentYearAndQuarter() {
  const now = new Date();
  const year = now.getFullYear();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return { year, quarter };
}

function extractFacturaNumber(name) {
  let match = name.match(/^(\d{1,6})\s+/); // "000105 Gares.pdf"
  if (!match) match = name.match(/^(\d{1,6})\./); // "56.xml"
  return match ? parseInt(match[1], 10) : null;
}

function getLastFacturaNumberFast(rootFolder) {
  let max = 0;

  const years = rootFolder.getFolders();
  const year_folders = []
  while (years.hasNext()) {
    year_folders.push(years.next());
  }

  year_folders.sort((a, b) =>
    b.getName().localeCompare(a.getName(), 'es', { numeric: true })
  );

  for(let i=0; i < year_folders.length; i++){
    const trimestre = year_folders[i].getFolders()
    const trimestre_folders = []
    while (trimestre.hasNext()) {
      trimestre_folders.push(trimestre.next());
    }

    trimestre_folders.sort((a, b) => {
      const numA = parseInt(a.getName(), 10); // extrae el número al inicio
      const numB = parseInt(b.getName(), 10);
      return numB - numA; // descendente
    });

    for(let j=0; j < trimestre_folders.length; j++){
      const subcarpeta = trimestre_folders[j].getFolders()
      while (subcarpeta.hasNext()){
        subcarpeta_facturas = subcarpeta.next()

        if(subcarpeta_facturas.getName() == 'Emitidos'){
          const files = subcarpeta_facturas.getFiles();
          while (files.hasNext()) {
            const file = files.next();
            const num = extractFacturaNumber(file.getName());
            if (num && num > max) max = num;
          }
        }
      }
    }
  }

  return max;
}

function getNextFacturaNumber(folderId) {
  const rootFolder = DriveApp.getFolderById(folderId);

  const lastNumber = getLastFacturaNumberFast(rootFolder);
  return String(lastNumber + 1).padStart(6, '0');
}


function deleteDokumentua(fileId) {
  DriveApp.getFileById(fileId).setTrashed(true);
}

function obtenerPresupuestos() {
  const folderId = "1Rx0DGKlmVo1DvKwxrqprNsj4U_hno0Yf";
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByType(MimeType.PDF);
  const result = [];

  while (files.hasNext()) {
    const file = files.next();
    result.push({
      id: file.getId(),
      name: file.getName(),
      url: file.getUrl()
    });
  }

  return result;
}

function obtenerDatosPresupuesto(id){
  const file = DriveApp.getFileById(id);
  return JSON.parse(file.getDescription());
}
