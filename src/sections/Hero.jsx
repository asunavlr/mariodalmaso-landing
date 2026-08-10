import { useEffect, useRef } from 'react'
import Aurora from '../components/Aurora'
import { Magnetic } from '../components/ui'
import { gsap, splitChars, whenFontsReady, prefersReduced } from '../lib/anim'
import { CONTACT } from '../data/content'

export default function Hero() {
  const root = useRef(null)
  const l1 = useRef(null)
  const l2 = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReduced()) {
        gsap.set('.hero-anim, .hero-line', { opacity: 1, y: 0 })
        return
      }

      whenFontsReady(() => {
        const c1 = l1.current ? splitChars(l1.current) : []
        const c2 = l2.current ? splitChars(l2.current) : []
        gsap.set([l1.current, l2.current], { opacity: 1 })

        const charIn = {
          opacity: 0,
          y: '0.55em',
          rotateX: -60,
          transformOrigin: '50% 100%',
          duration: 1.3,
          stagger: 0.016,
        }

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 1 }, 0.15)
          .from(c1, charIn, 0.28)
          .from(c2, charIn, 0.42)
          .from('.hero-lead', { opacity: 0, y: 22, duration: 1.1 }, 0.78)
          .from('.hero-cta', { opacity: 0, y: 18, duration: 1, stagger: 0.09 }, 0.92)
          .from('.hero-stat', { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, 1.05)
          .from('.hero-scroll', { opacity: 0, duration: 1 }, 1.4)
      })

      // parallax suave do conteudo ao rolar
      gsap.to('.hero-inner', {
        yPercent: 8,
        opacity: 0.72,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })

      // a foto de fundo se move mais devagar que o conteudo (profundidade)
      gsap.to('.hero-bg', {
        yPercent: 14,
        scale: 1.18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="top" className="noise relative min-h-[100svh] overflow-hidden">
      {/* Foto de fundo: skyline de Sao Paulo em luz de cobre */}
      <div className="absolute inset-0">
        <img
          src="/img/sp-skyline-cobre.webp"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="hero-bg h-full w-full scale-110 object-cover object-center opacity-45"
        />
        {/* sem mix-blend: o modo de mesclagem forcava o navegador a recompor a
            tela inteira a cada frame do parallax */}
        <div className="absolute inset-0 bg-ink-950/50" />
      </div>

      {/* Aurora por cima da foto, mascarada por um gradiente — senao a borda
          organica dela desenha um "blob" escuro no meio do hero. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 34%, transparent 72%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 34%, transparent 72%)',
        }}
      >
        <Aurora
          className="absolute inset-0 opacity-40"
          colorStops={['#8a6a34', '#d4af6a', '#c39a52']}
          amplitude={0.85}
          blend={0.75}
        />
      </div>

      {/* scrim: escurece a esquerda para o texto ter contraste */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,9,15,0.90)_0%,rgba(7,9,15,0.66)_46%,rgba(7,9,15,0.34)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="hero-inner relative mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-center px-6 pt-32 pb-20 lg:px-10">
        <span className="hero-eyebrow inline-flex w-fit items-center gap-2.5 rounded-full border border-gold-400/25 bg-gold-400/[0.06] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-gold-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
          </span>
          65 anos em São Paulo
        </span>

        <h1
          className="mt-7 max-w-[19ch] font-display text-[clamp(2.7rem,7vw,5.8rem)] leading-[1.02] font-light tracking-[-0.03em] text-bone-50"
          style={{ perspective: '900px' }}
        >
          <span ref={l1} className="block opacity-0">Administramos</span>
          <span ref={l2} className="block pr-[0.14em] opacity-0 italic text-gold-300">
            patrimônios.
          </span>
        </h1>

        <p className="hero-lead mt-7 max-w-[54ch] text-pretty text-[16.5px] leading-[1.65] text-bone-100/78 lg:text-[18px]">
          Condomínios, imóveis e carteiras de locação sob uma gestão personalizada —
          a mesma que, desde 1960, faz da Mario Dal Maso uma
          <em className="not-italic text-bone-50"> boutique imobiliária</em> em Moema.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Magnetic className="hero-cta">
            <a
              href="#contato"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold-400 px-8 py-4 text-[15px] font-medium text-ink-950 transition-shadow duration-500 hover:shadow-[0_0_46px_-8px] hover:shadow-gold-400/70"
            >
              <span className="relative z-10">Solicitar proposta</span>
              <svg className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
                <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full" />
            </a>
          </Magnetic>

          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hero-cta inline-flex items-center gap-2.5 rounded-full border border-white/14 px-7 py-4 text-[15px] text-bone-100/85 transition-all duration-400 hover:border-gold-400/45 hover:bg-white/[0.04] hover:text-bone-50"
          >
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.02a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.79 9.79 0 0 1-1.5-5.23c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.03 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.8-9.8 9.8M20.52 3.45A11.7 11.7 0 0 0 12.05 0C5.6 0 .35 5.25.35 11.7c0 2.06.54 4.08 1.56 5.85L.25 24l6.6-1.73a11.66 11.66 0 0 0 5.2 1.24h.01c6.45 0 11.7-5.25 11.7-11.7 0-3.13-1.22-6.06-3.43-8.27" />
            </svg>
            Falar no WhatsApp
          </a>
        </div>

        {/* metricas rapidas */}
        <div className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
          {[
            ['65', 'anos de história'],
            ['12', 'áreas especializadas'],
            ['24h', 'para repasse'],
            ['3', 'certificações do setor'],
          ].map(([v, l]) => (
            <div key={l} className="hero-stat">
              <div className="font-display text-3xl font-light text-gold-300">{v}</div>
              <div className="mt-1.5 text-[12.5px] leading-snug text-bone-100/50">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#empresa"
        className="hero-scroll absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 text-[10px] uppercase tracking-[0.24em] text-bone-100/35 transition-colors hover:text-gold-300 lg:flex"
      >
        Role
        <span className="relative h-11 w-px overflow-hidden bg-white/12">
          <span className="absolute inset-x-0 top-0 h-1/3 animate-[mdm-scroll_2.1s_ease-in-out_infinite] bg-gold-400" />
        </span>
      </a>
      <style>{`@keyframes mdm-scroll { 0%{transform:translateY(-100%)} 60%,100%{transform:translateY(340%)} }`}</style>
    </section>
  )
}
