"use client"

import * as React from "react"
import { BookCheck, Camera, ImageIcon, Loader2, Phone, Plus, Search, Trash2 } from "lucide-react"
import { btnGhost, btnPrimary, cx, inputCls, Modal, Pills, Tile } from "@/components/ui/bento"
import {
  db,
  edad,
  ESTADO_LABEL,
  ESTADOS,
  fechaCorta,
  FOTOS,
  SEXO_LABEL,
  type Candidato,
  type Estado,
} from "@/lib/panel"

type Filtro = "todos" | Estado

function Avatar({ c, url, size = 40 }: { c: Candidato; url?: string; size?: number }) {
  const iniciales = c.nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`Foto de ${c.nombre}`}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-muted font-label text-base tracking-wide text-muted-foreground"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {iniciales}
    </span>
  )
}

const badge: Record<Estado, string> = {
  nuevo: "bg-sky-400/15 text-sky-300",
  contactado: "bg-amber-400/15 text-amber-300",
  bautizado: "bg-emerald-400/15 text-emerald-300",
}

export function CandidatosTile({
  candidatos,
  fotos,
  admin,
  onCambio,
}: {
  candidatos: Candidato[]
  fotos: Record<string, string>
  admin: boolean
  onCambio: () => void
}) {
  const [filtro, setFiltro] = React.useState<Filtro>("todos")
  const [q, setQ] = React.useState("")
  const [abierto, setAbierto] = React.useState<Candidato | "nuevo" | null>(null)

  const lista = candidatos.filter(
    (c) =>
      (filtro === "todos" || c.estado === filtro) &&
      (q === "" ||
        c.nombre.toLowerCase().includes(q.toLowerCase()) ||
        c.telefono.replace(/\s/g, "").includes(q.replace(/\s/g, ""))),
  )
  const cuenta = (f: Filtro) =>
    f === "todos" ? candidatos.length : candidatos.filter((c) => c.estado === f).length

  return (
    <Tile
      title="Quién se va a bautizar"
      className="sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-2"
      action={
        admin && (
          <button type="button" onClick={() => setAbierto("nuevo")} className={btnPrimary}>
            <Plus className="size-4" /> Añadir
          </button>
        )
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <Pills
          label="Filtrar por estado"
          value={filtro}
          options={["todos", ...ESTADOS] as const}
          onChange={setFiltro}
          render={(f) => (
            <>
              {f === "todos" ? "Todos" : ESTADO_LABEL[f]} <span className="opacity-60">{cuenta(f)}</span>
            </>
          )}
        />
        <label className="relative ml-auto min-w-0 flex-1 sm:max-w-56">
          <span className="sr-only">Buscar</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nombre o teléfono"
            className={`${inputCls} py-2 pl-9`}
          />
        </label>
      </div>

      {lista.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {candidatos.length === 0 ? "Aún no hay nadie inscrito." : "Nadie coincide con la búsqueda."}
        </p>
      ) : (
        <ul className="-mx-2 mt-4 max-h-[460px] overflow-y-auto">
          {lista.map((c) => {
            const e = edad(c.fecha_nacimiento)
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setAbierto(c)}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar c={c} url={c.foto_path ? fotos[c.foto_path] : undefined} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{c.nombre}</p>
                    <p className="truncate text-[12px] text-muted-foreground">
                      {c.telefono}
                      {c.sexo ? ` · ${SEXO_LABEL[c.sexo]}` : ""}
                      {e !== null ? ` · ${e} años` : " · sin fecha de nacimiento"}
                    </p>
                  </div>
                  {c.libro_leido && (
                    <BookCheck className="size-4 shrink-0 text-accent" aria-label="Leyó el libro" />
                  )}
                  <span
                    className={cx(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      badge[c.estado],
                    )}
                  >
                    {ESTADO_LABEL[c.estado]}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <Modal
        open={abierto !== null}
        onClose={() => setAbierto(null)}
        title={abierto === "nuevo" ? "Añadir candidato" : "Ficha del candidato"}
      >
        {abierto !== null && (
          <FichaCandidato
            key={abierto === "nuevo" ? "nuevo" : abierto.id}
            candidato={abierto === "nuevo" ? null : abierto}
            admin={admin}
            fotoUrl={abierto !== "nuevo" && abierto.foto_path ? fotos[abierto.foto_path] : undefined}
            onHecho={() => {
              setAbierto(null)
              onCambio()
            }}
            onFoto={onCambio}
          />
        )}
      </Modal>
    </Tile>
  )
}

function FichaCandidato({
  candidato,
  admin,
  fotoUrl,
  onHecho,
  onFoto,
}: {
  candidato: Candidato | null
  admin: boolean
  fotoUrl?: string
  onHecho: () => void
  onFoto: () => void
}) {
  const [estado, setEstado] = React.useState<Estado>(candidato?.estado ?? "nuevo")
  const [guardando, setGuardando] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const val = (k: string) => String(d.get(k) ?? "").trim() || null
    const datos = {
      nombre: val("nombre"),
      telefono: val("telefono"),
      email: val("email"),
      fecha_nacimiento: val("fecha_nacimiento"),
      sexo: val("sexo"),
      fecha_bautismo: estado === "bautizado" ? val("fecha_bautismo") : null,
      libro_leido: d.get("libro_leido") === "on",
      estado,
      actualizado_at: new Date().toISOString(),
    }
    setGuardando(true)
    setError(null)
    const res = candidato
      ? await db().from("inscripciones_bautismo").update(datos).eq("id", candidato.id)
      : await db()
          .from("inscripciones_bautismo")
          .insert({ ...datos, fe: "Sí", mensaje: "Añadido desde el panel" })
    setGuardando(false)
    if (res.error) return setError("No se pudo guardar. Revisa los datos e inténtalo de nuevo.")
    onHecho()
  }

  async function borrar() {
    if (!candidato) return
    if (!window.confirm(`¿Borrar a ${candidato.nombre}? Esta acción no se puede deshacer.`)) return
    if (candidato.foto_path) await db().storage.from(FOTOS).remove([candidato.foto_path])
    await db().from("inscripciones_bautismo").delete().eq("id", candidato.id)
    onHecho()
  }

  return (
    <form onSubmit={guardar}>
      {!admin && (
        <p className="mb-4 rounded-xl bg-muted/60 px-3.5 py-2.5 text-[13px] text-muted-foreground">
          Solo lectura. Los cambios los hacen coordinadores y staff.
        </p>
      )}
      <fieldset disabled={!admin} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium">
            Nombre completo
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            minLength={2}
            maxLength={120}
            defaultValue={candidato?.nombre}
            className={inputCls}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium">
              Teléfono
            </label>
            <div className="flex gap-2">
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                minLength={5}
                maxLength={30}
                defaultValue={candidato?.telefono}
                className={inputCls}
              />
              {candidato && (
                <a
                  href={`tel:${candidato.telefono.replace(/[^\d+]/g, "")}`}
                  className={`${btnGhost} size-11 shrink-0 p-0`}
                  aria-label={`Llamar a ${candidato.nombre}`}
                >
                  <Phone className="size-4" />
                </a>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="fecha_nacimiento" className="mb-1.5 block text-sm font-medium">
              Fecha de nacimiento
            </label>
            <input
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              defaultValue={candidato?.fecha_nacimiento ?? ""}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Correo <span className="text-muted-foreground">(opcional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={160}
            defaultValue={candidato?.email ?? ""}
            className={inputCls}
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">Sexo</legend>
          <div className="flex flex-wrap gap-2">
            {(["hombre", "mujer"] as const).map((v) => (
              <label
                key={v}
                className="cursor-pointer rounded-full border border-input px-4 py-1.5 text-sm transition has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
              >
                <input
                  type="radio"
                  name="sexo"
                  value={v}
                  defaultChecked={candidato?.sexo === v}
                  className="sr-only"
                />
                {SEXO_LABEL[v]}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <p className="mb-1.5 text-sm font-medium">Estado</p>
          <Pills
            label="Estado"
            value={estado}
            options={ESTADOS}
            onChange={setEstado}
            render={(e) => ESTADO_LABEL[e]}
          />
        </div>

        {estado === "bautizado" && (
          <div>
            <label htmlFor="fecha_bautismo" className="mb-1.5 block text-sm font-medium">
              Fecha del bautismo
            </label>
            <input
              id="fecha_bautismo"
              name="fecha_bautismo"
              type="date"
              defaultValue={candidato?.fecha_bautismo ?? new Date().toISOString().slice(0, 10)}
              className={inputCls}
            />
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-3.5 py-3 text-sm">
          <input
            type="checkbox"
            name="libro_leido"
            defaultChecked={candidato?.libro_leido ?? false}
            className="size-4 accent-[var(--color-accent)]"
          />
          Ha leído el libro del bautismo
        </label>

        {candidato?.mensaje && (
          <div className="rounded-xl bg-muted/60 px-3.5 py-3 text-sm">
            <p className="mb-1 text-[12px] text-muted-foreground">
              Mensaje de la inscripción · {fechaCorta(candidato.created_at)}
            </p>
            <p className="whitespace-pre-wrap">{candidato.mensaje}</p>
          </div>
        )}

        {candidato && admin && (
          <FotoBautismo
            candidato={candidato}
            url={fotoUrl}
            habilitada={estado === "bautizado"}
            onCambio={onFoto}
          />
        )}
        {candidato && !admin && fotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoUrl}
            alt={`Bautismo de ${candidato.nombre}`}
            className="size-28 rounded-2xl object-cover"
          />
        )}

        {error && <p className="text-sm text-red-300">{error}</p>}
      </fieldset>

      {admin && (
        <div className="mt-4 flex items-center gap-2 pt-1">
          {candidato && (
            <button type="button" onClick={borrar} className={`${btnGhost} text-red-300`}>
              <Trash2 className="size-4" /> Borrar
            </button>
          )}
          <button type="submit" disabled={guardando} className={`${btnPrimary} ml-auto px-6 py-2.5`}>
            {guardando && <Loader2 className="size-4 animate-spin" />}
            {candidato ? "Guardar cambios" : "Añadir"}
          </button>
        </div>
      )}
    </form>
  )
}

function FotoBautismo({
  candidato,
  url,
  habilitada,
  onCambio,
}: {
  candidato: Candidato
  url?: string
  habilitada: boolean
  onCambio: () => void
}) {
  const [subiendo, setSubiendo] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState<string | undefined>(url)
  const input = React.useRef<HTMLInputElement>(null)

  async function subir(file: File) {
    if (file.size > 10 * 1024 * 1024) return setError("La foto pesa más de 10 MB.")
    setSubiendo(true)
    setError(null)
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
    const path = `${candidato.id}/${Date.now()}.${ext}`
    const sb = db()
    const up = await sb.storage.from(FOTOS).upload(path, file, { contentType: file.type })
    if (up.error) {
      setSubiendo(false)
      return setError("No se pudo subir la foto. Usa JPG, PNG o WEBP.")
    }
    await sb.from("inscripciones_bautismo").update({ foto_path: path }).eq("id", candidato.id)
    if (candidato.foto_path) await sb.storage.from(FOTOS).remove([candidato.foto_path])
    setPreview(URL.createObjectURL(file))
    setSubiendo(false)
    onCambio()
  }

  return (
    <div className="rounded-xl border border-dashed border-border p-3.5">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Camera className="size-4 text-accent" /> Foto del bautismo
      </p>
      {!habilitada ? (
        <p className="text-sm text-muted-foreground">
          Marca a la persona como <strong className="text-foreground">Bautizado</strong> y guarda para poder
          subir su foto.
        </p>
      ) : (
        <div className="flex items-center gap-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={`Bautismo de ${candidato.nombre}`}
              className="size-24 rounded-2xl object-cover"
            />
          ) : (
            <span className="grid size-24 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <ImageIcon className="size-6" />
            </span>
          )}
          <div>
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && subir(e.target.files[0])}
            />
            <button
              type="button"
              disabled={subiendo || candidato.estado !== "bautizado"}
              onClick={() => input.current?.click()}
              className={btnGhost}
            >
              {subiendo ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
              {preview ? "Cambiar foto" : "Subir foto"}
            </button>
            {candidato.estado !== "bautizado" && (
              <p className="mt-2 text-[12px] text-muted-foreground">Primero guarda el cambio de estado.</p>
            )}
            {error && <p className="mt-2 text-[12px] text-red-300">{error}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

/** Galería de fotos de los ya bautizados. */
export function BautizadosTile({
  candidatos,
  fotos,
}: {
  candidatos: Candidato[]
  fotos: Record<string, string>
}) {
  const bautizados = candidatos
    .filter((c) => c.estado === "bautizado")
    .sort((a, b) => (b.fecha_bautismo ?? "").localeCompare(a.fecha_bautismo ?? ""))
  return (
    <Tile
      title={
        <span>
          Bautizados <sup className="text-[11px]">{bautizados.length}</sup>
        </span>
      }
      className="sm:col-span-2 lg:col-span-4"
    >
      {bautizados.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Aquí aparecerán las fotos de quienes ya se bautizaron.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {bautizados.map((c) => {
            const url = c.foto_path ? fotos[c.foto_path] : undefined
            return (
              <li key={c.id} className="min-w-0">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={`Bautismo de ${c.nombre}`}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="grid size-full place-items-center text-center text-[12px] text-muted-foreground">
                      <span>
                        <Camera className="mx-auto mb-1 size-5" />
                        Sin foto
                      </span>
                    </span>
                  )}
                </div>
                <p className="mt-2 truncate text-[13px] font-medium">{c.nombre}</p>
                <p className="text-[11px] text-muted-foreground">{fechaCorta(c.fecha_bautismo)}</p>
              </li>
            )
          })}
        </ul>
      )}
    </Tile>
  )
}
