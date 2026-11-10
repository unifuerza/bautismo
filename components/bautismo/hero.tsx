import { ArrowRight, CalendarDays, ChevronDown } from "lucide-react"
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

// "domingo, 20 de diciembre"
const fechaCorta = new Date(site.proximoBautismo.fechaISO).toLocaleDateString("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
})

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-deep text-white"
    >
      <GlassFold {...waterSettings} className="absolute inset-0" />
      {/* velo para legibilidad del texto */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep/40 via-deep/10 to-deep/80" />
      {/* velo de lectura: oscurece los pliegues brillantes detrás del título y el versículo */}
      <div className="pointer-events-none absolute inset-0 bg-deep/55 sm:bg-transparent sm:bg-gradient-to-r sm:from-deep/80 sm:via-deep/60 sm:to-deep/15" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-8">
          <h1
            className="entrada max-w-4xl text-balance font-display text-6xl uppercase leading-[1.04] tracking-wide sm:text-7xl lg:text-8xl"
          >
            Una vida nueva comienza en el agua
          </h1>

          <blockquote
            className="entrada mt-8 max-w-xl [animation-delay:90ms] text-lg italic leading-relaxed text-white/90 sm:text-xl"
          >
            “Porque somos sepultados juntamente con él para muerte por el bautismo, a fin de que como Cristo
            resucitó de los muertos… así también nosotros andemos en vida nueva.”
            <cite className="mt-2 block font-label text-base not-italic tracking-[0.12em] text-accent">
              Romanos 6:4
            </cite>
          </blockquote>

          <div
            className="entrada mt-10 [animation-delay:180ms]"
          >
            <div className="flex flex-wrap gap-3">
              <a
                href="#inscripcion"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-label text-xl tracking-wide text-deep transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
              >
                Quiero bautizarme
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#significado"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-label text-xl tracking-wide transition hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
              >
                ¿Qué significa el bautismo?
              </a>
            </div>
            <a
              href="#proximo"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-base text-white/85 underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
            >
              <CalendarDays className="size-4 text-accent" aria-hidden />
              <span>
                Próximo bautismo: {fechaCorta}{" "}
                <span className="whitespace-nowrap">· {site.proximoBautismo.hora}</span>
              </span>
            </a>
          </div>
        </div>

      <a
        href="#significado"
        aria-label="Bajar a la siguiente sección"
        className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-10 grid size-11 -translate-x-1/2 place-items-center text-white/60 transition hover:text-white"
      >
        <ChevronDown className="size-7 motion-safe:animate-bounce" />
      </a>
    </section>
  )
}
