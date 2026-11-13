/**
 * Lectura y normalización de los datos del formulario.
 * Convierte las respuestas crudas de Google Forms en un objeto
 * estructurado y listo para usar en el resto del sistema.
 */

const FormParser = {
  parseFromObject(v, env_data, pricing) {

    const ekipoInfo = pricing.getEkipo(v.ekipoa, env_data);
    const dateInfo = Dates.parse(v.dataInicio, v.dataFin);
    const iraupena = String(v.iraupena);

    let data_gehigarriak = [];
    let prezio_gehigarria = 0;

    if (v.haizeak) {
      const haizeakMap = { "2": 2, "3": 4, "4": 4, "4.5": 4 };
      data_gehigarriak.push({
        text: CONFIG.TEXTS.GEHIGARRIAK.HAIZEAK,
        price: pricing.prices.extras.vientos[haizeakMap[iraupena]]
      });
    }

    Logger.log("HOLA 8")

    if (v.afaria) {
      data_gehigarriak.push({
        text: CONFIG.TEXTS.GEHIGARRIAK.AFARIA,
        price: pricing.prices.extras.afaria
      });
    }

    if (v.sonExtra) {
      data_gehigarriak.push({
        text: CONFIG.TEXTS.GEHIGARRIAK.SON_EXTRA,
        price: Number(v.precioSon || 0)
      });
    }

    if (v.fueraNavarra) {
      prezio_gehigarria = pricing.prices.extras.lejos;
    }

    return {
      herria: Utils.capitalize(v.herria),
      probintzia: Utils.capitalize(v.probintzia),
      iraupena,
      prezioGehigarria: prezio_gehigarria,
      data_gehigarriak,
      incluirIraupena: v.incluirIraupena,
      incluirEkipoa: v.incluirEkipoa,
      incluirHaizeak: v.incluirHaizeak,
      dokumentuIzena: `${dateInfo.hila}_${dateInfo.egunaTitle} ${Utils.capitalize(v.herria)}`,
      ekipo: ekipoInfo,
      date: dateInfo,
      word: v.word === true
    };
  }
};
