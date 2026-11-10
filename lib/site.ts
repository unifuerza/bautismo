/**
 * Datos editables de la iglesia.
 * Cambia estos valores para actualizar toda la página.
 */
const direccion = "Gran Via de les Corts Catalanes, 318"

export const site = {
  nombre: "Centro de Ayuda Cristiano",
  // Nombre legal del responsable del tratamiento de datos (aviso de privacidad)
  nombreLegal: "Centro de Ayuda Cristiano",
  proximoBautismo: {
    fecha: "Domingo, 20 de diciembre de 2026",
    hora: "12:00 h",
    // Misma fecha y hora en formato ISO (la usa la cuenta atrás del panel interno)
    fechaISO: "2026-12-20T12:00:00",
    lugar: direccion,
  },
  contacto: {
    direccion,
    mapa: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`,
    telefono: "+34 651 89 02 02",
    email: "unifuerzaesp@gmail.com",
    horarios: ["Todos los días · de 7:00 a 21:00"],
  },
}
