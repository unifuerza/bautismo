import type { Metadata, Viewport } from "next"
import "@fontsource/anton/latin-400.css"
import "@fontsource/alegreya-sans/latin-400.css"
import "@fontsource/alegreya-sans/latin-400-italic.css"
import "@fontsource/alegreya-sans/latin-500.css"
import "@fontsource/alegreya-sans/latin-700.css"
import "./globals.css"
import { bebasKai } from "./fonts"

export const metadata: Metadata = {
  applicationName: "Bautismo · Centro de Ayuda Cristiano",
  appleWebApp: { title: "Bautismo", statusBarStyle: "black" },
  formatDetection: { telephone: false },
  title: "Bautismo | Centro de Ayuda Cristiano",
  description:
    "Da el siguiente paso de fe. Conoce el significado del bautismo en agua, cómo prepararte e inscríbete en el próximo bautismo del Centro de Ayuda Cristiano.",
}

// Barra de estado del iPhone y de Chrome en Android con el azul profundo de la portada
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#040b22",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`motion-safe:scroll-smooth ${bebasKai.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
