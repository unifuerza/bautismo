"use client"

import { useRef, useState } from "react"
import { AlertCircle, Check, Loader2, Send } from "lucide-react"
import { site } from "@/lib/site"
import { supabase } from "@/lib/supabase"

const field =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus:ring-red-600/15"

// Opciones en forma de botón: el foco de teclado se ve con un anillo claro
const opcion =
  "cursor-pointer rounded-full border border-input px-5 py-2.5 text-sm transition hover:border-primary/60 has-[:checked]:border-primary has-[:checked]:bg-secondary has-[:checked]:text-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2"

const texto = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim()
  return s === "" ? null : s
}

type Campo = "nombre" | "telefono" | "fecha_nacimiento" | "sexo" | "fe" | "privacidad" | "tutor"
const ORDEN: Campo[] = ["nombre", "telefono", "fecha_nacimiento", "sexo", "fe", "privacidad", "tutor"]

function edad(fecha: string) {
  const [a, m, d] = fecha.split("-").map(Number)
  const hoy = new Date()
  let e = hoy.getFullYear() - a
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) e--
  return e
}

function MensajeError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm text-red-700">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      {msg}
    </p>
  )
}

export function Inscripcion() {
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({})
  const [menor, setMenor] = useState(false)
  const form = useRef<HTMLFormElement>(null)

  const limpiar = (c: Campo) => setErrores((e) => (e[c] ? { ...e, [c]: undefined } : e))
  const desc = (c: Campo) => (errores[c] ? `err-${c}` : undefined)

  function validar(d: FormData) {
    const e: Partial<Record<Campo, string>> = {}
    const nombre = String(d.get("nombre") ?? "").trim()
    if (nombre.length < 2) e.nombre = "Escribe tu nombre completo."
    const tel = String(d.get("telefono") ?? "").replace(/[^\d]/g, "")
    if (tel.length < 6) e.telefono = "Escribe un teléfono de contacto, por ejemplo 612 345 678."
    const nac = String(d.get("fecha_nacimiento") ?? "")
    const hoy = new Date().toLocaleDateString("en-CA") // AAAA-MM-DD en hora local
    if (!nac) e.fecha_nacimiento = "Indica tu fecha de nacimiento."
    else if (nac > hoy || nac < "1900-01-01") e.fecha_nacimiento = "Revisa la fecha de nacimiento."
    if (!d.get("sexo")) e.sexo = "Elige una opción."
    if (!d.get("fe")) e.fe = "Elige la respuesta que mejor te describa."
    if (d.get("privacidad") !== "on") e.privacidad = "Para enviar la inscripción necesitamos tu consentimiento."
    if (nac && edad(nac) < 14 && d.get("tutor") !== "on")
      e.tutor = "Si la persona tiene menos de 14 años, debe inscribirla su padre, madre o tutor legal."
    return e
  }

  // La inscripción se guarda en la tabla inscripciones_bautismo de Supabase.
  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    setError(null)
    const d = new FormData(ev.currentTarget)

    const e = validar(d)
    setErrores(e)
    const primero = ORDEN.find((c) => e[c])
    if (primero) {
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus()
      return
    }

    if (!supabase) {
      setError(`El formulario no está disponible en este momento. Llámanos al ${site.contacto.telefono}.`)
      return
    }

    setEnviando(true)
    const nac = String(d.get("fecha_nacimiento"))
    const { error } = await supabase.from("inscripciones_bautismo").insert({
      nombre: texto(d.get("nombre")),
      telefono: texto(d.get("telefono")),
      fecha_nacimiento: nac,
      sexo: texto(d.get("sexo")),
      email: texto(d.get("email")),
      fe: texto(d.get("fe")),
      mensaje: texto(d.get("mensaje")),
      acepta_privacidad: true,
      consentimiento_tutor: edad(nac) < 14 && d.get("tutor") === "on",
    })
    setEnviando(false)

    if (error) {
      setError(
        `No pudimos enviar tu inscripción. Inténtalo de nuevo en unos minutos o llámanos al ${site.contacto.telefono}.`,
      )
      return
    }
    setEnviado(true)
  }

  const nErrores = Object.values(errores).filter(Boolean).length

  return (
    <section id="inscripcion" className="scroll-mt-16 bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="mb-4 font-label text-lg uppercase tracking-[0.15em] text-primary">Inscripción</p>
          <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            ¿Listo para dar el paso?
          </h2>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Déjanos tus datos y alguien de nuestro grupo de bautismo se comunicará contigo para acompañarte en
            este paso.
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
            <div className="py-10 text-center" role="status">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
                <Check className="size-7" />
              </span>
              <h3 className="mt-5 font-serif text-3xl font-semibold tracking-tight">¡Gracias por tu decisión!</h3>
              <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                Recibimos tu inscripción. Alguien de nuestro grupo de bautismo se pondrá en contacto contigo muy
                pronto.
              </p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="mt-6 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Volver al formulario
              </button>
            </div>
          ) : (
            <form ref={form} onSubmit={onSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  required
                  maxLength={120}
                  autoComplete="name"
                  aria-invalid={!!errores.nombre}
                  aria-describedby={desc("nombre")}
                  onChange={() => limpiar("nombre")}
                  className={field}
                />
                <MensajeError id="err-nombre" msg={errores.nombre} />
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
                    maxLength={30}
                    autoComplete="tel"
                    aria-invalid={!!errores.telefono}
                    aria-describedby={desc("telefono")}
                    onChange={() => limpiar("telefono")}
                    className={field}
                  />
                  <MensajeError id="err-telefono" msg={errores.telefono} />
                </div>
                <div>
                  <label htmlFor="fecha_nacimiento" className="mb-1.5 block text-sm font-medium">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    type="date"
                    required
                    min="1900-01-01"
                    autoComplete="bday"
                    aria-invalid={!!errores.fecha_nacimiento}
                    aria-describedby={desc("fecha_nacimiento")}
                    onChange={(e) => {
                      limpiar("fecha_nacimiento")
                      const v = e.target.value
                      setMenor(!!v && edad(v) < 14)
                    }}
                    className={field}
                  />
                  <MensajeError id="err-fecha_nacimiento" msg={errores.fecha_nacimiento} />
                </div>
              </div>

              <fieldset aria-describedby={desc("sexo")}>
                <legend className="mb-1.5 text-sm font-medium">Sexo</legend>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["hombre", "Hombre"],
                    ["mujer", "Mujer"],
                  ].map(([valor, etiqueta]) => (
                    <label key={valor} className={opcion}>
                      <input
                        type="radio"
                        name="sexo"
                        value={valor}
                        onChange={() => limpiar("sexo")}
                        className="sr-only"
                      />
                      {etiqueta}
                    </label>
                  ))}
                </div>
                <MensajeError id="err-sexo" msg={errores.sexo} />
              </fieldset>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Correo <span className="text-muted-foreground">(opcional)</span>
                </label>
                <input id="email" name="email" type="email" maxLength={160} autoComplete="email" className={field} />
              </div>

              <fieldset aria-describedby={desc("fe")}>
                <legend className="mb-1.5 text-sm font-medium">¿Has recibido a Jesús como tu Salvador?</legend>
                <div className="flex flex-wrap gap-2">
                  {["Sí", "Tengo dudas, quiero conversar"].map((op) => (
                    <label key={op} className={opcion}>
                      <input type="radio" name="fe" value={op} onChange={() => limpiar("fe")} className="sr-only" />
                      {op}
                    </label>
                  ))}
                </div>
                <MensajeError id="err-fe" msg={errores.fe} />
              </fieldset>

              <div>
                <label htmlFor="mensaje" className="mb-1.5 block text-sm font-medium">
                  ¿Algo que quieras contarnos? <span className="text-muted-foreground">(opcional)</span>
                </label>
                <textarea id="mensaje" name="mensaje" rows={4} maxLength={2000} className={field} />
              </div>

              {/* Privacidad: información básica + consentimiento explícito */}
              <div className="space-y-3 rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed">
                <p className="text-muted-foreground">
                  <strong className="font-medium text-foreground">Tus datos están protegidos.</strong> Responsable:{" "}
                  {site.nombreLegal}. Solo los usamos para gestionar tu inscripción al bautismo y no los cedemos a
                  terceros. Puedes pedir verlos, corregirlos o borrarlos en {site.contacto.email}.{" "}
                  <a href="/privacidad" target="_blank" className="font-medium text-primary underline underline-offset-4">
                    Política de privacidad
                  </a>
                  .
                </p>
                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="privacidad"
                      aria-invalid={!!errores.privacidad}
                      aria-describedby={desc("privacidad")}
                      onChange={() => limpiar("privacidad")}
                      className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                    />
                    <span>
                      Doy mi consentimiento para que {site.nombreLegal} trate mis datos, incluida mi decisión de
                      bautizarme, para gestionar esta inscripción.
                    </span>
                  </label>
                  <MensajeError id="err-privacidad" msg={errores.privacidad} />
                </div>
                {menor && (
                  <div>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="tutor"
                        aria-invalid={!!errores.tutor}
                        aria-describedby={desc("tutor")}
                        onChange={() => limpiar("tutor")}
                        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                      />
                      <span>
                        La persona inscrita tiene menos de 14 años: soy su padre, madre o tutor legal y doy el
                        consentimiento en su nombre.
                      </span>
                    </label>
                    <MensajeError id="err-tutor" msg={errores.tutor} />
                  </div>
                )}
              </div>

              {nErrores > 0 && (
                <p role="alert" className="text-sm font-medium text-red-700">
                  Revisa {nErrores === 1 ? "el campo marcado" : `los ${nErrores} campos marcados`} para continuar.
                </p>
              )}
              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}{" "}
                  <a
                    href={`tel:${site.contacto.telefono.replace(/[^\d+]/g, "")}`}
                    className="font-semibold underline underline-offset-4"
                  >
                    Llamar ahora
                  </a>
                </p>
              )}
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-label text-xl tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-70"
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
