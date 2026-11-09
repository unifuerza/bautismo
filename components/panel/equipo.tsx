"use client"

import * as React from "react"
import { Loader2, ShieldCheck, Trash2, UserPlus } from "lucide-react"
import { btnPrimary, cx, inputCls, Modal, Pills, Tile } from "@/components/ui/bento"
import { db, ROL_LABEL, ROLES, type Miembro, type Rol } from "@/lib/panel"

export const rolBadge: Record<Rol, string> = {
  voluntario: "bg-sky-400/15 text-sky-300",
  coordinador: "bg-violet-400/15 text-violet-300",
  staff: "bg-amber-400/15 text-amber-300",
}

function mensajeError(msg: string) {
  if (msg.includes("No existe ninguna cuenta"))
    return "No existe ninguna cuenta con ese correo. Créala primero en Supabase."
  if (msg.includes("propio")) return "No puedes cambiar tu propio acceso."
  if (msg.includes("Sin permiso")) return "No tienes permiso para hacer esto."
  return "No se pudo guardar. Inténtalo de nuevo."
}

/** Gestión del equipo: solo coordinador y staff. */
export function EquipoTile({
  miembros,
  yo,
  onCambio,
}: {
  miembros: Miembro[]
  yo: string
  onCambio: () => void
}) {
  const [agregando, setAgregando] = React.useState(false)
  const [ocupado, setOcupado] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  async function cambiarRol(m: Miembro, rol: Rol) {
    if (rol === m.rol) return
    setOcupado(m.user_id)
    setError(null)
    const { error } = await db().rpc("cambiar_rol", { p_user: m.user_id, p_rol: rol })
    setOcupado(null)
    if (error) return setError(mensajeError(error.message))
    onCambio()
  }

  async function quitar(m: Miembro) {
    if (
      !window.confirm(
        `¿Quitar el acceso al panel a ${m.nombre}? Su cuenta seguirá existiendo, pero no podrá entrar.`,
      )
    )
      return
    setOcupado(m.user_id)
    setError(null)
    const { error } = await db().rpc("quitar_miembro", { p_user: m.user_id })
    setOcupado(null)
    if (error) return setError(mensajeError(error.message))
    onCambio()
  }

  const orden: Record<Rol, number> = { staff: 0, coordinador: 1, voluntario: 2 }
  const lista = [...miembros].sort((a, b) => orden[a.rol] - orden[b.rol] || a.nombre.localeCompare(b.nombre))

  return (
    <Tile
      title={
        <span>
          Equipo <sup className="text-[11px]">{miembros.length}</sup>
        </span>
      }
      className="sm:col-span-2 lg:col-span-4"
      action={
        <button type="button" onClick={() => setAgregando(true)} className={btnPrimary}>
          <UserPlus className="size-4" /> Dar acceso
        </button>
      }
    >
      <p className="-mt-2 mb-4 flex items-center gap-2 text-[12px] text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        Coordinador y Staff: acceso total. Voluntario: consulta candidatos, registra batas y lee el libro.
      </p>
      {error && (
        <p role="alert" className="mb-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <ul className="grid gap-2 md:grid-cols-2">
        {lista.map((m) => {
          const soyYo = m.user_id === yo
          return (
            <li
              key={m.user_id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-border px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">
                  {m.nombre} {soyYo && <span className="text-[12px] text-muted-foreground">(tú)</span>}
                </p>
                <p className="truncate text-[12px] text-muted-foreground">{m.email ?? "—"}</p>
              </div>
              {soyYo ? (
                <span className={cx("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", rolBadge[m.rol])}>
                  {ROL_LABEL[m.rol]}
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  {ocupado === m.user_id && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                  <Pills
                    label={`Rol de ${m.nombre}`}
                    value={m.rol}
                    options={ROLES}
                    onChange={(r) => cambiarRol(m, r)}
                    render={(r) => ROL_LABEL[r]}
                  />
                  <button
                    type="button"
                    onClick={() => quitar(m)}
                    className="grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-red-300"
                    aria-label={`Quitar acceso a ${m.nombre}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <Modal open={agregando} onClose={() => setAgregando(false)} title="Dar acceso al panel">
        <FormMiembro
          onHecho={() => {
            setAgregando(false)
            onCambio()
          }}
        />
      </Modal>
    </Tile>
  )
}

function FormMiembro({ onHecho }: { onHecho: () => void }) {
  const [rol, setRol] = React.useState<Rol>("voluntario")
  const [guardando, setGuardando] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    setGuardando(true)
    setError(null)
    const { error } = await db().rpc("agregar_miembro", {
      p_email: String(d.get("email")).trim(),
      p_nombre: String(d.get("nombre")).trim(),
      p_rol: rol,
    })
    setGuardando(false)
    if (error) return setError(mensajeError(error.message))
    onHecho()
  }

  return (
    <form onSubmit={guardar} className="space-y-4">
      <p className="rounded-xl bg-muted/60 px-3.5 py-3 text-[13px] text-muted-foreground">
        La persona necesita una cuenta. Créala en Supabase →{" "}
        <strong className="text-foreground">Authentication → Users → Add user</strong> con su correo y una
        contraseña, y después dale acceso aquí.
      </p>
      <div>
        <label htmlFor="m-nombre" className="mb-1.5 block text-sm font-medium">
          Nombre
        </label>
        <input id="m-nombre" name="nombre" required maxLength={80} className={inputCls} />
      </div>
      <div>
        <label htmlFor="m-email" className="mb-1.5 block text-sm font-medium">
          Correo de su cuenta
        </label>
        <input id="m-email" name="email" type="email" required className={inputCls} />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium">Rol</p>
        <Pills label="Rol" value={rol} options={ROLES} onChange={setRol} render={(r) => ROL_LABEL[r]} />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className={`${btnPrimary} flex-1 py-2.5`}>
          {guardando && <Loader2 className="size-4 animate-spin" />} Dar acceso
        </button>
      </div>
      <p className="text-[12px] text-muted-foreground">
        Si la persona ya estaba en el equipo, se actualizan su nombre y su rol.
      </p>
    </form>
  )
}
