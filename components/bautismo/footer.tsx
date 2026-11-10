import Link from "next/link"
import { Clock, Droplets, Mail, MapPin, Phone } from "lucide-react"
import { site } from "@/lib/site"

export function Footer() {
  const { direccion, mapa, telefono, email, horarios } = site.contacto
  return (
    <footer className="bg-deep text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <Droplets className="size-5 text-accent" />
            <span className="font-brand text-2xl tracking-[0.06em]">{site.nombre}</span>
          </div>
          <p className="mt-4 max-w-xs">
            Una familia que te recibe, te ayuda y camina contigo en la fe.
          </p>
        </div>
        <div>
          <h3 className="font-label text-xl uppercase tracking-wider text-white">Contacto</h3>
          <ul className="mt-3 space-y-1">
            <li className="flex min-h-11 items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-accent" />
              <a href={mapa} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center hover:text-white">
                {direccion}
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-accent" />
              <a href={`tel:${telefono.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-11 items-center hover:text-white">
                {telefono}
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-accent" />
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center break-all hover:text-white">
                {email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-label text-xl uppercase tracking-wider text-white">
            Horarios de servicio
          </h3>
          <ul className="mt-3 space-y-1">
            {horarios.map((h) => (
              <li key={h} className="flex gap-2.5">
                <Clock className="size-4 shrink-0 text-accent" /> {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center text-sm text-white/60">
        <span>
          © {new Date().getFullYear()} {site.nombre}. Todos los derechos reservados.
        </span>
        <Link href="/privacidad" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white">
          Política de privacidad
        </Link>
      </div>
    </footer>
  )
}
