"use client";

import { type SheetRecipe } from "./sheets";

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
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
  subtotalOthers: number;
  total: number;
  recipeCount: number; // paid recipes count
  bonusCount: number;  // filled free slots count
  maxBonusSlots: number; // total allowed free slots
  pricePerRecipe: number;
}

// Helper to get allowed free slots based on paid recipes count
function getFreeSlotsCount(paidCount: number): number {
  if (paidCount < 10) return 0;
  if (paidCount < 15) return 1;
  if (paidCount < 20) return 2;
  return 5;
}

// Helper to get price per recipe based on paid recipes count
function getPricePerRecipe(paidCount: number): number {
  if (paidCount === 0) return 0;
  if (paidCount <= 4) return 5.00;
  if (paidCount <= 9) return 4.00;
  if (paidCount <= 14) return 3.00;
  return 2.50;
}

export function calculateCart(cart: CartItem[], allRecipes: SheetRecipe[]): CalculatedCart {
  const recipeItems = cart.filter(item => item.tipo === "recipe");
  const otherItems = cart.filter(item => item.tipo !== "recipe");

  const N = recipeItems.length;
  let bestPaidCount = N;
  let bestFreeCount = 0;
  let minCost = Infinity;

  // Find the optimal split of Paid (P) and Free (F) recipes that minimizes cost
  for (let P = 0; P <= N; P++) {
    const F = N - P;
    const allowedSlots = getFreeSlotsCount(P);
    if (F <= allowedSlots) {
      const cost = P * getPricePerRecipe(P);
      if (cost < minCost) {
        minCost = cost;
        bestPaidCount = P;
        bestFreeCount = F;
      }
    }
  }

  const pricePerRecipe = getPricePerRecipe(bestPaidCount);
  const maxBonusSlots = getFreeSlotsCount(bestPaidCount);

  // Map paid and free recipes
  const paidRecipes = recipeItems.slice(0, bestPaidCount).map(item => ({
    id: item.id,
    nome: item.nome,
    precoOriginal: item.preco,
    precoFinal: pricePerRecipe,
    tipo: "recipe" as const,
    imagem: item.imagem
  }));

  const freeRecipes = recipeItems.slice(bestPaidCount, bestPaidCount + bestFreeCount).map(item => ({
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
    subtotalOthers,
    total,
    recipeCount: bestPaidCount,
    bonusCount: bestFreeCount,
    maxBonusSlots,
    pricePerRecipe
  };
}