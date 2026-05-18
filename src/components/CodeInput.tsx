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
    <div className="max-w-[480px] mx-auto my-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o codigo da receita (ex: 3872)"
          className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-[#FF6B35] transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !code.trim()}
          className="px-6 py-3 rounded-2xl font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
          style={{ backgroundColor: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          {loading ? "Buscando..." : "Buscar Receita →"}
        </button>
      </div>
    </div>
  );
};