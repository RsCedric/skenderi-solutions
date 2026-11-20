import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from './router'
import { CATEGORIES, inCategory } from './solutions'
import { BigMark, Contact, H2, Process, QuickForm, ServiceList, WRAP } from './ui'

/* the landing: headline and form on the left, the mark drawn large on the right */
function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-night text-paper">
      <div className={`${WRAP} grid items-center gap-14 pb-20 pt-14 md:pb-28 md:pt-20 lg:min-h-[min(760px,calc(100svh-4rem))] lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-8">
          <h1 className="font-display text-[clamp(2.1rem,4.8vw,4.5rem)] leading-[1.04] tracking-[-0.03em]">
            IT, die geplant ist.
            <br />
            <span className="text-steel">Nicht geflickt.</span>
          </h1>
          <p className="mt-10 max-w-[46ch] text-[19px] leading-[1.6] text-[#C9D0DD]">
            Netzwerk, Cloud, Sicherheit, Websites, eigene Software und Automatisierung für KMU. Ein Ansprechpartner, ein Plan, der aufgeht.
          </p>
          <div className="mt-10">
            <QuickForm />
          </div>
        </div>
        <BigMark className="order-first w-[clamp(88px,24vw,120px)] lg:order-none lg:col-span-3 lg:col-start-10 lg:w-full lg:max-w-[280px] lg:justify-self-end" />
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
