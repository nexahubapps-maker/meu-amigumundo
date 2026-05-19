"use client";

import { useState } from "react";
import { recipes, type Recipe } from "@/data/recipes";

interface CodeInputProps {
  onRecipeFound: (recipe: Recipe) => void;
  onRecipeNotFound: () => void;
}

export const CodeInput = ({ onRecipeFound, onRecipeNotFound }: CodeInputProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const recipe = recipes.find((r) => r.id === code.trim());
      if (recipe) {
        onRecipeFound(recipe);
      } else {
        onRecipeNotFound();
      }
      setLoading(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="max-w-[480px] mx-auto my-4 sm:my-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Código da receita (ex: 3872)"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl sm:rounded-2xl text-base sm:text-lg focus:outline-none focus:border-[#FF6B35] transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !code.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl font-bold text-white text-sm sm:text-lg disabled:opacity-50 transition-transform active:scale-95 bg-[#7BC843]"
        >
          {loading ? "Buscando..." : "Buscar Receita →"}
        </button>
      </div>
    </div>
  );
};