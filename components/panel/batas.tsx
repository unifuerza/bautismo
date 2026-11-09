"use client"

import * as React from "react"
import { Loader2, Minus, Pencil, Plus, RotateCcw, Shirt, Trash2 } from "lucide-react"
import {
  btnGhost,
  btnPrimary,
  Gauge,
  inputCls,
  Modal,
  Pills,
  Tile,
  useMounted,
  EASE,
} from "@/components/ui/bento"
import { db, hace, type RegistroBata } from "@/lib/panel"

export function calcularPlanchadas(registro: RegistroBata[], total: number) {
  const neto = registro.reduce((s, r) => s + (r.tipo === "planchado" ? r.cantidad : -r.cantidad), 0)
  return Math.max(0, Math.min(total, neto))
}

/** Medidor de batas planchadas con acciones rápidas. */
export function BatasTile({
  total,
  planchadas,
  persona,
  admin,
  onCambio,
}: {
  total: number
  planchadas: number
  persona: string
  admin: boolean
  onCambio: () => void
}) {
  const [modo, setModo] = React.useState<"planchado" | "usado" | "total" | null>(null)
  const sinPlanchar = Math.max(0, total - planchadas)

  return (
    <Tile
      title="Batas"
      className="lg:col-start-3 lg:row-start-1"
      action={
        admin ? (
          <button
            type="button"
            onClick={() => setModo("total")}
            className="inline-flex items-center gap-1 text-[12px] text-muted-foreground transition hover:text-foreground"
          >
            <Pencil className="size-3" /> Total: {total}
          </button>
        ) : (
          <span className="text-[12px] text-muted-foreground">Total: {total}</span>
        )
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        {total === 0 ? (
          <div className="py-4 text-center">
            {admin ? (
              <>
                <p className="text-sm text-muted-foreground">Indica cuántas batas tiene la iglesia.</p>
                <button type="button" onClick={() => setModo("total")} className={`${btnPrimary} mt-3`}>
                  Configurar total
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Un coordinador tiene que indicar cuántas batas tiene la iglesia.
              </p>
            )}
          </div>
        ) : (
          <>
            <Gauge
              value={planchadas / total}
              color="var(--color-accent)"
              label={`${planchadas} de ${total} batas planchadas`}
            />
            <p className="mt-2 font-serif text-[30px] font-semibold leading-none tabular-nums">
              {planchadas}
              <span className="text-base text-muted-foreground"> / {total}</span>
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">planchadas · {sinPlanchar} sin planchar</p>
          </>
        )}
      </div>
      {total > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setModo("planchado")}
            disabled={sinPlanchar === 0}
            className={btnPrimary}
          >
            <Plus className="size-4" /> Planché
          </button>
          <button
            type="button"
            onClick={() => setModo("usado")}
            disabled={planchadas === 0}
            className={btnGhost}
          >
            <Minus className="size-4" /> Se usaron
          </button>
        </div>
      )}

      <Modal
        open={modo === "planchado" || modo === "usado"}
        onClose={() => setModo(null)}
        title={modo === "usado" ? "Registrar batas usadas" : "Registrar batas planchadas"}
      >
        {(modo === "planchado" || modo === "usado") && (
          <FormRegistro
            tipo={modo}
            max={modo === "planchado" ? sinPlanchar : planchadas}
            persona={persona}
            onHecho={() => {
              setModo(null)
              onCambio()
            }}
          />
        )}
      </Modal>
      <Modal open={modo === "total"} onClose={() => setModo(null)} title="Total de batas">
        <FormTotal
          total={total}
          onHecho={() => {
            setModo(null)
            onCambio()
          }}
        />
      </Modal>
    </Tile>
  )
}

function FormRegistro({
  tipo,
  max,
  persona,
  onHecho,
}: {
  tipo: "planchado" | "usado"
  max: number
  persona: string
  onHecho: () => void
}) {
  const [cantidad, setCantidad] = React.useState(Math.min(1, max))
  const [guardando, setGuardando] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    setGuardando(true)
    setError(null)
    const { error } = await db()
      .from("batas_registro")
      .insert({
        tipo,
        cantidad,
        persona: String(d.get("persona")).trim(),
        nota: String(d.get("nota") ?? "").trim() || null,
      })
    setGuardando(false)
    if (error) return setError("No se pudo guardar. Inténtalo de nuevo.")
    onHecho()
  }

  return (
    <form onSubmit={guardar} className="space-y-4">
      <div>
        <p className="mb-1.5 text-sm font-medium">¿Cuántas?</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`${btnGhost} size-11 p-0`}
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            aria-label="Una menos"
          >
            <Minus className="size-4" />
          </button>
          <span
            className="w-14 text-center font-serif text-4xl font-semibold tabular-nums"
            aria-live="polite"
          >
            {cantidad}
          </span>
          <button
            type="button"
            className={`${btnGhost} size-11 p-0`}
            onClick={() => setCantidad((c) => Math.min(max, c + 1))}
            aria-label="Una más"
          >
            <Plus className="size-4" />
          </button>
          <span className="text-sm text-muted-foreground">máx. {max}</span>
        </div>
      </div>
      <div>
        <label htmlFor="persona" className="mb-1.5 block text-sm font-medium">
          {tipo === "planchado" ? "¿Quién las planchó?" : "¿Quién lo registra?"}
        </label>
        <input
          id="persona"
          name="persona"
          defaultValue={persona}
          required
          maxLength={80}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="nota" className="mb-1.5 block text-sm font-medium">
          Nota <span className="text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="nota"
          name="nota"
          maxLength={300}
          placeholder={tipo === "usado" ? "Bautismo del 6 de diciembre" : ""}
          className={inputCls}
        />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={guardando || cantidad < 1} className={`${btnPrimary} w-full py-3`}>
        {guardando && <Loader2 className="size-4 animate-spin" />} Guardar registro
      </button>
    </form>
  )
}

