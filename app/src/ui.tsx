import { useRef, useState, type FormEvent } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Menu, X } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from './router'
import { CATEGORIES, inCategory, solutionPath } from './solutions'

export const MAIL = 'kontakt@skenderi-solutions.ch'

/* no backend yet: hand the request to the visitor's mail program, nothing is pretended */
export function openMail(subject: string, body: string) {
  window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export const H2 = 'font-display text-[clamp(1.7rem,3.4vw,2.9rem)] leading-[1.12] tracking-[-0.02em] text-balance'
export const WRAP = 'mx-auto max-w-[1280px] px-5 md:px-8'

/* ---------- brand: the rendered titanium S ---------- */

export function Mark({ className = 'size-9' }: { className?: string }) {
  return <img src="/img/mark-96.webp" srcSet="/img/mark-96.webp 1x, /img/mark-192.webp 2x" alt="" width={36} height={36} className={`${className} rounded-[7px]`} />
}

export function Lockup() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Skenderi Solutions, zur Startseite">
      <Mark />
      <span className="font-display text-[12px] tracking-[0.12em] text-paper">
        SKENDERI <span className="text-steel">SOLUTIONS</span>
      </span>
    </Link>
  )
}

/* ---------- nav ---------- */

const LINKS = [
  ['Leistungen', '/#leistungen'],
  ['Ablauf', '/#ablauf'],
  ['Kontakt', '#kontakt'],
]

export function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night">
      <div className={`${WRAP} flex h-16 items-center justify-between`}>
        <Lockup />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
          {LINKS.map(([l, h]) => (
            <Link key={h} href={h} className="text-[15px] font-medium text-steel no-underline transition-colors duration-150 hover:text-paper">
              {l}
            </Link>
          ))}
          <Link
            href="#kontakt"
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
        <nav className="border-t border-white/10 md:hidden" aria-label="Mobile Navigation">
          {LINKS.map(([l, h]) => (
            <Link key={h} href={h} onClick={() => setOpen(false)} className="block border-b border-white/10 px-5 py-4 text-[18px] font-semibold text-paper no-underline last:border-b-0">
              {l}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

/* ---------- quick form (sits on the dark hero) ---------- */

export function QuickForm({ subject = 'Erstgespräch' }: { subject?: string }) {
  const [value, setValue] = useState('')
  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle')
  function submit(e: FormEvent) {
    e.preventDefault()
    const v = value.trim()
    const ok = /\S+@\S+\.\S+/.test(v) || /^[+\d][\d\s/-]{8,}$/.test(v)
    if (!ok) {
      setState('error')
      return
    }
    openMail(subject, `Guten Tag\n\nIch interessiere mich für ein Erstgespräch (${subject}). Sie erreichen mich unter: ${v}\n\nFreundliche Grüsse`)
    setState('done')
    toast.success('Ihr Mailprogramm öffnet sich', { description: 'Senden Sie die vorbereitete Nachricht ab, dann melden wir uns persönlich.' })
  }
  return (
    <form onSubmit={submit} noValidate className="w-full max-w-[520px]">
      <label htmlFor="quick" className="mb-2 block text-[14px] font-semibold text-paper">
        E-Mail oder Telefon
      </label>
      <div className={`flex flex-col border bg-night/60 sm:flex-row ${state === 'error' ? 'border-[#FF8A80]' : 'border-white/35'} transition-colors focus-within:border-signal`}>
        <input
          id="quick"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (state === 'error') setState('idle')
          }}
          disabled={state === 'done'}
          aria-invalid={state === 'error'}
          aria-describedby="quick-hint"
          placeholder="name@firma.ch"
          className="h-13 min-w-0 bg-transparent sm:flex-1 px-4 text-[16px] text-paper outline-none placeholder:text-steel disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === 'done'}
          className="group inline-flex h-13 shrink-0 items-center justify-center gap-2 bg-paper px-5 text-[15px] font-semibold text-night transition-colors duration-150 hover:bg-signal hover:text-paper disabled:cursor-default disabled:hover:bg-paper disabled:hover:text-night"
        >
          {state === 'done' && <Check className="size-4" strokeWidth={2.6} />}
          {state === 'done' ? 'Vorbereitet' : 'Erstgespräch anfragen'}
          {state !== 'done' && <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />}
        </button>
      </div>
      <p id="quick-hint" aria-live="polite" className={`mt-2.5 text-[14px] ${state === 'error' ? 'text-[#FF8A80]' : 'text-steel'}`}>
        {state === 'error'
          ? 'Das sieht weder nach E-Mail noch nach Telefonnummer aus. Bitte prüfen.'
          : state === 'done'
            ? 'Nachricht vorbereitet. Bitte im Mailprogramm absenden.'
            : 'Kostenlos und unverbindlich. Öffnet Ihr Mailprogramm.'}
      </p>
    </form>
  )
}

/* ---------- the render as a stage: the S stands on the right, text sits in the dark on the left ---------- */

export function Stage({ children, tall = false }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-night text-paper">
      {/* wide screens: the render fills the stage, the S stands right of the copy */}
      <img
        src="/img/hero.webp"
        alt=""
        width={2400}
        height={1500}
        fetchPriority="high"
        className="absolute inset-0 -z-10 hidden size-full object-cover object-[70%_50%] md:block"
      />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgb(4_4_5/0.9)_0%,rgb(4_4_5/0.6)_34%,transparent_56%)] md:block" aria-hidden />
      <div className={`${WRAP} ${tall ? 'md:min-h-[min(820px,calc(100svh-4rem))] md:pt-28 md:pb-28' : 'md:min-h-[600px] md:pt-24 md:pb-24'} flex flex-col justify-center pt-14`}>
        <div className="md:max-w-[min(660px,54%)]">{children}</div>
      </div>
      {/* phones: the S gets its own frame under the copy instead of hiding behind it */}
      <img src="/img/hero-1280.webp" alt="" width={1280} height={800} className="mt-12 aspect-[5/4] w-full object-cover object-[86%_60%] md:hidden" />
    </section>
  )
}

