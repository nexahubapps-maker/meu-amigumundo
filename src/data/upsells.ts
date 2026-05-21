export interface Upsell {
  id: string;
  nome: string;
  descricao: string;
  descricaoLonga: string;
  precoOriginal: number;
  precoAtual: number;
  emoji: string;
  cor: string;
  beneficios: string[];
  copiaVendas: string[];
}

export const upsells: Upsell[] = [
  {
    id: "upsell1",
    nome: "Instagram Profissional para Artesãs",
    descricao: "O segredo prático para atrair seguidores qualificados e transformá-los em clientes que pagam o valor justo sem chorar por descontos no Direct.",
    descricaoLonga: "Aprenda a transformar seu perfil do Instagram em uma vitrine magnética de alta conversão.",
    precoOriginal: 97,
    precoAtual: 47,
    emoji: "📱",
    cor: "#FF3D9A",
    beneficios: [
      "Como tirar fotos profissionais usando apenas o celular",
      "Roteiros prontos de Stories para vender todos os dias",
      "Estratégia de Reels para atrair seguidores compradores",
      "Como fechar vendas no Direct sem parecer chata"
    ],
    copiaVendas: [
      "Você passa horas criando amigurumis lindos, mas quando vai mostrar nas redes sociais, parece que ninguém valoriza?",
      "Com o Instagram Profissional para Artesãs, você vai aprender a otimizar cada imagem e legenda para vender mais rápido e pelo preço justo."
    ]
  },
  {
    id: "upsell2",
    nome: "Guia de Precificação sem Erros",
    descricao: "Descubra de forma simples e exata o valor real da sua hora de trabalho. Pare de pagar para trabalhar e garanta o seu lucro em cada peça desenvolvida.",
    descricaoLonga: "Uma planilha inteligente e um guia passo a passo para cobrar o preço justo e lucrativo.",
    precoOriginal: 47,
    precoAtual: 27,
    emoji: "💰",
    cor: "#7BC843",
    beneficios: [
      "Planilha automática de cálculo de custos e materiais",
      "Como calcular sua hora de trabalho de forma justa",
      "Estratégias para valorizar sua marca perante o cliente",
      "Como dar descontos sem perder a sua margem de lucro"
    ],
    copiaVendas: [
      "Cobrar pouco desvaloriza seu trabalho. Cobrar muito sem estratégia afasta clientes. Aprenda o equilíbrio perfeito e garanta o seu lucro real."
    ]
  },
  {
    id: "upsell3",
    nome: "Pacote de Moldes de Amigurumi Premium",
    descricao: "Tenha acesso a uma seleção exclusiva de moldes altamente desejados no mercado que vão fazer o seu portfólio se destacar instantaneamente.",
    descricaoLonga: "Moldes prontos, testados e aprovados pelas maiores artesãs do país.",
    precoOriginal: 37,
    precoAtual: 19,
    emoji: "🎁",
    cor: "#F5A623",
    beneficios: [
      "10 modelos de caixas criativas e exclusivas",
      "Tags de agradecimento editáveis e profissionais",
      "Instruções de lavagem ilustradas para enviar ao cliente",
      "Design exclusivo AmiguMundo para encantar na entrega"
    ],
    copiaVendas: [
      "Encante sua cliente desde o primeiro contato visual. A embalagem e a apresentação são responsáveis por mais de 50% da percepção de valor."
    ]
  },
  {
    id: "upsell4",
    nome: "Curso de Bordado de Alto Padrão",
    descricao: "Domine as técnicas de acabamento avançado e detalhes realistas que aumentam o valor percebido das suas peças em até 3 vezes.",
    descricaoLonga: "Técnicas avançadas de bordado para criar olhares expressivos e únicos.",
    precoOriginal: 67,
    precoAtual: 37,
    emoji: "👀",
    cor: "#4A90D9",
    beneficios: [
      "5 tipos de olhares expressivos e marcantes",
      "Como fazer cílios e sobrancelhas perfeitas e simétricas",
      "Técnica de profundidade, brilho e sombreamento",
      "Materiais recomendados para acabamentos de alto padrão"
    ],
    copiaVendas: [
      "O segredo de um amigurumi que 'fala' com o cliente está nos olhos. Domine a arte de dar vida e expressão às suas peças."
    ]
  },
  {
    id: "upsell5",
    nome: "Comunidade VIP de Artesãs Lucrativas",
    descricao: "Faça parte do grupo fechado de artesãs que vivem exclusivamente do seu artesanato. Troque estratégias diárias, moldes testados e dicas de fornecedores.",
    descricaoLonga: "Faça parte do nosso grupo fechado com aulas mensais e receitas inéditas.",
    precoOriginal: 197,
    precoAtual: 97,
    emoji: "👑",
    cor: "#9B59B6",
    beneficios: [
      "Grupo de suporte e networking ativo no WhatsApp",
      "1 receita inédita e exclusiva liberada todo mês",
      "Descontos exclusivos em fornecedores parceiros",
      "Lives mensais de tira-dúvidas e análise de perfil"
    ],
    copiaVendas: [
      "Não caminhe sozinha. Evolua sua arte e seu negócio junto com as melhores e mais lucrativas artesãs do Brasil."
    ]
  },
  {
    id: "upsell6",
    nome: "Workshop de Amigurumi Avançado",
    descricao: "Aprenda o passo a passo definitivo para criar estruturas complexas e dar vida a designs surpreendentes que encantam qualquer cliente.",
    descricaoLonga: "Como adaptar qualquer receita para fios de malha ou pelúcia sem perder a forma.",
    precoOriginal: 87,
    precoAtual: 47,
    emoji: "🧸",
    cor: "#FF6B35",
    beneficios: [
      "Adaptação de pontos para fios grossos e pelúcia",
      "Enchimento estruturado para peças grandes não murcharem",
      "Acabamentos invisíveis em fios de pelúcia premium",
      "Lista de fornecedores nacionais de fios de alta qualidade"
    ],
    copiaVendas: [
      "Peças gigantes são a maior tendência de decoração de quartos infantis e possuem altíssimo valor agregado no mercado."
    ]
  }
];