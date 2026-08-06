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
  paidRecipes: {
    id: string;
    nome: string;
    precoOriginal: number;
    precoFinal: number;
    tipo: "recipe";
    imagem?: string;
  }[];
  freeRecipes: {
    id: string;
    nome: string;
    precoOriginal: number;
    precoFinal: number;
    tipo: "recipe";
    imagem?: string;
  }[];
  subtotalRecipes: number;
  subtotalRecipesOriginal: number;
  subtotalOthers: number;
  total: number;
  recipeCount: number; // paid recipes count
  bonusCount: number;  // filled free slots count
  maxBonusSlots: number; // total allowed free slots
  discountPercent: number;
  pricePerRecipe: number;
}

// Helper to get allowed free slots based on paid recipes count
function getFreeSlotsCount(paidCount: number): number {
  if (paidCount < 11) return 0;
  if (paidCount < 16) return 1;
  return 3;
}

// Helper to get discount percentage based on paid recipes count
function getDiscountPercent(paidCount: number): number {
  if (paidCount < 5) return 0;
  if (paidCount < 11) return 0.20;
  if (paidCount < 16) return 0.40;
  return 0.50;
}

export function calculateCart(cart: CartItem[]): CalculatedCart {
  const recipeItems = cart.filter(item => item.tipo === "recipe");
  const otherItems = cart.filter(item => item.tipo !== "recipe");

  const paidRecipeItems = recipeItems.filter(item => !item.isBonus);
  const bonusRecipeItems = recipeItems.filter(item => item.isBonus);

  const paidCount = paidRecipeItems.length;
  const discountPercent = getDiscountPercent(paidCount);
  const maxBonusSlots = getFreeSlotsCount(paidCount);

  const paidRecipes = paidRecipeItems.map(item => ({
    id: item.id,
    nome: item.nome,
    precoOriginal: item.preco,
    precoFinal: item.preco * (1 - discountPercent),
    tipo: "recipe" as const,
    imagem: item.imagem
  }));

  const freeRecipes = bonusRecipeItems.map(item => ({
    id: item.id,
    nome: item.nome,
    precoOriginal: item.preco,
    precoFinal: 0,
    tipo: "recipe" as const,
    imagem: item.imagem
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

  const subtotalRecipes = paidRecipes.reduce((sum, item) => sum + item.precoFinal, 0);
  const subtotalRecipesOriginal = paidRecipes.reduce((sum, item) => sum + item.precoOriginal, 0);
  const subtotalOthers = calculatedOthers.reduce((sum, item) => sum + item.precoFinal, 0);
  const total = subtotalRecipes + subtotalOthers;

  return {
    items: [
      ...paidRecipes.map(r => ({ ...r, isBonus: false })),
      ...freeRecipes.map(r => ({ ...r, isBonus: true })),
      ...calculatedOthers
    ],
    paidRecipes,
    freeRecipes,
    subtotalRecipes,
    subtotalRecipesOriginal,
    subtotalOthers,
    total,
    recipeCount: paidCount,
    bonusCount: bonusRecipeItems.length,
    maxBonusSlots,
    discountPercent,
    pricePerRecipe: 0
  };
}