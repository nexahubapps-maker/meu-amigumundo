"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { name: "Bronze", emoji: "🥉", recipes: 3, price: 3.00, desc: "Você escolhe mais 3 receitas, por 3 reais cada." },
    { name: "Prata", emoji: "🥈", recipes: 6, price: 2.00, desc: "Você escolhe mais 3 receitas, por 2 reais cada." },
    { name: "Ouro", emoji: "🥇", recipes: 9, price: 1.00, desc: "Você escolhe mais 3 receitas, por 1 real cada." },
    { name: "SUPER BONUS", emoji: "🎁", recipes: 10, price: 0, desc: "Você pode escolher mais 3 receitas, GRATUITAS." },
  ];

  return (
    <div className="bg-white rounded-[20px] border-[2px] border-[#F5C842] p-4 sm:p-6 my-4 shadow-sm text-left">
      <h2 className="text-[#E8472A] font-black text-lg sm:text-xl mb-4 flex items-center gap-2 uppercase tracking-tight">
        🎁 SUPER MIMO AMIGUMUNDO
      </h2>
      
      <div className="space-y-4 mb-6">
        {levels.map((level, i) => {
          const isActive = cartCount >= level.recipes;
          return (
            <div key={i} className={`p-3 rounded-xl border transition-all ${isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-black text-gray-800">
                  {level.recipes} receitas no carrinho - Ativa o Bonus {level.name}:
                </span>
                <span className="text-lg">{level.emoji}</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">{level.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5 border-t border-gray-100 pt-4 text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide">
        <p>* Apenas receitas avulsas são contabilizadas no carrinho.</p>
        <p>* Receitas bônus não são contabilizadas no carrinho.</p>
        <p>* Packs, Combos e Super Ofertas não são contabilizadas no carrinho.</p>
      </div>
    </div>
  );
};