import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReduced } from './lib/anim'
import { useLite } from './lib/device'
import { CONTACT } from './data/content'

import { Cursor, Intro, ScrollVelocity } from './components/fx'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Empresa from './sections/Empresa'
import Galeria from './sections/Galeria'
import Servicos from './sections/Servicos'
import Manifesto from './sections/Manifesto'
import Diferenciais from './sections/Diferenciais'
import Contato from './sections/Contato'
import Footer from './sections/Footer'

/* Faixa de texto que acelera conforme o scroll */
function VelocityBand() {
  return (
    <div className="relative overflow-hidden border-y border-white/8 bg-ink-900/30 py-7">
      <ScrollVelocity
        text="Condomínios · Patrimônios · Locação · Comercialização · Aluguel Garantido"
        className="font-display text-[clamp(1.4rem,3.4vw,2.6rem)] font-light text-bone-100/22"
      />
    </div>
  )
}

/* Barra fina de progresso + WhatsApp flutuante.
   Um unico listener de scroll, agrupado num frame: antes eram dois listeners
   disparando setState (e reflow por causa do scrollHeight) a cada evento. */
function ScrollUI() {
  const bar = useRef(null)
  const fab = useRef(null)

  useEffect(() => {
    let max = 1
    let frame = 0
    let shown = null

    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }

    const apply = () => {
      frame = 0
      const y = window.scrollY
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, y / max)})`

      const show = y > window.innerHeight * 0.75
      if (show !== shown) {
        shown = show
        fab.current?.classList.toggle('translate-y-0', show)
        fab.current?.classList.toggle('opacity-100', show)
        fab.current?.classList.toggle('pointer-events-none', !show)
        fab.current?.classList.toggle('translate-y-6', !show)
        fab.current?.classList.toggle('opacity-0', !show)
      }
    }

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(apply) }
    const onResize = () => { measure(); onScroll() }

    measure()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    ScrollTrigger.addEventListener('refresh', measure)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.removeEventListener('refresh', measure)
    }
  }, [])

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px">
        <div
          ref={bar}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500"
        />
      </div>
      <WhatsFab ref={fab} />
    </>
  )
}

/* WhatsApp flutuante — aparece depois do hero */
function WhatsFab({ ref }) {
  return (
    <a
      ref={ref}
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="group pointer-events-none fixed bottom-6 right-6 z-50 flex translate-y-6 items-center gap-3 rounded-full bg-gold-400 py-3.5 pl-4 pr-5 text-ink-950 opacity-0 shadow-[0_10px_40px_-10px] shadow-gold-400/60 transition-all duration-500 hover:bg-gold-300"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.02a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.79 9.79 0 0 1-1.5-5.23c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.03 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.8-9.8 9.8M20.52 3.45A11.7 11.7 0 0 0 12.05 0C5.6 0 .35 5.25.35 11.7c0 2.06.54 4.08 1.56 5.85L.25 24l6.6-1.73a11.66 11.66 0 0 0 5.2 1.24h.01c6.45 0 11.7-5.25 11.7-11.7 0-3.13-1.22-6.06-3.43-8.27" />
      </svg>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-medium transition-all duration-500 group-hover:max-w-[130px]">
        Fale conosco
      </span>
    </a>
  )
}

export default function App() {
  const lite = useLite()

  useEffect(() => {
    if (prefersReduced()) return
    // Em maquina fraca a rolagem volta a ser a do proprio navegador: e o
    // unico jeito de ela nao depender do JS conseguir entregar o frame.
    // (o ScrollTrigger sozinho ja escuta a rolagem nativa; as ancoras usam o
    // scroll-behavior do CSS)
    if (lite) return

    // Medido: com duration 1.05 a pagina continuava andando ~700ms depois do
    // ultimo giro da roda. E isso que se sente como "pesado" — nao ha quadro
    // perdido. Com lerp a rolagem acompanha a roda de perto e ainda suaviza.
    const lenis = new Lenis({ lerp: 0.25, smoothWheel: true, touchMultiplier: 1.4 })
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // ancoras suaves
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -70, duration: 1.15 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [lite])

  return (
    <>
      <Intro />
      <Cursor />
      <ScrollUI />
      <Nav />
      <main>
        <Hero />
        <VelocityBand />
        <Empresa />
        <Galeria />
        <Servicos />
        <Manifesto />
        <Diferenciais />
        <VelocityBand />
        <Contato />
      </main>
      <Footer />
    </>
  )
}
