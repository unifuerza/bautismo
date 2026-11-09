import {
  BookOpen,
  CalendarDays,
  Clock,
  HandHeart,
  HeartHandshake,
  MapPin,
  Shirt,
  Sparkles,
  Users,
  Waves,
} from "lucide-react"
import { site } from "@/lib/site"

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-label text-lg uppercase tracking-[0.15em] text-primary">
      {children}
    </p>
  )
}

/* ---------------- Significado ---------------- */
const significados = [
  {
    icon: HandHeart,
    title: "Un paso de obediencia",
    text: "Jesús mandó a sus discípulos bautizar a todos los que creen. Bautizarnos es responder con obediencia a su llamado.",
    ref: "Mateo 28:19",
  },
  {
    icon: Waves,
    title: "Morir y resucitar con Cristo",
    text: "Al entrar al agua dejamos atrás la vida pasada; al salir, declaramos que caminamos en una vida nueva por su resurrección.",
    ref: "Romanos 6:4",
  },
  {
    icon: Users,
    title: "Un testimonio público",
    text: "Es una declaración delante de tu familia y de la iglesia: “Pertenezco a Jesús”. Una fiesta para toda la comunidad de fe.",
    ref: "Hechos 2:41",
  },
]

export function Significado() {
  return (
    <section id="significado" className="scroll-mt-16 bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <Eyebrow>¿Qué es el bautismo?</Eyebrow>
          <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Una señal exterior de un cambio interior
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            El bautismo en agua no nos salva: es la respuesta de quien ya ha recibido a Jesucristo
            como Señor y Salvador. Es una celebración de lo que Dios ya hizo en tu corazón.
          </p>

          <div className="mt-10 space-y-6">
            {significados.map(({ icon: Icon, title, text, ref }) => (
              <div key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-muted-foreground">{text}</p>
                  <p className="mt-1 text-sm font-medium text-primary">{ref}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200 to-primary/40 shadow-2xl shadow-primary/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1000&q=80"
              alt="Biblia abierta sobre una mesa"
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border bg-card p-5 shadow-xl sm:left-auto sm:right-[-1.5rem] sm:w-72">
            <BookOpen className="mb-2 size-5 text-primary" />
            <p className="text-lg italic leading-snug">
              “Arrepentíos, y bautícese cada uno de vosotros en el nombre de Jesucristo.”
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Hechos 2:38</p>
          </div>
        </div>
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
          <Eyebrow>Cómo prepararte</Eyebrow>
          <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Tres pasos hacia las aguas
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            No tienes que tenerlo todo resuelto. Te acompañamos en cada etapa del camino.
          </p>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {pasos.map((p, i) => (
            <li
              key={p.title}
              className="relative rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="font-label text-6xl leading-none text-primary/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-muted-foreground">{p.text}</p>
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

export function ProximoBautismo() {
  const { fecha, hora, lugar } = site.proximoBautismo
  const detalles = [
    { icon: CalendarDays, label: "Fecha", value: fecha },
    { icon: Clock, label: "Hora", value: hora },
    { icon: MapPin, label: "Lugar", value: lugar },
  ]

  return (
    <section id="proximo" className="scroll-mt-16 bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-3xl bg-deep text-white shadow-2xl">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-72 lg:min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"
                alt="Agua cristalina iluminada por el sol"
                className="absolute inset-0 size-full object-cover opacity-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-deep/20 lg:to-deep" />
            </div>

            <div className="p-8 sm:p-12">
              <p className="mb-4 font-label text-lg uppercase tracking-[0.15em] text-accent">
                Próximo bautismo
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Te esperamos en las aguas
              </h2>

              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                {detalles.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3 sm:last:col-span-2">
                    <Icon className="mt-0.5 size-5 shrink-0 text-accent" />
                    <div>
                      <dt className="font-label text-base uppercase tracking-wider text-white/50">{label}</dt>
                      <dd className="mt-1 text-white/90">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Shirt className="size-4 text-accent" /> ¿Qué debo traer?
                </h3>
                <ul className="mt-4 space-y-2.5 text-white/75">
                  {traer.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Sparkles className="mt-1 size-3.5 shrink-0 text-accent" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#inscripcion"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-label text-lg tracking-wide text-deep transition hover:bg-accent"
              >
                <HeartHandshake className="size-4" /> Reservar mi lugar
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
    q: "Ya fui bautizado de niño, ¿debo bautizarme de nuevo?",
    a: "Creemos en el bautismo como una decisión personal de fe. Si fuiste bautizado antes de poder tomar esa decisión por ti mismo, te invitamos a conversar con nuestro grupo de bautismo para orar y decidir juntos.",
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
    q: "Me da nervios hablar en público, ¿tengo que dar un testimonio?",
    a: "No es obligatorio. Si deseas compartir unas palabras, te ayudamos a prepararlas; si no, tu bautismo ya es un hermoso testimonio por sí mismo.",
  },
  {
    q: "¿Puedo invitar a mi familia a ver el bautismo?",
    a: "¡Claro que sí! Es una celebración. Familiares y amigos son bienvenidos, y pueden tomar fotos y videos.",
  },
]

export function Preguntas() {
  return (
    <section id="preguntas" className="scroll-mt-16 bg-secondary/60 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Resolvemos tus dudas
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            ¿No encuentras tu pregunta? Escríbenos y con gusto te respondemos.
          </p>
        </div>

        <div className="divide-y rounded-2xl border bg-card">
          {preguntas.map(({ q, a }) => (
            <details key={q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-primary transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
