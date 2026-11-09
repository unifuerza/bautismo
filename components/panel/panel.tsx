"use client"

import * as React from "react"
import { Droplets, ExternalLink, LogOut, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useReducedMotion } from "@/components/ui/bento"
import { db, FOTOS, type Candidato, type RegistroBata } from "@/lib/panel"
import { site } from "@/lib/site"
import { Cargando, Login, SinPermiso, useAcceso } from "./acceso"
import { HeroTile, ProximoTile } from "./resumen"
import { BatasTile, calcularPlanchadas, RegistroBatasTile } from "./batas"
import { BautizadosTile, CandidatosTile } from "./candidatos"
import { LibroTile } from "./libro"

interface Datos {
  candidatos: Candidato[]
  registro: RegistroBata[]
  total: number
  fotos: Record<string, string>
}

async function cargarDatos(): Promise<Datos> {
  const sb = db()
  const [c, r, a] = await Promise.all([
    sb.from("inscripciones_bautismo").select("*").order("created_at", { ascending: false }),
    sb.from("batas_registro").select("*").order("created_at", { ascending: false }),
    sb.from("ajustes").select("valor").eq("clave", "batas_total").maybeSingle(),
  ])
  if (c.error || r.error) throw new Error("No se pudieron cargar los datos.")
  const candidatos = (c.data ?? []) as Candidato[]
  const paths = candidatos.map((x) => x.foto_path).filter((p): p is string => !!p)
  const fotos: Record<string, string> = {}
  if (paths.length) {
    const { data } = await sb.storage.from(FOTOS).createSignedUrls(paths, 60 * 60)
    for (const f of data ?? []) if (f.path && f.signedUrl) fotos[f.path] = f.signedUrl
  }
  return {
    candidatos,
    registro: (r.data ?? []) as RegistroBata[],
    total: Number(a.data?.valor ?? 0),
    fotos,
  }
}

export function PanelApp() {
  const acceso = useAcceso()
  if (acceso.estado === "cargando") return <Cargando />
  if (acceso.estado === "fuera") return <Login />
  if (acceso.estado === "sin-permiso") return <SinPermiso email={acceso.session.user.email} />
  return <Dashboard nombre={acceso.nombre} />
}

function Dashboard({ nombre }: { nombre: string }) {
  const reduced = useReducedMotion()
  const [datos, setDatos] = React.useState<Datos | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [recargando, setRecargando] = React.useState(false)

  const recargar = React.useCallback(async () => {
    setRecargando(true)
    try {
      setDatos(await cargarDatos())
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setRecargando(false)
    }
  }, [])

  React.useEffect(() => {
    recargar()
  }, [recargar])

  if (!datos) return error ? <ErrorCarga mensaje={error} onRetry={recargar} /> : <Cargando />

  const planchadas = calcularPlanchadas(datos.registro, datos.total)
  const primerNombre = nombre.split(" ")[0]

  return (
    <div className="min-h-[100svh] bg-background px-4 py-4 text-foreground sm:px-8 sm:py-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <nav className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1" aria-label="Panel">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-muted ring-1 ring-border">
              <Droplets className="size-4 text-accent" />
            </span>
            <span className="font-brand text-base sm:text-lg">{site.nombre}</span>
            <span className="hidden rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground sm:inline">
              Panel interno
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={recargar}
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
              aria-label="Actualizar datos"
            >
              <RefreshCw className={`size-4 ${recargando ? "animate-spin" : ""}`} />
            </button>
            <a
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              Ver la web <ExternalLink className="size-3" />
            </a>
            <span className="rounded-full bg-foreground px-3 py-1.5 text-[12px] font-semibold text-background">
              {nombre}
            </span>
            <button
              type="button"
              onClick={() => supabase?.auth.signOut()}
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
              aria-label="Cerrar sesión"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </nav>

        {error && (
          <p role="alert" className="mb-3 rounded-2xl bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HeroTile nombre={primerNombre} candidatos={datos.candidatos} reduced={reduced} />
          <BatasTile total={datos.total} planchadas={planchadas} persona={nombre} onCambio={recargar} />
          <ProximoTile candidatos={datos.candidatos} planchadas={planchadas} />
          <CandidatosTile candidatos={datos.candidatos} fotos={datos.fotos} onCambio={recargar} />
          <RegistroBatasTile registro={datos.registro} onCambio={recargar} />
          <LibroTile candidatos={datos.candidatos} />
          <BautizadosTile candidatos={datos.candidatos} fotos={datos.fotos} />
        </div>
      </div>
    </div>
  )
}

function ErrorCarga({ mensaje, onRetry }: { mensaje: string; onRetry: () => void }) {
  return (
    <div className="grid min-h-[100svh] place-items-center bg-background px-4 text-center text-foreground">
      <div>
        <p className="text-muted-foreground">{mensaje}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-semibold"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
