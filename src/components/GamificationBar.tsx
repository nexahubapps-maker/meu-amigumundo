"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { 
      recipes: 3, 
      label: "🔖 Com 3 receitas no carrinho:", 
      desc: "Você pode escolher mais 3 receitas, por 3 reais cada." 
    },
    { 
      recipes: 6, 
      label: "🔖 Com 6 receitas no carrinho:", 
      desc: "Você pode escolher mais 3 receitas, por 2 reais cada." 
    },
    { 
      recipes: 9, 
      label: "🔖 Com 9 receitas no carrinho:", 
      desc: "Você pode escolher mais 3 receitas, por 1 real cada." 
    },
    { 
      recipes: 10, 
      label: "🔖 Com 10 receitas no carrinho:", 
      desc: "Você ganha o SUPER BONUS e pode escolher 3 receitas, GRATIS 🎁" 
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#F5C842] p-4 shadow-sm text-left">
      <h2 className="text-[#E8472A] font-black text-base sm:text-lg mb-3 flex items-center gap-1.5 uppercase tracking-tight">
        🎁 SUPER MIMO AMIGUMUNDO
      </h2>
      
      <div className="space-y-3 mb-3">
        {levels.map((level, i) => {
          const isActive = cartCount >= level.recipes;
          return (
            <div key={i} className={`p-3 px-4 rounded-lg border text-sm transition-all ${isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="font-black text-gray-800 leading-none text-sm sm:text-base">
                {level.label}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1.5 leading-tight">
                {level.desc}
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