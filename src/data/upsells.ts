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
    descricao: "Transforme seu perfil em uma máquina de vendas",
    descricaoLonga: "Aprenda a fotografar, criar conteúdo e vender seus amigurumis nas redes sociais.",
    precoOriginal: 97,
    precoAtual: 47,
    emoji: "📱",
    cor: "#FF3D9A",
    beneficios: [
      "Aprenda a fotografar seus amigurumis como uma profissional",
      "Crie um feed que vende sem você falar nada",
      "Estratégias de stories que engajam e convertem",
      "Como usar reels para viralizar suas receitas",
      "Monte uma base de seguidores apaixonados pelo seu trabalho"
    ],
    copiaVendas: [
      "Você passa horas criando amigurumis lindos, mas quando vai mostrar nas redes sociais, parece que não fazem jus ao trabalho que você teve?",
      "Com o Instagram Profissional para Artesãs, você vai aprender a otimizar cada imagem para vender mais rápido."
    ]
  },
  {
    id: "upsell2",
    nome: "Guia de Precificação Lucrativa",
    descricao: "Nunca mais tenha prejuízo nas suas peças",
    descricaoLonga: "Uma planilha inteligente e um guia passo a passo para cobrar o preço justo.",
    precoOriginal: 47,
    precoAtual: 27,
    emoji: "💰",
    cor: "#7BC843",
    beneficios: [
      "Planilha automática de cálculo de custos",
      "Como calcular sua hora de trabalho",
      "Estratégias para valorizar sua marca",
      "Como dar descontos sem perder lucro"
    ],
    copiaVendas: [
      "Cobrar pouco desvaloriza seu trabalho. Cobrar muito pode afastar clientes. Aprenda o equilíbrio perfeito."
    ]
  },
  {
    id: "upsell3",
    nome: "Pack de Moldes de Embalagens",
    descricao: "A primeira impressão é a que fica",
    descricaoLonga: "Moldes prontos para imprimir e montar embalagens personalizadas e fofas.",
    precoOriginal: 37,
    precoAtual: 19,
    emoji: "🎁",
    cor: "#F5A623",
    beneficios: [
      "10 modelos de caixas criativas",
      "Tags de agradecimento editáveis",
      "Instruções de lavagem para o cliente",
      "Design exclusivo AmiguMundo"
    ],
    copiaVendas: [
      "Encante sua cliente desde o momento que o pacote chega pelo correio."
    ]
  },
  {
    id: "upsell4",
    nome: "Curso de Bordado de Olhinhos",
    descricao: "Dê vida e expressão aos seus amigurumis",
    descricaoLonga: "Técnicas avançadas de bordado para criar olhares expressivos e únicos.",
    precoOriginal: 67,
    precoAtual: 37,
    emoji: "👀",
    cor: "#4A90D9",
    beneficios: [
      "5 tipos de olhares diferentes",
      "Como fazer cílios e sobrancelhas perfeitas",
      "Técnica de profundidade e brilho",
      "Materiais recomendados para bordar"
    ],
    copiaVendas: [
      "O segredo de um amigurumi que 'fala' com o cliente está nos olhos."
    ]
  },
  {
    id: "upsell5",
    nome: "Comunidade VIP AmiguMundo",
    descricao: "Acesso antecipado e suporte exclusivo",
    descricaoLonga: "Faça parte do nosso grupo fechado com aulas mensais e receitas inéditas.",
    precoOriginal: 197,
    precoAtual: 97,
    emoji: "👑",
    cor: "#9B59B6",
    beneficios: [
      "Grupo de suporte no WhatsApp",
      "1 receita inédita todo mês",
      "Descontos exclusivos na loja",
      "Lives de tira-dúvidas"
    ],
    copiaVendas: [
      "Não caminhe sozinha. Evolua sua arte junto com as melhores artesãs do Brasil."
    ]
  },
  {
    id: "upsell6",
    nome: "Workshop: Amigurumi Gigante",
    descricao: "Aprenda a técnica de fios grossos",
    descricaoLonga: "Como adaptar qualquer receita para fios de malha ou pelúcia sem perder a forma.",
    precoOriginal: 87,
    precoAtual: 47,
    emoji: "🧸",
    cor: "#FF6B35",
    beneficios: [
      "Adaptação de pontos para fios grossos",
      "Enchimento estruturado para peças grandes",
      "Acabamentos invisíveis em fios de pelúcia",
      "Lista de fornecedores de fios premium"
    ],
    copiaVendas: [
      "Peças gigantes são tendência de decoração e possuem alto valor agregado."
    ]
  }
];