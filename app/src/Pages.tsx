import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from './router'
import { Contact, H2, MAIL, Process, ServiceList, Stage, WRAP } from './ui'

function useTitle(t: string) {
  useEffect(() => {
    document.title = `${t} · Skenderi Solutions`
  }, [t])
}

const H1 = 'font-display text-[clamp(1.9rem,4.2vw,3.5rem)] leading-[1.1] tracking-[-0.025em] text-balance'
const LEAD = 'mt-8 max-w-[50ch] text-[19px] leading-[1.6] text-[#C9D0DD]'

/* a plain dark page head, for pages that need no product shot */
function PageHead({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="bg-night text-paper">
      <div className={`${WRAP} pb-16 pt-16 md:pb-24 md:pt-24`}>
        <h1 className={H1}>{title}</h1>
        {lead && <p className={LEAD}>{lead}</p>}
      </div>
    </section>
  )
}

function CTA({ href = '/kontakt', children }: { href?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group mt-10 inline-flex h-13 w-fit items-center gap-2 bg-paper px-6 text-[15px] font-semibold text-night no-underline transition-colors duration-150 hover:bg-signal hover:text-paper"
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />
    </Link>
  )
}

/* ---------- Leistungen ---------- */

export function ServicesPage() {
  useTitle('Leistungen')
  return (
    <>
      <PageHead
        title="Leistungen"
        lead="Alles, was eine IT-Firma macht, in fünf Bereichen: vom Netzwerkkabel bis zur eigenen App. Jede Leistung hat eine eigene Seite mit allem, was dazugehört."
      />
      <ServiceList />
      <Process />
      <Contact />
    </>
  )
}

/* ---------- Über uns ---------- */

const VALUES = [
  { t: 'Ein Ansprechpartner', d: 'Sie haben eine Nummer und eine Person, die Ihre IT kennt. Kein Ticket-Pingpong zwischen fünf Anbietern.' },
  { t: 'Erst planen, dann bauen', d: 'Bevor etwas gekauft oder umgebaut wird, liegt ein schriftlicher Plan mit Prioritäten und Kosten auf dem Tisch.' },
  { t: 'Alles dokumentiert', d: 'Geräte, Zugänge, Lizenzen und Abläufe landen in einer Dokumentation, die Ihnen gehört. Auch wenn Sie einmal wechseln.' },
  { t: 'Klare Sprache', d: 'Wir erklären, was wir tun und warum, ohne Fachchinesisch. Sie entscheiden, wir setzen um.' },
]

