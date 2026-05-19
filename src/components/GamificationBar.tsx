"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { name: "Bronze", emoji: "🥉", recipes: 3, price: 3.00, color: "#CD7F32" },
    { name: "Prata", emoji: "🥈", recipes: 6, price: 2.00, color: "#A8A9AD" },
    { name: "Ouro", emoji: "🥇", recipes: 9, price: 1.00, color: "#FFD700" },
    { name: "Mimo", emoji: "🎁", recipes: 10, price: 0, color: "#E8689A" },
  ];

  const nextLevelIndex = levels.findIndex(l => cartCount < l.recipes);
  const nextLevel = nextLevelIndex !== -1 ? levels[nextLevelIndex] : null;
  const recipesLeft = nextLevel ? nextLevel.recipes - cartCount : 0;

  return (
    <div className="bg-white rounded-[20px] border-[2px] border-[#F5C842] p-3 sm:p-4 my-4 shadow-sm">
      <h2 className="text-[#E8472A] font-extrabold text-[0.95rem] mb-2 flex items-center gap-2">
        🎁 Super Mimo AmiguMundo
      </h2>
      
      <div className="space-y-1 mb-3">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🏅</span>
              <span className="text-[0.85rem] font-bold text-gray-700">Bônus {level.name} ({level.recipes} un)</span>
            </div>
            <span className="text-[0.85rem] font-extrabold text-[#4CAF50]">
              {level.price > 0 ? `R$ ${level.price.toFixed(2)} cada` : `GRÁTIS!`}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#4CAF50] transition-all duration-500"
            style={{ width: `${Math.min((cartCount / 10) * 100, 100)}%` }}
          />
        </div>
        
        {nextLevel && (
          <div className="inline-block bg-[#F5C842] px-3 py-1 rounded-full">
            <p className="text-[0.8rem] font-bold text-gray-900">
              Faltam {recipesLeft} receitas para o BÔNUS {nextLevel.name.toUpperCase()} {nextLevel.emoji}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};