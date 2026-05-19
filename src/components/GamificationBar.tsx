"use client";
import { useState } from "react";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const [levels] = useState([
    { name: "Bronze", emoji: "🥉", recipes: 3, price: 3.00, color: "#CD7F32" },
    { name: "Prata", emoji: "🥈", recipes: 6, price: 2.00, color: "#A8A9AD" },
    { name: "Ouro", emoji: "🥇", recipes: 9, price: 1.00, color: "#FFD700" },
    { name: "Mimo", emoji: "🎁", recipes: 10, price: 0, color: "#FF3D9A" },
  ]);

  const nextLevel = cartCount < 3 ? 0 : cartCount < 6 ? 1 : cartCount < 9 ? 2 : cartCount < 10 ? 3 : -1;
  const progress = nextLevel === -1 ? 100 : (cartCount / levels[nextLevel].recipes) * 100;

  return (
    <div className="card-float p-4 sm:p-6 my-4 sm:my-6 max-w-lg mx-auto relative">
      <h2 className="text-lg sm:text-2xl text-center mb-3 sm:mb-4 font-extrabold text-[#FF6B35]">
        🎁 Super Mimo AmiguMundo
      </h2>
      <div className="space-y-1.5 sm:space-y-2 mb-4">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center gap-2 text-[0.8rem] sm:text-base">
            <span className="text-base sm:text-lg">{level.emoji}</span>
            <span className="level-pill text-[0.7rem] sm:text-xs" style={{ backgroundColor: level.color, color: "white" }}>
              {level.name}: {level.recipes}
            </span>
            <span className="text-gray-500 truncate">
              {level.price > 0 ? `→ R$ ${level.price.toFixed(2)} cada` : `→ GRATIS!`}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-8 sm:h-12 rounded-full overflow-hidden bg-gray-100">
        <div className="gradient-progress h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <p className="text-center text-[0.75rem] sm:text-sm mt-2 text-gray-600 font-medium">
        Faltam {nextLevel === -1 ? 0 : levels[nextLevel].recipes - cartCount} receitas para o próximo nível
      </p>
    </div>
  );
};