/* ---------- process ---------- */

const STEPS = [
  { t: 'Erstgespräch', d: 'Sie erzählen, was nervt und was laufen muss. Wir hören zu und stellen die richtigen Fragen.' },
  { t: 'Bestandsaufnahme', d: 'Wir schauen an, was da ist: Geräte, Netz, Software, Lizenzen, Zugänge, Abläufe.' },
  { t: 'Plan', d: 'Sie bekommen einen schriftlichen Plan mit Prioritäten und Kosten, bevor irgendetwas passiert.' },
  { t: 'Umsetzung & Betreuung', d: 'Wir bauen um, dokumentieren jeden Schritt und bleiben Ihr fester Ansprechpartner.' },
]

export function Process() {
  const ref = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  useMotionValueEvent(progress, 'change', (v) => {
    const r = Math.min(STEPS.length, Math.floor(v * STEPS.length + 0.15))
    setReached((p) => (p === r ? p : r))
  })

  return (
    <section id="ablauf" className="scroll-mt-16 bg-night text-paper">
      <div className={`${WRAP} py-24 md:py-32`}>
        <h2 className={`${H2} max-w-[20ch]`}>Vom ersten Anruf bis zur Dokumentation.</h2>
        <ol ref={ref} className="relative mt-16 grid gap-0 md:mt-20 lg:grid-cols-4">
          {/* the line fills as you read: horizontal on wide screens, vertical below */}
          <span className="absolute inset-x-0 top-0 hidden h-px bg-white/15 lg:block" aria-hidden />
          <motion.span className="absolute inset-x-0 top-0 hidden h-0.5 origin-left bg-signal lg:block" style={{ scaleX: progress }} aria-hidden />
          <span className="absolute bottom-0 left-0 top-0 w-px bg-white/15 lg:hidden" aria-hidden />
          <motion.span className="absolute bottom-0 left-0 top-0 w-0.5 origin-top bg-signal lg:hidden" style={{ scaleY: progress }} aria-hidden />
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative pb-12 pl-8 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8 lg:pt-10">
              <span className={`block font-display text-[52px] leading-none transition-colors duration-500 lg:text-[64px] ${reached > i ? 'text-paper' : 'text-[#3A4256]'}`} aria-hidden>
                {i + 1}
              </span>
              <h3 className="mt-5 text-[21px] font-[600] leading-tight tracking-[-0.015em]">{s.t}</h3>
              <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.6] text-steel">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- contact ---------- */

const INPUT = 'h-12 border-0 border-b border-ink bg-transparent px-0 text-[17px] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-2/80 focus:border-signal focus:shadow-[0_1px_0_0_var(--color-signal)]'

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[14px] font-semibold">{label}</label>
      <input id={id} name={id} {...rest} className={INPUT} />
    </div>
  )
}

