"use client"

import * as React from "react"
import { BookOpen, ExternalLink, Loader2, Upload } from "lucide-react"
import { btnGhost, btnPrimary, Modal, Tile } from "@/components/ui/bento"
import { db, LIBRO, LIBRO_PATH, type Candidato } from "@/lib/panel"

/** Sección de lectura del libro del bautismo (PDF privado). */
export function LibroTile({ candidatos, admin }: { candidatos: Candidato[]; admin: boolean }) {
  const [url, setUrl] = React.useState<string | null | undefined>(undefined)
  const [leyendo, setLeyendo] = React.useState(false)
  const [subiendo, setSubiendo] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const input = React.useRef<HTMLInputElement>(null)

  const cargar = React.useCallback(async () => {
    const { data } = await db()
      .storage.from(LIBRO)
      .createSignedUrl(LIBRO_PATH, 60 * 60)
    setUrl(data?.signedUrl ?? null)
  }, [])

  React.useEffect(() => {
    cargar()
  }, [cargar])

  async function subir(file: File) {
    if (file.type !== "application/pdf") return setError("El libro tiene que ser un PDF.")
    if (file.size > 50 * 1024 * 1024) return setError("El PDF pesa más de 50 MB.")
    setSubiendo(true)
    setError(null)
    const { error } = await db()
      .storage.from(LIBRO)
      .upload(LIBRO_PATH, file, { upsert: true, contentType: "application/pdf" })
    setSubiendo(false)
    if (error) return setError("No se pudo subir el PDF.")
    cargar()
  }

  const pendientes = candidatos.filter((c) => c.estado !== "bautizado")
  const leidos = pendientes.filter((c) => c.libro_leido).length
  const pct = pendientes.length ? leidos / pendientes.length : 0

  return (
    <Tile title="Libro del bautismo" className="lg:col-start-4 lg:row-start-3">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-muted">
            <BookOpen className="size-6 text-accent" />
          </span>
          <div>
            <p className="font-serif text-[22px] font-semibold leading-none tabular-nums">
              {leidos}
              <span className="text-sm text-muted-foreground"> / {pendientes.length}</span>
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">candidatos lo han leído</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-700"
            style={{ width: `${pct * 100}%` }}
          />
        </div>

        <div className="mt-auto space-y-2 pt-5">
          {url === undefined ? (
            <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
          ) : url ? (
            <button type="button" onClick={() => setLeyendo(true)} className={`${btnPrimary} w-full py-2.5`}>
              <BookOpen className="size-4" /> Leer el libro
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">
              {admin ? "Sube el libro en PDF para leerlo aquí." : "Todavía no se ha subido el libro."}
            </p>
          )}
          {admin && (
            <>
              <input
                ref={input}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => e.target.files?.[0] && subir(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => input.current?.click()}
                disabled={subiendo}
                className={`${btnGhost} w-full`}
              >
                {subiendo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {url ? "Reemplazar PDF" : "Subir PDF"}
              </button>
            </>
          )}
          {error && <p className="text-[12px] text-red-300">{error}</p>}
        </div>
      </div>

      <Modal open={leyendo} onClose={() => setLeyendo(false)} title="Libro del bautismo" wide>
        {url && (
          <>
            <iframe
              src={url}
              title="Libro del bautismo"
              className="h-[75vh] w-full rounded-2xl border border-border bg-white"
            />
            <a href={url} target="_blank" rel="noreferrer" className={`${btnGhost} mt-3`}>
              <ExternalLink className="size-4" /> Abrir en otra pestaña
            </a>
          </>
        )}
      </Modal>
    </Tile>
  )
}
