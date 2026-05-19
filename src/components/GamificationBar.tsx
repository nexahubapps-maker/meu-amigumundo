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
    <div className="bg-white rounded-[20px] border-[3px] border-[#F5C842] p-4 sm:p-6 my-6 shadow-sm">
      <h2 className="text-[#E8472A] font-extrabold text-[1.1rem] mb-4 flex items-center gap-2">
        🎁 Super Mimo AmiguMundo
      </h2>
      
      <div className="space-y-3 mb-6">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🏅</span>
              <span className="text-sm font-bold text-gray-700">Bônus {level.name} ({level.recipes} un)</span>
            </div>
            <span className="text-sm font-extrabold text-[#4CAF50]">
              {level.price > 0 ? `R$ ${level.price.toFixed(2)} cada` : `GRÁTIS!`}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#4CAF50] transition-all duration-500"
            style={{ width: `${Math.min((cartCount / 10) * 100, 100)}%` }}
          />
        </div>
        
        {nextLevel && (
          <div className="inline-block bg-[#F5C842] px-4 py-1.5 rounded-full">
            <p className="text-[11px] sm:text-xs font-bold text-gray-900">
              Faltam {recipesLeft} receitas para o BÔNUS {nextLevel.name.toUpperCase()} {nextLevel.emoji}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};