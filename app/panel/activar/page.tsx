"use client"

import * as React from "react"
import { CheckCircle2, Droplets, KeyRound, Loader2, TriangleAlert } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { inputCls } from "@/components/ui/bento"
import { site } from "@/lib/site"

type Estado = "cargando" | "listo" | "invalido" | "hecho"

function errorDelEnlace(): string | null {
  const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search.slice(1))
  const code = params.get("error_code")
  if (!params.get("error") && !code) return null
  if (code === "otp_expired")
    return "El enlace ha caducado o ya se usó. Pide a un coordinador que te reenvíe el correo."
  return params.get("error_description")?.replace(/\+/g, " ") ?? "El enlace no es válido."
}

export default function ActivarCuenta() {
  const [estado, setEstado] = React.useState<Estado>("cargando")
  const [motivo, setMotivo] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState<string | null>(null)
  const [guardando, setGuardando] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const err = errorDelEnlace()
    if (err || !supabase) {
      setMotivo(err ?? "El panel no está configurado.")
      setEstado("invalido")
      return
    }
    const sb = supabase
    let resuelto = false
    const listo = (correo?: string | null) => {
      resuelto = true
      setEmail(correo ?? null)
      setEstado("listo")
    }
    const { data: sub } = sb.auth.onAuthStateChange((evento, session) => {
      if (
        session &&
        (evento === "SIGNED_IN" || evento === "PASSWORD_RECOVERY" || evento === "INITIAL_SESSION")
      )
        listo(session.user.email)
    })
    sb.auth.getSession().then(({ data }) => {
      if (data.session) listo(data.session.user.email)
      else
        setTimeout(() => {
          if (!resuelto) {
            setMotivo("El enlace no es válido o ya se usó. Pide a un coordinador que te reenvíe el correo.")
            setEstado("invalido")
          }
        }, 1500)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return
    const d = new FormData(e.currentTarget)
    const pass = String(d.get("password"))
    if (pass.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.")
    if (pass !== String(d.get("confirmar"))) return setError("Las contraseñas no coinciden.")
    setGuardando(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password: pass })
    setGuardando(false)
    if (error) {
      if (/different from the old/i.test(error.message))
        return setError("La nueva contraseña tiene que ser distinta de la anterior.")
      if (/weak|short|characters/i.test(error.message))
        return setError("La contraseña es demasiado débil. Usa letras y números.")
      return setError("No se pudo guardar la contraseña. Inténtalo de nuevo.")
    }
    setEstado("hecho")
  }

  return (
    <div className="grid min-h-[100svh] place-items-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-muted ring-1 ring-border">
            <Droplets className="size-5 text-accent" />
          </span>
          <span className="font-brand text-lg">{site.nombre}</span>
        </div>
        <div className="rounded-[26px] border border-border bg-card p-6 sm:p-8">
          {estado === "cargando" && (
            <div className="grid place-items-center py-8 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" aria-label="Comprobando el enlace" />
            </div>
          )}

          {estado === "invalido" && (
            <>
              <TriangleAlert className="size-8 text-amber-300" />
              <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight">Enlace no válido</h1>
              <p className="mt-2 text-sm text-muted-foreground">{motivo}</p>
              <a
                href="/panel"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-border py-2.5 text-sm font-semibold transition hover:bg-muted"
              >
                Ir al inicio de sesión
              </a>
            </>
          )}

          {estado === "listo" && (
            <>
              <KeyRound className="size-8 text-accent" />
              <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight">Crea tu contraseña</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu correo{email ? <strong className="text-foreground"> {email}</strong> : ""} está verificado.
                Elige una contraseña para entrar al panel.
              </p>
              <form onSubmit={guardar} className="mt-6 space-y-4">
                <input
                  type="email"
                  name="username"
                  value={email ?? ""}
                  autoComplete="username"
                  readOnly
                  hidden
                />
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                    Contraseña nueva
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="confirmar" className="mb-1.5 block text-sm font-medium">
                    Repite la contraseña
                  </label>
                  <input
                    id="confirmar"
                    name="confirmar"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
                <p className="text-[12px] text-muted-foreground">Mínimo 8 caracteres.</p>
                {error && (
                  <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={guardando}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-label text-xl tracking-wide text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {guardando && <Loader2 className="size-4 animate-spin" />} Guardar y entrar
                </button>
              </form>
            </>
          )}

          {estado === "hecho" && (
            <>
              <CheckCircle2 className="size-8 text-emerald-300" />
              <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight">¡Listo!</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu contraseña está guardada. A partir de ahora entra con tu correo y esa contraseña.
              </p>
              <a
                href="/panel"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent py-3 font-label text-xl tracking-wide text-accent-foreground transition hover:opacity-90"
              >
                Entrar al panel
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
