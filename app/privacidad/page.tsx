import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Política de privacidad | Centro de Ayuda Cristiano",
  description: "Cómo trata el Centro de Ayuda Cristiano los datos de las inscripciones al bautismo.",
}

const ACTUALIZADO = "10 de noviembre de 2026"

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-semibold tracking-tight">{titulo}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-muted-foreground [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  )
}

export default function Privacidad() {
  const { email, direccion } = site.contacto
  return (
    <main className="bg-background px-5 py-16 sm:py-24">
      <article className="mx-auto max-w-[68ch]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" /> Volver a la página del bautismo
        </Link>
        <h1 className="mt-8 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Política de privacidad
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Última actualización: {ACTUALIZADO}</p>

        <p className="mt-8 text-lg leading-relaxed">
          Cuando te inscribes al bautismo nos confías datos personales y nos cuentas una decisión de fe.
          Aquí explicamos qué hacemos con ellos.
        </p>

        <Seccion titulo="Quién es el responsable">
          <p>
            <strong>{site.nombreLegal}</strong>, {direccion}. Correo de contacto para cualquier
            cuestión sobre tus datos:{" "}
            <a href={`mailto:${email}`} className="text-primary underline underline-offset-4">
              {email}
            </a>
            .
          </p>
        </Seccion>

        <Seccion titulo="Qué datos tratamos">
          <p>
            Los que escribes en el formulario de inscripción: nombre completo, teléfono, fecha de nacimiento,
            sexo, correo (opcional), tu respuesta sobre la fe y el mensaje que quieras dejarnos. Si te
            bautizas, el grupo de bautismo puede guardar también la fecha del bautismo y una foto de ese día.
          </p>
          <p>
            Inscribirte al bautismo revela tus <strong>creencias religiosas</strong>, que la ley considera
            una categoría especial de datos. Por eso solo los tratamos con tu consentimiento explícito.
          </p>
        </Seccion>

        <Seccion titulo="Para qué los usamos">
          <p>
            Únicamente para gestionar tu inscripción: contactarte, acompañarte en la preparación y organizar
            el día del bautismo. No los usamos para publicidad ni para enviarte comunicaciones de otro tipo.
          </p>
        </Seccion>

        <Seccion titulo="Base legal">
          <p>
            Tu <strong>consentimiento explícito</strong> (artículos 6.1.a y 9.2.a del Reglamento General de
            Protección de Datos), que das al marcar la casilla del formulario. Puedes retirarlo en cualquier
            momento escribiendo a {email}; eso no afecta a lo que hayamos hecho antes con él.
          </p>
        </Seccion>

        <Seccion titulo="Menores de 14 años">
          <p>
            Si la persona que se inscribe tiene menos de 14 años, la inscripción debe hacerla su padre, madre
            o tutor legal, que es quien da el consentimiento.
          </p>
        </Seccion>

        <Seccion titulo="Quién puede verlos">
          <p>
            Solo las personas del grupo de bautismo de la iglesia que tienen acceso al panel interno. No
            cedemos tus datos a terceros.
          </p>
          <p>
            Para guardar la información usamos proveedores tecnológicos que actúan como encargados del
            tratamiento: Supabase (base de datos, con servidores en la Unión Europea) y Vercel (alojamiento de
            la web). Solo tratan los datos siguiendo nuestras instrucciones.
          </p>
        </Seccion>

        <Seccion titulo="Cuánto tiempo los guardamos">
          <p>
            Mientras dure tu proceso de bautismo y, después, hasta que nos pidas que los borremos o retires
            tu consentimiento.
          </p>
        </Seccion>

        <Seccion titulo="Tus derechos">
          <p>
            Puedes pedir acceder a tus datos, corregirlos, borrarlos, limitar u oponerte a su tratamiento,
            recibirlos en un formato portable o retirar tu consentimiento. Escríbenos a{" "}
            <a href={`mailto:${email}`} className="text-primary underline underline-offset-4">
              {email}
            </a>
            .
          </p>
          <p>
            Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de
            Protección de Datos (
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4"
            >
              www.aepd.es
            </a>
            ).
          </p>
        </Seccion>
      </article>
    </main>
  )
}
