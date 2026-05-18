export interface Upsell {
  id: string;
  nome: string;
  descricao: string;
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
    nome: "Instagram Profissional para Artesaas",
    descricao: "Transforme seu perfil em uma maquina de vendas",
    precoOriginal: 97,
    precoAtual: 47,
    emoji: "📱",
    cor: "#FF3D9A",
    beneficios: [
      "Aprenda a fotografar seus amigurumis como uma profissional",
      "Crie um feed que vende sem voce falar nada",
      "Estrategias de stories que engajam e convertem",
      "Como usar reels para viralizar suas receitas",
      "Monte uma base de seguidores apaixonados pelo seu trabalho"
    ],
    copiaVendas: [
      "Você passa horas criando amigurumis lindos, mas quando vai mostrar nas redes sociais, parece que não fazem jus ao trabalho que você teve?",
      "Com o Instagram Profissional para Artesaas, você vai aprender a transformar cada foto em uma vitrine irresistivel que faz a cliente clicar no link e comprar.",
      "Deixe para trás o medo de postar, a inseguranca com o seu trabalho e a duvida se alguém vai gostar.",
      "Imagina postar uma foto e em minutos ja ter varias curtidas, comentários de clientes interessadas e mensagens de pedidos chegando no seu direct.",
      "E tudo isso sem gastar um centavo com propaganda, sem precisar ser famosa e sem perder sua identidade."
    ]
  },
  {
    id: "upsell2",
    nome: "Como Precificar seus Amigurumis",
    descricao: "Pare de vender barato e lucre de verdade",
    precoOriginal: 67,
    precoAtual: 37,
    emoji: "💰",
    cor: "#F5A623",
    beneficios: [
      "Descubra quanto seus amigurumis realmente valem",
      "Aprenda a cobrar com confianca e sem culpa",
      "Metodo de precificacao que garante lucro e vendas",
      "Como calcular custo de materiais e tempo de trabalho",
      "Tenha precos que encantam a cliente e protegem seu bolso"
    ],
    copiaVendas: [
      "Você faz amigurumis lindos, mas no final do mes o saldo continua zerado?",
      "Com o Como Precificar seus Amigurumis, você vai descobrir o metodo exato para calcular o preco ideal de cada peça.",
      "Deixe para trás a inseguranca de precificar, o medo de cobrar caro e a sensacao de que seu trabalho vale pouco.",
      "Imagina abrir o controle e ver que cada amigurumi que você faz de fato contribui para suas contas pagas.",
      "E sem precisar aumentar muito o preco, apenas entender de verdade o valor do seu tempo e materiais."
    ]
  },
  {
    id: "upsell3",
    nome: "Amigurumis para Iniciantes",
    descricao: "Do zero ao seu primeiro amigurumi em 7 dias",
    precoOriginal: 77,
    precoAtual: 47,
    emoji: "🧶",
    cor: "#7BC843",
    beneficios: [
      "Aprenda as bases do croche amigurumi do zero",
      "Tutorial passo a passo com figurinhas coloridas",
      "10 projetos para praticar desde o primeiro dia",
      "Solucione erros comuns que desanimam iniciantes",
      "Tenha confianca para criar suas primeiras pecas"
    ],
    copiaVendas: [
      "Sempre quis fazer amigurumis mas nunca soube por onde começar?",
      "Com o Amigurumis para Iniciantes, você vai aprender do zero ao primeiro amigurumi em apenas 7 dias.",
      "Deixe para trás a duvida com pontos, a inseguranca com agulha e a sensacao de que você não consegue.",
      "Imagina pegar a agulha e o fio e sair do seu primeiro projeto com um amigurumi lindo para presentear alguém.",
      "E sem precisar de experiencia previa, sem gastar muito com materiais e sem precisar de uma professora."
    ]
  },
  {
    id: "upsell4",
    nome: "Embalagens que Encantam",
    descricao: "Apresentacao profissional que faz a cliente voltar",
    precoOriginal: 47,
    precoAtual: 27,
    emoji: "📦",
    cor: "#4A90D9",
    beneficios: [
      "Ideias criativas de embalagem com pouco custo",
      "Etiquetas e cartoes que encantam a cliente",
      "Dicas para embalar com cuidado e elegancia",
      "Brinde que gera lealdade e indicações",
      "Transforme cada entrega em uma experiencia especial"
    ],
    copiaVendas: [
      "Sua peça esta linda, mas quando a cliente recebe parece que veio de um pedido qualquer?",
      "Com as Embalagens que Encantam, você vai aprender a transformar cada entrega em uma experiencia inesquecivel.",
      "Deixe para trás o papel pardo e o plástico simples que faz a cliente esquecer de você em minutos.",
      "Imagina a cliente abrir a caixa e sentir que recebeu algo especial, como se fosse um presente.",
      "E sem gastar muito, com materiais simples que você encontra facilmente e tecnicas faceis de fazer."
    ]
  },
  {
    id: "upsell5",
    nome: "Colorimetria para Croche",
    descricao: "Combine cores como uma profissional",
    precoOriginal: 57,
    precoAtual: 37,
    emoji: "🎨",
    cor: "#9B59B6",
    beneficios: [
      "Aprenda a combinar cores como uma designer",
      "Paletas de cores que fazem seus amigurumis brilharem",
      "Evite erros comuns de combinacao de cores",
      "Crie pecas com harmonia visual perfeita",
      "Tenha confianca para experimentar novas combinacoes"
    ],
    copiaVendas: [
      "Voce gosta de crochê mas as combinacoes de cores nunca ficam como imaginou?",
      "Com a Colorimetria para Croche, você vai aprender o segredo das profissionais para criar combinacoes perfeitas.",
      "Deixe para trás o medo de errar na escolha das cores e a sensacao de que seu amigurumi ficou sem vida.",
      "Imagina criar uma peça onde cada cor parece ter sido escolhida com perfeicao, como se fosse uma obra de arte.",
      "E sem precisar ser artista, sem conhecimento avancado e sem gastar muito testando varias combinacoes."
    ]
  },
  {
    id: "upsell6",
    nome: "Scripts de Vendas no WhatsApp",
    descricao: "Textos prontos para vender mais no grupo",
    precoOriginal: 87,
    precoAtual: 47,
    emoji: "💬",
    cor: "#2EC4B6",
    beneficios: [
      "Mensagens prontas para usar nos grupos de WhatsApp",
      "Scripts que geram engajamento e vendas",
      "Como responder objeções sem perder a venda",
      "Estrategias para postar sem ser chata",
      "Aumente suas vendas apenas mandando mensagens"
    ],
    copiaVendas: [
      "Voce posta no grupo mas ninguem responde e as vendas ficam lentas?",
      "Com os Scripts de Vendas no WhatsApp, você vai ter mensagens prontas que fazem as clientes quererem comprar.",
      "Deixe para trás a duvida de como postar, o medo de ser chata e a sensacao de que ninguem se importa.",
      "Imagina postar uma mensagem e em minutos ja ter varias respostas de clientes interessadas.",
      "E sem precisar ser vendedora, sem precisar criar texto do zero e sem perder seu tempo pensando no que escrever."
    ]
  }
];