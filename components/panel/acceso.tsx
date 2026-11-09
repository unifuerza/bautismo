"use client"

import * as React from "react"
import type { Session } from "@supabase/supabase-js"
import { Droplets, Loader2, LogIn, ShieldAlert } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { btnGhost, inputCls } from "@/components/ui/bento"
import { site } from "@/lib/site"
import type { Rol } from "@/lib/panel"

export type Acceso =
  | { estado: "cargando" }
  | { estado: "fuera" }
  | { estado: "sin-permiso"; session: Session }
  | { estado: "dentro"; session: Session; nombre: string; rol: Rol }

export function useAcceso(): Acceso {
  const [acceso, setAcceso] = React.useState<Acceso>({ estado: "cargando" })

  React.useEffect(() => {
    if (!supabase) {
      setAcceso({ estado: "fuera" })
      return
    }
    const sb = supabase
    let vivo = true

    async function comprobar(session: Session | null) {
      if (!session) return vivo && setAcceso({ estado: "fuera" })
      const { data } = await sb
        .from("equipo")
        .select("nombre, rol")
        .eq("user_id", session.user.id)
        .maybeSingle()
      if (!vivo) return
      if (data) setAcceso({ estado: "dentro", session, nombre: data.nombre, rol: data.rol as Rol })
      else setAcceso({ estado: "sin-permiso", session })
    }

    sb.auth.getSession().then(({ data }) => comprobar(data.session))
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      // diferido para no llamar a Supabase dentro del callback de auth
      setTimeout(() => comprobar(session), 0)
    })
    return () => {
      vivo = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return acceso
}

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[100svh] place-items-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-muted ring-1 ring-border">
            <Droplets className="size-5 text-accent" />
          </span>
          <span className="font-brand text-lg">{site.nombre}</span>
        </div>
        <div className="rounded-[26px] border border-border bg-card p-6 sm:p-8">{children}</div>
      </div>
    </div>
  )
}

export function Cargando() {
  return (
    <div className="grid min-h-[100svh] place-items-center bg-background text-muted-foreground">
      <Loader2 className="size-6 animate-spin" aria-label="Cargando" />
    </div>
  )
}

export function Login() {
  const [enviando, setEnviando] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [olvido, setOlvido] = React.useState(false)
  const [aviso, setAviso] = React.useState<string | null>(null)

  async function recuperar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return
    const email = String(new FormData(e.currentTarget).get("email")).trim()
    setEnviando(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/panel/activar`,
    })
    setEnviando(false)
    if (error && /rate limit/i.test(error.message))
      return setError("Se han enviado demasiados correos. Espera un rato e inténtalo de nuevo.")
    // Mismo mensaje exista o no la cuenta, para no revelar qué correos están registrados
    setAviso(`Si ${email} tiene una cuenta, recibirá un correo para crear una contraseña nueva.`)
  }

  if (olvido)
    return (
      <Marco>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
        <p className="mt-1 text-sm text-muted-foreground">Te enviaremos un enlace para crear una nueva.</p>
        {aviso ? (
          <p role="status" className="mt-6 rounded-xl bg-emerald-400/10 px-3 py-3 text-sm text-emerald-300">
            {aviso}
          </p>
        ) : (
          <form onSubmit={recuperar} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className={inputCls}
              />
            </div>
            {error && (
              <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <button type="submit" disabled={enviando} className={`${btnGhost} w-full py-3`}>
              {enviando && <Loader2 className="size-4 animate-spin" />} Enviar enlace
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={() => {
            setOlvido(false)
            setAviso(null)
            setError(null)
          }}
          className="mt-4 text-sm font-semibold text-accent hover:underline"
        >
          ← Volver
        </button>
      </Marco>
    )

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return setError("El panel no está configurado (faltan las variables de Supabase).")
    const d = new FormData(e.currentTarget)
    setEnviando(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: String(d.get("email")).trim(),
      password: String(d.get("password")),
    })
    setEnviando(false)
    if (!error) return
    if (/not confirmed/i.test(error.message))
      setError("Tu correo aún no está verificado. Abre el correo de invitación que te enviamos.")
    else setError("Correo o contraseña incorrectos.")
  }

  return (
    <Marco>
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Panel interno</h1>
      <p className="mt-1 text-sm text-muted-foreground">Grupo de bautismo · solo para el equipo.</p>
      <form onSubmit={entrar} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Correo
          </label>
          <input id="email" name="email" type="email" required autoComplete="username" className={inputCls} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputCls}
          />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={enviando}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-label text-xl tracking-wide text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {enviando ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          Entrar
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setOlvido(true)
          setError(null)
        }}
        className="mt-4 text-sm text-muted-foreground transition hover:text-foreground"
      >
        ¿Olvidaste tu contraseña?
      </button>
    </Marco>
  )
}

export function SinPermiso({ email }: { email?: string }) {
  return (
    <Marco>
      <ShieldAlert className="size-8 text-accent" />
      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight">Sin acceso</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        La cuenta <strong className="text-foreground">{email}</strong> existe, pero todavía no forma parte del
        equipo del panel. Pide a un responsable que te dé acceso.
      </p>
      <button type="button" onClick={() => supabase?.auth.signOut()} className={`${btnGhost} mt-6 w-full`}>
        Cerrar sesión
      </button>
    </Marco>
  )
}
