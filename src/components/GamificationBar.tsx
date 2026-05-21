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
    <div className="bg-white rounded-xl border border-[#F5C842] p-2.5 shadow-sm text-left">
      <div className="space-y-1.5 mb-2">
        {levels.map((level, i) => {
          const isActive = cartCount >= level.recipes;
          return (
            <div key={i} className={`p-1.5 px-2.5 rounded-lg border text-xs transition-all ${isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="font-black text-gray-800 leading-none text-xs">
                {level.label}
              </div>
              <p className="text-[11px] text-gray-600 font-medium mt-0.5 leading-tight">
                {level.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-0.5 border-t border-gray-100 pt-1.5 text-[8px] text-gray-400 font-bold uppercase tracking-wide leading-tight">
        <p>* Apenas receitas avulsas são contabilizadas no carrinho.</p>
        <p>* Receitas bônus não são contabilizadas no carrinho.</p>
        <p>* Packs, Combos e Super Ofertas não são contabilizadas no carrinho.</p>
      </div>
    </div>
  );
};