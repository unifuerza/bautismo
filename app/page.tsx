import { Navbar } from "@/components/bautismo/navbar"
import { Hero } from "@/components/bautismo/hero"
import {
  Pasos,
  Preguntas,
  ProximoBautismo,
  Significado,
} from "@/components/bautismo/sections"
import { Inscripcion } from "@/components/bautismo/inscripcion"
import { Footer } from "@/components/bautismo/footer"

export default function BautismoPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Significado />
        <Pasos />
        <ProximoBautismo />
        <Preguntas />
        <Inscripcion />
      </main>
      <Footer />
    </>
  )
}
