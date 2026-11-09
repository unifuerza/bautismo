// Invita a una persona al panel interno: crea su cuenta (si no existe), envía el correo
// de invitación de Supabase Auth y la añade a la tabla `equipo` con su rol.
// Solo pueden llamarla coordinadores y staff (se comprueba con public.es_admin()).
import { createClient } from "npm:@supabase/supabase-js@2"

const ROLES = ["voluntario", "coordinador", "staff"]
const PRODUCCION = "https://bautismo-beige.vercel.app"
const ORIGEN_PERMITIDO = /^(https:\/\/bautismo[a-z0-9-]*\.vercel\.app|http:\/\/localhost:\d+)$/

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

function respuesta(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  })
}

function clave(nuevas: string, legacy: string) {
  const json = Deno.env.get(nuevas)
  if (json) {
    try {
      const k = JSON.parse(json)["default"]
      if (k) return k as string
    } catch {
      /* usar la clave legacy */
    }
  }
  return Deno.env.get(legacy)!
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })
  if (req.method !== "POST") return respuesta(405, { error: "Método no permitido" })

  const url = Deno.env.get("SUPABASE_URL")!
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "")
  if (!token) return respuesta(401, { error: "Inicia sesión" })

  // Cliente con la sesión de quien llama (respeta RLS) para comprobar su rol
  const cliente = createClient(url, clave("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY"), {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: quien, error: errUser } = await cliente.auth.getUser(token)
  if (errUser || !quien.user) return respuesta(401, { error: "Sesión no válida" })
  const { data: esAdmin } = await cliente.rpc("es_admin")
  if (!esAdmin) return respuesta(403, { error: "Solo coordinadores y staff pueden dar acceso" })

  let body: { email?: string; nombre?: string; rol?: string; accion?: string }
  try {
    body = await req.json()
  } catch {
    return respuesta(400, { error: "Datos no válidos" })
  }
  const email = String(body.email ?? "").trim().toLowerCase()
  const nombre = String(body.nombre ?? "").trim()
  const rol = String(body.rol ?? "voluntario")
  const accion = body.accion === "reenviar" ? "reenviar" : "invitar"

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160)
    return respuesta(400, { error: "Correo no válido" })
  if (accion === "invitar" && (nombre.length < 1 || nombre.length > 80))
    return respuesta(400, { error: "Nombre no válido" })
  if (accion === "invitar" && !ROLES.includes(rol)) return respuesta(400, { error: "Rol no válido" })

  const origen = req.headers.get("Origin") ?? ""
  const redirectTo = `${ORIGEN_PERMITIDO.test(origen) ? origen : PRODUCCION}/panel/activar`

  const admin = createClient(url, clave("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: existentes, error: errBuscar } = await admin.rpc("buscar_usuario", { p_email: email })
  if (errBuscar) return respuesta(500, { error: "No se pudo comprobar la cuenta" })
  const existente = (existentes as { id: string; verificado: boolean }[] | null)?.[0]

  if (existente?.id === quien.user.id) return respuesta(400, { error: "No puedes cambiar tu propio acceso" })

  let userId = existente?.id
  let enviado = false

  if (!existente || !existente.verificado) {
    // Cuenta nueva o aún sin verificar: (re)enviar la invitación
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { nombre: nombre || undefined },
    })
    if (error) {
      const msg = error.message ?? ""
      if (/rate limit/i.test(msg))
        return respuesta(429, { error: "Se han enviado demasiados correos. Espera un rato e inténtalo de nuevo." })
      if (/not authorized|email_address_not_authorized/i.test(msg) || error.code === "email_address_not_authorized")
        return respuesta(502, {
          error:
            "Supabase no puede enviar correos a esta dirección. Hay que configurar un servidor de correo (SMTP) propio en Supabase.",
        })
      return respuesta(502, { error: `No se pudo enviar la invitación: ${msg}` })
    }
    userId = data.user?.id ?? userId
    enviado = true
  } else if (accion === "reenviar") {
    return respuesta(400, { error: "Esta persona ya verificó su correo; puede entrar con su contraseña." })
  }

  if (!userId) return respuesta(500, { error: "No se pudo crear la cuenta" })

  if (accion === "invitar") {
    const { error } = await admin
      .from("equipo")
      .upsert({ user_id: userId, nombre, rol, email }, { onConflict: "user_id" })
    if (error) return respuesta(500, { error: "La invitación se envió, pero no se pudo guardar en el equipo" })
  }

  return respuesta(200, {
    ok: true,
    enviado,
    mensaje: enviado
      ? `Hemos enviado un correo a ${email} para que confirme su cuenta y cree su contraseña.`
      : `${email} ya tenía una cuenta verificada: ya puede entrar al panel.`,
  })
})
