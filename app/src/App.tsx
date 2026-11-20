import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Toaster } from 'sonner'
import Home from './Home'
import SolutionPage from './SolutionPage'
import { Link, usePath } from './router'
import { bySlug } from './solutions'
import { Contact, Footer, Nav, Stage } from './ui'

function NotFound() {
  useEffect(() => {
    document.title = 'Seite nicht gefunden · Skenderi Solutions'
  }, [])
  return (
    <>
      <Stage>
        <h1 className="max-w-[18ch] font-display text-[clamp(1.9rem,4.8vw,3.9rem)] leading-[1.1] tracking-[-0.025em]">Diese Seite gibt es nicht.</h1>
        <p className="mt-8 max-w-[44ch] text-[19px] leading-[1.6] text-[#C9D0DD]">Vielleicht ist der Link veraltet. Alle Leistungen finden Sie auf der Startseite.</p>
        <Link href="/#leistungen" className="group mt-10 inline-flex h-13 w-fit items-center gap-2 bg-paper px-6 text-[15px] font-semibold text-night no-underline transition-colors hover:bg-signal hover:text-paper">
          Zu den Leistungen <ArrowRight className="size-4" />
        </Link>
      </Stage>
      <Contact />
    </>
  )
}

function Page({ path }: { path: string }) {
  const clean = path.replace(/\/+$/, '') || '/'
  if (clean === '/') return <Home />
  const m = clean.match(/^\/leistungen\/([a-z0-9-]+)$/)
  const s = m && bySlug(m[1])
  if (s) return <SolutionPage key={s.slug} s={s} />
  return <NotFound />
}

export default function App() {
  const path = usePath()
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { fontFamily: '"Host Grotesk", sans-serif', borderRadius: 0, border: '1px solid #0B1B3A', background: '#EDEDE9', color: '#0B1B3A', boxShadow: 'none' } }}
      />
      <Nav />
      <main>
        <Page path={path} />
      </main>
      <Footer />
    </>
  )
}
