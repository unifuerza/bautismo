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
