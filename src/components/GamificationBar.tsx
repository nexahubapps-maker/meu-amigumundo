"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { name: "Bronze", emoji: "🥉", recipes: 3, desc: "Você escolhe mais 3 receitas, por 3 reais cada.", label: "3 receitas no carrinho" },
    { name: "Prata", emoji: "🥈", recipes: 6, desc: "Você escolhe mais 3 receitas, por 2 reais cada.", label: "6 receitas no carrinho" },
    { name: "Ouro", emoji: "🥇", recipes: 9, desc: "Você escolhe mais 3 receitas, por 1 real cada.", label: "9 receitas no carrinho" },
    { name: "SUPER BONUS", emoji: "🎁", recipes: 10, desc: "Você pode escolher mais 3 receitas, GRATUITAS.", label: "10 receitas no carrinho" },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#F5C842] p-3.5 shadow-sm text-left">
      <h2 className="text-[#E8472A] font-black text-sm sm:text-base mb-2 flex items-center gap-1.5 uppercase tracking-tight">
        🎁 SUPER MIMO AMIGUMUNDO
      </h2>
      
      <div className="space-y-2 mb-3">
        {levels.map((level, i) => {
          const isActive = cartCount >= level.recipes;
          return (
            <div key={i} className={`p-2 px-3 rounded-lg border text-xs transition-all ${isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="font-black text-gray-800 leading-none flex items-center justify-between text-xs sm:text-sm">
                <span>{level.label}</span>
                <span className="text-sm sm:text-base">{level.emoji}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1 leading-tight">
                <span className="font-bold text-gray-700">Bônus {level.name}:</span> {level.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-1 border-t border-gray-100 pt-2 text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-tight">
        <p>* Apenas receitas avulsas são contabilizadas no carrinho.</p>
        <p>* Receitas bônus não são contabilizadas no carrinho.</p>
        <p>* Packs, Combos e Super Ofertas não são contabilizadas no carrinho.</p>
      </div>
    </div>
  );
};