import { useEffect, useRef, Children } from 'react'
import { gsap, ScrollTrigger, EASE, splitChars, whenFontsReady, prefersReduced } from '../lib/anim'

/* ------------------------------------------------------------------ */
/* SplitText — headline entrando caractere a caractere no scroll       */
/* ------------------------------------------------------------------ */
export function SplitText({ as: Tag = 'h2', children, className = '', delay = 0, stagger = 0.018 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      gsap.set(el, { opacity: 1 })
      return
    }

    let ctx
    whenFontsReady(() => {
      if (!ref.current) return
      const chars = splitChars(ref.current)
      gsap.set(ref.current, { opacity: 1 })
      ctx = gsap.context(() => {
        gsap.from(chars, {
          opacity: 0,
          y: '0.5em',
          rotateX: -55,
          duration: 1.1,
          ease: 'expo.out',
          transformOrigin: '50% 100%',
          stagger,
          delay,
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        })
      }, ref)
    })
    return () => ctx?.revert()
  }, [delay, stagger])

  return (
    <Tag ref={ref} className={`opacity-0 ${className}`} style={{ perspective: '900px' }}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Reveal — wrapper generico de entrada no scroll                      */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className = '',
  y = 26,
  delay = 0,
  duration = 1,
  // blur desligado por padrao: desfocar blocos grandes na entrada custa um
  // redesenho caro justamente quando a secao esta aparecendo.
  blur = false,
  as: Tag = 'div',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      gsap.set(el, { opacity: 1, y: 0, filter: 'none' })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, ...(blur ? { filter: 'blur(10px)' } : null) },
        {
          opacity: 1,
          y: 0,
          ...(blur ? { filter: 'blur(0px)' } : null),
          duration,
          delay,
          ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [y, delay, duration, blur])

  return (
    <Tag ref={ref} className={`will-reveal ${className}`}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Stagger — revela filhos em sequencia                                */
/* ------------------------------------------------------------------ */
export function Stagger({ children, className = '', each = 0.09, y = 24 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.children
    if (prefersReduced()) {
      gsap.set(items, { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: EASE,
          stagger: each,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [each, y])

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (c) => c)}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* CountUp — numero animado ao entrar na tela                          */
/* ------------------------------------------------------------------ */
export function CountUp({ to, from = 0, duration = 2, suffix = '', prefix = '', decimals = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`
      return
    }
    const obj = { v: from }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${obj.v.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`
        },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [to, from, duration, suffix, prefix, decimals])

  return <span ref={ref}>{prefix}{from}{suffix}</span>
}

/* ------------------------------------------------------------------ */
/* SpotlightCard — luz radial seguindo o cursor                        */
/* ------------------------------------------------------------------ */
export function SpotlightCard({ children, className = '', spotlight = 'rgba(212,175,106,0.16)' }) {
  const ref = useRef(null)
  const glow = useRef(null)
  const rect = useRef(null)
  const frame = useRef(0)

  // Sem estado do React aqui: cada movimento do mouse re-renderizava o card
  // inteiro. Agora so escreve duas variaveis CSS, uma vez por frame.
  const onMove = (e) => {
    rect.current = { x: e.clientX, y: e.clientY }
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const g = glow.current
      const el = ref.current
      const p = rect.current
      if (!g || !el || !p) return
      const r = el.getBoundingClientRect()
      g.style.setProperty('--mx', `${p.x - r.left}px`)
      g.style.setProperty('--my', `${p.y - r.top}px`)
    })
  }

  const onEnter = () => {
    if (glow.current) glow.current.style.opacity = '1'
  }
  const onLeave = () => {
    rect.current = null
    if (frame.current) { cancelAnimationFrame(frame.current); frame.current = 0 }
    if (glow.current) glow.current.style.opacity = '0'
  }

  useEffect(() => () => { if (frame.current) cancelAnimationFrame(frame.current) }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-ink-900/60 transition-colors duration-500 hover:border-gold-400/35 ${className}`}
    >
      <div
        ref={glow}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), ${spotlight}, transparent 62%)`,
        }}
      />
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Magnetic — elemento atraido pelo cursor (CTA)                       */
/* ------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.32, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.4)' })

    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }

    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [strength])

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Marquee — faixa infinita, pausa no hover                            */
/* ------------------------------------------------------------------ */
export function Marquee({ children, speed = 38, className = '' }) {
  const items = Children.toArray(children)
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className="flex w-max gap-14 will-change-transform group-hover:[animation-play-state:paused]"
        style={{ animation: `mdm-marquee ${speed}s linear infinite` }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-14" aria-hidden={dup === 1}>
            {items}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink-950 to-transparent" />
      <style>{`@keyframes mdm-marquee { to { transform: translateX(calc(-50% - 1.75rem)); } }`}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Eyebrow / GoldRule — elementos de apoio                             */
/* ------------------------------------------------------------------ */
export function Eyebrow({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold-300/90 ${className}`}
    >
      <span className="h-px w-7 bg-gold-400/60" />
      {children}
    </span>
  )
}

export function GoldRule({ className = '' }) {
  return <div className={`gold-line h-px w-full opacity-40 ${className}`} />
}

export { ScrollTrigger }
