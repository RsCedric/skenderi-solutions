import { lazy, Suspense, useRef, useState, type FormEvent } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Loader2, Menu, X } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import type { PartId } from './Office3D'

const Office3D = lazy(() => import('./Office3D'))

const EASE = [0.16, 1, 0.3, 1] as const

/* ---------- brand ---------- */

function Mark({ className = 'size-9', inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <rect width="120" height="120" rx="28" fill={inverted ? '#F3F1EC' : '#0B1B3A'} />
      <path d="M84 30 H50 a15 15 0 0 0 0 30 H70 a15 15 0 0 1 0 30 H36" fill="none" stroke={inverted ? '#0B1B3A' : '#F3F1EC'} strokeWidth="12" />
      <circle cx="86" cy="30" r="8" fill="#3D7BFF" />
      <circle cx="34" cy="90" r="8" fill="#3D7BFF" />
    </svg>
  )
}

function Lockup() {
  return (
    <a href="#top" className="flex items-center gap-3 no-underline" aria-label="Skenderi Solutions, zum Seitenanfang">
      <Mark />
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-[750] tracking-[0.02em]">SKENDERI</span>
        <span className="mt-1 text-[9.5px] font-semibold tracking-[0.5em] text-signal">SOLUTIONS</span>
      </span>
    </a>
  )
}

/* ---------- sheet frame: coordinate ruler like a drawing border ---------- */

function Ruler() {
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  return (
    <div className="pointer-events-none hidden h-6 grid-cols-8 border-b border-ink/70 font-mono text-[10px] text-ink-2 md:grid" aria-hidden>
      {cols.map((c) => (
        <span key={c} className="grid place-items-center border-l border-ink/25 first:border-l-0">{c}</span>
      ))}
    </div>
  )
}

/* ---------- nav ---------- */

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [
    ['Leistungen', '#leistungen'],
    ['Ablauf', '#ablauf'],
    ['Kontakt', '#kontakt'],
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-ink/70 bg-paper/92 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between px-5 md:px-8">
        <Lockup />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Hauptnavigation">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="text-[15px] font-medium text-ink-2 no-underline transition-colors duration-150 hover:text-ink">
              {l}
            </a>
          ))}
          <a
            href="#kontakt"
            className="group inline-flex h-10 items-center gap-2 rounded-[3px] bg-ink px-4 text-[14px] font-semibold text-paper no-underline transition-[background-color,transform] duration-150 hover:bg-signal active:scale-[0.97]"
          >
            Erstgespräch
            <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" strokeWidth={2.2} />
          </a>
        </nav>
        <button className="grid size-10 place-items-center md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menü">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-ink/20 px-5 pb-5 md:hidden" aria-label="Mobile Navigation">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="block border-b border-ink/15 py-4 text-lg font-semibold no-underline">
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

/* ---------- hero: the drawing sheet, title block is the form ---------- */

