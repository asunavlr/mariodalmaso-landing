import { useEffect, useState } from 'react'
import { NAV, CONTACT } from '../data/content'

function Logo({ className = '' }) {
  return (
    <a href="#top" className={`group flex items-baseline gap-2.5 ${className}`} aria-label="Mario Dal Maso — início">
      <span className="font-display text-[22px] leading-none font-medium tracking-tight text-bone-50">
        Mario<span className="text-gold-400"> Dal Maso</span>
      </span>
      <span className="hidden h-3.5 w-px bg-white/20 sm:block" />
      <span className="hidden text-[10px] uppercase tracking-[0.2em] text-bone-100/45 sm:block">
        desde 1965
      </span>
    </a>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-white/8 py-3.5' : 'py-6'
        }`}
      >
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 lg:px-10">
          <Logo />

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Principal">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-[13.5px] text-bone-100/70 transition-colors hover:text-bone-50"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-400 transition-all duration-400 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={CONTACT.portal}
              target="_blank"
              rel="noreferrer"
              className="hidden text-[13px] text-bone-100/60 transition-colors hover:text-gold-300 md:block"
            >
              Área do cliente
            </a>
            <a
              href="#contato"
              className="hidden rounded-full bg-gold-400 px-5 py-2.5 text-[13px] font-medium text-ink-950 transition-all duration-300 hover:bg-gold-300 hover:shadow-[0_0_28px_-6px] hover:shadow-gold-400/60 sm:block"
            >
              Solicitar proposta
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
            >
              <span className={`h-px w-5 bg-bone-50 transition-all duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`h-px w-5 bg-bone-50 transition-all duration-300 ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 z-40 bg-ink-950/97 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex h-full flex-col justify-center gap-1 px-9">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/8 py-5 font-display text-3xl text-bone-50 transition-all duration-500"
              style={{
                transform: open ? 'translateY(0)' : 'translateY(18px)',
                opacity: open ? 1 : 0,
                transitionDelay: `${i * 60 + 90}ms`,
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-9 rounded-full bg-gold-400 py-4 text-center font-medium text-ink-950"
          >
            Solicitar proposta
          </a>
        </nav>
      </div>
    </>
  )
}
