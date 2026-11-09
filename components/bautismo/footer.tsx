import { Clock, Droplets, Mail, MapPin, Phone } from "lucide-react"
import { site } from "@/lib/site"

export function Footer() {
  const { direccion, telefono, email, horarios } = site.contacto
  return (
    <footer className="bg-deep text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <Droplets className="size-5 text-accent" />
            <span className="font-serif text-2xl font-semibold">{site.nombre}</span>
          </div>
          <p className="mt-4 max-w-xs">
            Una familia que te recibe, te ayuda y camina contigo en la fe.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contacto</h3>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" /> {direccion}
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={`tel:${telefono.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                {telefono}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={`mailto:${email}`} className="break-all hover:text-white">
                {email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Horarios de servicio
          </h3>
          <ul className="mt-4 space-y-3">
            {horarios.map((h) => (
              <li key={h} className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-accent" /> {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-sm text-white/50">
        © {new Date().getFullYear()} {site.nombre}. Todos los derechos reservados.
      </div>
    </footer>
  )
}