export function Contact({ about }: { about?: string }) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (!String(data.get('name')).trim() || !String(data.get('reach')).trim()) {
      toast.error('Name und Kontakt fehlen', { description: 'Ohne die beiden können wir uns nicht melden.' })
      return
    }
    const company = String(data.get('company') || '').trim()
    openMail(
      `${about ? `Anfrage ${about}` : 'Erstgespräch'}${company ? ` · ${company}` : ''}`,
      `Name: ${data.get('name')}\nFirma: ${company || '–'}\nKontakt: ${data.get('reach')}\n${about ? `Thema: ${about}\n` : ''}\n${String(data.get('topic') || '').trim()}`,
    )
    toast.success('Ihr Mailprogramm öffnet sich', { description: 'Senden Sie die vorbereitete Nachricht ab, dann melden wir uns persönlich.' })
  }
  return (
    <section id="kontakt" className="scroll-mt-16">
      <div className={`${WRAP} grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-5">
          <h2 className={H2}>{about ? <>Reden wir über {about}.</> : <>Planen wir Ihre IT.</>}</h2>
          <p className="mt-7 max-w-[38ch] text-[18px] leading-[1.6] text-ink-2">
            Ein Gespräch, kostenlos und unverbindlich. Danach wissen Sie, wo Sie stehen und was als Nächstes kommt.
          </p>
          <a href={`mailto:${MAIL}`} className="mt-10 inline-flex items-center gap-2 text-[17px] font-semibold text-ink underline">
            {MAIL} <ArrowUpRight className="size-4" />
          </a>
          <p className="mt-1.5 text-[13px] text-mute">Platzhalter-Adresse</p>
        </div>

        <form onSubmit={submit} className="grid gap-8 border-t border-ink pt-8 lg:col-span-6 lg:col-start-7" noValidate>
          <div className="grid gap-8 sm:grid-cols-2">
            <Field id="name" label="Name" autoComplete="name" placeholder="Vorname Nachname" />
            <Field id="company" label="Firma" autoComplete="organization" placeholder="Muster AG" />
          </div>
          <Field id="reach" label="E-Mail oder Telefon" autoComplete="email" placeholder="name@firma.ch" />
          <div className="flex flex-col gap-1">
            <label htmlFor="topic" className="text-[14px] font-semibold">Worum geht es?</label>
            <textarea
              id="topic"
              name="topic"
              rows={3}
              placeholder="z. B. WLAN fällt dauernd aus, Bericht wird jede Woche von Hand gebaut, Idee für eine eigene App …"
              className={`${INPUT} h-auto resize-none py-3 leading-[1.5]`}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="group inline-flex h-14 items-center justify-center gap-2 bg-ink px-7 text-[16px] font-semibold text-paper transition-colors duration-150 hover:bg-signal">
              Erstgespräch anfragen
              <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />
            </button>
            <p className="text-[14px] text-ink-2">Öffnet Ihr Mailprogramm mit der fertigen Nachricht.</p>
          </div>
        </form>
      </div>
    </section>
  )
}

/* ---------- footer: also the sitemap of every service ---------- */

export function Footer() {
  return (
    <footer className="bg-night text-paper">
      <div className={`${WRAP} grid gap-12 py-16 md:grid-cols-12 md:gap-8`}>
        <div className="md:col-span-3">
          <Lockup />
          <p className="mt-5 max-w-[28ch] text-[14px] leading-[1.6] text-steel">IT, Software und Automatisierung für KMU in der Schweiz.</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:col-span-9 lg:grid-cols-5" aria-label="Alle Leistungen">
          {CATEGORIES.map((c) => (
            <div key={c.id}>
              <p className="text-[13px] font-semibold text-paper">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {inCategory(c.id).map((s) => (
                  <li key={s.slug}>
                    <Link href={solutionPath(s.slug)} className="text-[14px] text-steel no-underline transition-colors hover:text-paper hover:underline">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className={`${WRAP} tabular py-6 text-[13px] text-steel`}>© 2026 Skenderi Solutions</p>
      </div>
    </footer>
  )
}
