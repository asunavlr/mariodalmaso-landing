import { useEffect, useRef } from 'react'
import { Eyebrow, Reveal, SplitText, Stagger } from '../components/ui'
import { gsap, prefersReduced } from '../lib/anim'
import { ADVANTAGES, CERTIFICATIONS, ENTIDADES } from '../data/content'

/* Faixa de entidades correndo em loop */
function EntityStrip() {
  return (
    <div className="group relative overflow-hidden py-2">
      <div
        className="flex w-max items-center gap-16 group-hover:[animation-play-state:paused]"
        style={{ animation: 'mdm-strip 34s linear infinite' }}
      >
        {[0, 1].map((d) => (
          <div key={d} className="flex shrink-0 items-center gap-16" aria-hidden={d === 1}>
            {ENTIDADES.map((e) => (
              <span
                key={e}
                className="whitespace-nowrap font-display text-xl font-light text-bone-100/28 transition-colors duration-500 hover:text-gold-300"
              >
                {e}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink-950 to-transparent" />
      <style>{`@keyframes mdm-strip { to { transform: translateX(calc(-50% - 2rem)); } }`}</style>
    </div>
  )
}

export default function Diferenciais() {
  const root = useRef(null)

  // linha vertical que "cresce" conforme o scroll da lista
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dif-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: { trigger: '.dif-list', start: 'top 72%', end: 'bottom 78%', scrub: 0.7 },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="diferenciais" className="relative overflow-hidden border-t border-white/6 py-28 lg:py-40">
      {/* vista aerea no crepusculo, bem apagada, so para dar textura */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%]">
        <img
          src="/img/aerea-crepusculo.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top opacity-[0.13]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal><Eyebrow>Por que a Mario Dal Maso</Eyebrow></Reveal>
        <SplitText
          as="h2"
          className="mt-7 max-w-[18ch] font-display text-[clamp(2.1rem,4.6vw,3.7rem)] leading-[1.04] font-light tracking-[-0.025em] text-bone-50"
        >
          O que muda quando a gestão é de verdade.
        </SplitText>

        {/* Lista de diferenciais com trilho */}
        <div className="dif-list relative mt-16 pl-8 lg:pl-14">
          <div className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-white/8" />
          <div className="dif-line absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gold-300 via-gold-400 to-transparent" />

          <Stagger className="grid gap-x-14 gap-y-11 md:grid-cols-2" each={0.08}>
            {ADVANTAGES.map((a, i) => (
              <div key={a.title} className="group relative">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[12px] tabular-nums text-gold-400/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-[1.35rem] leading-snug font-light text-bone-50 transition-colors duration-400 group-hover:text-gold-200">
                    {a.title}
                  </h3>
                </div>
                <p className="mt-3 pl-8 text-[15px] leading-[1.7] text-bone-100/52">{a.body}</p>
              </div>
            ))}
          </Stagger>
        </div>

        {/* Certificações */}
        <div id="certificacoes" className="mt-28 scroll-mt-28">
          <Reveal><Eyebrow>Certificações</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[58ch] text-[16.5px] leading-[1.7] text-bone-100/55">
              O profissionalismo e a ética da casa são comprovados por selos conquistados ao longo
              da história — e reforçados pela associação às principais entidades do setor.
            </p>
          </Reveal>

          <Stagger className="mt-11 grid gap-6 md:grid-cols-3" each={0.1}>
            {CERTIFICATIONS.map((c) => (
              <div
                key={c.sigla}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-ink-900/40 p-8 transition-all duration-500 hover:border-gold-400/30 hover:bg-ink-900/70"
              >
                <div className="absolute -right-6 -top-8 font-display text-[6rem] leading-none text-white/[0.025] transition-all duration-700 group-hover:text-gold-400/[0.07]">
                  {c.sigla}
                </div>
                <div className="relative">
                  <div className="font-display text-2xl font-light text-gold-300">{c.sigla}</div>
                  <div className="mt-2 text-[13.5px] leading-snug text-bone-50">{c.nome}</div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-[0.15em] text-bone-100/35">
                    {c.orgao}
                  </div>
                  <p className="mt-5 border-t border-white/8 pt-5 text-[13.5px] leading-relaxed text-bone-100/48">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </Stagger>

          <Reveal className="mt-14" blur={false}>
            <div className="text-center text-[11px] uppercase tracking-[0.2em] text-bone-100/28">
              Associada a
            </div>
            <div className="mt-6"><EntityStrip /></div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
