import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReduced } from '../lib/anim'
import { isLite, useLite } from '../lib/device'

/* ------------------------------------------------------------------ */
/* Cursor customizado — anel que segue o mouse e cresce em links        */
/* ------------------------------------------------------------------ */
export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const lite = useLite()

  useEffect(() => {
    if (prefersReduced()) return
    if (lite) return // maquina fraca: cursor do sistema, sem custo por movimento
    if (window.matchMedia('(hover: none)').matches) return // sem cursor no touch

    const d = dot.current
    const r = ring.current
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 })

    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' })

    let shown = false
    let onLink = false

    // O estado de "sobre um link" sai do proprio mousemove. Antes eram dois
    // ouvintes de entrada/saida no documento inteiro: com a pagina rolando sob
    // o mouse parado, eles disparavam sem parar, e cada disparo obriga o
    // navegador a recalcular estilo para saber o que esta sob o ponteiro.
    const move = (e) => {
      if (!shown) { gsap.to([d, r], { opacity: 1, duration: 0.3 }); shown = true }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)

      const now = !!e.target.closest?.('a, button, input, select, textarea, [data-cursor]')
      if (now === onLink) return
      onLink = now
      gsap.to(r, {
        scale: now ? 2.2 : 1,
        borderColor: now ? 'rgba(212,175,106,0.9)' : 'rgba(255,255,255,0.28)',
        duration: 0.35,
      })
      gsap.to(d, { scale: now ? 0 : 1, duration: 0.25 })
    }
    const leave = () => { gsap.to([d, r], { opacity: 0, duration: 0.25 }); shown = false }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
    }
  }, [lite])

  if (lite) return null

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
  const lite = useLite()
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced() || lite) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.3 },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [speed, lite])
  return <div ref={ref} className={className}>{children}</div>
}

/* ------------------------------------------------------------------ */
/* Tilt3D — inclinacao 3D no hover                                     */
/* ------------------------------------------------------------------ */
export function Tilt3D({ children, className = '', max = 7 }) {
  const ref = useRef(null)
  const lite = useLite()

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced() || lite) return
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
  }, [max, lite])

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
  const lite = useLite()

  useEffect(() => {
    const el = track.current
    const box = wrap.current
    if (!el || !box) return
    if (prefersReduced()) return
    if (lite) return // faixa fica parada: um loop por quadro so para enfeite

    let x = 0
    let vel = 0
    let last = window.scrollY
    let raf = 0
    let visible = false

    // largura medida uma vez (e no resize) — ler scrollWidth a cada frame
    // forcava reflow do documento inteiro, 60x por segundo.
    let half = el.scrollWidth / 2 || 1
    const measure = () => { half = el.scrollWidth / 2 || 1 }
    window.addEventListener('resize', measure)

    const onScroll = () => {
      const now = window.scrollY
      vel = gsap.utils.clamp(-70, 70, (now - last) * 1.7)
      last = now
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      vel *= 0.92
      x -= baseSpeed + vel * 0.16
      if (x <= -half) x += half
      if (x > 0) x -= half
      el.style.transform = `translate3d(${x}px,0,0)`
    }

    // so anima enquanto a faixa esta na tela
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible && !raf) raf = requestAnimationFrame(tick)
        else if (!visible && raf) { cancelAnimationFrame(raf); raf = 0 }
      },
      { rootMargin: '120px 0px' }
    )
    io.observe(box)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [baseSpeed, lite])

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
export function DotGrid({ className = '', gap = 34, radius = 130 }) {
  const ref = useRef(null)
  const lite = useLite()

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d', { alpha: true })
    // em maquina fraca a malha vira desenho parado: sem reagir ao cursor
    const reduced = prefersReduced() || lite
    const touch = window.matchMedia('(hover: none)').matches

    let dots = []
    let raf = 0
    let visible = false
    let w = 0
    let h = 0
    const mouse = { x: -9999, y: -9999, inside: false }

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      // setTransform (nao scale) — scale acumulava a cada resize
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let y = gap; y < h; y += gap)
        for (let x = gap; x < w; x += gap) dots.push({ x, y, ox: x, oy: y })
    }

    const paintStatic = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(212,175,106,0.16)'
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.ox, d.oy, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // desenha so enquanto algo esta se mexendo; parado, o loop nao toca no canvas
    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!visible) return

      let moving = false
      ctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        let tx = d.ox
        let ty = d.oy
        let alpha = 0.16
        let size = 1
        if (mouse.inside) {
          const dx = d.x - mouse.x
          const dy = d.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < radius * radius) {
            const dist = Math.sqrt(d2) || 1
            const f = 1 - dist / radius
            tx = d.ox + (dx / dist) * f * 22
            ty = d.oy + (dy / dist) * f * 22
            alpha = 0.16 + f * 0.65
            size = 1 + f * 1.4
          }
        }
        const ex = tx - d.x
        const ey = ty - d.y
        if (ex * ex + ey * ey > 0.01) moving = true
        d.x += ex * 0.12
        d.y += ey * 0.12
        ctx.beginPath()
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,175,106,${alpha})`
        ctx.fill()
      }

      if (!moving && !mouse.inside) {
        // tudo em repouso: encerra o loop ate o mouse voltar
        cancelAnimationFrame(raf)
        raf = 0
        paintStatic()
      }
    }

    const wake = () => { if (!raf && visible) raf = requestAnimationFrame(draw) }

    const onMove = (e) => {
      // sem isso, todo movimento do mouse na pagina inteira forcava uma
      // medicao de layout aqui — inclusive com a secao longe da tela
      if (!visible) return
      const r = cv.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const near = x > -radius && y > -radius && x < r.width + radius && y < r.height + radius
      mouse.x = x
      mouse.y = y
      mouse.inside = near
      if (near) wake()
    }
    const onLeave = () => { mouse.inside = false; wake() }

    let resizeT = 0
    const onResize = () => {
      clearTimeout(resizeT)
      resizeT = setTimeout(() => { build(); paintStatic(); wake() }, 150)
    }

    build()
    paintStatic()
    window.addEventListener('resize', onResize)

    let io
    if (!reduced && !touch) {
      window.addEventListener('mousemove', onMove, { passive: true })
      cv.addEventListener('mouseleave', onLeave)
      io = new IntersectionObserver(
        ([e]) => {
          visible = e.isIntersecting
          if (!visible && raf) { cancelAnimationFrame(raf); raf = 0 }
        },
        { rootMargin: '100px 0px' }
      )
      io.observe(cv)
    }

    return () => {
      clearTimeout(resizeT)
      if (raf) cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cv.removeEventListener('mouseleave', onLeave)
    }
  }, [gap, radius, lite])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/* Intro — cortina de abertura da pagina                               */
/* ------------------------------------------------------------------ */
export function Intro() {
  const [done, setDone] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    // maquina fraca nao ganha nada com cortina de abertura: e so atraso
    if (prefersReduced() || isLite()) { setDone(true); return }
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
