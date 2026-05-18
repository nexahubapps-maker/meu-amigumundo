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
    nome: "Instagram Profissional para Artesaas",
    descricao: "Transforme seu perfil em uma maquina de vendas",
    descricaoLonga: "Aprenda a fotografar, criar conteudo e vender seus amigurumis nas redes sociais.",
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
      "Com o Instagram Profissional para Artesaas, você vai aprender a otimizar cada imagem para vender mais rapido.",
      "Compartilhei abaixo outras oportunidades especiais para você potencializar seu trabalho! 😊✨"
    ]
  }
];