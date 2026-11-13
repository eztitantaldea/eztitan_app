/**
 * Lógica de precios y cálculos económicos.
 * Determina el precio según duración, equipo y extras,
 * y calcula subtotal, IVA y total.
 */

class Pricing{
  constructor(env_data){
    const cache = CacheService.getScriptCache();
    const cacheKey = `prices_${env_data.PRICING_SHEET_ID}`;

    const cached = cache.get(cacheKey);
    let prices = {}
    if (cached) {
      prices = JSON.parse(cached);
    }else{
      const sheet = SpreadsheetApp
        .openById(env_data.PRICING_SHEET_ID)
        .getSheets()[0];

      prices = {
        duracion: this.readMap_(sheet, 2), // B:C
        equipo: this.readMap_(sheet, 5),   // E:F
        extras: {
          vientos: this.readMap_(sheet, 8),
          ...this.readMap_(sheet, 11),
          ...this.readMap_(sheet, 14)
        }
      };
    }

    cache.put(cacheKey, JSON.stringify(prices), 3600); // 1 hora

    this.prices = prices;
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

  getEkipo(ekipoa) {

    return {
      type: ekipoa,
      price: this.prices.equipo[ekipoa]
    };
  }

  calculate(data) {
    let iraupenPrezioa = this.prices.duracion[data.iraupena];
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
