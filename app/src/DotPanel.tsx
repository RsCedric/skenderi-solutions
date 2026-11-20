import { useEffect, useRef } from 'react'

export type Scene = 'logo' | 'network' | 'workplaces' | 'cloud' | 'security'

const COLS = 60
const ROWS = 36
const OFF = '#1A2A4A'
const ON = '#EDEDE9'
const SIGNAL = '#3D7BFF'

/* each scene is drawn once at grid resolution, then read back cell by cell: white = lit, red = signal */
function draw(scene: Scene, c: CanvasRenderingContext2D) {
  c.clearRect(0, 0, COLS, ROWS)
  const lit = '#FFFFFF'
  const sig = '#FF0000'
  c.lineCap = 'butt'
  c.lineJoin = 'miter'
  const dot = (x: number, y: number, r: number, col: string) => {
    c.fillStyle = col
    c.beginPath()
    c.arc(x, y, r, 0, Math.PI * 2)
    c.fill()
  }
  if (scene === 'logo') {
    // the S from the mark, two dots thick, with its two nodes
    c.strokeStyle = lit
    c.lineWidth = 2
    c.stroke(new Path2D('M40 8 H25 A6 6 0 0 0 25 20 H35 A6 6 0 0 1 35 32 H20'))
    dot(42, 8, 2.2, sig)
    dot(18, 32, 2.2, sig)
    return
  }
  if (scene === 'network') {
    const ends = [[9, 7], [51, 7], [6, 18], [54, 18], [9, 29], [51, 29], [30, 4], [30, 32]]
    c.strokeStyle = lit
    c.lineWidth = 1
    for (const [x, y] of ends) {
      c.beginPath()
      c.moveTo(30.5, 18.5)
      c.lineTo(x + 0.5, y + 0.5)
      c.stroke()
    }
    c.fillStyle = lit
    for (const [x, y] of ends) c.fillRect(x - 1, y - 1, 3, 3)
    c.fillStyle = sig
    c.fillRect(27, 16, 7, 5)
    return
  }
  if (scene === 'workplaces') {
    // six desks from above, each with its screen
    c.strokeStyle = lit
    c.lineWidth = 1
    for (const x of [8, 24, 40]) {
      for (const y of [7, 21]) {
        c.strokeRect(x + 0.5, y + 0.5, 12, 8)
        c.fillStyle = x === 24 && y === 7 ? sig : lit
        c.fillRect(x + 4, y + 2, 5, 2)
      }
    }
    return
  }
  if (scene === 'cloud') {
    c.strokeStyle = lit
    c.lineWidth = 1
    for (const r of [5.5, 10.5, 15.5]) {
      c.beginPath()
      c.arc(30, 18, r, 0, Math.PI * 2)
      c.stroke()
    }
    dot(30, 18, 2, sig)
    dot(30 + 10.5 * Math.cos(-0.6), 18 + 10.5 * Math.sin(-0.6), 1.4, sig)
    return
  }
  // security: backup inside backup, a key at the core
  c.strokeStyle = lit
  c.lineWidth = 1
  c.strokeRect(10.5, 4.5, 39, 27)
  c.strokeRect(17.5, 9.5, 25, 17)
  c.strokeRect(23.5, 13.5, 13, 9)
  c.fillStyle = sig
  c.fillRect(28, 16, 4, 4)
}

function sample(scene: Scene, c: CanvasRenderingContext2D) {
  draw(scene, c)
  const px = c.getImageData(0, 0, COLS, ROWS).data
  const out = new Uint8Array(COLS * ROWS)
  for (let i = 0; i < out.length; i++) {
    if (px[i * 4 + 3] < 110) continue
    out[i] = px[i * 4 + 1] < 128 ? 2 : 1
  }
  return out
}

const colourOf = (s: number) => (s === 2 ? SIGNAL : s === 1 ? ON : OFF)

/* a dot-matrix display: when the scene changes every dot flips on its own short delay */
export default function DotPanel({ scene, label }: { scene: Scene; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const state = useRef<{ from: Uint8Array; to: Uint8Array; delay: Float32Array; t0: number; cache: Map<Scene, Uint8Array> } | null>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const scratch = document.createElement('canvas')
    scratch.width = COLS
    scratch.height = ROWS
    const sc = scratch.getContext('2d', { willReadFrequently: true })!
    const cache = new Map<Scene, Uint8Array>()
    for (const s of ['logo', 'network', 'workplaces', 'cloud', 'security'] as Scene[]) cache.set(s, sample(s, sc))
    const empty = new Uint8Array(COLS * ROWS)
    state.current = { from: empty, to: cache.get('logo')!, delay: new Float32Array(COLS * ROWS), t0: performance.now(), cache }
    for (let i = 0; i < COLS * ROWS; i++) {
      // first light-up sweeps in from the left, later flips scatter
      state.current.delay[i] = (i % COLS) * 9 + Math.random() * 160
    }

    const ctx = el.getContext('2d')!
    let raf = 0
    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = el.clientWidth
      h = el.clientHeight
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      kick()
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const FLIP = 140

    const frame = (now: number) => {
      const st = state.current!
      const cell = w / COLS
      const r = cell * 0.36
      ctx.clearRect(0, 0, w, h)
      let busy = false
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x
          const a = st.from[i]
          const b = st.to[i]
          let k = 1
          if (a !== b && !reduce) {
            k = (now - st.t0 - st.delay[i]) / FLIP
            if (k < 1) busy = true
            k = Math.max(0, Math.min(1, k))
          }
          const cx = x * cell + cell / 2
          const cy = y * cell + cell / 2
          ctx.globalAlpha = 1
          ctx.fillStyle = colourOf(k < 1 ? a : b)
          if (k > 0 && k < 1) {
            ctx.fillStyle = OFF
            ctx.beginPath()
            ctx.arc(cx, cy, r, 0, Math.PI * 2)
            ctx.fill()
            if (a) {
              ctx.globalAlpha = 1 - k
              ctx.fillStyle = colourOf(a)
              ctx.beginPath()
              ctx.arc(cx, cy, r, 0, Math.PI * 2)
              ctx.fill()
            }
            if (b) {
              ctx.globalAlpha = k
              ctx.fillStyle = colourOf(b)
            } else continue
          }
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      raf = busy ? requestAnimationFrame(frame) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    ;(state.current as unknown as { kick: () => void }).kick = kick

    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const st = state.current
    if (!st) return
    const next = st.cache.get(scene)!
    if (next === st.to) return
    // freeze the current picture, then flip towards the next one
    st.from = st.to
    st.to = next
    st.t0 = performance.now()
    for (let i = 0; i < st.delay.length; i++) st.delay[i] = Math.random() * 380
    ;(st as unknown as { kick: () => void }).kick()
  }, [scene])

  return (
    <figure className="bg-ink p-4 sm:p-5">
      <canvas ref={canvas} className="block aspect-[60/36] w-full" aria-hidden />
      <figcaption className="mt-4 flex items-center justify-between border-t border-white/12 pt-3 font-display text-[15px] font-[800] uppercase tracking-[0.04em] text-paper sm:text-[17px]">
        <span aria-live="polite">{label}</span>
        <span className="size-2 bg-signal" aria-hidden />
      </figcaption>
    </figure>
  )
}
