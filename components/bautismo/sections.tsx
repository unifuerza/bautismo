import { ArrowRight, Check, MapPin, Plus } from "lucide-react"
import { site } from "@/lib/site"

// Titulares de sección: la misma voz que la portada (Anton, mayúsculas)
const h2 =
  "text-balance font-display text-4xl uppercase leading-[1.05] tracking-wide text-foreground sm:text-5xl lg:text-6xl"

// Referencias bíblicas y etiquetas: Bebas Kai
const referencia = "font-label text-base tracking-[0.12em] text-primary"

/* ---------------- Significado ---------------- */
const significados = [
  {
    title: "Un paso de obediencia",
    text: "Jesús mandó a sus discípulos bautizar a todos los que creen. Bautizarnos es responder con obediencia a su llamado.",
    ref: "Mateo 28:19",
  },
  {
    title: "Morir y resucitar con Cristo",
    text: "Al entrar al agua dejamos atrás la vida pasada; al salir, declaramos que caminamos en una vida nueva por su resurrección.",
    ref: "Romanos 6:4",
  },
  {
    title: "Un testimonio público",
    text: "Es una declaración delante de tu familia y de la iglesia: “Pertenezco a Jesús”. Una fiesta para toda la comunidad de fe.",
    ref: "Hechos 2:41",
  },
]

