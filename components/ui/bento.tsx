"use client"

// Piezas base del panel, adaptadas del componente "Web3 Bento"
// (tarjetas con esquinas de 26px, selector en pastillas, contadores animados y medidor semicircular).

import * as React from "react"

export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function useReducedMotion() {
  const [r, setR] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const u = () => setR(mq.matches)
    u()
    mq.addEventListener("change", u)
    return () => mq.removeEventListener("change", u)
  }, [])
  return r
}

export function useMounted() {
  const [on, setOn] = React.useState(false)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return on
}

export function useCountUp(target: number, enabled: boolean, duration = 1100) {
  const [v, setV] = React.useState(enabled ? 0 : target)
  React.useEffect(() => {
    if (!enabled) {
      setV(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const from = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      setV(from + (target - from) * (1 - Math.pow(1 - p, 4)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, enabled, duration])
  return v
}

export function Tile({
  title,
  action,
  className,
  style,
  children,
}: {
  title?: React.ReactNode
  action?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <section
      className={cx(
        "relative flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-border bg-card p-5 text-card-foreground",
        className
      )}
      style={style}
    >
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="font-label text-lg uppercase tracking-[0.12em] text-muted-foreground">
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function Pills<T extends string>({
  value,
  options,
  onChange,
  label,
  render,
}: {
  value: T
  options: readonly T[]
  onChange: (v: T) => void
  label: string
  render?: (v: T) => React.ReactNode
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full overflow-x-auto rounded-full border border-border p-0.5 [scrollbar-width:none]"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={cx(
            "shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            o === value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {render ? render(o) : o}
        </button>
      ))}
    </div>
  )
}

/** Medidor semicircular (0..1). */
export function Gauge({ value, color, label }: { value: number; color: string; label: string }) {
  const t = Math.max(0, Math.min(1, value))
  const R = 62
  const len = Math.PI * R
  const angle = -90 + t * 180
  return (
    <div className="relative" style={{ width: 150, height: 86 }} role="img" aria-label={label}>
      <svg width="150" height="86" viewBox="0 0 150 86" aria-hidden>
        <path
          d="M 13 78 A 62 62 0 0 1 137 78"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          style={{ stroke: "var(--color-muted)" }}
        />
        <path
          d="M 13 78 A 62 62 0 0 1 137 78"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={len}
          style={{ stroke: color, strokeDashoffset: len * (1 - t), transition: `stroke-dashoffset 900ms ${EASE}` }}
        />
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "75px 78px",
            transition: `transform 900ms ${EASE}`,
          }}
        >
          <line
            x1="75"
            y1="78"
            x2="75"
            y2="30"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ stroke: "var(--color-foreground)" }}
          />
        </g>
        <circle cx="75" cy="78" r="5" style={{ fill: "var(--color-foreground)" }} />
      </svg>
    </div>
  )
}

/** Ventana modal sencilla y accesible. */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  const ref = React.useRef<HTMLDialogElement>(null)
  React.useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className={cx(
        "m-auto w-[calc(100%-2rem)] rounded-[26px] border border-border bg-card p-0 text-card-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        wide ? "max-w-5xl" : "max-w-lg"
      )}
    >
      {open && (
        <div className="p-5 sm:p-6">
          <header className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  )
}

export const inputCls =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60"

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted disabled:opacity-60"
