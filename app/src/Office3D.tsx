import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Edges, Html, Line, OrthographicCamera } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import type { Group } from 'three'

export type PartId = 'network' | 'workplaces' | 'cloud' | 'security'

const INK = '#0B1B3A'
const SIGNAL = '#3D7BFF'
const PAPER = '#F3F1EC'
const TINT = '#DCE6FF'

type V3 = [number, number, number]

function Block({ id, active, position, size }: { id: PartId | null; active: PartId | null; position: V3; size: V3 }) {
  const on = id !== null && id === active
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={on ? TINT : PAPER} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      <Edges color={on ? SIGNAL : INK} lineWidth={on ? 2 : 1.25} />
    </mesh>
  )
}

function Puff({ position, r, on }: { position: V3; r: number; on: boolean }) {
  return (
    <mesh position={position}>
      <icosahedronGeometry args={[r, 1]} />
      <meshBasicMaterial color={on ? TINT : PAPER} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      <Edges color={on ? SIGNAL : INK} lineWidth={on ? 1.6 : 1} threshold={8} />
    </mesh>
  )
}

function Cable({ points, on }: { points: V3[]; on: boolean }) {
  const ref = useRef<any>(null)
  useFrame((_, dt) => {
    if (ref.current?.material) ref.current.material.dashOffset -= dt * 0.6
  })
  return <Line ref={ref} points={points} color={SIGNAL} lineWidth={on ? 2.6 : 1.6} dashed dashSize={0.18} gapSize={0.1} />
}

function Callout({ n, position, id, label, onHover }: { n: number; position: V3; id: PartId; label: string; onHover: (p: PartId | null) => void }) {
  return (
    <Html position={position} center zIndexRange={[20, 0]}>
      <a
        href={`#pos-${id}`}
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(id)}
        onBlur={() => onHover(null)}
        className="group flex items-center gap-2 whitespace-nowrap no-underline"
      >
        <span className="grid size-7 place-items-center rounded-full border border-ink bg-paper font-mono text-[12px] font-bold text-ink transition-colors duration-200 group-hover:border-signal group-hover:bg-signal group-hover:text-white">
          {n}
        </span>
        <span className="hidden font-mono text-[11px] uppercase sm:inline tracking-[0.08em] text-ink-2 transition-colors duration-200 group-hover:text-ink">{label}</span>
      </a>
    </Html>
  )
}

function Floor() {
  const lines = useMemo(() => {
    const out: V3[][] = []
    for (let x = -4.5; x <= 4.5; x += 1) out.push([[x, 0, -3.5], [x, 0, 3.5]])
    for (let z = -3.5; z <= 3.5; z += 1) out.push([[-4.5, 0, z], [4.5, 0, z]])
    return out
  }, [])
  return (
    <group>
      {lines.map((p, i) => (
        <Line key={i} points={p} color="#C3C8D2" lineWidth={0.8} />
      ))}
      {/* dimension line along the front edge */}
      <Line points={[[-4.5, 0, 4.1], [4.5, 0, 4.1]]} color={INK} lineWidth={1} />
      <Line points={[[-4.5, 0, 3.6], [-4.5, 0, 4.3]]} color={INK} lineWidth={1} />
      <Line points={[[4.5, 0, 3.6], [4.5, 0, 4.3]]} color={INK} lineWidth={1} />
      <Html position={[0, 0, 4.1]} center>
        <span className="bg-paper px-1.5 font-mono text-[11px] text-ink tabular">9 000</span>
      </Html>
    </group>
  )
}

