import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Menu, X } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import DotPanel, { type Scene } from './DotPanel'

const MAIL = 'kontakt@skenderi-solutions.ch'

/* no backend yet: hand the request to the visitor's mail program, nothing is pretended */
function openMail(subject: string, body: string) {
  window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const H2 = 'font-display text-[clamp(2.1rem,4.6vw,3.9rem)] font-[800] uppercase leading-[0.98] tracking-[-0.01em]'

/* ---------- brand ---------- */

function Mark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <rect width="120" height="120" rx="28" fill="#0B1B3A" />
      <path d="M84 30 H50 a15 15 0 0 0 0 30 H70 a15 15 0 0 1 0 30 H36" fill="none" stroke="#FFFFFF" strokeWidth="12" />
      <circle cx="86" cy="30" r="8" fill="#3D7BFF" />
      <circle cx="34" cy="90" r="8" fill="#3D7BFF" />
    </svg>
  )
}

function Lockup() {
  return (
    <a href="#top" className="flex items-center gap-3 no-underline" aria-label="Skenderi Solutions, zum Seitenanfang">
      <Mark />
      <span className="text-[14px] font-[650] tracking-[0.08em]">
        SKENDERI <span className="font-[450] text-ink-2">SOLUTIONS</span>
      </span>
    </a>
  )
}

/* ---------- nav ---------- */

const LINKS = [
  ['Leistungen', '#leistungen'],
  ['Ablauf', '#ablauf'],
  ['Kontakt', '#kontakt'],
]

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-8">
        <Lockup />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="text-[15px] font-medium text-ink-2 no-underline transition-colors duration-150 hover:text-ink hover:underline">
              {l}
            </a>
          ))}
          <a
            href="#kontakt"
            className="group inline-flex h-10 items-center gap-2 bg-ink px-4 text-[14px] font-semibold text-paper no-underline transition-colors duration-150 hover:bg-signal hover:text-ink"
          >
            Erstgespräch
            <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" strokeWidth={2.2} />
          </a>
        </nav>
        <button className="-mr-2 grid size-11 place-items-center md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menü">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-line md:hidden" aria-label="Mobile Navigation">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="block border-b border-line px-5 py-4 text-[18px] font-semibold no-underline last:border-b-0">
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

/* ---------- hero ---------- */

function QuickForm() {
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
    openMail('Erstgespräch', `Guten Tag\n\nIch interessiere mich für ein Erstgespräch. Sie erreichen mich unter: ${v}\n\nFreundliche Grüsse`)
    setState('done')
    toast.success('Ihr Mailprogramm öffnet sich', { description: 'Senden Sie die vorbereitete Nachricht ab, dann melden wir uns persönlich.' })
  }
  return (
    <form onSubmit={submit} noValidate className="w-full max-w-[520px]">
      <label htmlFor="quick" className="mb-2 block text-[14px] font-semibold">
        E-Mail oder Telefon
      </label>
      <div className={`flex flex-col border sm:flex-row ${state === 'error' ? 'border-error' : 'border-ink'} transition-colors focus-within:border-signal`}>
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
          className="h-13 min-w-0 flex-1 bg-transparent px-4 text-[16px] outline-none placeholder:text-mute disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === 'done'}
          className="group inline-flex h-13 shrink-0 items-center justify-center gap-2 bg-ink px-5 text-[15px] font-semibold text-paper transition-colors duration-150 hover:bg-signal hover:text-ink disabled:cursor-default disabled:hover:bg-ink disabled:hover:text-paper"
        >
          {state === 'done' && <Check className="size-4" strokeWidth={2.6} />}
          {state === 'done' ? 'Vorbereitet' : 'Erstgespräch anfragen'}
          {state !== 'done' && <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />}
        </button>
      </div>
      <p id="quick-hint" aria-live="polite" className={`mt-2.5 text-[14px] ${state === 'error' ? 'text-error' : 'text-ink-2'}`}>
        {state === 'error'
          ? 'Das sieht weder nach E-Mail noch nach Telefonnummer aus. Bitte prüfen.'
          : state === 'done'
            ? 'Nachricht vorbereitet. Bitte im Mailprogramm absenden.'
            : 'Kostenlos und unverbindlich. Öffnet Ihr Mailprogramm.'}
      </p>
    </form>
  )
}

const AREAS: { id: Exclude<Scene, 'logo'>; label: string }[] = [
  { id: 'network', label: 'Netzwerk' },
  { id: 'workplaces', label: 'Arbeitsplätze' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'security', label: 'Sicherheit' },
]
const CYCLE: Scene[] = ['logo', ...AREAS.map((a) => a.id)]
const LABEL: Record<Scene, string> = { logo: 'Skenderi Solutions', network: 'Netzwerk', workplaces: 'Arbeitsplätze', cloud: 'Cloud & M365', security: 'Sicherheit & Backup' }

