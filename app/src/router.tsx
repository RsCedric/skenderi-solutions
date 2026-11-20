import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

/* a tiny history router: enough for a marketing site with one dynamic route, no dependency */
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
window.addEventListener('popstate', emit)

export function usePath() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => window.location.pathname,
  )
}

export function navigate(to: string) {
  const url = new URL(to, window.location.href)
  const samePage = url.pathname === window.location.pathname
  window.history.pushState(null, '', url.pathname + url.hash)
  emit()
  if (url.hash) {
    // wait for the new page to render, then go to the anchor
    requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: samePage ? 'smooth' : 'auto' }))
  } else {
    window.scrollTo({ top: 0 })
  }
}

export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  function click(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!href.startsWith('/')) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={click} {...rest} />
}

/* on first load with a hash (e.g. /#leistungen from another tab), jump there once the page exists */
export function useInitialHash() {
  useEffect(() => {
    const h = window.location.hash.slice(1)
    if (h) requestAnimationFrame(() => document.getElementById(h)?.scrollIntoView())
  }, [])
}
