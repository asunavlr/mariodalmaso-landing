import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'

const VERT = /* glsl */ `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3  uColorStops[3];
uniform vec2  uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop { vec3 color; float position; };

vec3 rampColor(ColorStop colors[3], float factor) {
  int idx = 0;
  for (int i = 0; i < 2; i++) {
    bool inBetween = colors[i].position <= factor;
    idx = inBetween ? i : idx;
  }
  ColorStop cur = colors[idx];
  ColorStop nxt = colors[idx + 1];
  float range = nxt.position - cur.position;
  float lerpF = (factor - cur.position) / max(range, 0.0001);
  return mix(cur.color, nxt.color, clamp(lerpF, 0.0, 1.0));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampCol = rampColor(colors, uv.x);

  float height = snoise(vec2(uv.x * 2.0, uTime * 0.08)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);

  float intensity = 0.6 * height;
  float midPoint = 0.20;
  float alpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  // desvanecimento vertical feito aqui dentro. Antes era uma mascara CSS por
  // cima do canvas, e mascarar em CSS obriga uma composicao extra da tela
  // inteira a cada quadro desenhado.
  alpha *= smoothstep(0.28, 0.66, uv.y);

  fragColor = vec4(rampCol * alpha, alpha);
}
`

/**
 * Fitas de luz (aurora) em WebGL. Um unico canvas, desmontado ao sair.
 * Baseado no padrao do React Bits (reactbits.dev), adaptado.
 */
export default function Aurora({
  colorStops = ['#a37d3d', '#d4af6a', '#273349'],
  amplitude = 1.0,
  blend = 0.55,
  speed = 0.6,
  className = '',
}) {
  const hostRef = useRef(null)
  const propsRef = useRef({ colorStops, amplitude, blend, speed })
  propsRef.current = { colorStops, amplitude, blend, speed }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // dpr 1 e sem antialias: e um gradiente difuso, mascarado e a 40% de
    // opacidade atras da foto. Medido: a aurora era 25% do JS durante o
    // scroll do hero, entao aqui vale cada corte.
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: 0.5, // metade da resolucao, esticada pelo CSS: e um borrao, nao tem detalhe a perder
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.canvas.style.backgroundColor = 'transparent'
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uBlend: { value: blend },
        uResolution: { value: [host.offsetWidth, host.offsetHeight] },
        uColorStops: { value: colorStops.map((c) => new Color(c)) },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })
    host.appendChild(gl.canvas)

    const resize = () => {
      renderer.setSize(host.offsetWidth, host.offsetHeight)
      program.uniforms.uResolution.value = [host.offsetWidth, host.offsetHeight]
    }
    resize()
    window.addEventListener('resize', resize)

    // pausa quando fora da viewport (economia de GPU)
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0,
    })
    io.observe(host)

    let raf = 0
    let lastDraw = 0
    const loop = (t) => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      // 30fps: e uma onda lenta, o olho nao distingue de 60 — e libera
      // metade dos frames para o resto do hero
      if (t - lastDraw < 33) return
      lastDraw = t
      const p = propsRef.current
      program.uniforms.uTime.value = (t * 0.001) * p.speed
      program.uniforms.uAmplitude.value = p.amplitude
      program.uniforms.uBlend.value = p.blend
      // as cores nao mudam: recriar tres objetos Color por frame so gerava lixo
      renderer.render({ scene: mesh })
    }

    if (reduced) {
      program.uniforms.uTime.value = 12
      renderer.render({ scene: mesh })
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={hostRef} className={className} aria-hidden="true" />
}
