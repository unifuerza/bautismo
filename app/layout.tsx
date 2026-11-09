import type { Metadata } from "next"
import "@fontsource/anton/latin-400.css"
import "@fontsource/belleza/latin-400.css"
import "@fontsource/inter-tight/latin-600.css"
import "@fontsource/righteous/latin-400.css"
import "./globals.css"
import { bebasKai } from "./fonts"

export const metadata: Metadata = {
  title: "Bautismo | Centro de Ayuda Cristiano",
  description:
    "Da el siguiente paso de fe. Conoce el significado del bautismo en agua, cómo prepararte e inscríbete en el próximo bautismo del Centro de Ayuda Cristiano.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`scroll-smooth ${bebasKai.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
