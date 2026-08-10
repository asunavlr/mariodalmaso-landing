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
 * Vigia os quadros enquanto a pagina rola. A medicao so acontece durante a
 * rolagem, que e quando o engasgo aparece, e continua valendo a sessao toda —
 * nao so nos primeiros segundos.
 *
 * Regra: quadro acima de 24ms conta como engasgo. Se em 60 quadros medidos
 * mais de 40% engasgarem, liga o modo leve.
 */
function watchFrames() {
  let slow = 0
  let total = 0
  let last = 0
  let raf = 0
  let idleTimer = 0

  const tick = (t) => {
    if (lite) return
    if (last) {
      const dt = t - last
      total++
      if (dt > 24) slow++
      if (total >= 60) {
        if (slow / total > 0.4) { enable(); return }
        slow = 0
        total = 0
      }
    }
    last = t
    raf = requestAnimationFrame(tick)
  }

  const onScroll = () => {
    if (lite) return
    if (!raf) { last = 0; raf = requestAnimationFrame(tick) }
    clearTimeout(idleTimer)
    // parou de rolar: encerra a medicao ate a proxima
    idleTimer = setTimeout(() => {
      cancelAnimationFrame(raf)
      raf = 0
      slow = 0
      total = 0
    }, 400)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
}

if (typeof window !== 'undefined') {
  const forced = new URLSearchParams(window.location.search).get('lite')

  // ?lite=1 liga na marra e fica gravado no navegador; ?lite=0 desfaz.
  // Serve para testar numa maquina especifica sem depender da deteccao.
  let saved = null
  try {
    if (forced === '1') localStorage.setItem('mdm-lite', '1')
    if (forced === '0') localStorage.removeItem('mdm-lite')
    saved = localStorage.getItem('mdm-lite')
  } catch { /* navegador sem armazenamento: segue so pela deteccao */ }

  if (forced === '1' || saved === '1' || weakByHardware()) enable()
  else watchFrames()
}

export const isLite = () => lite

/** Le o modo leve dentro de um componente e re-renderiza quando ele liga. */
export function useLite() {
  return useSyncExternalStore(subscribe, isLite, () => false)
}