export function AboutPage() {
  useTitle('Über uns')
  return (
    <>
      <Stage>
        <h1 className={H1}>Eine IT-Firma, die man anrufen kann.</h1>
        <p className={LEAD}>
          Skenderi Solutions plant, baut und betreut die IT von kleinen und mittleren Unternehmen in der Schweiz. Vom Netzwerk über die Cloud bis zur eigenen Software,
          aus einer Hand.
        </p>
        <CTA>Kennenlernen</CTA>
      </Stage>

      <section>
        <div className={`${WRAP} grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-8`}>
          <h2 className={`${H2} lg:col-span-4`}>Wofür wir stehen</h2>
          <ul className="grid border-t border-ink sm:grid-cols-2 lg:col-span-8">
            {VALUES.map((v) => (
              <li key={v.t} className="border-b border-line py-8 sm:pr-8 sm:odd:border-r sm:even:pl-8">
                <h3 className="text-[20px] font-[600] tracking-[-0.015em]">{v.t}</h3>
                <p className="mt-3 max-w-[40ch] text-[16px] leading-[1.6] text-ink-2">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper-2">
        <div className={`${WRAP} grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-8`}>
          <h2 className={`${H2} lg:col-span-4`}>Für wen wir arbeiten</h2>
          <div className="space-y-6 text-[18px] leading-[1.65] text-ink-2 lg:col-span-7">
            <p>
              Für Büros, Praxen, Werkstätten und Läden, die keine eigene IT-Abteilung haben und auch keine brauchen. Typisch sind Firmen mit 5 bis 80 Mitarbeitenden, bei
              denen die IT irgendwann gewachsen ist, aber nie geplant wurde.
            </p>
            <p>
              Wir übernehmen dort, wo es gerade hakt, oder das Ganze: Infrastruktur, Cloud und Sicherheit, Websites und eigene Software, Automatisierung und die laufende
              Betreuung.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className={`${WRAP} grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-8`}>
          <h2 className={`${H2} lg:col-span-4`}>Wer dahinter steht</h2>
          <div className="lg:col-span-7">
            <p className="text-[18px] leading-[1.65] text-ink-2">Skenderi Solutions wurde von Resul Skenderi gegründet.</p>
            <p className="mt-6 border-l-2 border-signal pl-4 text-[15px] leading-[1.6] text-mute">
              Foto, Werdegang und Standort folgen in Kürze.
            </p>
          </div>
        </div>
      </section>

      <Process />
      <Contact />
    </>
  )
}

/* ---------- Kontakt ---------- */

export function ContactPage() {
  useTitle('Kontakt')
  return (
    <>
      <PageHead title="Kontakt" lead="Erzählen Sie kurz, worum es geht. Wir melden uns persönlich und vereinbaren ein kostenloses Erstgespräch." />
      <Contact />
    </>
  )
}

/* ---------- legal: drafts with clearly marked placeholders ---------- */

function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  useTitle(title)
  return (
    <>
      <PageHead title={title} />
      <section>
        <div className={`${WRAP} py-16 md:py-24`}>
          <p className="mb-12 max-w-[64ch] border-l-2 border-signal pl-4 text-[15px] leading-[1.6] text-ink-2">
            Entwurf mit Platzhaltern in [eckigen Klammern]. Vor der Veröffentlichung ergänzen und rechtlich prüfen lassen.
          </p>
          <div className="max-w-[68ch] space-y-10 text-[17px] leading-[1.7] text-ink-2 [&_h2]:mb-3 [&_h2]:text-[20px] [&_h2]:font-[600] [&_h2]:text-ink">{children}</div>
        </div>
      </section>
    </>
  )
}

export function ImprintPage() {
  return (
    <Legal title="Impressum">
      <div>
        <h2>Verantwortlich für diese Website</h2>
        <p>
          Skenderi Solutions
          <br />
          [Inhaber/in, Rechtsform]
          <br />
          [Strasse Nr.]
          <br />
          [PLZ Ort], Schweiz
        </p>
      </div>
      <div>
        <h2>Kontakt</h2>
        <p>
          E-Mail: {MAIL} [Platzhalter-Adresse]
          <br />
          Telefon: [Nummer]
        </p>
      </div>
      <div>
        <h2>Handelsregister und UID</h2>
        <p>[Eintrag und UID-Nummer, falls vorhanden]</p>
      </div>
      <div>
        <h2>Haftung</h2>
        <p>
          Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität übernehmen wir keine Gewähr. Für Inhalte verlinkter
          Websites sind deren Betreiber verantwortlich.
        </p>
      </div>
    </Legal>
  )
}

export function PrivacyPage() {
  return (
    <Legal title="Datenschutz">
      <div>
        <h2>Kurz gesagt</h2>
        <p>
          Diese Website setzt keine Cookies, nutzt keine Analyse- oder Werbedienste und lädt keine Schriften oder Skripte von fremden Servern. Die Formulare speichern
          nichts: Sie öffnen Ihr eigenes Mailprogramm mit einer vorbereiteten Nachricht, die Sie selbst absenden.
        </p>
      </div>
      <div>
        <h2>Verantwortliche Stelle</h2>
        <p>Skenderi Solutions, [Adresse], {MAIL} [Platzhalter-Adresse]</p>
      </div>
      <div>
        <h2>E-Mail-Anfragen</h2>
        <p>
          Wenn Sie uns schreiben, verwenden wir Ihre Angaben nur, um Ihre Anfrage zu beantworten. Wir geben sie nicht weiter und löschen sie, wenn sie nicht mehr gebraucht
          werden, soweit keine gesetzliche Aufbewahrungspflicht besteht.
        </p>
      </div>
      <div>
        <h2>Hosting</h2>
        <p>
          Die Website wird bei [Hosting-Anbieter, Land] betrieben. Beim Aufruf verarbeitet der Anbieter technisch notwendige Daten wie IP-Adresse und Zeitpunkt in
          Server-Protokollen.
        </p>
      </div>
      <div>
        <h2>Ihre Rechte</h2>
        <p>
          Sie können jederzeit Auskunft über Ihre gespeicherten Daten verlangen sowie deren Berichtigung oder Löschung. Schreiben Sie dazu an {MAIL} [Platzhalter-Adresse].
        </p>
      </div>
    </Legal>
  )
}