function Scene({ active, onHover }: { active: PartId | null; onHover: (p: PartId | null) => void }) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    if (!group.current) return
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tx = reduce ? 0 : state.pointer.x * 0.14
    const ty = reduce ? 0 : -state.pointer.y * 0.05
    group.current.rotation.y += (tx - group.current.rotation.y) * 0.05
    group.current.rotation.x += (ty - group.current.rotation.x) * 0.05
  })

  const net = active === 'network'
  const cloud = active === 'cloud'
  const router: V3 = [-3.3, 1.35, -3.1]

  return (
    <group ref={group} position={[0.2, -1.5, 0]}>
      <Floor />
      {/* cutaway walls */}
      <Block id={null} active={active} position={[0, 1.2, -3.55]} size={[9, 2.4, 0.1]} />
      <Block id={null} active={active} position={[-4.55, 1.2, 0]} size={[0.1, 2.4, 7.2]} />

      {/* network: router shelf + access point */}
      <Block id="network" active={active} position={[-3.3, 1.2, -3.25]} size={[1.1, 0.06, 0.5]} />
      <Block id="network" active={active} position={router} size={[0.8, 0.22, 0.4]} />
      <mesh position={[-1.2, 2.25, -3.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.1, 24]} />
        <meshBasicMaterial color={net ? TINT : PAPER} polygonOffset polygonOffsetFactor={1} />
        <Edges color={net ? SIGNAL : INK} lineWidth={net ? 2 : 1.2} threshold={20} />
      </mesh>

      {/* workplaces: three desks with screens */}
      {[-2.4, 0, 2.4].map((x) => (
        <group key={x}>
          <Block id="workplaces" active={active} position={[x, 0.38, 1.4]} size={[1.6, 0.76, 0.85]} />
          <Block id="workplaces" active={active} position={[x, 1.08, 1.2]} size={[0.85, 0.52, 0.06]} />
          <Block id="workplaces" active={active} position={[x, 0.8, 1.2]} size={[0.1, 0.08, 0.06]} />
          <Block id="workplaces" active={active} position={[x + 0.5, 0.78, 1.6]} size={[0.32, 0.03, 0.22]} />
        </group>
      ))}

      {/* security: backup rack */}
      <Block id="security" active={active} position={[3.6, 0.95, -2.8]} size={[0.8, 1.9, 0.8]} />
      {[0.5, 0.85, 1.2, 1.55].map((y) => (
        <Line key={y} points={[[3.2, y, -2.39], [4.0, y, -2.39]]} color={active === 'security' ? SIGNAL : INK} lineWidth={1} />
      ))}

      {/* cloud */}
      <group position={[-3.0, 4.3, 1.9]}>
        <Puff position={[0, 0, 0]} r={0.62} on={cloud} />
        <Puff position={[0.75, -0.1, 0.1]} r={0.48} on={cloud} />
        <Puff position={[-0.72, -0.15, 0]} r={0.44} on={cloud} />
      </group>

      {/* cables */}
      <Cable on={net} points={[router, [-3.3, 0.02, -3.1], [-3.3, 0.02, 0.6], [2.4, 0.02, 0.6], [2.4, 0.02, 1.0]]} />
      <Cable on={net} points={[[-2.4, 0.02, 0.6], [-2.4, 0.02, 1.0]]} />
      <Cable on={net} points={[[0, 0.02, 0.6], [0, 0.02, 1.0]]} />
      <Cable on={active === 'security'} points={[[-3.3, 0.02, -2.4], [3.6, 0.02, -2.4]]} />
      <Cable on={cloud} points={[[-3.0, 1.5, -3.1], [-3.0, 3.75, -3.1], [-3.0, 3.75, 1.3]]} />

      <Callout n={1} id="network" label="Netzwerk" position={[-3.3, 2.0, -2.7]} onHover={onHover} />
      <Callout n={2} id="workplaces" label="Arbeitsplätze" position={[2.4, 1.75, 1.2]} onHover={onHover} />
      <Callout n={3} id="cloud" label="Cloud · M365" position={[-3.0, 5.35, 1.9]} onHover={onHover} />
      <Callout n={4} id="security" label="Backup" position={[3.6, 2.35, -2.8]} onHover={onHover} />
    </group>
  )
}

function FitZoom() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.zoom = Math.min(60, size.width / 15.5, size.height / 9.5)
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

export default function Office3D({ active, onHover }: { active: PartId | null; onHover: (p: PartId | null) => void }) {
  return (
    <Canvas flat dpr={[1, 2]} gl={{ antialias: true, alpha: true }} aria-hidden>
      <OrthographicCamera makeDefault position={[10, 8.5, 10]} zoom={60} near={-100} far={100} onUpdate={(c) => c.lookAt(0, 0.6, 0)} />
      <FitZoom />
      <Scene active={active} onHover={onHover} />
    </Canvas>
  )
}
