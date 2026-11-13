/**
 * Lectura y normalización de los datos del formulario.
 * Convierte las respuestas crudas de Google Forms en un objeto
 * estructurado y listo para usar en el resto del sistema.
 */

const FormParser = {
  parseFromObject(v, env_data, pricing) {

    const dateInfo = Dates.parse(v.dataInicio, v.dataFin);
    temporada = Dates.obtenerTipoTemporada(v.dataInicio)
    const ekipoInfo = {
      type: v.ekipoa,
      price: pricing.prices.equipos[v.ekipoa][temporada] //TODO calcular temporada
    }
    const iraupena = String(v.iraupena);

    let data_gehigarriak = [];
    let prezio_gehigarria = 0;

    if (v.haizeak) {
      data_gehigarriak.push({
        text: CONFIG.TEXTS.GEHIGARRIAK.HAIZEAK,
        price: 350
      });
    }

    if (v.afaria) {
      data_gehigarriak.push({
        text: CONFIG.TEXTS.GEHIGARRIAK.AFARIA,
        price: 200
      });
    }

    /*if (v.sonExtra) {
      data_gehigarriak.push({
        text: CONFIG.TEXTS.GEHIGARRIAK.SON_EXTRA,
        price: Number(v.precioSon || 0)
      });
    }

    if (v.fueraNavarra) {
      prezio_gehigarria = pricing.prices.extras.lejos;
    }*/

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
