import { Eyebrow, Reveal, SplitText, Stagger, Magnetic, SpotlightCard } from '../components/ui'
import { CONTACT, DIRETORIA } from '../data/content'

function Field({ label, type = 'text', name, required, options, rows }) {
  const base =
    'peer w-full border-b border-white/12 bg-transparent pb-3 pt-6 text-[15px] text-bone-50 outline-none transition-colors duration-300 placeholder-transparent focus:border-gold-400'
  return (
    <div className="relative">
      {options ? (
        <select name={name} required={required} defaultValue="" className={`${base} appearance-none`}>
          <option value="" disabled />
          {options.map((o) => (
            <option key={o} value={o} className="bg-ink-900 text-bone-50">{o}</option>
          ))}
        </select>
      ) : rows ? (
        <textarea name={name} rows={rows} required={required} placeholder={label} className={`${base} resize-none`} />
      ) : (
        <input type={type} name={name} required={required} placeholder={label} className={base} />
      )}
      <label className="pointer-events-none absolute left-0 top-0 text-[11px] uppercase tracking-[0.14em] text-bone-100/40 transition-colors peer-focus:text-gold-300">
        {label}{required && <span className="text-gold-400"> *</span>}
      </label>
      {options && (
        <svg className="pointer-events-none absolute right-1 top-7 h-3.5 w-3.5 text-bone-100/40" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}

export default function Contato() {
  return (
    <section id="contato" className="relative border-t border-white/6 py-28 lg:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/[0.05] blur-[130px]" />

      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        {/* Diretoria */}
        <div className="mb-28">
          <Reveal><Eyebrow>Diretoria</Eyebrow></Reveal>
          <Stagger className="mt-10 grid gap-6 lg:grid-cols-2" each={0.12}>
            {DIRETORIA.map((d) => (
              <SpotlightCard key={d.nome} className="p-9">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/[0.07] font-display text-lg text-gold-300">
                    {d.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-light text-bone-50">{d.nome}</h3>
                    <div className="mt-1 text-[12px] uppercase tracking-[0.13em] text-gold-300/80">
                      {d.cargo}
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-[14.5px] leading-[1.7] text-bone-100/52">{d.bio}</p>
              </SpotlightCard>
            ))}
          </Stagger>
        </div>

        {/* Contato */}
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal><Eyebrow>Fale conosco</Eyebrow></Reveal>
            <SplitText
              as="h2"
              className="mt-7 font-display text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.04] font-light tracking-[-0.025em] text-bone-50"
            >
              Vamos cuidar do seu patrimônio.
            </SplitText>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[42ch] text-[16px] leading-[1.7] text-bone-100/55">
                Conte o que você precisa — condomínio, locação ou administração de bens.
                Retornamos com uma proposta personalizada.
              </p>
            </Reveal>

            <Stagger className="mt-11 space-y-6" each={0.08}>
              {[
                ['Telefone', CONTACT.phone, CONTACT.phoneHref],
                ['E-mail', CONTACT.email, `mailto:${CONTACT.email}`],
                ['Endereço', `${CONTACT.address}\n${CONTACT.city}`, CONTACT.maps],
              ].map(([label, value, href]) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'Endereço' ? '_blank' : undefined}
                  rel="noreferrer"
                  className="group block border-b border-white/8 pb-5"
                >
                  <div className="text-[10.5px] uppercase tracking-[0.2em] text-bone-100/35">{label}</div>
                  <div className="mt-2 whitespace-pre-line text-[16px] leading-snug text-bone-100/85 transition-colors duration-300 group-hover:text-gold-300">
                    {value}
                  </div>
                </a>
              ))}
            </Stagger>

            <Reveal delay={0.2} className="mt-9">
              <Magnetic strength={0.22}>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-gold-400/30 bg-gold-400/[0.07] px-6 py-3.5 text-[14.5px] text-gold-200 transition-all duration-400 hover:bg-gold-400 hover:text-ink-950"
                >
                  Atendimento imediato no WhatsApp
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Magnetic>
            </Reveal>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-7">
            <Reveal y={30}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const f = new FormData(e.currentTarget)
                  const msg = `Olá! Meu nome é ${f.get('nome')}.%0A%0AInteresse: ${f.get('interesse')}%0AE-mail: ${f.get('email')}%0ATelefone: ${f.get('telefone')}%0A%0A${f.get('mensagem') || ''}`
                  window.open(`${CONTACT.whatsapp.split('?')[0]}?text=${msg}`, '_blank')
                }}
                className="rounded-2xl border border-white/8 bg-ink-900/45 p-8 lg:p-11"
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Nome" name="nome" required />
                  <Field label="Telefone" name="telefone" type="tel" required />
                </div>
                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <Field label="E-mail" name="email" type="email" required />
                  <Field
                    label="Interesse"
                    name="interesse"
                    required
                    options={[
                      'Administração de condomínio',
                      'Administração de patrimônio',
                      'Gestão integrada de comercialização',
                      'Aluguel garantido',
                      'Seguro incêndio conteúdo',
                      'Outro assunto',
                    ]}
                  />
                </div>
                <div className="mt-8">
                  <Field label="Mensagem" name="mensagem" rows={4} />
                </div>

                <button
                  type="submit"
                  className="group relative mt-10 w-full overflow-hidden rounded-full bg-gold-400 py-4 text-[15px] font-medium text-ink-950 transition-shadow duration-500 hover:shadow-[0_0_44px_-8px] hover:shadow-gold-400/70"
                >
                  <span className="relative z-10">Enviar solicitação</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full" />
                </button>
                <p className="mt-4 text-center text-[12px] text-bone-100/32">
                  Ao enviar, você será direcionado ao nosso WhatsApp com os dados preenchidos.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
