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
    <div className="bg-white rounded-xl border border-[#F5C842] p-2 shadow-sm text-left">
      <h2 className="text-[#E8472A] font-black text-[11px] mb-1 flex items-center gap-1.5 uppercase tracking-tight">
        🎁 SUPER MIMO AMIGUMUNDO
      </h2>
      
      <div className="space-y-1 mb-1.5">
        {levels.map((level, i) => {
          const isActive = cartCount >= level.recipes;
          return (
            <div key={i} className={`p-1 px-2 rounded-lg border text-[10px] transition-all ${isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="font-black text-gray-800 leading-none flex items-center justify-between">
                <span>{level.label}</span>
                <span className="text-xs">{level.emoji}</span>
              </div>
              <p className="text-[9px] text-gray-500 font-medium mt-0.5 leading-tight">
                <span className="font-bold text-gray-700">Bônus {level.name}:</span> {level.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-0.5 border-t border-gray-100 pt-1 text-[7px] text-gray-400 font-bold uppercase tracking-wide leading-tight">
        <p>* Apenas receitas avulsas são contabilizadas no carrinho.</p>
        <p>* Receitas bônus não são contabilizadas no carrinho.</p>
        <p>* Packs, Combos e Super Ofertas não são contabilizadas no carrinho.</p>
      </div>
    </div>
  );
};