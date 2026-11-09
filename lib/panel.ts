import { supabase } from "@/lib/supabase"

export type Estado = "nuevo" | "contactado" | "bautizado"
export const ESTADOS: readonly Estado[] = ["nuevo", "contactado", "bautizado"] as const
export const ESTADO_LABEL: Record<Estado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  bautizado: "Bautizado",
}

export interface Candidato {
  id: string
  created_at: string
  nombre: string
  telefono: string
  email: string | null
  fe: string
  mensaje: string | null
  estado: Estado
  fecha_nacimiento: string | null
  fecha_bautismo: string | null
  foto_path: string | null
  libro_leido: boolean
  actualizado_at: string | null
}

export interface RegistroBata {
  id: string
  created_at: string
  tipo: "planchado" | "usado"
  cantidad: number
  persona: string
  nota: string | null
}

export const FOTOS = "fotos-bautismo"
export const LIBRO = "libro-bautismo"
export const LIBRO_PATH = "libro-del-bautismo.pdf"

export function db() {
  if (!supabase) throw new Error("Supabase no está configurado (faltan las variables de entorno).")
  return supabase
}

export function edad(fecha: string | null) {
  if (!fecha) return null
  const n = new Date(fecha + "T00:00:00")
  const h = new Date()
  let e = h.getFullYear() - n.getFullYear()
  if (h.getMonth() < n.getMonth() || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) e--
  return e
}

export function fechaCorta(fecha: string | null) {
  if (!fecha) return "—"
  const d = fecha.length === 10 ? new Date(fecha + "T00:00:00") : new Date(fecha)
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" })
export function hace(iso: string) {
  const s = (new Date(iso).getTime() - Date.now()) / 1000
  const abs = Math.abs(s)
  if (abs < 60) return "ahora"
  if (abs < 3600) return rtf.format(Math.round(s / 60), "minute")
  if (abs < 86400) return rtf.format(Math.round(s / 3600), "hour")
  if (abs < 86400 * 30) return rtf.format(Math.round(s / 86400), "day")
  return fechaCorta(iso)
}
