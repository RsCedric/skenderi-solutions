import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link } from './router'
import { CATEGORIES, bySlug, inCategory, solutionPath, type Solution } from './solutions'
import { Contact, H2, Process, Stage, WRAP } from './ui'

function Related({ s }: { s: Solution }) {
  const siblings = inCategory(s.cat).filter((x) => x.slug !== s.slug)
  const related = s.related.map(bySlug).filter((x): x is Solution => !!x && !siblings.includes(x))
  const items = [...siblings, ...related].slice(0, 4)
  return (
    <section className="border-t border-line">
      <div className={`${WRAP} py-20 md:py-28`}>
        <h2 className={H2}>Passt dazu</h2>
        <ul className="mt-12 grid border-t border-ink sm:grid-cols-2">
          {items.map((r) => (
            <li key={r.slug} className="border-b border-line sm:odd:border-r">
              <Link href={solutionPath(r.slug)} className="group flex h-full items-start justify-between gap-6 py-6 no-underline transition-colors duration-200 hover:bg-paper-2 sm:px-5">
                <span>
                  <span className="block text-[18px] font-[600] tracking-[-0.01em]">{r.title}</span>
                  <span className="mt-1.5 block max-w-[44ch] text-[15px] leading-[1.55] text-ink-2">{r.short}</span>
                </span>
                <ArrowRight className="mt-1 size-4 shrink-0 text-mute transition-[color,transform] duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function SolutionPage({ s }: { s: Solution }) {
  const cat = CATEGORIES.find((c) => c.id === s.cat)!
  useEffect(() => {
    document.title = `${s.title} · Skenderi Solutions`
  }, [s])

  return (
    <>
      <Stage>
        <nav aria-label="Pfad" className="mb-14 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-steel md:mb-20">
          <Link href="/leistungen" className="inline-flex items-center gap-1.5 no-underline hover:text-paper hover:underline">
            <ArrowLeft className="size-3.5" /> Leistungen
          </Link>
          <span aria-hidden>/</span>
          <Link href={`/leistungen#${cat.id}`} className="no-underline hover:text-paper hover:underline">
            {cat.title}
          </Link>
        </nav>
        <h1 className="font-display text-[clamp(1.9rem,4vw,3.4rem)] leading-[1.1] tracking-[-0.025em] text-balance">{s.title}</h1>
        <p className="mt-8 max-w-[50ch] text-[19px] leading-[1.6] text-[#C9D0DD]">{s.lead}</p>
        <Link
          href="#kontakt"
          className="group mt-10 inline-flex h-13 w-fit items-center gap-2 bg-paper px-6 text-[15px] font-semibold text-night no-underline transition-colors duration-150 hover:bg-signal hover:text-paper"
        >
          Erstgespräch zu {s.title}
          <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />
        </Link>
      </Stage>

      <section>
        <div className={`${WRAP} grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-8`}>
          <h2 className={`${H2} lg:col-span-4`}>Was wir übernehmen</h2>
          <ul className="grid border-t border-ink sm:grid-cols-2 lg:col-span-8">
            {s.does.map((d) => (
              <li key={d} className="flex gap-3 border-b border-line py-5 text-[17px] leading-[1.5] sm:pr-6 sm:odd:border-r sm:even:pl-6">
                <Check className="mt-1 size-4 shrink-0 text-signal" strokeWidth={2.6} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper-2">
        <div className={`${WRAP} grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-8`}>
          <h2 className={`${H2} lg:col-span-4`}>Kennen Sie das?</h2>
          <ul className="space-y-8 lg:col-span-8">
            {s.cases.map((c) => (
              <li key={c} className="max-w-[40ch] text-[clamp(1.25rem,2vw,1.6rem)] font-[500] leading-[1.35] tracking-[-0.015em]">
                «{c}»
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className={`${WRAP} grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-8`}>
          <h2 className={`${H2} lg:col-span-4`}>Was Sie am Ende in der Hand haben</h2>
          <ol className="border-t border-ink lg:col-span-8">
            {s.result.map((r) => (
              <li key={r} className="border-b border-line py-6 text-[19px] font-[550] leading-[1.45] tracking-[-0.01em]">
                {r}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Process />
      <Related s={s} />
      <Contact about={s.title} />
    </>
  )
}
