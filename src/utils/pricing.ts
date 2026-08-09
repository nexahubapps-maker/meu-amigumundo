"use client";

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  tipo: "recipe" | "pack" | "combo" | "upsell";
  imagem?: string;
  isBonus?: boolean;
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
  subtotalRecipesOriginal: number;
  subtotalOthers: number;
  total: number;
  recipeCount: number;
  pricePerRecipe: number;
  economia: number;
}

const PRECO_BASE_RECEITA = 5;

export function getPrecoPorReceita(paidCount: number): number {
  if (paidCount < 6) return 5;
  if (paidCount < 11) return 3;
  if (paidCount < 21) return 2.5;
  return 2;
}

export function calculateCart(cart: CartItem[]): CalculatedCart {
  const recipeItems = cart.filter(item => item.tipo === "recipe");
  const otherItems = cart.filter(item => item.tipo !== "recipe");

  const recipeCount = recipeItems.length;
  const pricePerRecipe = getPrecoPorReceita(recipeCount);

  const calculatedRecipes = recipeItems.map(item => ({
    id: item.id,
    nome: item.nome,
    precoOriginal: PRECO_BASE_RECEITA,
    precoFinal: pricePerRecipe,
    tipo: "recipe" as const,
    imagem: item.imagem,
    isBonus: false
  }));

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
  const subtotalRecipesOriginal = recipeCount * PRECO_BASE_RECEITA;
  const subtotalOthers = calculatedOthers.reduce((sum, item) => sum + item.precoFinal, 0);
  const total = subtotalRecipes + subtotalOthers;
  const economia = subtotalRecipesOriginal - subtotalRecipes;

  return {
    items: [...calculatedRecipes, ...calculatedOthers],
    subtotalRecipes,
    subtotalRecipesOriginal,
    subtotalOthers,
    total,
    recipeCount,
    pricePerRecipe,
    economia
  };
}