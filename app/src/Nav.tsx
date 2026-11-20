import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { Link, usePath } from './router'
import { CATEGORIES, SOLUTIONS, inCategory, solutionPath } from './solutions'
import { Lockup, WRAP } from './ui'

const LINKS = [
  ['Über uns', '/ueber-uns'],
  ['Ablauf', '/#ablauf'],
  ['Kontakt', '/kontakt'],
]

const NAV_LINK = 'text-[15px] font-medium text-steel no-underline transition-colors duration-150 hover:text-paper aria-[current=page]:text-paper'
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* the register under the bar: every area as a column, every service one click away */
function ServicesPanel({ open, path }: { open: boolean; path: string }) {
  return (
    <div
      id="nav-leistungen"
      data-open={open}
      className="invisible absolute inset-x-0 top-full border-b border-white/10 bg-night opacity-0 shadow-[0_28px_48px_-24px_rgb(0_0_0/0.7)] transition-[opacity,clip-path,visibility] duration-300 ease-out-expo [clip-path:inset(0_0_100%_0)] data-[open=true]:visible data-[open=true]:opacity-100 data-[open=true]:[clip-path:inset(0_0_-80px_0)] motion-reduce:transition-none"
    >
      <div className={`${WRAP} grid grid-cols-3 gap-x-8 gap-y-10 pb-10 pt-8 lg:grid-cols-5`}>
        {CATEGORIES.map((c) => (
          <div key={c.id}>
            <Link href={`/leistungen#${c.id}`} className="block border-t border-paper/80 pt-4 text-[15px] font-semibold text-paper no-underline hover:underline">
              {c.title}
            </Link>
            <p className="mt-1.5 max-w-[28ch] text-[13px] leading-[1.5] text-steel">{c.text}</p>
            <ul className="mt-4">
              {inCategory(c.id).map((sol) => {
                const href = solutionPath(sol.slug)
                return (
                  <li key={sol.slug}>
                    <Link
                      href={href}
                      aria-current={path === href ? 'page' : undefined}
                      className="group flex items-center justify-between gap-3 py-1.5 text-[15px] leading-[1.35] text-[#C9D0DD] no-underline transition-colors duration-150 hover:text-paper aria-[current=page]:text-paper aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                    >
                      {sol.title}
                      <ArrowRight className="size-3.5 shrink-0 -translate-x-1 text-signal opacity-0 transition-[opacity,transform] duration-200 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className={`${WRAP} flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4 text-[14px]`}>
          <span className="text-steel">
            {SOLUTIONS.length} Leistungen in {CATEGORIES.length} Bereichen. Nicht sicher, was passt? Das klären wir im Erstgespräch.
          </span>
          <Link href="/leistungen" className="group inline-flex items-center gap-2 font-semibold text-paper no-underline hover:underline">
            Alle Leistungen im Überblick
            <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const path = usePath()
  const header = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)
  const hovered = useRef(false)
  const here = (h: string) => (h === path || (h !== '/' && !h.includes('#') && path.startsWith(h + '/')) ? 'page' : undefined)
  const inServices = path === '/leistungen' || path.startsWith('/leistungen/')

  // any navigation closes everything
  const [seenPath, setSeenPath] = useState(path)
  if (seenPath !== path) {
    setSeenPath(path)
    setMega(false)
    setOpen(false)
  }

  useEffect(() => {
    if (!mega) return
    const outside = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setMega(false)
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMega(false)
      trigger.current?.focus()
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', esc)
    }
  }, [mega])

  // mouse users get it on hover, with a short grace period so the pointer can travel into the panel
  const enter = () => {
    if (!finePointer()) return
    window.clearTimeout(timer.current)
    hovered.current = true
    setMega(true)
  }
  const leave = () => {
    if (!finePointer()) return
    window.clearTimeout(timer.current)
    hovered.current = false
    timer.current = window.setTimeout(() => setMega(false), 140)
  }

  return (
    <header
      ref={header}
      onClick={(e) => {
        // links to the current page or a hash on it do not change the path, so close here as well
        if ((e.target as HTMLElement).closest('a')) {
          setMega(false)
          setOpen(false)
        }
      }}
      className="sticky top-0 z-40 border-b border-white/10 bg-night">
      <div className={`${WRAP} flex h-16 items-center justify-between`}>
        <Lockup />
        <nav className="hidden h-full items-center gap-8 md:flex" aria-label="Hauptnavigation">
          <div className="flex h-full items-center" onMouseEnter={enter} onMouseLeave={leave}>
            <button
              ref={trigger}
              type="button"
              aria-expanded={mega}
              aria-controls="nav-leistungen"
              onClick={() => {
                // a click right after hover opened it should not slam it shut again
                if (hovered.current && mega) {
                  hovered.current = false
                  return
                }
                setMega((m) => !m)
              }}
              className={`inline-flex h-full items-center gap-1.5 text-[15px] font-medium transition-colors duration-150 hover:text-paper ${mega || inServices ? 'text-paper' : 'text-steel'}`}
            >
              Leistungen
              <ChevronDown className={`size-3.5 transition-transform duration-200 ease-out-expo ${mega ? 'rotate-180' : ''}`} strokeWidth={2.2} />
            </button>
            <ServicesPanel open={mega} path={path} />
          </div>
          {LINKS.map(([l, h]) => (
            <Link key={h} href={h} aria-current={here(h)} className={NAV_LINK}>
              {l}
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="group inline-flex h-10 items-center gap-2 bg-paper px-4 text-[14px] font-semibold text-night no-underline transition-colors duration-150 hover:bg-signal hover:text-paper"
          >
            Erstgespräch
            <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
        </nav>
        <button className="-mr-2 grid size-11 place-items-center text-paper md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menü">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 md:hidden" aria-label="Mobile Navigation">
          <details className="group border-b border-white/10" open={inServices}>
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[18px] font-semibold text-paper [&::-webkit-details-marker]:hidden">
              Leistungen
              <ChevronDown className="size-5 text-steel transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="space-y-6 px-5 pb-6">
              {CATEGORIES.map((c) => (
                <div key={c.id}>
                  <Link href={`/leistungen#${c.id}`} className="block border-t border-white/20 pt-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-steel no-underline">
                    {c.title}
                  </Link>
                  <ul className="mt-1">
                    {inCategory(c.id).map((sol) => (
                      <li key={sol.slug}>
                        <Link
                          href={solutionPath(sol.slug)}
                          aria-current={path === solutionPath(sol.slug) ? 'page' : undefined}
                          className="block py-2 text-[16px] text-[#C9D0DD] no-underline aria-[current=page]:text-paper aria-[current=page]:underline"
                        >
                          {sol.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link href="/leistungen" className="inline-flex items-center gap-2 text-[16px] font-semibold text-paper no-underline">
                Alle Leistungen im Überblick <ArrowRight className="size-4" />
              </Link>
            </div>
          </details>
          {LINKS.map(([l, h]) => (
            <Link key={h} href={h} aria-current={here(h)} className="block border-b border-white/10 px-5 py-4 text-[18px] font-semibold text-paper no-underline">
              {l}
            </Link>
          ))}
          <Link href="/kontakt" className="m-5 flex h-12 items-center justify-center gap-2 bg-paper text-[16px] font-semibold text-night no-underline">
            Erstgespräch anfragen <ArrowRight className="size-4" />
          </Link>
        </nav>
      )}
    </header>
  )
}
