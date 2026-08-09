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
      const outer = document.createElement('span')
      outer.style.display = 'inline-block'
      outer.style.overflow = 'hidden'
      outer.style.verticalAlign = 'top'
      // Folga para acentos (ô, ã) e descendentes (p, g, ç) nao serem cortados
      // pelo overflow. O espaco extra e devolvido com margens negativas.
      outer.style.paddingTop = '0.18em'
      outer.style.marginTop = '-0.18em'
      outer.style.paddingBottom = '0.22em'
      outer.style.marginBottom = '-0.22em'

      const inner = document.createElement('span')
      inner.style.display = 'inline-block'
      inner.textContent = ch

      outer.appendChild(inner)
      word.appendChild(outer)
      chars.push(inner)
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
