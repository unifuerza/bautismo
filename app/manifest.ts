import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bautismo · Centro de Ayuda Cristiano",
    short_name: "Bautismo",
    description: "Información e inscripción al bautismo en agua del Centro de Ayuda Cristiano.",
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#040b22",
    theme_color: "#040b22",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