function Hero() {
  const [step, setStep] = useState(0)
  const [pinned, setPinned] = useState<Scene | null>(null)
  const panel = useRef<HTMLDivElement>(null)

  // the display cycles while it is on screen and nobody points at it
  useEffect(() => {
    if (pinned || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    if (panel.current) io.observe(panel.current)
    const id = window.setInterval(() => {
      if (visible && !document.hidden) setStep((s) => (s + 1) % CYCLE.length)
    }, 3000)
    return () => {
      window.clearInterval(id)
      io.disconnect()
    }
  }, [pinned])

  const scene = pinned ?? CYCLE[step]

  return (
    <section id="top" className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-5 pb-16 pt-14 md:px-8 md:pb-20 md:pt-20">
        <h1 className="font-display text-[clamp(2.6rem,8.4vw,6rem)] font-[800] uppercase leading-[0.95] tracking-[-0.01em]">
          <span className="block">IT, die geplant ist.</span>
          <span className="block text-mute">Nicht geflickt.</span>
        </h1>

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <p className="max-w-[42ch] text-[19px] leading-[1.55] text-ink-2">
              Wir planen, bauen und betreuen die IT von KMU: Netzwerk, Arbeitsplätze, Cloud und Sicherheit. Ein Ansprechpartner, ein Plan, der aufgeht.
            </p>
            <QuickForm />
          </div>

          <div ref={panel} className="lg:col-span-6 lg:col-start-7">
            <DotPanel scene={scene} label={LABEL[scene]} />
            <ul className="grid grid-cols-2 border-l border-line sm:grid-cols-4" aria-label="Die vier Bereiche Ihrer IT">
              {AREAS.map((a) => {
                const on = scene === a.id
                return (
                  <li key={a.id} className="border-b border-r border-line">
                    <a
                      href={`#${a.id}`}
                      onMouseEnter={() => setPinned(a.id)}
                      onMouseLeave={() => setPinned(null)}
                      onFocus={() => setPinned(a.id)}
                      onBlur={() => setPinned(null)}
                      className={`flex h-12 items-center gap-2.5 px-3 text-[14px] font-medium no-underline transition-colors duration-200 ${on ? 'bg-paper-2 text-ink' : 'text-ink-2 hover:text-ink'}`}
                    >
                      <span className={`size-1.5 shrink-0 transition-colors duration-200 ${on ? 'bg-signal' : 'bg-line'}`} aria-hidden />
                      {a.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- services ---------- */

const SERVICES: { id: string; title: string; text: string; items: string[] }[] = [
  { id: 'network', title: 'Netzwerk & WLAN', text: 'Router, Switches, Firewall und WLAN, geplant für Ihre Räume und dokumentiert bis zum letzten Port.', items: ['Firewall', 'Switch', 'Access Points', 'VPN'] },
  { id: 'workplaces', title: 'Arbeitsplätze', text: 'Laptops, PCs und Drucker: eingerichtet, inventarisiert und ersetzt, bevor sie Ihnen den Tag kosten.', items: ['Einrichtung', 'Inventar', 'Ersatz', 'Support'] },
  { id: 'cloud', title: 'Cloud & Microsoft 365', text: 'Mail, Teams und Dateien. Umzug ohne Datenverlust, Berechtigungen, die zur Firma passen.', items: ['Exchange', 'Teams', 'SharePoint', 'Lizenzen'] },
  { id: 'security', title: 'Sicherheit & Backup', text: 'Backups, die regelmässig getestet werden. Updates, Virenschutz und Zugänge mit zweitem Faktor.', items: ['Backup', 'Updates', 'MFA', 'Notfallplan'] },
  { id: 'web', title: 'Websites & Web-Apps', text: 'Ihre Website und interne Werkzeuge, gebaut mit React und TypeScript, schnell und wartbar.', items: ['Website', 'Formulare', 'Interne Tools'] },
]

function Services() {
  return (
    <section id="leistungen" className="scroll-mt-16">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className={`${H2} lg:col-span-7`}>Alles, was Ihr Büro am Laufen hält.</h2>
          <p className="max-w-[44ch] text-[18px] leading-[1.6] text-ink-2 lg:col-span-4 lg:col-start-9 lg:self-end">
            Wir übernehmen einzelne Bereiche oder das Ganze. Alles landet in einer Dokumentation, die Ihnen gehört.
          </p>
        </div>

        <ul className="mt-16 border-t border-ink md:mt-20">
          {SERVICES.map((s) => (
            <li key={s.id} id={s.id} className="group scroll-mt-20 border-b border-line">
              <div className="grid gap-x-8 gap-y-3 py-8 transition-colors duration-200 md:grid-cols-12 md:py-10 md:hover:bg-paper-2">
                <h3 className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-[600] leading-tight tracking-[-0.02em] md:col-span-4 md:pl-4">{s.title}</h3>
                <p className="max-w-[52ch] text-[17px] leading-[1.6] text-ink-2 md:col-span-5">{s.text}</p>
                <p className="text-[14px] leading-[1.7] text-mute md:col-span-3 md:pr-4 md:text-right">{s.items.join(' · ')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- process ---------- */

const STEPS = [
  { t: 'Erstgespräch', d: 'Sie erzählen, was nervt und was laufen muss. Wir hören zu und stellen die richtigen Fragen.' },
  { t: 'Bestandsaufnahme', d: 'Vor Ort schauen wir an, was da ist: Geräte, Netz, Lizenzen, Zugänge, Backups.' },
  { t: 'Plan', d: 'Sie bekommen einen schriftlichen Plan mit Prioritäten und Kosten, bevor irgendetwas passiert.' },
  { t: 'Umsetzung & Betreuung', d: 'Wir bauen um, dokumentieren jeden Schritt und bleiben Ihr fester Ansprechpartner.' },
]

function Process() {
  const ref = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  useMotionValueEvent(progress, 'change', (v) => {
    const r = Math.min(STEPS.length, Math.floor(v * STEPS.length + 0.15))
    setReached((p) => (p === r ? p : r))
  })

  return (
    <section id="ablauf" className="scroll-mt-16 bg-ink text-paper">
      <div className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
        <h2 className={`${H2} max-w-[16ch]`}>Vom ersten Anruf bis zur Dokumentation.</h2>

        <ol ref={ref} className="relative mt-16 grid gap-0 md:mt-20 lg:grid-cols-4">
          {/* the line fills as you read: horizontal on wide screens, vertical below */}
          <span className="absolute inset-x-0 top-0 hidden h-px bg-white/20 lg:block" aria-hidden />
          <motion.span className="absolute inset-x-0 top-0 hidden h-0.5 origin-left bg-signal lg:block" style={{ scaleX: progress }} aria-hidden />
          <span className="absolute bottom-0 left-0 top-0 w-px bg-white/20 lg:hidden" aria-hidden />
          <motion.span className="absolute bottom-0 left-0 top-0 w-0.5 origin-top bg-signal lg:hidden" style={{ scaleY: progress }} aria-hidden />
          {STEPS.map((s, i) => {
            const lit = reached > i
            return (
              <li key={s.t} className="relative pb-12 pl-8 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8 lg:pt-10">
                <span
                  className={`block font-display text-[64px] font-[800] leading-none transition-colors duration-500 lg:text-[88px] ${lit ? 'text-paper' : 'text-[#5A6680]'}`}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[22px] font-[600] leading-tight tracking-[-0.015em]">{s.t}</h3>
                <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.6] text-[#B7BFCF]">{s.d}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ---------- contact ---------- */

const INPUT = 'h-12 border-0 border-b border-ink bg-transparent px-0 text-[17px] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-mute focus:border-signal focus:shadow-[0_1px_0_0_var(--color-signal)]'

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[14px] font-semibold">{label}</label>
      <input id={id} name={id} {...rest} className={INPUT} />
    </div>
  )
}

function Contact() {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (!String(data.get('name')).trim() || !String(data.get('reach')).trim()) {
      toast.error('Name und Kontakt fehlen', { description: 'Ohne die beiden können wir uns nicht melden.' })
      return
    }
    const company = String(data.get('company') || '').trim()
    openMail(
      `Erstgespräch${company ? ` · ${company}` : ''}`,
      `Name: ${data.get('name')}\nFirma: ${company || '–'}\nKontakt: ${data.get('reach')}\n\n${String(data.get('topic') || '').trim()}`,
    )
    toast.success('Ihr Mailprogramm öffnet sich', { description: 'Senden Sie die vorbereitete Nachricht ab, dann melden wir uns persönlich.' })
  }
  return (
    <section id="kontakt" className="scroll-mt-16">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 className={H2}>
            Planen wir<br />Ihre IT.
          </h2>
          <p className="mt-7 max-w-[38ch] text-[18px] leading-[1.6] text-ink-2">
            Ein Gespräch, kostenlos und unverbindlich. Danach wissen Sie, wo Ihre IT steht und was als Nächstes kommt.
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
              placeholder="z. B. WLAN fällt dauernd aus, neue Mitarbeitende brauchen Laptops, Umzug auf Microsoft 365 …"
              className={`${INPUT} h-auto resize-none py-3 leading-[1.5]`}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="group inline-flex h-14 items-center justify-center gap-2 bg-ink px-7 text-[16px] font-semibold text-paper transition-colors duration-150 hover:bg-signal hover:text-ink">
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

/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <Lockup />
        <p className="text-[14px] text-ink-2">IT-Planung, Aufbau und Betreuung für KMU in der Schweiz</p>
        <p className="tabular text-[14px] text-ink-2">© 2026 Skenderi Solutions</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { fontFamily: '"Host Grotesk", sans-serif', borderRadius: 0, border: '1px solid #0B1B3A', background: '#EDEDE9', color: '#0B1B3A', boxShadow: 'none' } }}
      />
      <Nav />
      <main>
        <Hero />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
