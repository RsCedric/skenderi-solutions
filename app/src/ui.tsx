import { useRef, useState, type FormEvent } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
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

/* ---------- brand: an isometric cube whose edges trace an S, the top face lit in signal blue ---------- */

const VB = '15.4 13 225.2 230'
const S_PATH =
  'M15.4 78L121.5 139.3L188.6 178L128 213L15.4 148V178L128 243L240.6 178L134.5 116.7L67.4 78L128 43L240.6 108V78L128 13Z'
const FACE = 'M128 56L166.1 78L128 100L89.9 78Z'

export function Mark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox={VB} className={className} aria-hidden>
      <path d={S_PATH} fill="#EDEDE9" />
      <path d={FACE} fill="#3D7BFF" />
    </svg>
  )
}

/* the mark at display size: the S is drawn in from the top, then the blue face drops onto the cube */
export function BigMark({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox={VB} className={className} role="img" aria-label="Das Zeichen von Skenderi Solutions: ein Würfel, dessen Kanten ein S bilden, die obere Fläche in Blau">
      <motion.path
        d={S_PATH}
        fill="#EDEDE9"
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      />
      <motion.path
        d={FACE}
        fill="#3D7BFF"
        initial={reduce ? false : { opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
      />
    </svg>
  )
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

/* ---------- the dark stage: copy left, the mark stands quietly on the right ---------- */

export function Stage({ children, tall = false }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-night text-paper">
      <div className={`${WRAP} ${tall ? 'md:min-h-[min(820px,calc(100svh-4rem))] md:py-28' : 'md:min-h-[560px] md:py-24'} grid items-center gap-12 pb-16 pt-14 md:grid-cols-12`}>
        <div className="md:col-span-7">{children}</div>
        <BigMark className="hidden w-full max-w-[240px] justify-self-end md:col-span-4 md:col-start-9 md:block" />
      </div>
    </section>
  )
}

/* ---------- every service, grouped by area (home and /leistungen) ---------- */

export function ServiceList() {
  return (
    <section id="leistungen" className="scroll-mt-16">
      <div className={`${WRAP} py-24 md:py-32`}>
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className={`${H2} lg:col-span-7`}>Alles, was eine IT-Firma macht. Aus einer Hand.</h2>
          <p className="max-w-[44ch] text-[18px] leading-[1.6] text-ink-2 lg:col-span-4 lg:col-start-9 lg:self-end">
            Vom Netzwerkkabel bis zur eigenen App. Sie wählen einzelne Leistungen oder geben das Ganze ab; alles landet in einer Dokumentation, die Ihnen gehört.
          </p>
        </div>

        <div className="mt-16 md:mt-24">
          {CATEGORIES.map((c) => (
            <div key={c.id} id={c.id} className="grid scroll-mt-20 gap-6 border-t border-ink py-10 md:py-14 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <h3 className="font-display text-[clamp(1.15rem,1.7vw,1.4rem)] leading-tight tracking-[-0.01em]">{c.title}</h3>
                <p className="mt-3 max-w-[32ch] text-[16px] leading-[1.6] text-ink-2">{c.text}</p>
              </div>
              <ul className="lg:col-span-8">
                {inCategory(c.id).map((s) => (
                  <li key={s.slug} className="border-b border-line first:border-t lg:first:border-t-0">
                    <Link
                      href={solutionPath(s.slug)}
                      className="group grid gap-x-6 gap-y-1 py-5 no-underline transition-colors duration-200 sm:grid-cols-[minmax(0,15rem)_1fr_auto] sm:items-center md:hover:bg-paper-2 sm:px-3"
                    >
                      <span className="text-[18px] font-[600] tracking-[-0.01em]">{s.title}</span>
                      <span className="text-[15px] leading-[1.55] text-ink-2">{s.short}</span>
                      <ArrowRight className="hidden size-4 text-mute transition-[color,transform] duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-ink sm:block" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
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

const COMPANY = [
  ['Leistungen', '/leistungen'],
  ['Über uns', '/ueber-uns'],
  ['Kontakt', '/kontakt'],
]

export function Footer() {
  return (
    <footer className="bg-night text-paper">
      <div className={`${WRAP} grid gap-12 py-16 md:grid-cols-12 md:gap-8`}>
        <div className="md:col-span-3">
          <Lockup />
          <p className="mt-5 max-w-[28ch] text-[14px] leading-[1.6] text-steel">IT, Software und Automatisierung für KMU in der Schweiz.</p>
          <ul className="mt-8 space-y-2">
            {COMPANY.map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="text-[14px] font-semibold text-paper no-underline hover:underline">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
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
        <div className={`${WRAP} flex flex-wrap items-center justify-between gap-4 py-6 text-[13px] text-steel`}>
          <p className="tabular">© 2026 Skenderi Solutions</p>
          <p className="flex gap-6">
            <Link href="/impressum" className="text-steel no-underline hover:text-paper hover:underline">Impressum</Link>
            <Link href="/datenschutz" className="text-steel no-underline hover:text-paper hover:underline">Datenschutz</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