export function Significado() {
  return (
    <section id="significado" className="scroll-mt-16 bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <h2 className={h2}>Una señal exterior de un cambio interior</h2>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted-foreground">
            El bautismo en agua no nos salva: es la respuesta de quien ya ha recibido a Jesucristo como Señor y
            Salvador. Es una celebración de lo que Dios ya hizo en tu corazón.
          </p>

          <ul className="mt-12 divide-y divide-border border-y border-border">
            {significados.map(({ title, text, ref }) => (
              <li key={title} className="py-6">
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-1.5 max-w-xl text-lg leading-relaxed text-muted-foreground">{text}</p>
                <p className={`mt-2 ${referencia}`}>{ref}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Versículo protagonista: sustituye a la foto de stock */}
        <figure className="relative overflow-hidden rounded-3xl bg-deep p-8 text-white sm:p-12 lg:self-center lg:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 70% at 85% 0%, rgb(30 79 200 / 0.55), transparent 60%), radial-gradient(90% 60% at 0% 100%, rgb(150 215 255 / 0.18), transparent 70%)",
            }}
          />
          <blockquote className="relative text-3xl italic leading-snug sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            “Arrepentíos, y bautícese cada uno de vosotros en el nombre de Jesucristo.”
          </blockquote>
          <figcaption className="relative mt-6 font-label text-lg tracking-[0.12em] text-accent">Hechos 2:38</figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ---------------- Pasos ---------------- */
const pasos = [
  {
    title: "Recibe a Jesús",
    text: "El bautismo es para quien ha creído en Cristo y ha decidido seguirle. Si aún tienes preguntas, conversemos.",
  },
  {
    title: "Conoce al grupo de bautismo",
    text: "Nuestro grupo de bautismo se reunirá contigo para escuchar tu testimonio, resolver tus dudas y orar contigo.",
  },
  {
    title: "¡El día de tu bautismo!",
    text: "Invita a tu familia y amigos. Celebraremos juntos este paso tan importante en tu fe.",
  },
]

export function Pasos() {
  return (
    <section id="pasos" className="scroll-mt-16 bg-secondary/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className={h2}>Tres pasos hacia las aguas</h2>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">
            No tienes que tenerlo todo resuelto. Te acompañamos en cada etapa del camino.
          </p>
        </div>

        {/* Recorrido: el número indica el orden, la línea une los pasos */}
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {pasos.map((p, i) => (
            <li key={p.title} className="border-t-2 border-primary/30 pt-6">
              <span className="font-label text-7xl leading-none text-primary" aria-hidden>
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">
                <span className="sr-only">Paso {i + 1}: </span>
                {p.title}
              </h3>
              <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Próximo bautismo ---------------- */
const traer = [
  "Ropa oscura o que no se transparente al mojarse",
  "Una muda de ropa seca y ropa interior extra",
  "Toalla, sandalias y una bolsa para la ropa mojada",
  "¡A tu familia y amigos para celebrar contigo!",
]

function partesFecha(iso: string) {
  const d = new Date(iso)
  const f = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("es-ES", o)
  return { semana: f({ weekday: "long" }), dia: f({ day: "numeric" }), mes: f({ month: "long" }), anio: f({ year: "numeric" }) }
}

export function ProximoBautismo() {
  const { hora, lugar, fechaISO } = site.proximoBautismo
  const { semana, dia, mes, anio } = partesFecha(fechaISO)

  return (
    <section id="proximo" className="scroll-mt-16 bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-deep text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 90% at 0% 0%, rgb(30 79 200 / 0.6), transparent 65%), radial-gradient(60% 70% at 100% 100%, rgb(150 215 255 / 0.14), transparent 70%)",
            }}
          />
          <div className="relative grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* La fecha es la protagonista */}
            <div className="flex flex-col justify-center border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <p className="font-label text-2xl capitalize tracking-[0.1em] text-accent">{semana}</p>
              <p className="font-display text-[8rem] leading-[0.9] sm:text-[10rem]">{dia}</p>
              <p className="font-label text-4xl capitalize tracking-[0.06em]">
                {mes} {anio}
              </p>
              <p className="mt-4 font-label text-2xl tracking-[0.1em] text-white/80">{hora}</p>
            </div>

            <div className="p-8 sm:p-12">
              <h2 className="text-balance font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
                Próximo bautismo
              </h2>
              <p className="mt-2 flex items-center gap-2 text-lg text-white/90">
                <MapPin className="size-5 shrink-0 text-accent" aria-hidden />
                <a
                  href={site.contacto.mapa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center underline decoration-white/30 underline-offset-4 hover:decoration-white"
                >
                  {lugar}
                </a>
              </p>

              <h3 className="mt-10 text-xl font-bold">¿Qué debo traer?</h3>
              <ul className="mt-4 space-y-3 text-lg text-white/85">
                {traer.map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>

              <a
                href="#inscripcion"
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-label text-xl tracking-wide text-deep transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
              >
                Quiero bautizarme
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Preguntas ---------------- */
const preguntas = [
  {
    q: "¿Quién puede bautizarse?",
    a: "Toda persona que haya creído en Jesucristo como su Señor y Salvador y desee seguirle públicamente. Los niños pueden bautizarse cuando entienden y expresan su fe personal; conversamos con los padres en cada caso.",
  },
  {
    q: "¿Cómo se realiza el bautismo?",
    a: "Por inmersión: el pastor te sumerge brevemente en el agua y te levanta, simbolizando la muerte a la vida pasada y la resurrección a una vida nueva en Cristo.",
  },
  {
    q: "¿Tiene algún costo?",
    a: "No. El bautismo es completamente gratuito.",
  },
  {
    q: "¿Puedo invitar a mi familia a ver el bautismo?",
    a: "¡Claro que sí! Es una celebración. Familiares y amigos son bienvenidos, y pueden tomar fotos y videos.",
  },
]

export function Preguntas() {
  const { email, telefono } = site.contacto
  return (
    <section id="preguntas" className="scroll-mt-16 bg-secondary/60 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className={h2}>Resolvemos tus dudas</h2>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">
            ¿No encuentras tu pregunta? Escríbenos a{" "}
            <a href={`mailto:${email}`} className="text-primary underline underline-offset-4">
              {email}
            </a>{" "}
            o llámanos al{" "}
            <a
              href={`tel:${telefono.replace(/[^\d+]/g, "")}`}
              className="whitespace-nowrap text-primary underline underline-offset-4"
            >
              {telefono}
            </a>
            .
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {preguntas.map(({ q, a }) => (
            <details key={q} className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-5 text-xl font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                {q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-primary/30 text-primary transition group-open:rotate-45">
                  <Plus className="size-4" aria-hidden />
                </span>
              </summary>
              <p className="-mt-1 max-w-2xl pb-6 text-lg leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
