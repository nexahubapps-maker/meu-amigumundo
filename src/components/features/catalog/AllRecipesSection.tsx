"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { getRecipesPage, type SheetRecipe } from "@/utils/sheets";
import { RecipeGridCard } from "@/components/features/catalog/RecipeGridCard";
import { SOMBRA_3D } from "@/lib/style3d";

// Quantas receitas carregam por vez (primeira página e cada clique em "Ver mais").
const TAMANHO_PAGINA = 30;

const GRADE = "grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4";

interface AllRecipesSectionProps {
  isInCart: (id: string) => boolean;
  onRecipeAdd: (recipe: SheetRecipe) => void;
  onRecipeRemove: (id: string) => void;
  onZoomImage: (url: string) => void;
  favorites: string[];
  onToggleFavorite: (recipe: SheetRecipe) => void;
}

export const AllRecipesSection = ({
  isInCart,
  onRecipeAdd,
  onRecipeRemove,
  onZoomImage,
  favorites,
  onToggleFavorite,
}: AllRecipesSectionProps) => {
  const [recipes, setRecipes] = useState<SheetRecipe[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  // Quantos registros já foram buscados no banco (usado como deslocamento da próxima página).
  const proximoOffset = useRef(0);

  useEffect(() => {
    let cancelado = false;
    setIsLoading(true);
    setLoadError(false);

    getRecipesPage(0, TAMANHO_PAGINA).then((res) => {
      if (cancelado) return;
      if (res.error) {
        setLoadError(true);
      } else {
        proximoOffset.current = res.recipes.length;
        setRecipes(res.recipes);
        setHasMore(res.hasMore);
      }
      setIsLoading(false);
    });

    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  const handleVerMais = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setLoadMoreError(false);

    const res = await getRecipesPage(proximoOffset.current, TAMANHO_PAGINA);

    if (res.error) {
      setLoadMoreError(true);
    } else {
      proximoOffset.current += res.recipes.length;
      // Evita card repetido caso entre receita nova enquanto a cliente navega.
      setRecipes((anteriores) => {
        const jaExistem = new Set(anteriores.map((r) => r.id));
        return [...anteriores, ...res.recipes.filter((r) => !jaExistem.has(r.id))];
      });
      setHasMore(res.hasMore);
    }

    setIsLoadingMore(false);
  };

  if (isLoading) {
    return (
      <div className={GRADE}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
        ))}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-10 text-center">
        <p className="text-xs font-bold text-gray-500 mb-3">
          Não foi possível carregar as receitas agora.
        </p>
        <button
          onClick={() => setTentativa((n) => n + 1)}
          className="px-6 py-2.5 rounded-xl bg-[#5D0599] text-white font-black text-xs uppercase tracking-wide active:scale-95 transition-transform"
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <p className="py-10 text-center text-xs font-bold text-gray-400">
        Nenhuma receita disponível no momento.
      </p>
    );
  }

  return (
    <div>
      <div className={GRADE}>
        {recipes.map((recipe) => (
          <RecipeGridCard
            key={recipe.id}
            recipe={recipe}
            added={isInCart(recipe.id)}
            isFavorite={favorites.includes(recipe.id)}
            onAdd={onRecipeAdd}
            onRemove={onRecipeRemove}
            onZoomImage={onZoomImage}
            onToggleFavorite={() => onToggleFavorite(recipe)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex flex-col items-center gap-2 pt-4 pb-2">
          {loadMoreError && (
            <p className="text-[11px] font-bold text-red-500">
              Não foi possível carregar mais. Tente de novo.
            </p>
          )}
          <button
            onClick={handleVerMais}
            disabled={isLoadingMore}
            style={{ backgroundColor: "#5D0599" }}
            className={`flex items-center justify-center gap-2 px-10 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide text-white active:scale-95 transition-transform disabled:opacity-70 ${SOMBRA_3D}`}
          >
            {isLoadingMore ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Carregando...
              </>
            ) : (
              "Ver mais"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
