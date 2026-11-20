import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useInitialHash } from './router'
import { CATEGORIES, inCategory, solutionPath } from './solutions'
import { Contact, H2, Process, QuickForm, Stage, WRAP } from './ui'

function Hero() {
  return (
    <Stage tall>
      <h1 className="font-display text-[clamp(2rem,4.3vw,3.7rem)] leading-[1.08] tracking-[-0.025em] text-balance">
        IT, die geplant ist. <span className="text-steel">Nicht geflickt.</span>
      </h1>
      <p className="mt-8 max-w-[44ch] text-[19px] leading-[1.55] text-[#C9D0DD]">
        Netzwerk, Cloud, Sicherheit, Websites, eigene Software und Automatisierung für KMU. Ein Ansprechpartner, ein Plan, der aufgeht.
      </p>
      <div className="mt-10">
        <QuickForm />
      </div>
    </Stage>
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

function Services() {
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

export default function Home() {
  useInitialHash()
  useEffect(() => {
    document.title = 'Skenderi Solutions · IT, Software und Automatisierung für KMU'
  }, [])
  return (
    <>
      <Hero />
      <AreaStrip />
      <Services />
      <Process />
      <Contact />
    </>
  )
}
