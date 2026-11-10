"use client"

import { useEffect, useState } from "react"
import { Droplets, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { site } from "@/lib/site"

const links = [
  { href: "#significado", label: "Significado" },
  { href: "#pasos", label: "Pasos" },
  { href: "#proximo", label: "Próximo bautismo" },
  { href: "#preguntas", label: "Preguntas" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Cerrar el menú móvil con Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-deep/80 backdrop-blur-xl"
          : "bg-transparent",
        open && "bg-deep"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 text-white sm:px-8">
        <a href="#inicio" className="flex min-h-11 items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
            <Droplets className="size-4.5 text-accent" />
          </span>
          <span className="font-brand text-xl leading-none tracking-[0.06em] sm:text-2xl">
            {site.nombre}
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-label text-lg tracking-wide text-white/75 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#inscripcion"
            className="rounded-full bg-white px-4 py-2 font-label text-lg tracking-wide text-deep transition hover:bg-accent"
          >
            Quiero bautizarme
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="-mr-2 grid size-11 place-items-center rounded-full md:hidden"
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div id="menu-movil" className="border-t border-white/10 px-5 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-label text-xl tracking-wide text-white/85"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#inscripcion"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-white py-3 text-center font-label text-lg tracking-wide text-deep"
          >
            Quiero bautizarme
          </a>
        </div>
      )}
    </header>
  )
}
