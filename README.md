# Bautismo — Centro de Ayuda Cristiano

Página web del bautismo en agua. Next.js 15 + TypeScript + Tailwind CSS v4 + estructura shadcn.

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Editar datos de la iglesia

Todo lo editable (fecha del próximo bautismo, dirección, teléfono, correo, WhatsApp, horarios) está en `lib/site.ts`.

## Estructura

- `components/ui/glass-fold.tsx` — fondo WebGL animado (GradFlow) usado en la portada
- `components/bautismo/*` — secciones de la página
- `app/page.tsx` — página principal

## Supabase (inscripciones)

El formulario guarda cada inscripción en la tabla `inscripciones_bautismo` del proyecto Supabase **bautismo**.

Variables de entorno (ver `.env.example`), necesarias en local (`.env.local`) y en Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Seguridad (RLS): los visitantes solo pueden **insertar** inscripciones; no pueden leerlas, editarlas ni borrarlas.
Para ver las inscripciones, entra al panel de Supabase → Table Editor → `inscripciones_bautismo`.
La columna `estado` (`nuevo`, `contactado`, `bautizado`) sirve para dar seguimiento.

## Tipografías

Todas con licencia SIL Open Font License 1.1 (libres para uso web y comercial):

| Uso | Fuente | Origen |
|---|---|---|
| Etiquetas, botones, menú, números | Bebas Kai | `app/fonts/bebas-kai.otf` |
| Título de la portada | Anton | `@fontsource/anton` |
| Títulos de sección | Inter Tight | `@fontsource/inter-tight` |
| Texto general | Belleza | `@fontsource/belleza` |
| Nombre de la iglesia | Righteous | `@fontsource/righteous` |

Los tokens están en `app/globals.css` (`--font-sans`, `--font-serif`, `--font-display`, `--font-label`, `--font-brand`).

## Panel interno (`/panel`)

Panel privado para el grupo de bautismo (diseño "bento" adaptado de Web3 Bento; piezas base en `components/ui/bento.tsx`).

- **Acceso:** correo y contraseña (Supabase Auth). Solo entran los usuarios que estén en la tabla `equipo`.
- **Quién se va a bautizar:** nombre completo, teléfono, fecha de nacimiento, estado, fecha del bautismo y foto (se sube cuando la persona está bautizada; bucket privado `fotos-bautismo`).
- **Batas:** total de batas, cuántas están planchadas y registro de planchado/uso (`batas_registro`, `ajustes.batas_total`).
- **Libro del bautismo:** PDF privado (bucket `libro-bautismo`) que se lee dentro del panel, y casilla "ha leído el libro" por candidato.

### Dar acceso a una persona

1. Supabase → **Authentication → Users → Add user → Create new user** (correo + contraseña, marcar *Auto Confirm User*).
2. Añadirla al equipo en **SQL Editor**:

```sql
insert into public.equipo (user_id, nombre)
select id, 'Nombre de la persona' from auth.users where email = 'correo@ejemplo.com';
```
