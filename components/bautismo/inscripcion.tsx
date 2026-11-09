"use client"

import { useState } from "react"
import { Check, Loader2, Send } from "lucide-react"
import { site } from "@/lib/site"
import { supabase } from "@/lib/supabase"

const field =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

const texto = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim()
  return s === "" ? null : s
}

export function Inscripcion() {
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // La inscripción se guarda en la tabla inscripciones_bautismo de Supabase.
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const d = new FormData(e.currentTarget)

    if (!supabase) {
      setError("El formulario no está configurado todavía. Escríbenos por teléfono o correo.")
      return
    }

    setEnviando(true)
    const { error } = await supabase.from("inscripciones_bautismo").insert({
      nombre: texto(d.get("nombre")),
      telefono: texto(d.get("telefono")),
      email: texto(d.get("email")),
      fe: texto(d.get("fe")),
      mensaje: texto(d.get("mensaje")),
    })
    setEnviando(false)

    if (error) {
      setError(
        `No pudimos enviar tu inscripción. Inténtalo de nuevo o llámanos al ${site.contacto.telefono}.`
      )
      return
    }
    setEnviado(true)
  }

  return (
    <section id="inscripcion" className="scroll-mt-16 bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="mb-4 font-label text-lg uppercase tracking-[0.15em] text-primary">
            Inscripción
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            ¿Listo para dar el paso?
          </h2>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Déjanos tus datos y un miembro del equipo pastoral se comunicará contigo para
            acompañarte en tu preparación.
          </p>
          <div className="mt-10 aspect-[16/10] overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200 to-primary/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80"
              alt="Interior de una iglesia iluminado por la luz"
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-xl shadow-primary/5 sm:p-10">
          {enviado ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
                <Check className="size-7" />
              </span>
              <h3 className="mt-5 font-serif text-3xl font-semibold tracking-tight">¡Gracias por tu decisión!</h3>
              <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                Recibimos tu inscripción. Un miembro del equipo pastoral se pondrá en contacto
                contigo muy pronto.
              </p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="mt-6 text-sm font-semibold text-primary hover:underline"
              >
                Volver al formulario
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
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
                  autoComplete="name"
                  className={field}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    minLength={5}
                    maxLength={30}
                    autoComplete="tel"
                    className={field}
                  />
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
                    autoComplete="email"
                    className={field}
                  />
                </div>
              </div>
              <fieldset>
                <legend className="mb-1.5 text-sm font-medium">
                  ¿Has recibido a Jesús como tu Salvador?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {["Sí", "Tengo dudas, quiero conversar"].map((op, i) => (
                    <label
                      key={op}
                      className="cursor-pointer rounded-full border border-input px-4 py-2 text-sm transition has-[:checked]:border-primary has-[:checked]:bg-secondary has-[:checked]:text-primary"
                    >
                      <input
                        type="radio"
                        name="fe"
                        value={op}
                        defaultChecked={i === 0}
                        className="sr-only"
                      />
                      {op}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="mensaje" className="mb-1.5 block text-sm font-medium">
                  ¿Algo que quieras contarnos? <span className="text-muted-foreground">(opcional)</span>
                </label>
                <textarea id="mensaje" name="mensaje" rows={4} maxLength={2000} className={field} />
              </div>
              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-label text-xl tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:opacity-70"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Enviando…
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Enviar inscripción
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
