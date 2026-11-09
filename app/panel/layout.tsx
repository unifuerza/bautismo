import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel interno | Centro de Ayuda Cristiano",
  robots: { index: false, follow: false },
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <div className="dark">{children}</div>
}
