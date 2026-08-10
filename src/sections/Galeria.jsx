import { useEffect, useRef } from 'react'
import { Eyebrow, Reveal, SplitText } from '../components/ui'
import { gsap, prefersReduced } from '../lib/anim'

/**
 * Imagem com parallax interno: o <img> e maior que o container e desliza
 * dentro dele conforme o scroll, criando profundidade.
 */
function ParallaxImage({ src, alt, className = '', strength = 16, priority = false }) {
  const box = useRef(null)
  const img = useRef(null)

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -strength },
        {
          yPercent: strength,
          ease: 'none',
          scrollTrigger: { trigger: box.current, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        }
      )
    }, box)
    return () => ctx.revert()
  }, [strength])

  return (
    <div ref={box} className={`relative overflow-hidden rounded-2xl bg-ink-900 ${className}`}>
      <img
        ref={img}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-[132%] w-full object-cover"
        style={{ marginTop: '-16%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/75 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </div>
  )
}

const SHOTS = [
  {
    src: '/img/torres-vidro.webp',
    alt: 'Torres de vidro vistas de baixo contra o céu',
    caption: 'Comerciais',
    text: 'Lajes corporativas e torres de escritório',
  },
  {
    src: '/img/fachada-residencial.webp',
    alt: 'Fachada de edifício residencial contemporâneo',
    caption: 'Residenciais',
    text: 'Condomínios verticais e horizontais',
  },
  {
    src: '/img/fachada-geometrica.webp',
    alt: 'Fachada de concreto com padrão geométrico',
    caption: 'Industriais',
    text: 'Galpões, centros logísticos e plantas',
  },
]

export default function Galeria() {
  return (
    <section className="relative border-t border-white/6 py-28 lg:py-36">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal><Eyebrow>Onde atuamos</Eyebrow></Reveal>
            <SplitText
              as="h2"
              className="mt-7 max-w-[17ch] font-display text-[clamp(2.1rem,4.6vw,3.7rem)] leading-[1.04] font-light tracking-[-0.025em] text-bone-50"
            >
              Todo tipo de patrimônio.
            </SplitText>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[40ch] text-[15.5px] leading-relaxed text-bone-100/50">
              Da torre comercial na Paulista ao galpão na marginal — a gestão muda de
              forma conforme o ativo, não o contrário.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {SHOTS.map((s, i) => (
            <Reveal key={s.src} delay={i * 0.1} y={30}>
              <div className="group relative">
                <ParallaxImage
                  src={s.src}
                  alt={s.alt}
                  priority={i === 0}
                  className="aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.015]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-7">
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-gold-300">
                    {s.caption}
                  </div>
                  <div className="mt-2 font-display text-[1.25rem] leading-snug font-light text-bone-50">
                    {s.text}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export { ParallaxImage }
