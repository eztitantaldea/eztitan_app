/**
 * Gestión y formateo de fechas.
 * Convierte las fechas del formulario en formatos legibles
 * para el documento (mes, día, rangos de fechas, etc.).
 */

const Dates = {
  parse(inicio, fin) {
    const [eguna, hila, urtea] = inicio.split("/");
    let egunaTitle = eguna;
    let egunaFinal = eguna;

    if (fin) {
      const [egunaAmaiera] = fin.split("/");
      egunaTitle = `${eguna}-${egunaAmaiera}`;
      egunaFinal = `${eguna}-${egunaAmaiera}`;
    }

    return {
      eguna: egunaFinal,
      egunaTitle,
      mes: CONFIG.TEXTS.MESES.ES[hila - 1],
      hilabetea: CONFIG.TEXTS.MESES.EU[hila - 1],
      hila,
      urtea
    };
  },

  obtenerTipoTemporada(fechaInput) {
    // Asegurarnos de que trabajamos con un objeto Date
    const [eguna, hila, urtea] = fechaInput.split("/");
    const inEnglish = hila + "/" + eguna + "/" + urtea;
    const fecha = new Date(inEnglish);
    
    const mes = fecha.getMonth() + 1; // getMonth() devuelve de 0 (enero) a 11 (diciembre)
    const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 5 = Viernes, 6 = Sábado

    // 1. Por defecto asumimos temporada baja (para los meses restantes como enero-marzo, noviembre-diciembre, etc.)
    let tipoTemporada = "baja";

    // 2. Comprobamos temporada media: abril (4), mayo (5) u octubre (10)
    if ([4, 5, 10].includes(mes)) {
      tipoTemporada = "media";
    } 
    // 3. Comprobamos temporada alta: de julio (7) a septiembre (9)
    else if (mes >= 7 && mes <= 9) {
      // Dentro de la alta, distinguimos entre laborable (domingo a jueves) y finde (viernes y sábado)
      // En JS: 0 es Domingo, 1-4 de Lunes a Jueves. 5 es Viernes y 6 es Sábado.
      if (diaSemana >= 0 && diaSemana <= 4) {
        tipoTemporada = "alta_laborable";
      } else {
        tipoTemporada = "alta_finde";
      }
    }

    return tipoTemporada;
  }
};
