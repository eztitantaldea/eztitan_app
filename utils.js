/**
 * Funciones auxiliares reutilizables.
 * Incluye utilidades genéricas como capitalización de textos
 * y helpers comunes a todo el proyecto.
 */


const Utils = {
  capitalize(text) {
    return text
      .split(" ")
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
  },
  
  formatEuro(value) {
    return value != null
      ? `${Number(value).toFixed(2)} €`
      : "";
  }
};
