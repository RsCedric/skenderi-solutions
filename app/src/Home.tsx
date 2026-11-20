import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from './router'
import { CATEGORIES, inCategory } from './solutions'
import { Contact, H2, Process, QuickForm, ServiceList, WRAP } from './ui'

/* the landing: the headline owns the top, the rendered mark gets its own wide frame underneath */
function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-night text-paper">
      <div className={`${WRAP} relative z-10 pt-14 md:pt-20`}>
        <h1 className="font-display text-[clamp(2.1rem,5.6vw,5.4rem)] leading-[1.04] tracking-[-0.03em]">
          IT, die geplant ist.
          <br />
          <span className="text-steel">Nicht geflickt.</span>
        </h1>
        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8">
          <p className="max-w-[46ch] text-[19px] leading-[1.6] text-[#C9D0DD] lg:col-span-5">
            Netzwerk, Cloud, Sicherheit, Websites, eigene Software und Automatisierung für KMU. Ein Ansprechpartner, ein Plan, der aufgeht.
          </p>
          <div className="lg:col-span-6 lg:col-start-7 lg:flex lg:justify-end">
            <QuickForm />
          </div>
        </div>
      </div>
      <div className="relative mt-6 md:-mt-10">
        <picture>
          <source media="(min-width: 768px)" srcSet="/img/hero.webp" />
          <img
            src="/img/hero-1280.webp"
            alt="Das Zeichen von Skenderi Solutions: ein gefrästes Titan-S mit blauem Licht in den Schlitzen"
            width={2400}
            height={1500}
            fetchPriority="high"
            className="h-[clamp(300px,44vw,640px)] w-full object-cover object-[80%_58%]"
          />
        </picture>
        {/* the render's black sky melts into the page above */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-night to-transparent" aria-hidden />
      </div>
    </section>
  )
}

/* the five areas as a strip right under the stage: a map of the whole company in one line */
function AreaStrip() {
  return (
    <nav className="border-b border-line bg-paper" aria-label="Bereiche">
      <ul className={`${WRAP} grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`}>
        {CATEGORIES.map((c) => (
          <li key={c.id} className="border-line max-lg:border-b lg:border-r lg:first:border-l">
            <Link
              href={`/#${c.id}`}
              className="group flex h-full flex-col gap-1 px-1 py-5 no-underline transition-colors duration-200 hover:bg-paper-2 sm:px-4"
            >
              <span className="flex items-center justify-between text-[15px] font-semibold">
                {c.title}
                <ArrowRight className="size-4 -translate-x-1 text-mute opacity-0 transition-[opacity,transform] duration-200 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
              <span className="tabular text-[13px] text-mute">{inCategory(c.id).length} Leistungen</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function AboutTeaser() {
  return (
    <section className="bg-paper-2">
      <div className={`${WRAP} grid gap-10 py-24 md:py-32 lg:grid-cols-12 lg:gap-8`}>
        <h2 className={`${H2} lg:col-span-5`}>Eine IT-Firma, die man anrufen kann.</h2>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="max-w-[48ch] text-[18px] leading-[1.65] text-ink-2">
            Ein fester Ansprechpartner statt fünf Anbieter. Erst ein schriftlicher Plan, dann die Umsetzung. Und eine Dokumentation, die Ihnen gehört, auch wenn Sie einmal
            wechseln.
          </p>
          <Link href="/ueber-uns" className="group mt-8 inline-flex items-center gap-2 text-[17px] font-semibold text-ink underline">
            Mehr über uns
            <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useEffect(() => {
    document.title = 'Skenderi Solutions · IT, Software und Automatisierung für KMU'
  }, [])
  return (
    <>
      <Hero />
      <AreaStrip />
      <ServiceList />
      <AboutTeaser />
      <Process />
      <Contact />
    </>
  )
}
