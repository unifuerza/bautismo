"use client"

import { motion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { GlassFold } from "@/components/ui/glass-fold"
import { site } from "@/lib/site"

// Azules de agua: cuerpo, fondo profundo y bordes iluminados
const waterSettings = {
  color1: "#1e4fc8",
  color2: "#040b22",
  color3: "#a8e4ff",
  speed: 0.4,
  scale: 1,
  noise: 0.1,
}

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-deep text-white"
    >
      <GlassFold {...waterSettings} className="absolute inset-0" />
      {/* velo para legibilidad del texto */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep/40 via-deep/10 to-deep/80" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-sky-100 backdrop-blur-md"
        >
          Bautismo en agua · {site.nombre}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="max-w-4xl font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl"
        >
          Una vida nueva comienza en el agua
        </motion.h1>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="mt-8 max-w-xl border-l-2 border-accent/70 pl-5 text-base leading-relaxed text-white/80 sm:text-lg"
        >
          “Porque somos sepultados juntamente con él para muerte por el bautismo, a fin de que
          como Cristo resucitó de los muertos… así también nosotros andemos en vida nueva.”
          <cite className="mt-2 block text-sm not-italic text-accent">Romanos 6:4</cite>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href="#inscripcion"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-deep transition hover:bg-accent"
          >
            Quiero bautizarme
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#significado"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-md transition hover:bg-white/20"
          >
            ¿Qué significa el bautismo?
          </a>
        </motion.div>
      </div>

      <a
        href="#significado"
        aria-label="Bajar a la siguiente sección"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60 transition hover:text-white"
      >
        <ChevronDown className="size-7 animate-bounce" />
      </a>
    </section>
  )
}
