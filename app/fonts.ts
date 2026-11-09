import localFont from "next/font/local"

/**
 * Tipografías de la página (todas con licencia SIL Open Font License 1.1):
 * - Bebas Kai (local, app/fonts): etiquetas, botones, menú y números de pasos.
 * - Anton (@fontsource): título principal de la portada.
 * - Inter Tight (@fontsource): títulos de sección.
 * - Belleza (@fontsource): texto general.
 * - Righteous (@fontsource): nombre de la iglesia (logotipo).
 */
export const bebasKai = localFont({
  src: "./fonts/bebas-kai.otf",
  variable: "--font-bebas-kai",
  display: "swap",
})
