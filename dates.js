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
  }
};
