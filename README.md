# Mario Dal Maso — landing page

Reconstrução da página institucional da **Mario Dal Maso**, administradora de
condomínios e patrimônios em Moema, São Paulo, no mercado desde 1965.

Substitui o site atual (`mariodalmaso.com.br/site`), que roda em PHP 5.6 com o
conteúdo da home inteiro em imagem, sem meta description e com links quebrados.

## Stack

| | |
|---|---|
| Framework | React 19 + Vite 8 |
| Estilo | Tailwind CSS 4 |
| Animação | GSAP 3 + ScrollTrigger |
| Scroll | Lenis (smooth scroll) |
| WebGL | OGL (background aurora) |

## Rodando local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

## Estrutura

```
src/
├── components/
│   ├── Aurora.jsx     # background WebGL (shader de ruído simplex)
│   ├── ui.jsx         # SplitText, Reveal, Stagger, CountUp,
│   │                  # SpotlightCard, Magnetic, Marquee
│   └── fx.jsx         # Cursor, Parallax, Tilt3D, ScrollVelocity,
│                      # DotGrid, Intro
├── data/content.js    # todo o conteúdo (contato, serviços, certificações)
├── lib/anim.js        # setup do GSAP + splitChars próprio
├── sections/          # Nav, Hero, Empresa, Servicos, Diferenciais,
│                      # Contato, Footer
└── App.jsx
```

## Decisões

- **`splitChars` próprio** em vez do plugin `SplitText` do GSAP — evita a
  dependência do Club GreenSock. Inclui folga de padding para não cortar
  acentos (ô, ã) nem descendentes (p, g, ç).
- **Ouro da marca preservado.** O site atual usa `#ffcc28`; aqui a paleta foi
  refinada para um champanhe (`#d4af6a`) sobre azul-tinta, mantendo a
  identidade mas elevando o contraste e a sofisticação.
- **Um único canvas WebGL** na página (o Aurora do hero), pausado quando sai da
  viewport. O restante dos efeitos é Canvas 2D ou CSS.
- **`prefers-reduced-motion`** respeitado em todos os componentes animados.
- **Anos corrigidos.** O site atual se contradiz entre "50", "55" e "60 anos";
  adotamos 60 anos / desde 1965.

## Conteúdo

Textos, serviços, certificações (PROAD, PQE, PQI), bios da diretoria e dados de
contato foram extraídos do site atual e reescritos. Telefone, e-mail e endereço
são os reais.

## Pendências

- Logo oficial em SVG (o atual é bitmap)
- Fotografia real dos empreendimentos
- Integração do formulário com backend (hoje monta a mensagem e abre o WhatsApp)
- Seção de imóveis disponíveis
