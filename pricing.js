/**
 * Lógica de precios y cálculos económicos.
 * Determina el precio según duración, equipo y extras,
 * y calcula subtotal, IVA y total.
 */

class Pricing{
  constructor(){
    const idSpreadsheet = '1KZVGm5eMrM_cUnNtv4LYYjC1PaCvG3ZB-tCTFiR9AXU';
  
    try {
      const ss = SpreadsheetApp.openById(idSpreadsheet);
      const hoja = ss.getSheetByName('2027');
      const datos = hoja.getDataRange().getValues();
      this.obtenerDuraciones(hoja)
      this.obtenerEkipoa(hoja)

      this.prices = {duraciones: this.duraciones, equipos: this.equipos}

    } catch (error) {
      console.error("Error en obtenerDatosPresupuesto: " + error.message);
      throw new Error("No se pudo abrir el documento de Google Sheets.");
    }
  }
  
  obtenerDuraciones(hoja) {
    const lastRow = hoja.getLastRow();
    
    // Si no hay datos a partir de la fila 2, devolvemos un objeto vacío
    if (lastRow < 3) return [];

    const range = hoja.getRange(3, 2, lastRow - 1, 2); // Columnas B y C desde la fila 2
    const values = range.getValues();
    
    this.duraciones = {};
    
    values.forEach(row => {
      if(row[0] !== ""){
        this.duraciones[row[0]] = row[1]
      }
    })
  }

  obtenerEkipoa(hoja){
    const lastRow = hoja.getLastRow();
    
    // Si no hay datos a partir de la fila 2, devolvemos un objeto vacío
    if (lastRow < 3) return [];

    const range = hoja.getRange(3, 5, lastRow - 1, 8); // Columnas B y C desde la fila 2
    const values = range.getValues();
    
    this.equipos = {};
    
    values.forEach(row => {
      if(row[0] !== ""){
        this.equipos[row[0]] = {
          "baja": row[1],
          "media": row[2],
          "alta_laborable": row[3],
          "alta_finde": row[4]
        }
      }
    });   
  }

  readMap_(sheet, startCol) {
    const values = sheet
      .getRange(3, startCol, sheet.getLastRow() - 1, 2)
      .getValues();

    return values.reduce((acc, [key, value]) => {
      if (key !== "" && key != null) {
        acc[key.toString()] = Number(value);
      }
      return acc;
    }, {});
  }

  calculate(data) {
    let iraupenPrezioa = this.prices.duraciones[data.iraupena];
    iraupenPrezioa += data.prezioGehigarria;

    let subtotala = iraupenPrezioa + data.ekipo.price;

    data.data_gehigarriak.forEach(g => {
      subtotala += g.price;
    });

    const iva = Math.ceil(subtotala * CONFIG.IVA * 100) / 100;

    return {
      iraupenPrezioa,
      subtotala,
      iva,
      totala: subtotala + iva
    };
  }
};
