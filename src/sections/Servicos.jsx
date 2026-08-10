import { Eyebrow, Reveal, SplitText, SpotlightCard, Stagger } from '../components/ui'
import { Tilt3D, DotGrid } from '../components/fx'
import { SERVICES } from '../data/content'

function Check() {
  return (
    <svg viewBox="0 0 14 14" className="mt-[6px] h-3 w-3 shrink-0 text-gold-400" fill="none">
      <path d="M2 7.4L5.2 10.5L12 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Servicos() {
  const [featured, ...rest] = SERVICES

  return (
    <section id="servicos" className="relative border-t border-white/6 py-28 lg:py-40">
      {/* fundo: malha de pontos reativa + brilho que flutua */}
      <DotGrid className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px gold-line opacity-30" />
      {/* brilho parado: mover/escalar um elemento com blur de 120px obriga o
          navegador a refazer o desfoque em todo frame, o tempo todo */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gold-400/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal><Eyebrow>O que fazemos</Eyebrow></Reveal>
            <SplitText
              as="h2"
              className="mt-7 max-w-[15ch] font-display text-[clamp(2.1rem,4.6vw,3.7rem)] leading-[1.04] font-light tracking-[-0.025em] text-bone-50"
            >
              Cinco frentes, uma só gestão.
            </SplitText>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[38ch] text-[15.5px] leading-relaxed text-bone-100/50">
              Cada empreendimento tem um perfil específico — e por isso nenhuma solução aqui
              é de prateleira.
            </p>
          </Reveal>
        </div>

        {/* Serviço principal */}
        <Reveal className="mt-16" y={34}>
          <SpotlightCard className="p-9 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-4">
                  <span className="font-display text-[13px] tabular-nums text-gold-400/70">{featured.n}</span>
                  <span className="h-px w-10 bg-gold-400/40" />
                  <span className="rounded-full border border-gold-400/25 bg-gold-400/[0.07] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-300">
                    Principal
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.1] font-light text-bone-50">
                  {featured.title}
                </h3>
                <p className="mt-6 text-pretty text-[15.5px] leading-[1.7] text-bone-100/58">
                  {featured.lead}
                </p>
              </div>

              <div className="lg:col-span-7">
                <ul className="grid gap-x-9 gap-y-3.5 sm:grid-cols-2">
                  {featured.items.map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <Check />
                      <span className="text-[14.5px] leading-snug text-bone-100/70">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Demais serviços */}
        <Stagger className="mt-6 grid gap-6 lg:grid-cols-2" each={0.1}>
          {rest.slice(0, 2).map((s) => (
            <Tilt3D key={s.id} max={5} className="h-full">
              <SpotlightCard className="h-full p-9">
                <div className="flex items-center gap-4">
                  <span className="font-display text-[13px] tabular-nums text-gold-400/70">{s.n}</span>
                  <span className="h-px w-10 bg-gold-400/40 transition-all duration-500 group-hover:w-16" />
                </div>
                <h3 className="mt-5 text-pretty font-display text-2xl leading-[1.25] font-light text-bone-50">
                  {s.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.7] text-bone-100/55">{s.lead}</p>
                {s.items.length > 0 && (
                  <ul className="mt-7 space-y-3 border-t border-white/8 pt-6">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-3">
                        <Check />
                        <span className="text-[14px] leading-snug text-bone-100/62">{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </SpotlightCard>
            </Tilt3D>
          ))}
        </Stagger>

        <Stagger className="mt-6 grid gap-6 lg:grid-cols-2" each={0.1}>
          {rest.slice(2).map((s) => (
            <SpotlightCard key={s.id} className="flex items-center gap-7 p-8">
              <span className="font-display text-[13px] tabular-nums text-gold-400/70">{s.n}</span>
              <div>
                <h3 className="font-display text-xl font-light text-bone-50">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-bone-100/52">{s.lead}</p>
              </div>
            </SpotlightCard>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
