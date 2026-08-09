import { Reveal, GoldRule } from '../components/ui'
import { CONTACT, SERVICES } from '../data/content'

const ICONS = {
  instagram:
    'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13-.67-.66-1.34-1.08-2.13-1.38-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0',
  facebook:
    'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07',
  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13m1.78 13.02H3.55V9h3.57v11.45M22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0',
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/8 pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0"><GoldRule /></div>

      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        {/* App */}
        <Reveal>
          <div className="mb-20 flex flex-col items-center justify-between gap-8 rounded-2xl border border-white/8 bg-ink-900/45 p-9 md:flex-row lg:p-12">
            <div className="max-w-[46ch] text-center md:text-left">
              <div className="text-[11px] uppercase tracking-[0.2em] text-gold-300/85">
                Área exclusiva
              </div>
              <h3 className="mt-4 font-display text-[1.9rem] leading-tight font-light text-bone-50">
                Seu condomínio no bolso.
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-bone-100/52">
                Boletos, documentos, reservas de espaços e comunicados — tudo pelo aplicativo
                ou pelo portal do cliente, a qualquer hora.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              {[
                ['App Store', CONTACT.apps.ios],
                ['Google Play', CONTACT.apps.android],
                ['Portal web', CONTACT.portal],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap rounded-full border border-white/14 px-6 py-3 text-center text-[14px] text-bone-100/80 transition-all duration-400 hover:border-gold-400/45 hover:bg-gold-400/[0.07] hover:text-gold-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Mapa do site */}
        <div className="grid gap-12 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-display text-2xl font-light text-bone-50">
              Mario<span className="text-gold-400"> Dal Maso</span>
            </div>
            <p className="mt-4 max-w-[34ch] text-[14.5px] leading-relaxed text-bone-100/45">
              Administração de condomínios, patrimônios e comercialização integrada em São Paulo
              desde 1960.
            </p>
            <div className="mt-7 flex gap-3">
              {Object.entries(CONTACT.social).map(([k, href]) => (
                <a
                  key={k}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={k}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-bone-100/55 transition-all duration-400 hover:border-gold-400/45 hover:text-gold-300"
                >
                  <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor">
                    <path d={ICONS[k]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[10.5px] uppercase tracking-[0.2em] text-bone-100/35">Serviços</div>
            <ul className="mt-5 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a href="#servicos" className="text-[14.5px] text-bone-100/60 transition-colors hover:text-gold-300">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-[10.5px] uppercase tracking-[0.2em] text-bone-100/35">Institucional</div>
            <ul className="mt-5 space-y-2.5">
              {[
                ['A empresa', '#empresa'],
                ['Diferenciais', '#diferenciais'],
                ['Certificações', '#certificacoes'],
                ['Contato', '#contato'],
              ].map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="text-[14.5px] text-bone-100/60 transition-colors hover:text-gold-300">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[10.5px] uppercase tracking-[0.2em] text-bone-100/35">Contato</div>
            <ul className="mt-5 space-y-3.5 text-[14.5px] text-bone-100/60">
              <li><a href={CONTACT.phoneHref} className="transition-colors hover:text-gold-300">{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="break-all transition-colors hover:text-gold-300">{CONTACT.email}</a></li>
              <li className="leading-relaxed text-bone-100/45">
                {CONTACT.address}<br />{CONTACT.city}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-8 text-[12.5px] text-bone-100/32 sm:flex-row">
          <div>© {year} Mario Dal Maso. Todos os direitos reservados.</div>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-bone-100/60">Política de Privacidade</a>
            <a href="#" className="transition-colors hover:text-bone-100/60">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
