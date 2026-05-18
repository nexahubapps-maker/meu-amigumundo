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
    <div className="max-w-[480px] mx-auto my-6 code-input">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o código da receita (ex: 3872)"
          className="flex-1 px-5 py-4 border-2.5 border-[#e0e0e0] rounded-16 text-lg focus:outline-none focus:border-[#FF6B35] focus:ring-0 focus:shadow-[0_0_0_4px_rgba(255,107,53,0.15)] transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !code.trim()}
          className="px-7 py-4 rounded-14 font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:translate-y-[-2px] shadow-[0_4px_15px_rgba(123,200,67,0.4)]"
          style={{
            background:
              "linear-gradient(135deg, #7BC843, #5fa832)",
            fontFamily: "'Fredoka One', cursive",
          }}
        >
          {loading ? "Buscando..." : "Buscar Receita →"}
        </button>
      </div>
    </div>
  );
};