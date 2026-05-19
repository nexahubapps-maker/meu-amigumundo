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
    <div className="max-w-[480px] mx-auto my-8 px-4">
      <div className="relative group">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          maxLength={4}
          placeholder="DIGITE O CÓDIGO"
          className="w-full px-6 py-6 border-2 border-gray-100 rounded-[20px] text-3xl font-black text-center focus:outline-none focus:border-[#F8DD12] transition-all placeholder:font-black placeholder:text-gray-200 uppercase shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
        />
      </div>
      <p className="text-center text-[10px] text-gray-400 mt-4 font-black uppercase tracking-[0.2em]">
        Busca automática ao digitar 4 números
      </p>
    </div>
  );
};