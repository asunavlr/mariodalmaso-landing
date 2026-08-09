import { useEffect, useRef } from 'react'
import { Eyebrow, Reveal, SplitText, CountUp, Stagger } from '../components/ui'
import { gsap, prefersReduced } from '../lib/anim'
import { AREAS, VALUES, STATS } from '../data/content'

/* Paragrafo que revela palavra a palavra conforme o scroll */
function ScrollReveal({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const text = el.textContent
    el.textContent = ''
    text.split(/(\s+)/).forEach((chunk) => {
      if (/^\s+$/.test(chunk)) return el.appendChild(document.createTextNode(' '))
      const s = document.createElement('span')
      s.textContent = chunk
      s.className = 'srw inline-block'
      el.appendChild(s)
    })

    if (prefersReduced()) {
      gsap.set(el.querySelectorAll('.srw'), { opacity: 1, filter: 'none' })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.srw'),
        { opacity: 0.12, filter: 'blur(5px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 58%', scrub: 0.8 },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return <p ref={ref} className={className} />
}

export default function Empresa() {
  return (
    <section id="empresa" className="relative border-t border-white/6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal><Eyebrow>A empresa</Eyebrow></Reveal>

        <div className="mt-9 grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SplitText
              as="h2"
              className="max-w-[16ch] font-display text-[clamp(2.1rem,4.6vw,3.7rem)] leading-[1.04] font-light tracking-[-0.025em] text-bone-50"
            >
              Sessenta e cinco anos construindo confiança.
            </SplitText>

            <ScrollReveal className="mt-9 max-w-[62ch] text-pretty text-[17px] leading-[1.75] text-bone-100/60">
              Especialista em soluções imobiliárias personalizadas, a Mario Dal Maso administra
              condomínios, imóveis e patrimônios comerciais, residenciais e industriais — sempre
              conforme a legislação e com assessoria completa ao síndico, ao conselho fiscal e
              aos moradores.
            </ScrollReveal>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[62ch] text-[16.5px] leading-[1.75] text-bone-100/45">
                Com atendimento proativo, personalizado e criativo, essas áreas se transformam
                numa verdadeira boutique imobiliária. Cerca de 60 colaboradores compõem a
                inteligência imobiliária da casa, divididos em 12 áreas.
              </p>
            </Reveal>
          </div>

          {/* Áreas */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="rounded-2xl border border-white/8 bg-ink-900/40 p-8">
                <div className="text-[11px] uppercase tracking-[0.2em] text-gold-300/80">
                  12 áreas especializadas
                </div>
                <ul className="mt-6 space-y-0">
                  {AREAS.map((a, i) => (
                    <li
                      key={a}
                      className="flex items-baseline gap-3.5 border-b border-white/6 py-2.5 last:border-0"
                    >
                      <span className="font-display text-[11px] tabular-nums text-gold-400/50">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[14.5px] text-bone-100/72">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Números */}
        <Stagger className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-900/70">
              <div className="font-display text-[2.9rem] leading-none font-light text-bone-50">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-[13px] font-medium uppercase tracking-[0.14em] text-gold-300/90">
                {s.label}
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-bone-100/40">{s.sub}</p>
            </div>
          ))}
        </Stagger>

        {/* Valores */}
        <div className="mt-24">
          <Reveal><Eyebrow>Princípios e valores</Eyebrow></Reveal>
          <Stagger className="mt-9 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4" each={0.06}>
            {VALUES.map(([t, d]) => (
              <div key={t} className="border-t border-white/10 pt-5">
                <div className="font-display text-lg text-bone-50">{t}</div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-bone-100/45">{d}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
