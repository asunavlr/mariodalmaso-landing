import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReduced } from '../lib/anim'

/* ------------------------------------------------------------------ */
/* Cursor customizado — anel que segue o mouse e cresce em links        */
/* ------------------------------------------------------------------ */
export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (prefersReduced()) return
    if (window.matchMedia('(hover: none)').matches) return // sem cursor no touch

    const d = dot.current
    const r = ring.current
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 })

    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' })

    let shown = false
    const move = (e) => {
      if (!shown) { gsap.to([d, r], { opacity: 1, duration: 0.3 }); shown = true }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
    }
    const over = (e) => {
      if (e.target.closest('a, button, input, select, textarea, [data-cursor]')) {
        gsap.to(r, { scale: 2.2, borderColor: 'rgba(212,175,106,0.9)', duration: 0.35 })
        gsap.to(d, { scale: 0, duration: 0.25 })
      }
    }
    const out = (e) => {
      if (e.target.closest('a, button, input, select, textarea, [data-cursor]')) {
        gsap.to(r, { scale: 1, borderColor: 'rgba(255,255,255,0.28)', duration: 0.35 })
        gsap.to(d, { scale: 1, duration: 0.25 })
      }
    }
    const leave = () => { gsap.to([d, r], { opacity: 0, duration: 0.25 }); shown = false }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden lg:block" aria-hidden="true">
      <div ref={dot} className="absolute h-1.5 w-1.5 rounded-full bg-gold-300" />
      <div ref={ring} className="absolute h-9 w-9 rounded-full border border-white/28" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Parallax — desloca o elemento conforme o scroll                     */
/* ------------------------------------------------------------------ */
export function Parallax({ children, speed = 0.18, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [speed])
  return <div ref={ref} className={className}>{children}</div>
}

/* ------------------------------------------------------------------ */
/* Tilt3D — inclinacao 3D no hover                                     */
/* ------------------------------------------------------------------ */
export function Tilt3D({ children, className = '', max = 7 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    if (window.matchMedia('(hover: none)').matches) return

    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' })

    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      ry(px * max * 2)
      rx(-py * max * 2)
    }
    const leave = () => { rx(0); ry(0) }

    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [max])

  return (
    <div style={{ perspective: '1000px' }} className={className}>
      <div ref={ref} style={{ transformStyle: 'preserve-3d' }} className="h-full">
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* ScrollVelocity — faixa de texto que acelera com o scroll            */
/* ------------------------------------------------------------------ */
export function ScrollVelocity({ text, className = '', baseSpeed = 0.6 }) {
  const wrap = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    if (prefersReduced()) return

    let x = 0
    let vel = 0
    let last = window.scrollY
    let raf = 0

    const onScroll = () => {
      const now = window.scrollY
      vel = gsap.utils.clamp(-70, 70, (now - last) * 1.7)
      last = now
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const half = () => el.scrollWidth / 2 || 1

    const tick = () => {
      raf = requestAnimationFrame(tick)
      vel *= 0.92
      x -= baseSpeed + vel * 0.16
      const h = half()
      if (x <= -h) x += h
      if (x > 0) x -= h
      el.style.transform = `translate3d(${x}px,0,0)`
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [baseSpeed])

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((d) => (
          <span key={d} className="flex shrink-0 items-center">
            {[0, 1, 2].map((i) => (
              <span key={i} className="flex items-center">
                <span className="px-8">{text}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400/60" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* DotGrid — malha de pontos que reage ao cursor (canvas 2D, leve)     */
/* ------------------------------------------------------------------ */
export function DotGrid({ className = '', gap = 30, radius = 130 }) {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const reduced = prefersReduced()
    let dots = []
    let raf = 0
    const mouse = { x: -9999, y: -9999 }
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const build = () => {
      const r = cv.getBoundingClientRect()
      cv.width = r.width * dpr
      cv.height = r.height * dpr
      ctx.scale(dpr, dpr)
      dots = []
      for (let y = gap; y < r.height; y += gap)
        for (let x = gap; x < r.width; x += gap) dots.push({ x, y, ox: x, oy: y })
    }

    const draw = () => {
      const r = cv.getBoundingClientRect()
      ctx.clearRect(0, 0, r.width, r.height)
      for (const d of dots) {
        const dx = d.x - mouse.x
        const dy = d.y - mouse.y
        const dist = Math.hypot(dx, dy)
        let tx = d.ox
        let ty = d.oy
        let alpha = 0.16
        let size = 1
        if (dist < radius) {
          const f = (1 - dist / radius)
          tx = d.ox + (dx / (dist || 1)) * f * 22
          ty = d.oy + (dy / (dist || 1)) * f * 22
          alpha = 0.16 + f * 0.65
          size = 1 + f * 1.4
        }
        d.x += (tx - d.x) * 0.12
        d.y += (ty - d.y) * 0.12
        ctx.beginPath()
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,175,106,${alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      const r = cv.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const onResize = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); build() }

    build()
    if (reduced) {
      // desenha estatico
      for (const d of dots) {
        ctx.beginPath(); ctx.arc(d.x, d.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(212,175,106,0.16)'; ctx.fill()
      }
    } else {
      raf = requestAnimationFrame(draw)
      window.addEventListener('mousemove', onMove)
      cv.addEventListener('mouseleave', onLeave)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cv.removeEventListener('mouseleave', onLeave)
    }
  }, [gap, radius])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/* Intro — cortina de abertura da pagina                               */
/* ------------------------------------------------------------------ */
export function Intro() {
  const [done, setDone] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    if (prefersReduced()) { setDone(true); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setDone(true) })
      tl.to('.intro-word', { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09 }, 0.15)
        .to('.intro-rule', { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, 0.35)
        .to('.intro-word', { opacity: 0, y: -14, duration: 0.55, ease: 'power2.in', stagger: 0.05 }, 1.55)
        .to(root.current, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, 1.85)
    }, root)
    return () => ctx.revert()
  }, [])

  if (done) return null

  return (
    <div ref={root} className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950">
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-3 overflow-hidden font-display text-[clamp(1.8rem,5vw,3.2rem)] font-light">
          <span className="intro-word translate-y-6 opacity-0 text-bone-50">Mario</span>
          <span className="intro-word translate-y-6 opacity-0 text-gold-400">Dal Maso</span>
        </div>
        <div className="intro-rule mx-auto mt-5 h-px w-48 origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        <div className="intro-word mt-5 translate-y-6 text-[10.5px] uppercase tracking-[0.3em] text-bone-100/40 opacity-0">
          desde 1960
        </div>
      </div>
    </div>
  )
}

export { ScrollTrigger }
