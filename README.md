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

### Roles

| Acción | Voluntario | Coordinador / Staff |
|---|---|---|
| Ver candidatos (nombre, teléfono, fecha de nacimiento, estado, foto) | ✓ | ✓ |
| Añadir, editar o borrar candidatos; subir fotos | — | ✓ |
| Registrar batas planchadas / usadas | ✓ | ✓ |
| Borrar registros de batas; cambiar el total de batas | — | ✓ |
| Leer el libro del bautismo | ✓ | ✓ |
| Subir o reemplazar el PDF del libro | — | ✓ |
| Gestionar el equipo (dar acceso, cambiar roles) | — | ✓ |

Los permisos se aplican en la base de datos (RLS + funciones `agregar_miembro`, `cambiar_rol`, `quitar_miembro`), no solo en la interfaz. Nadie puede cambiar su propio rol ni quitarse el acceso.

### Dar acceso a una persona

En el panel, sección **Equipo → Dar acceso** (coordinador o staff): nombre, correo y rol.
La función `invitar-miembro` (Supabase Edge Function, código en `supabase/functions/`) crea la cuenta y
envía un **correo de invitación**. La persona pulsa el enlace, su correo queda verificado y crea su
contraseña en `/panel/activar`. Mientras no lo haga aparece como «Pendiente de verificar» (con botón para
reenviar el correo) y no puede entrar.

`/panel/activar` también sirve para «¿Olvidaste tu contraseña?».

### Configuración necesaria en Supabase (una sola vez)

1. **Authentication → URL Configuration**
   - *Site URL*: `https://bautismo-beige.vercel.app`
   - *Redirect URLs*: añadir `https://bautismo-beige.vercel.app/panel/activar`
2. **Authentication → Emails → SMTP Settings**: activar un servidor SMTP propio (Gmail con contraseña de
   aplicación, Resend, Brevo…). Sin esto, Supabase solo envía correos a los miembros de la organización de
   Supabase y muy pocos por hora.
3. **Authentication → Emails → Templates**: pegar `supabase/plantillas-correo/invitacion.html` en
   *Invite user* (asunto: «Te han dado acceso al panel de bautismo») y
   `supabase/plantillas-correo/recuperar-contrasena.html` en *Reset password*.
4. **Authentication → Sign In / Providers**: desactivar *Allow new users to sign up* (las invitaciones
   siguen funcionando).

## Skill de diseño: Impeccable

En `.claude/skills/impeccable` (más 4 agentes en `.claude/agents/`) está instalada la skill
[Impeccable](https://github.com/pbakaus/impeccable) v4.8.2 (licencia Apache 2.0), copiada del repositorio
oficial. En Claude Code se usa con `/impeccable <comando> <objetivo>`, por ejemplo:

```
/impeccable init
/impeccable critique el formulario de inscripción
/impeccable polish el panel interno
/impeccable audit /panel
```

Notas:
- La primera vez descarga su motor (binario) desde las *releases* de GitHub de pbakaus/impeccable y comprueba
  su SHA-256 con `scripts/engine-checksums.txt`.
- **No** se ha instalado el *hook* automático (que revisa cada archivo de UI editado); se puede añadir con
  `npx impeccable install` si se quiere.
- El modo `live` puede lanzar `claude`/`codex` sin pedir permisos para aplicar cambios; usarlo solo en local y
  con `IMPECCABLE_LIVE_COPY_AGENT=chat`.
- Para actualizar: `npx impeccable update`.

## Skill de diseño: UI/UX Pro Max

En `.claude/skills/ui-ux-pro-max` está instalada la skill
[UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) v2.15.0 (licencia MIT), copiada del
repositorio oficial. Es una base de datos local de diseño (80 estilos, 192 paletas, 74 combinaciones de
tipografías, 120 pautas de UX, 25 tipos de gráfico, 22 tecnologías) con un buscador en Python sin
dependencias ni acceso a internet. Claude la usa sola al diseñar o revisar interfaces; también se puede
consultar a mano:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "church community" --design-system -p "Centro de Ayuda Cristiano"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation errors" --domain ux
```

Las rutas del `SKILL.md` se ajustaron a instalación de proyecto (igual que hace su instalador oficial
`uipro init --ai claude`).
