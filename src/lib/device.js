import { useSyncExternalStore } from 'react'

/**
 * Modo leve.
 *
 * A pagina tem varios enfeites que custam frame: rolagem suavizada por JS,
 * aurora em WebGL, cursor proprio, malha de pontos no canvas, faixas de texto
 * em loop e desfoque na barra fixa. Em maquina boa isso passa despercebido;
 * em maquina fraca a pagina engasga.
 *
 * Aqui a gente decide de duas formas:
 *   1. pelo que o navegador conta de si (nucleos, memoria, economia de dados,
 *      preferencia por menos movimento);
 *   2. medindo os quadros nos primeiros segundos — se estiver engasgando de
 *      fato, liga o modo leve mesmo que a maquina se declare boa.
 *
 * A decisao so vai num sentido: uma vez leve, continua leve ate recarregar.
 */

let lite = false
const listeners = new Set()

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function enable() {
  if (lite) return
  lite = true
  document.documentElement.dataset.lite = '1'
  for (const fn of listeners) fn()
}

function weakByHardware() {
  const nav = navigator
  if (nav.connection?.saveData) return true
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return true
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  return false
}

/**
 * Conta quadros por ~2,5s. Se mais da metade demorou acima de 22ms (menos de
 * ~45 quadros por segundo), a maquina nao esta dando conta.
 */
function probeFrames() {
  let slow = 0
  let total = 0
  let last = 0
  let start = 0

  const tick = (t) => {
    if (!start) { start = t; last = t; requestAnimationFrame(tick); return }
    const dt = t - last
    last = t
    total++
    if (dt > 22) slow++
    if (t - start < 2500) {
      requestAnimationFrame(tick)
      return
    }
    if (total > 20 && slow / total > 0.5) enable()
  }

  requestAnimationFrame(tick)
}

if (typeof window !== 'undefined') {
  if (weakByHardware()) enable()
  else window.addEventListener('load', () => setTimeout(probeFrames, 600), { once: true })
}

export const isLite = () => lite

/** Le o modo leve dentro de um componente e re-renderiza quando ele liga. */
export function useLite() {
  return useSyncExternalStore(subscribe, isLite, () => false)
}
