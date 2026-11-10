import type { Metadata } from "next"
import "@fontsource/anton/latin-400.css"
import "@fontsource/alegreya-sans/latin-400.css"
import "@fontsource/alegreya-sans/latin-400-italic.css"
import "@fontsource/alegreya-sans/latin-500.css"
import "@fontsource/alegreya-sans/latin-700.css"
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
