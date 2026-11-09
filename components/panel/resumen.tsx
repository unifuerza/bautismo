"use client"

import * as React from "react"
import { BookOpen, Shirt, UserCheck, Users } from "lucide-react"
import { EASE, Tile, useCountUp, useMounted } from "@/components/ui/bento"
import type { Candidato } from "@/lib/panel"
import { site } from "@/lib/site"

const SEMANAS = 12

/** Saludo, total de candidatos y barras de inscripciones por semana. */
export function HeroTile({
  nombre,
  candidatos,
  reduced,
}: {
  nombre: string
  candidatos: Candidato[]
  reduced: boolean
}) {
  const mounted = useMounted()
  const pendientes = candidatos.filter((c) => c.estado !== "bautizado").length
  const bautizados = candidatos.filter((c) => c.estado === "bautizado").length
  const shown = useCountUp(pendientes, !reduced)
  const [hover, setHover] = React.useState<number | null>(null)

  const semanas = React.useMemo(() => {
    const ahora = Date.now()
    const semana = 7 * 86400 * 1000
    const counts = Array.from({ length: SEMANAS }, () => 0)
    for (const c of candidatos) {
      const i = SEMANAS - 1 - Math.floor((ahora - new Date(c.created_at).getTime()) / semana)
      if (i >= 0 && i < SEMANAS) counts[i]++
    }
    return counts
  }, [candidatos])
  const max = Math.max(...semanas, 1)
  const etiqueta = (i: number) => {
    const n = SEMANAS - 1 - i
    return n === 0 ? "Esta semana" : n === 1 ? "Semana pasada" : `Hace ${n} semanas`
  }

  return (
    <Tile className="sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-1">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="font-serif text-[28px] font-semibold leading-[1.1] tracking-tight sm:text-[34px]">
            Bendiciones, <span className="text-accent">{nombre}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Así va el grupo de bautismo.</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-muted-foreground">Por bautizar</p>
          <p className="font-serif text-[40px] font-semibold leading-none tabular-nums">
            {Math.round(shown)}
          </p>
          <p className="mt-1.5 text-[12px] text-muted-foreground">
            <span className="text-accent">{bautizados}</span> ya bautizados
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <div
          className="flex flex-1 items-end gap-[4px]"
          style={{ minHeight: 72 }}
          onPointerLeave={() => setHover(null)}
        >
          {semanas.map((n, i) => (
            <button
              key={i}
              type="button"
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${etiqueta(i)}: ${n} inscripciones`}
              className="relative flex-1 rounded-[5px] bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                height: mounted ? `${8 + (n / max) * 92}%` : "6%",
                opacity: hover === null ? 0.3 + (n / max) * 0.7 : hover === i ? 1 : 0.25,
                transition: `height 900ms ${EASE} ${i * 30}ms, opacity 200ms ease`,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Hace {SEMANAS - 1} sem.</span>
          <span className="text-foreground" aria-live="polite">
            {hover !== null
              ? `${etiqueta(hover)} · ${semanas[hover]} inscripción${semanas[hover] === 1 ? "" : "es"}`
              : "Inscripciones por semana"}
          </span>
          <span>Hoy</span>
        </div>
      </div>
    </Tile>
  )
}

/** Tarjeta de color: cuenta atrás al próximo bautismo y preparación. */
export function ProximoTile({
  candidatos,
  planchadas,
}: {
  candidatos: Candidato[]
  planchadas: number
}) {
  const [ahora, setAhora] = React.useState<number | null>(null)
  React.useEffect(() => {
    setAhora(Date.now())
    const id = window.setInterval(() => setAhora(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const fecha = new Date(site.proximoBautismo.fechaISO).getTime()
  const dias = ahora === null ? null : Math.ceil((fecha - ahora) / 86400000)
  const pendientes = candidatos.filter((c) => c.estado !== "bautizado")
  const contactados = pendientes.filter((c) => c.estado === "contactado").length
  const leidos = pendientes.filter((c) => c.libro_leido).length
  const batasOk = planchadas >= pendientes.length
  const ink = "#06122e"

  const filas: [React.ReactNode, string, string][] = [
    [<Users key="u" className="size-4" />, "Candidatos", String(pendientes.length)],
    [<UserCheck key="c" className="size-4" />, "Contactados", `${contactados} de ${pendientes.length}`],
    [<BookOpen key="l" className="size-4" />, "Leyeron el libro", `${leidos} de ${pendientes.length}`],
    [<Shirt key="b" className="size-4" />, "Batas planchadas", `${planchadas} / ${pendientes.length} necesarias`],
  ]

  return (
    <section
      className="relative flex min-w-0 flex-col overflow-hidden rounded-[26px] bg-accent p-5 lg:col-start-4 lg:row-span-2 lg:row-start-1"
      style={{ color: ink }}
    >
      <header className="flex items-start justify-between gap-2">
        <h2 className="font-label text-lg uppercase tracking-[0.12em] opacity-75">Próximo bautismo</h2>
        <span
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
          style={{ background: "rgb(6 18 46 / 0.12)" }}
        >
          <span className="size-1.5 rounded-full" style={{ background: ink }} aria-hidden />
          {dias === null ? "…" : dias > 0 ? "En preparación" : dias === 0 ? "¡Es hoy!" : "Ya pasó"}
        </span>
      </header>

      <p className="mt-5 font-display text-[64px] leading-none tabular-nums">
        {dias === null ? "–" : Math.max(dias, 0)}
        <span className="ml-2 font-label text-2xl tracking-wide">{dias === 1 ? "día" : "días"}</span>
      </p>
      <p className="mt-1 text-[13px] font-medium opacity-75">
        {site.proximoBautismo.fecha} · {site.proximoBautismo.hora}
      </p>

      <dl className="mt-6 space-y-2.5 text-[13px]">
        {filas.map(([icon, k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 opacity-75">
              {icon}
              {k}
            </dt>
            <dd className="font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl p-3 text-[13px] font-semibold" style={{ background: "rgb(6 18 46 / 0.1)" }}>
          {pendientes.length === 0
            ? "Todavía no hay candidatos para este bautismo."
            : batasOk
              ? "✓ Hay batas planchadas para todos."
              : `Faltan ${pendientes.length - planchadas} batas por planchar.`}
        </div>
        <p className="mt-2 text-[11px] opacity-60">La fecha se cambia en lib/site.ts</p>
      </div>
    </section>
  )
}
