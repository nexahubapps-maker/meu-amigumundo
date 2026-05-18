export interface Pack {
  id: string;
  nome: string;
  descricao: string;
  receitas: number;
  precoOriginal: number;
  precoAtual: number;
  emoji: string;
}

export const packs: Pack[] = [
  { id: "pack1", nome: "Pack Safari Completo", descricao: "20 receitas de animais selvagens", receitas: 20, precoOriginal: 39.90, precoAtual: 19.90, emoji: "🦁" },
  { id: "pack2", nome: "Pack Princesas Encantadas", descricao: "20 receitas de princesas", receitas: 20, precoOriginal: 39.90, precoAtual: 19.90, emoji: "👸" },
  { id: "pack3", nome: "Pack Super-Herois", descricao: "20 receitas de heroi e viloes", receitas: 20, precoOriginal: 39.90, precoAtual: 19.90, emoji: "🦸" },
  { id: "pack4", nome: "Pack Bebes e Fofuras", descricao: "20 receitas para presentear bebes", receitas: 20, precoOriginal: 34.90, precoAtual: 17.90, emoji: "👶" },
  { id: "pack5", nome: "Pack Natal Magico", descricao: "20 receitas natalinas", receitas: 20, precoOriginal: 39.90, precoAtual: 19.90, emoji: "🎄" },
  { id: "pack6", nome: "Pack Personagens TV", descricao: "20 receitas de personagens famosos", receitas: 20, precoOriginal: 44.90, precoAtual: 21.90, emoji: "📺" },
];

export interface Combo {
  id: string;
  nome: string;
  descricao: string;
  receitas: number;
  preco: number;
  badge: string;
  cor: string;
}

export const combos: Combo[] = [
  { id: "combo1", nome: "Combo Tematico", descricao: "20 receitas escolhidas a dedo de um unico tema", receitas: 20, preco: 37.00, badge: "MAIS PROCURADO", cor: "#9B59B6" },
  { id: "combo2", nome: "Combo Silver", descricao: "50 receitas variadas - colecao essencial AmiguMundo", receitas: 50, preco: 75.00, badge: "ECONOMIA TOP", cor: "#4A90D9" },
  { id: "combo3", nome: "Combo Gold", descricao: "100 receitas premium + bonus exclusivos. A colecao completa!", receitas: 100, preco: 97.00, badge: "MELHOR CUSTO", cor: "#7BC843" },
];