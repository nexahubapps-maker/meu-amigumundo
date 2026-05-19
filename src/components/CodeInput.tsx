"use client";

import { useState } from "react";
import { recipes, type Recipe } from "@/data/recipes";

interface CodeInputProps {
  onRecipeFound: (recipe: Recipe) => void;
  onRecipeNotFound: () => void;
}

export const CodeInput = ({ onRecipeFound, onRecipeNotFound }: CodeInputProps) => {
  const [code, setCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setCode(value);

    if (value.length === 4) {
      const recipe = recipes.find((r) => r.id === value);
      if (recipe) {
        onRecipeFound(recipe);
        setCode(""); // Limpa após encontrar
      } else {
        onRecipeNotFound();
      }
    }
  };

  return (
    <div className="max-w-[480px] mx-auto my-6">
      <div className="relative">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          maxLength={4}
          placeholder="Digite o código de 4 dígitos (ex: 3872)"
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-lg font-bold text-center focus:outline-none focus:border-[#E8472A] transition-colors placeholder:font-medium placeholder:text-gray-300"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E8472A] font-bold text-sm">
          {code.length}/4
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2 font-medium">
        A busca é automática ao digitar os 4 números
      </p>
    </div>
  );
};