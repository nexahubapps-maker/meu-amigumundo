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
    <div className="max-w-[480px] mx-auto my-8">
      <div className="relative">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          maxLength={4}
          placeholder="DIGITE O CÓDIGO DE 4 DÍGITOS"
          className="w-full px-6 py-5 border-4 border-[#171717] rounded-[16px] text-2xl font-black text-center focus:outline-none focus:bg-[#F8DD12] transition-colors placeholder:font-black placeholder:text-[#171717]/20 uppercase"
          style={{ boxShadow: '6px 6px 0px 0px #171717' }}
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#171717] font-black text-lg italic">
          {code.length}/4
        </div>
      </div>
      <p className="text-center text-[10px] text-[#171717] mt-4 font-black uppercase tracking-widest">
        A busca é automática ao digitar os 4 números
      </p>
    </div>
  );
};