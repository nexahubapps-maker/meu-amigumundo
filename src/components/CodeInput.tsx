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
        setCode(""); 
      } else {
        onRecipeNotFound();
      }
    }
  };

  return (
    <div className="max-w-[360px] mx-auto my-4 px-4">
      <div className="relative group">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          maxLength={4}
          placeholder="digite o codigo"
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-xl font-black text-center focus:outline-none focus:border-[#F8DD12] transition-all placeholder:font-bold placeholder:text-gray-300 uppercase shadow-sm"
        />
      </div>
      <p className="text-center text-[9px] text-gray-400 mt-2 font-black uppercase tracking-[0.15em]">
        Busca automática ao digitar 4 números
      </p>
    </div>
  );
};