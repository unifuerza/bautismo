import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/** Cliente público de Supabase (clave publishable; los permisos los controla RLS). */
export const supabase = url && key ? createClient(url, key) : null