function FormTotal({ total, onHecho }: { total: number; onHecho: () => void }) {
  const [guardando, setGuardando] = React.useState(false)
  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const n = Number(new FormData(e.currentTarget).get("total"))
    setGuardando(true)
    await db()
      .from("ajustes")
      .upsert({ clave: "batas_total", valor: n, updated_at: new Date().toISOString() })
    setGuardando(false)
    onHecho()
  }
  return (
    <form onSubmit={guardar} className="space-y-4">
      <label htmlFor="total" className="block text-sm font-medium">
        ¿Cuántas batas de bautismo tiene la iglesia en total?
      </label>
      <input
        id="total"
        name="total"
        type="number"
        min={0}
        max={500}
        required
        defaultValue={total || ""}
        className={inputCls}
      />
      <button type="submit" disabled={guardando} className={`${btnPrimary} w-full py-3`}>
        {guardando && <Loader2 className="size-4 animate-spin" />} Guardar
      </button>
    </form>
  )
}

/** Historial de planchado y uso. */
export function RegistroBatasTile({
  registro,
  admin,
  onCambio,
}: {
  registro: RegistroBata[]
  admin: boolean
  onCambio: () => void
}) {
  const mounted = useMounted()
  const [filtro, setFiltro] = React.useState<"Todo" | "Planchado" | "Usado">("Todo")
  const [verTodo, setVerTodo] = React.useState(false)
  const lista = registro.filter(
    (r) => filtro === "Todo" || r.tipo === (filtro === "Planchado" ? "planchado" : "usado"),
  )
  const visibles = verTodo ? lista : lista.slice(0, 6)

  async function borrar(r: RegistroBata) {
    if (!window.confirm(`¿Borrar este registro (${r.cantidad} batas, ${r.persona})?`)) return
    await db().from("batas_registro").delete().eq("id", r.id)
    onCambio()
  }

  return (
    <Tile title="Registro de batas" className="lg:col-start-3 lg:row-span-2 lg:row-start-2">
      <div className="mb-3">
        <Pills
          label="Filtrar registro"
          value={filtro}
          options={["Todo", "Planchado", "Usado"] as const}
          onChange={setFiltro}
        />
      </div>
      {lista.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Todavía no hay registros.</p>
      ) : (
        <ul className="-mx-2 -my-1">
          {visibles.map((r, i) => (
            <li
              key={r.id}
              className="group flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-muted/50"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(6px)",
                transition: `opacity 500ms ease ${150 + i * 60}ms, transform 500ms ${EASE} ${150 + i * 60}ms`,
              }}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted">
                {r.tipo === "planchado" ? (
                  <Shirt className="size-4 text-accent" />
                ) : (
                  <RotateCcw className="size-4 text-muted-foreground" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">
                  {r.persona} {r.tipo === "planchado" ? "planchó" : "registró uso de"} {r.cantidad}{" "}
                  {r.cantidad === 1 ? "bata" : "batas"}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {hace(r.created_at)}
                  {r.nota ? ` · ${r.nota}` : ""}
                </p>
              </div>
              <span
                className={`font-serif text-[14px] font-semibold tabular-nums ${r.tipo === "planchado" ? "text-accent" : "text-muted-foreground"}`}
              >
                {r.tipo === "planchado" ? "+" : "−"}
                {r.cantidad}
              </span>
              {admin && (
                <button
                  type="button"
                  onClick={() => borrar(r)}
                  className="grid size-8 place-items-center rounded-full text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100"
                  aria-label="Borrar registro"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {lista.length > 6 && (
        <button
          type="button"
          onClick={() => setVerTodo((v) => !v)}
          className="mt-3 self-start text-[13px] font-semibold text-accent hover:underline"
        >
          {verTodo ? "Ver menos" : `Ver los ${lista.length} registros`}
        </button>
      )}
    </Tile>
  )
}
