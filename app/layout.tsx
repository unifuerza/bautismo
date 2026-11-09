import type { Metadata } from "next"
import "./globals.css"

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
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
