/**
 * Conteudo extraido do site atual (mariodalmaso.com.br/site) e reescrito
 * para a nova pagina. Dados de contato, servicos, certificacoes e textos
 * institucionais sao fieis ao original.
 */

export const CONTACT = {
  phone: '11 5095-1333',
  phoneHref: 'tel:+551150951333',
  whatsapp: 'https://wa.me/551150951333?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es.',
  email: 'atendimento@mariodalmaso.com.br',
  address: 'Rua dos Chanés, 95 — Moema',
  city: 'São Paulo — SP · CEP 04087-030',
  maps: 'https://maps.google.com/?q=Rua+dos+Chanés,+95+Moema+São+Paulo',
  social: {
    instagram: 'https://www.instagram.com/mariodalmasoadministradora/',
    facebook: 'https://www.facebook.com/mariodalmasoadm/',
    linkedin: 'https://pt.linkedin.com/company/mario-dal-maso-empreendimentos-imobili-rios-ltda.',
  },
  apps: {
    android: 'https://play.google.com/store/apps/details?id=br.com.winker.wl.mariodalmaso',
    ios: 'https://apps.apple.com/br/app/id6472942640',
  },
  portal: 'https://app.winker.com.br/intra/default/login?wl=mariodalmaso',
}

export const NAV = [
  { label: 'A empresa', href: '#empresa' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Certificações', href: '#certificacoes' },
  { label: 'Contato', href: '#contato' },
]

export const STATS = [
  { value: 60, suffix: '', label: 'anos de mercado', sub: 'Seis décadas administrando patrimônios em São Paulo' },
  { value: 60, suffix: '', label: 'colaboradores', sub: 'Distribuídos em 12 áreas especializadas' },
  { value: 24, suffix: 'h', label: 'para repasse', sub: 'Aluguel na conta após confirmação do pagamento' },
  { value: 3, suffix: ' mil', label: 'corretores', sub: 'Alcance via Rede SECOVI e 50+ portais' },
]

export const SERVICES = [
  {
    id: 'condominios',
    n: '01',
    title: 'Administração de Condomínios',
    lead:
      'Cada empreendimento tem um perfil próprio. Por isso a gestão é desenhada sob medida — residencial, comercial ou industrial — com assessoria completa ao síndico, subsíndico, conselho fiscal e condôminos.',
    items: [
      'Gestão patrimonial, tributária e fiscal',
      'Análise mensal de contas com gráficos comparativos',
      'Programa de manutenção e conservação (PMNO)',
      'Recursos humanos e funcionários multifuncionais',
      'Gerenciamento de obras',
      'Reserva online de espaços comuns',
      'Departamento jurídico especializado',
      'Programa de redução de inadimplência',
      'Programa de segurança condominial',
      'Ouvidoria (SAC)',
    ],
    featured: true,
  },
  {
    id: 'patrimonio',
    n: '02',
    title: 'Administração de Patrimônios',
    lead:
      'Gestão inteligente focada em detectar oportunidades de mercado, com objetivo na valorização e na rentabilidade do patrimônio imobiliário.',
    items: [
      'Repasse do aluguel em até 24 horas',
      'Inadimplência praticamente zero',
      'Análise cadastral rigorosa de garantias',
      'Gestão de Valorização Patrimonial (GVP)',
      'Laudo técnico de vistoria na entrada e saída',
      'Relatórios financeiros mensais',
    ],
  },
  {
    id: 'comercializacao',
    n: '03',
    title: 'Gestão Integrada de Comercialização',
    lead:
      'Um único profissional credenciado coordena interessados e imobiliárias. Avaliação precisa, plano de mídia e relatórios de desempenho a cada etapa.',
    items: [
      'Avaliação comparativa fiel ao mercado',
      'Divulgação na Rede SECOVI e 50+ portais',
      'Relatório de visitas com pontos fortes e fracos',
      'Assessoria jurídica em contratos',
    ],
  },
  {
    id: 'aluguel-garantido',
    n: '04',
    title: 'Aluguel Garantido',
    lead: 'Previsibilidade de receita para o proprietário, independentemente da pontualidade do locatário.',
    items: [],
  },
  {
    id: 'seguro',
    n: '05',
    title: 'Seguro Incêndio Conteúdo',
    lead: 'Cobertura contratada com assessoria da administradora, sem burocracia para o condomínio.',
    items: [],
  },
]

export const ADVANTAGES = [
  {
    title: 'Atendimento centralizado',
    body:
      'Um só interlocutor credenciado e dedicado ao seu imóvel — em vez de dezenas de corretores ligando por informação.',
  },
  {
    title: 'Inadimplência quase zero',
    body:
      'A avaliação rigorosa de cadastro e garantias mantém a carteira saudável. Os casos raros são negociados pelo jurídico próprio.',
  },
  {
    title: 'Prestação de contas ágil',
    body:
      'Relatórios mensais e controle rigoroso do recebimento. O repasse acontece em até 24 horas após a confirmação.',
  },
  {
    title: 'Valorização contínua',
    body:
      'O departamento de GVP avalia a propriedade e renegocia condições contratuais focado em rentabilidade crescente.',
  },
  {
    title: 'Jurídico especializado',
    body:
      'Equipe em atualização constante, do parecer preventivo à atuação no judiciário quando necessário.',
  },
  {
    title: 'Foco em renda contínua',
    body:
      'A relação próxima com o locatário antecipa a desocupação e reduz vacância — mais meses de receita no ano.',
  },
]

export const VALUES = [
  ['Ética', 'Transparência, honestidade e senso de justiça.'],
  ['Evolução', 'Excelência contínua e crescimento sustentável.'],
  ['Seriedade', 'Comprometimento com os objetivos do cliente.'],
  ['Diplomacia', 'Preparo para mediar conflitos.'],
  ['Profissionalismo', 'Responsabilidade, precisão e atenção ao detalhe.'],
  ['Criatividade', 'Soluções inovadoras para cada problema.'],
  ['Proatividade', 'Antecipar fatos, maximizar oportunidades.'],
  ['Confiabilidade', 'A soma de tudo, a serviço da confiança.'],
]

export const CERTIFICATIONS = [
  {
    sigla: 'PROAD',
    nome: 'Programa de Autorregulamentação da Administração de Condomínios',
    orgao: 'SECOVI-SP + AABIC',
    desc: 'Destaca empresas com foco na qualidade de vida dos moradores e na valorização patrimonial, com ética e responsabilidade.',
  },
  {
    sigla: 'PQE',
    nome: 'Programa de Qualificação Essencial',
    orgao: 'SECOVI-SP',
    desc: 'Certifica prestadoras nas áreas de compra, venda, locação e administração. A Mario Dal Maso foi pioneira a conquistar o selo.',
  },
  {
    sigla: 'PQI',
    nome: 'Programa de Qualidade Imobiliária',
    orgao: 'COFECI-CRECI',
    desc: 'Comprova comprometimento com qualidade, desenvolvimento de pessoas e otimização de processos.',
  },
]

export const ENTIDADES = [
  'SECOVI-SP',
  'AABIC',
  'ACSP',
  'CRECI',
  'CREA-SP',
  'Rede SECOVI de Imóveis',
]

export const DIRETORIA = [
  {
    nome: 'Marco Dal Maso',
    cargo: 'Diretor Comercial, Expansão e Desenvolvimento',
    bio:
      'Engenheiro Civil pela FAAP. Vice-presidente de locação, comercialização e administração de patrimônio e condomínio do SECOVI-SP, conselheiro da Rede SECOVI e diretor de negócios imobiliários da AABIC.',
  },
  {
    nome: 'Hélio Coelho Neto',
    cargo: 'Diretor Administrativo e Financeiro',
    bio:
      'Engenheiro Eletricista pela Escola Politécnica da USP. Foi gerente de Marketing e Vendas da Siemens do Brasil entre 1982 e 2000. Na Mario Dal Maso desde 2001.',
  },
]

export const AREAS = [
  'Administração de Condomínios',
  'Gestão Integrada de Comercialização',
  'Administração de Patrimônios',
  'Gestão de Valorização Patrimonial',
  'Gestão e Consultoria Jurídicas',
  'Gestão Financeira e Administrativa',
  'Gestão Tributária',
  'Gestão de Suprimentos',
  'Gestão de Recursos Humanos',
  'Gestão de Qualidade',
  'Marketing',
  'Ouvidoria',
]
