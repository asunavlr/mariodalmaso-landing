import { useEffect, useRef } from 'react'
import { Eyebrow } from '../components/ui'
import { gsap, prefersReduced } from '../lib/anim'

/**
 * Faixa de largura total com foto em parallax e uma frase-manifesto que
 * revela palavra a palavra conforme o scroll.
 */
export default function Manifesto() {
  const root = useRef(null)
  const img = useRef(null)
  const quote = useRef(null)

  useEffect(() => {
    const el = quote.current
    if (!el) return

    // quebra a frase em palavras
    const text = el.textContent
    el.textContent = ''
    text.split(/(\s+)/).forEach((chunk) => {
      if (/^\s+$/.test(chunk)) return el.appendChild(document.createTextNode(' '))
      const s = document.createElement('span')
      s.textContent = chunk
      s.className = 'mfw inline-block'
      el.appendChild(s)
    })

    if (prefersReduced()) {
      gsap.set(el.querySelectorAll('.mfw'), { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -12, scale: 1.14 },
        {
          yPercent: 12,
          scale: 1.14,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        }
      )
      // so opacidade: animar blur por palavra, preso ao scroll, obrigava o
      // navegador a redesenhar cada palavra em todo frame.
      gsap.fromTo(
        el.querySelectorAll('.mfw'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: 'top 66%', end: 'center 44%', scrub: 0.8 },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          ref={img}
          src="/img/lobby-escuro.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink-950)_0%,rgba(7,9,15,0.62)_38%,rgba(7,9,15,0.72)_62%,var(--color-ink-950)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 py-32 lg:px-10 lg:py-44">
        <div className="mx-auto max-w-[24ch] text-center">
          <Eyebrow className="justify-center">Nossa missão</Eyebrow>
          <blockquote
            ref={quote}
            className="mt-9 font-display text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.25] font-light text-balance text-bone-50"
          >
            Administrar e comercializar propriedades de maneira personalizada e sólida,
            gerando valorização e rentabilidade ao patrimônio de nossos clientes.
          </blockquote>
          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>
      </div>
    </section>
  )
}
