import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE = 'power3.out'
export const EASE_EXPO = 'expo.out'

export const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Quebra o texto de um elemento em spans por palavra e por caractere,
 * preservando a quebra de linha natural. Substitui o plugin SplitText
 * (que e do Club GSAP) por uma implementacao propria.
 */
export function splitChars(el) {
  const text = el.textContent
  el.textContent = ''
  el.setAttribute('aria-label', text)

  const chars = []
  text.split(/(\s+)/).forEach((chunk) => {
    if (/^\s+$/.test(chunk)) {
      el.appendChild(document.createTextNode(' '))
      return
    }
    const word = document.createElement('span')
    word.style.display = 'inline-block'
    word.style.whiteSpace = 'nowrap'
    word.setAttribute('aria-hidden', 'true')

    for (const ch of chunk) {
      // Sem overflow:hidden por caractere. Fontes serifadas em italico
      // (Fraunces) tem glifos que ultrapassam a largura de avanco, e a
      // mascara por letra cortava as bordas. A entrada e feita so com
      // opacidade + deslocamento, sem clipping.
      const span = document.createElement('span')
      span.style.display = 'inline-block'
      span.style.willChange = 'transform, opacity'
      span.textContent = ch
      word.appendChild(span)
      chars.push(span)
    }
    el.appendChild(word)
  })
  return chars
}

/** Espera as webfonts antes de medir/animar texto (evita reflow feio). */
export function whenFontsReady(cb) {
  if (typeof document === 'undefined') return
  if (document.fonts?.status === 'loaded') cb()
  else document.fonts?.ready.then(cb) ?? cb()
}

export { gsap, ScrollTrigger }
