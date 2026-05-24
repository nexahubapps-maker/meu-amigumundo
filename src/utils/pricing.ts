import { type SheetRecipe } from "./sheets";

export interface CartItem {
  id: string;
  nome: string;
  preco: number; // original price
  tipo: "recipe" | "pack" | "combo" | "upsell";
  imagem?: string;
}

export interface CalculatedCart {
  items: {
    id: string;
    nome: string;
    precoOriginal: number;
    precoFinal: number;
    tipo: "recipe" | "pack" | "combo" | "upsell";
    imagem?: string;
    isBonus?: boolean;
  }[];
  subtotalRecipes: number;
  subtotalOthers: number;
  total: number;
  recipeCount: number;
  bonusCount: number;
  pricePerRecipe: number;
  nextTierMessage: string;
}

export function calculateCart(cart: CartItem[], allRecipes: SheetRecipe[]): CalculatedCart {
  const recipeItems = cart.filter(item => item.tipo === "recipe");
  const otherItems = cart.filter(item => item.tipo !== "recipe");

  const N = recipeItems.length;
  let pricePerRecipe = 5.00;
  let bonusCount = 0;
  let nextTierMessage = "";

  if (N === 0) {
    pricePerRecipe = 5.00;
    bonusCount = 0;
    nextTierMessage = "Adicione receitas para ganhar descontos e presentes!";
  } else if (N >= 1 && N <= 4) {
    pricePerRecipe = 5.00;
    bonusCount = 0;
    const needed = 5 - N;
    nextTierMessage = `Falta apenas ${needed} ${needed === 1 ? 'receita' : 'receitas'} para o preço cair para R$ 4,00 cada!`;
  } else if (N >= 5 && N <= 9) {
    pricePerRecipe = 4.00;
    bonusCount = 0;
    const needed = 10 - N;
    nextTierMessage = `Falta apenas ${needed} ${needed === 1 ? 'receita' : 'receitas'} para o preço cair para R$ 3,00 cada e ganhar +1 PRESENTE!`;
  } else if (N >= 10 && N <= 14) {
    pricePerRecipe = 3.00;
    bonusCount = 1;
    const needed = 15 - N;
    nextTierMessage = `Parabéns! Você ganhou +1 receita de PRESENTE! Adicione mais ${needed} para o preço cair para R$ 2,50 cada e ganhar +2 PRESENTES!`;
  } else if (N >= 15 && N <= 19) {
    pricePerRecipe = 2.50;
    bonusCount = 2;
    const needed = 20 - N;
    nextTierMessage = `Parabéns! Você ganhou +2 receitas de PRESENTE! Adicione mais ${needed} para ganhar +5 PRESENTES!`;
  } else {
    pricePerRecipe = 2.50;
    bonusCount = 5;
    nextTierMessage = `Parabéns! Você atingiu o nível máximo e ganhou +5 receitas de PRESENTE!`;
  }

  // Calculate prices for recipe items
  const calculatedRecipes = recipeItems.map(item => ({
    id: item.id,
    nome: item.nome,
    precoOriginal: item.preco,
    precoFinal: pricePerRecipe,
    tipo: item.tipo,
    imagem: item.imagem,
    isBonus: false
  }));

  // Inject automatic bonus items if applicable
  const bonusItems: any[] = [];
  if (bonusCount > 0 && allRecipes.length > 0) {
    const existingIds = new Set(cart.map(i => i.id));
    const availableBonuses = allRecipes.filter(r => !existingIds.has(r.id));
    
    for (let i = 0; i < Math.min(bonusCount, availableBonuses.length); i++) {
      const bonusRecipe = availableBonuses[i];
      bonusItems.push({
        id: `bonus-${bonusRecipe.id}`,
        nome: `[PRESENTE] ${bonusRecipe.nome}`,
        precoOriginal: bonusRecipe.preco,
        precoFinal: 0,
        tipo: "recipe" as const,
        imagem: bonusRecipe.url_foto,
        isBonus: true
      });
    }
  }

  const calculatedOthers = otherItems.map(item => ({
    id: item.id,
    nome: item.nome,
    precoOriginal: item.preco,
    precoFinal: item.preco,
    tipo: item.tipo,
    imagem: item.imagem,
    isBonus: false
  }));

  const subtotalRecipes = calculatedRecipes.reduce((sum, item) => sum + item.precoFinal, 0);
  const subtotalOthers = calculatedOthers.reduce((sum, item) => sum + item.precoFinal, 0);
  const total = subtotalRecipes + subtotalOthers;

  return {
    items: [...calculatedRecipes, ...bonusItems, ...calculatedOthers],
    subtotalRecipes,
    subtotalOthers,
    total,
    recipeCount: N,
    bonusCount,
    pricePerRecipe,
    nextTierMessage
  };
}