/**
 * Datos editables de la iglesia.
 * Cambia estos valores para actualizar toda la página.
 */
export const site = {
  nombre: "Centro de Ayuda Cristiano",
  // Próximo bautismo (EJEMPLO: reemplazar con la fecha real)
  proximoBautismo: {
    fecha: "Domingo 6 de diciembre de 2026",
    hora: "10:00 a.m.",
    // Misma fecha y hora en formato ISO (la usa la cuenta atrás del panel interno)
    fechaISO: "2026-12-06T10:00:00",
    lugar: "Templo principal — Centro de Ayuda Cristiano",
  },
  contacto: {
    direccion: "Dirección de la iglesia (editar en lib/site.ts)",
    telefono: "+1 (000) 000-0000",
    email: "contacto@centrodeayudacristiano.org",
    horarios: ["Domingos · 10:00 a.m.", "Miércoles · 7:00 p.m."],
  },
}