function QuickForm() {
  const [value, setValue] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  function submit(e: FormEvent) {
    e.preventDefault()
    const v = value.trim()
    const ok = /\S+@\S+\.\S+/.test(v) || /^[+\d][\d\s/-]{8,}$/.test(v)
    if (!ok) {
      setState('error')
      return
    }
    setState('sending')
    setTimeout(() => {
      setState('done')
      toast.success('Anfrage erfasst', { description: 'Wir melden uns innerhalb eines Arbeitstages für einen Termin.' })
    }, 900)
  }
  return (
    <form onSubmit={submit} noValidate className="border border-ink bg-paper">
      <div className="grid grid-cols-[1fr_auto] border-b border-ink font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-2">
        <span className="px-3 py-2">Plankopf · Erstgespräch</span>
        <span className="border-l border-ink px-3 py-2 tabular">Blatt 1/1</span>
      </div>
      <div className="p-4">
        <label htmlFor="quick" className="mb-2 block text-[15px] font-semibold">
          Wie erreichen wir Sie?
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
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
            placeholder="E-Mail oder Telefon"
            className="h-12 min-w-0 flex-1 rounded-[3px] border border-ink/60 bg-white px-3.5 text-[16px] outline-none transition-colors placeholder:text-ink-2/80 focus:border-signal aria-[invalid=true]:border-[#C2261B] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={state === 'sending' || state === 'done'}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-[3px] bg-signal px-5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-ink active:scale-[0.97] disabled:cursor-default disabled:hover:bg-signal"
          >
            {state === 'sending' && <Loader2 className="size-4 animate-spin" />}
            {state === 'done' && <Check className="size-4" strokeWidth={2.6} />}
            {state === 'done' ? 'Angefragt' : 'Erstgespräch anfragen'}
            {state === 'idle' || state === 'error' ? <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" /> : null}
          </button>
        </div>
        <p id="quick-hint" className={`mt-2 text-[13px] ${state === 'error' ? 'text-[#B0231A]' : 'text-ink-2'}`}>
          {state === 'error'
            ? 'Das sieht weder nach E-Mail noch nach Telefonnummer aus. Bitte prüfen.'
            : state === 'done'
              ? 'Danke. Wir rufen zurück oder schreiben Ihnen.'
              : 'Kostenlos und unverbindlich. Wir melden uns persönlich.'}
        </p>
      </div>
      <div className="grid grid-cols-3 border-t border-ink font-mono text-[10.5px] text-ink-2 tabular">
        <span className="px-3 py-2">M 1:50</span>
        <span className="border-l border-ink px-3 py-2">Rev. {state === 'done' ? 'B' : 'A'}</span>
        <span className="border-l border-ink px-3 py-2">{state === 'done' ? 'Anfrage erfasst' : 'Entwurf'}</span>
      </div>
    </form>
  )
}

function Hero({ active, setActive }: { active: PartId | null; setActive: (p: PartId | null) => void }) {
  return (
    <section id="top" className="relative border-b border-ink/70">
      <div className="sheet-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto flex max-w-[1360px] flex-col lg:block lg:h-[max(760px,calc(100svh-92px))]">
        {/* lettering */}
        <div className="relative z-10 px-5 pt-14 md:px-8 lg:max-w-[600px] lg:pt-20">
          <h1 className="text-balance text-[clamp(2.9rem,5.6vw,4.9rem)] font-[820] leading-[0.95] tracking-[-0.035em]">
            IT, die geplant ist.
            <span className="block text-ink-2/75">Nicht geflickt.</span>
          </h1>
          <p className="mt-7 max-w-[36ch] text-[19px] leading-[1.5] text-ink-2">
            Wir planen, bauen und betreuen die IT von KMU: Netzwerk, Arbeitsplätze, Cloud und Sicherheit. Ein Ansprechpartner, ein Plan, der aufgeht.
          </p>
        </div>

        {/* the drawing fills the sheet */}
        <div className="relative h-[420px] sm:h-[520px] lg:absolute lg:inset-y-0 lg:left-[36%] lg:right-0 lg:h-auto">
          <Suspense fallback={null}>
            <Office3D active={active} onHover={setActive} />
          </Suspense>
          <p className="pointer-events-none absolute right-5 top-5 hidden font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 md:right-8 md:block">
            Ansicht A · Büro, axonometrisch
          </p>
        </div>

        {/* title block in the sheet corner = the action */}
        <div className="relative z-10 px-5 pb-10 md:px-8 lg:absolute lg:bottom-8 lg:left-8 lg:w-[520px] lg:p-0">
          <QuickForm />
        </div>
      </div>
    </section>
  )
}

/* ---------- parts list ---------- */

const PARTS: { id: PartId | 'web'; pos: string; title: string; text: string; items: string }[] = [
  { id: 'network', pos: '1', title: 'Netzwerk & WLAN', text: 'Router, Switches, Firewall und WLAN, geplant für Ihre Räume und dokumentiert bis zum letzten Port.', items: 'Firewall · Switch · Access Points · VPN' },
  { id: 'workplaces', pos: '2', title: 'Arbeitsplätze', text: 'Laptops, PCs und Drucker: eingerichtet, inventarisiert und ersetzt, bevor sie Ihnen den Tag kosten.', items: 'Einrichtung · Inventar · Ersatz · Support' },
  { id: 'cloud', pos: '3', title: 'Cloud & Microsoft 365', text: 'Mail, Teams und Dateien. Umzug ohne Datenverlust, Berechtigungen, die zur Firma passen.', items: 'Exchange · Teams · SharePoint · Lizenzen' },
  { id: 'security', pos: '4', title: 'Sicherheit & Backup', text: 'Backups, die regelmässig getestet werden. Updates, Virenschutz und Zugänge mit zweitem Faktor.', items: 'Backup · Updates · MFA · Notfallplan' },
  { id: 'web', pos: '5', title: 'Websites & Web-Apps', text: 'Ihre Website und interne Werkzeuge, gebaut mit React und TypeScript, schnell und wartbar.', items: 'Website · Formulare · Interne Tools' },
]

function Parts({ active, setActive }: { active: PartId | null; setActive: (p: PartId | null) => void }) {
  return (
    <section id="leistungen" className="scroll-mt-20 border-b border-ink/70">
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 className="text-balance text-[clamp(2.2rem,4.2vw,3.6rem)] font-[800] leading-[1] tracking-[-0.03em] lg:col-span-5">
            Alles, was Ihr Büro am Laufen hält.
          </h2>
          <p className="max-w-[52ch] text-[18px] leading-[1.55] text-ink-2 lg:col-span-5 lg:col-start-8 lg:pt-2">
            Die Stückliste Ihrer IT. Wir übernehmen einzelne Positionen oder das Ganze, und alles landet in einer Dokumentation, die Sie behalten.
          </p>
        </div>

        <div className="mt-16 border-t-2 border-ink" role="table" aria-label="Leistungen">
          <div role="row" className="hidden grid-cols-[72px_1.1fr_1.6fr_1fr] border-b border-ink py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 md:grid">
            <span role="columnheader">Pos.</span>
            <span role="columnheader">Bauteil</span>
            <span role="columnheader">Was wir machen</span>
            <span role="columnheader">Umfang</span>
          </div>
          {PARTS.map((p) => {
            const on = active === p.id
            const hoverable = p.id !== 'web'
            return (
              <div
                key={p.id}
                id={`pos-${p.id}`}
                role="row"
                onMouseEnter={() => hoverable && setActive(p.id as PartId)}
                onMouseLeave={() => hoverable && setActive(null)}
                className={`grid scroll-mt-28 grid-cols-[48px_1fr] gap-x-4 gap-y-2 border-b border-ink/30 py-7 transition-colors duration-200 md:grid-cols-[72px_1.1fr_1.6fr_1fr] md:gap-x-0 ${on ? 'bg-[#DCE6FF]' : ''}`}
              >
                <span role="cell" className={`font-mono text-[15px] font-bold tabular md:pl-1 ${on ? 'text-signal' : ''}`}>{p.pos}</span>
                <span role="cell" className="text-[22px] font-[750] leading-tight tracking-[-0.01em] md:pr-6">{p.title}</span>
                <span role="cell" className="col-start-2 max-w-[48ch] text-[16.5px] leading-[1.55] text-ink-2 md:col-start-auto md:pr-8">{p.text}</span>
                <span role="cell" className="col-start-2 font-mono text-[12px] leading-[1.7] text-ink-2 md:col-start-auto">{p.items}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- process: the S trace routes the steps ---------- */

const STEPS = [
  { k: 'A', t: 'Erstgespräch', d: 'Sie erzählen, was nervt und was laufen muss. Wir hören zu und stellen die richtigen Fragen.' },
  { k: 'B', t: 'Bestandsaufnahme', d: 'Vor Ort schauen wir an, was da ist: Geräte, Netz, Lizenzen, Zugänge, Backups.' },
  { k: 'C', t: 'Plan', d: 'Sie bekommen einen schriftlichen Plan mit Prioritäten und Kosten, bevor irgendetwas passiert.' },
  { k: 'D', t: 'Umsetzung & Betreuung', d: 'Wir bauen um, dokumentieren jeden Schritt und bleiben Ihr fester Ansprechpartner.' },
]

function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const nodeA = useTransform(progress, [0, 0.04], [0.25, 1])
  const nodeB = useTransform(progress, [0.95, 1], [0.25, 1])

  return (
    <section id="ablauf" className="relative scroll-mt-20 overflow-hidden border-b border-ink/70 bg-ink text-paper">
      <div className="mx-auto max-w-[1360px] px-5 py-24 md:px-8 md:py-32">
        <h2 className="max-w-[16ch] text-balance text-[clamp(2.2rem,4.2vw,3.6rem)] font-[800] leading-[1] tracking-[-0.03em]">
          Vom ersten Anruf bis zur Dokumentation.
        </h2>

        <div ref={ref} className="relative mt-20">
          {/* the trace, desktop */}
          <svg viewBox="0 0 1200 560" className="absolute inset-0 hidden h-full w-full lg:block" preserveAspectRatio="none" aria-hidden>
            <path d="M1140 40 H300 a110 110 0 0 0 0 220 H900 a110 110 0 0 1 0 220 H60" fill="none" stroke="rgb(243 241 236 / 0.12)" strokeWidth="14" vectorEffect="non-scaling-stroke" />
            <motion.path
              d="M1140 40 H300 a110 110 0 0 0 0 220 H900 a110 110 0 0 1 0 220 H60"
              fill="none"
              stroke="#F3F1EC"
              strokeWidth="14"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: progress }}
            />
            <motion.circle cx="1146" cy="40" r="15" fill="#3D7BFF" style={{ opacity: nodeA }} />
            <motion.circle cx="54" cy="480" r="15" fill="#3D7BFF" style={{ opacity: nodeB }} />
          </svg>

          <ol className="relative grid gap-y-14 lg:block lg:h-[560px]">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.k}
                initial={{ y: 12 }}
                whileInView={{ y: 0 }}
                viewport={{ amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE }}
                className={`relative max-w-[40ch] border-l border-paper/30 pl-6 lg:border-l-0 lg:pl-0 ${
                  ['lg:absolute lg:left-[66%] lg:top-[13%] lg:w-[28%]', 'lg:absolute lg:left-[30%] lg:top-[13%] lg:w-[28%]', 'lg:absolute lg:left-[6%] lg:top-[52%] lg:w-[28%]', 'lg:absolute lg:left-[40%] lg:top-[52%] lg:w-[28%]'][i]
                }`}
              >
                <span className="font-mono text-[12px] font-bold tracking-[0.1em] text-[#8FB3FF]">Schritt {s.k}</span>
                <h3 className="mt-2 text-[26px] font-[750] leading-tight tracking-[-0.015em]">{s.t}</h3>
                <p className="mt-2 text-[16.5px] leading-[1.55] text-paper/75">{s.d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ---------- contact band ---------- */

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[14px] font-semibold text-ink">{label}</label>
      <input id={id} name={id} {...rest} className="h-12 rounded-[3px] border border-ink/70 bg-paper px-3.5 text-[16px] outline-none transition-colors placeholder:text-ink-2/80 focus:border-ink focus:bg-white" />
    </div>
  )
}

function Contact() {
  const [sending, setSending] = useState(false)
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (!String(data.get('name')).trim() || !String(data.get('reach')).trim()) {
      toast.error('Name und Kontakt fehlen', { description: 'Ohne die beiden können wir uns nicht melden.' })
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      form.reset()
      toast.success('Anfrage erfasst', { description: 'Wir melden uns innerhalb eines Arbeitstages.' })
    }, 1000)
  }
  return (
    <section id="kontakt" className="scroll-mt-20 border-b border-ink/70 bg-band">
      <div className="mx-auto grid max-w-[1360px] gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-balance text-[clamp(2.6rem,5.4vw,4.6rem)] font-[820] leading-[0.95] tracking-[-0.035em] text-ink">
            Planen wir Ihre IT.
          </h2>
          <p className="mt-6 max-w-[38ch] text-[18px] leading-[1.55] text-ink">
            Ein Gespräch, kostenlos und unverbindlich. Danach wissen Sie, wo Ihre IT steht und was als Nächstes kommt.
          </p>
          <a href="mailto:kontakt@skenderi-solutions.ch" className="mt-10 inline-flex items-center gap-2 text-[17px] font-semibold text-ink underline">
            kontakt@skenderi-solutions.ch <ArrowUpRight className="size-4" />
          </a>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/80">Platzhalter-Adresse</p>
        </div>

        <form onSubmit={submit} className="grid gap-5 border-2 border-ink bg-paper p-6 md:p-8 lg:col-span-6 lg:col-start-7" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Name" autoComplete="name" placeholder="Vorname Nachname" />
            <Field id="company" label="Firma" autoComplete="organization" placeholder="Muster AG" />
          </div>
          <Field id="reach" label="E-Mail oder Telefon" autoComplete="email" placeholder="name@firma.ch" />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="topic" className="text-[14px] font-semibold">Worum geht es?</label>
            <textarea id="topic" name="topic" rows={4} placeholder="z. B. WLAN fällt dauernd aus, neue Mitarbeitende brauchen Laptops, Umzug auf Microsoft 365 …" className="resize-none rounded-[3px] border border-ink/70 bg-paper px-3.5 py-3 text-[16px] leading-[1.5] outline-none transition-colors placeholder:text-ink-2/80 focus:border-ink focus:bg-white" />
          </div>
          <button type="submit" disabled={sending} className="group inline-flex h-14 items-center justify-center gap-2 rounded-[3px] bg-ink px-6 text-[16px] font-semibold text-paper transition-[background-color,transform] duration-150 hover:bg-signal active:scale-[0.98] disabled:opacity-80">
            {sending ? <Loader2 className="size-4 animate-spin" /> : null}
            {sending ? 'Wird gesendet' : 'Erstgespräch anfragen'}
            {!sending && <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />}
          </button>
        </form>
      </div>
    </section>
  )
}

/* ---------- footer = title block ---------- */

function Footer() {
  const cells: [string, string][] = [
    ['Auftragnehmer', 'Skenderi Solutions'],
    ['Leistung', 'IT-Planung, Aufbau, Betreuung'],
    ['Region', 'Schweiz'],
    ['Kontakt', 'kontakt@skenderi-solutions.ch (Platzhalter)'],
  ]
  return (
    <footer className="mx-auto max-w-[1360px] px-5 py-14 md:px-8">
      <div className="grid border-2 border-ink md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div className="flex items-center border-b border-ink p-5 md:border-b-0 md:border-r">
          <Lockup />
        </div>
        {cells.map(([k, v], i) => (
          <div key={k} className={`p-5 ${i < cells.length - 1 ? 'border-b border-ink md:border-b-0 md:border-r' : ''}`}>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-2">{k}</p>
            <p className="mt-1.5 text-[14.5px] font-semibold leading-snug">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-[11px] text-ink-2 tabular">© 2026 Skenderi Solutions · Blatt 1/1 · M 1:1</p>
    </footer>
  )
}

export default function App() {
  const [active, setActive] = useState<PartId | null>(null)
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'Archivo, sans-serif', borderRadius: 3, border: '1px solid #0B1B3A', background: '#F3F1EC', color: '#0B1B3A' } }} />
      <Nav />
      <Ruler />
      <main>
        <Hero active={active} setActive={setActive} />
        <Parts active={active} setActive={setActive} />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
