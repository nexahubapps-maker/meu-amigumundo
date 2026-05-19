"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { name: "Bronze", emoji: "🥉", recipes: 3, price: 3.00 },
    { name: "Prata", emoji: "🥈", recipes: 6, price: 2.00 },
    { name: "Ouro", emoji: "🥇", recipes: 9, price: 1.00 },
    { name: "Mimo", emoji: "🎁", recipes: 10, price: 0 },
  ];

  const nextLevelIndex = levels.findIndex(l => cartCount < l.recipes);
  const nextLevel = nextLevelIndex !== -1 ? levels[nextLevelIndex] : null;
  const recipesLeft = nextLevel ? nextLevel.recipes - cartCount : 0;

  return (
    <div className="neo-card bg-white p-4 my-6">
      <h2 className="text-[#171717] font-black text-[1.1rem] mb-4 flex items-center gap-2 uppercase italic">
        ⚡ SUPER MIMO AMIGUMUNDO
      </h2>
      
      <div className="space-y-2 mb-4">
        {levels.map((level, i) => (
          <div key={i} className={`flex items-center justify-between p-2 border-2 border-[#171717] rounded-[8px] ${cartCount >= level.recipes ? 'bg-[#44FF00]' : 'bg-white'}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{level.emoji}</span>
              <span className="text-[0.85rem] font-black text-[#171717] uppercase">{level.name} ({level.recipes} un)</span>
            </div>
            <span className="text-[0.85rem] font-black text-[#171717]">
              {level.price > 0 ? `R$ ${level.price.toFixed(2)} cada` : `GRÁTIS!`}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-4 bg-white border-2 border-[#171717] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#44FF00] border-r-2 border-[#171717] transition-all duration-500"
            style={{ width: `${Math.min((cartCount / 10) * 100, 100)}%` }}
          />
        </div>
        
        {nextLevel && (
          <div className="inline-block bg-[#F8DD12] border-2 border-[#171717] px-4 py-1.5 rounded-[8px]" style={{ boxShadow: '2px 2px 0px 0px #171717' }}>
            <p className="text-[0.8rem] font-black text-[#171717] uppercase">
              Faltam {recipesLeft} receitas para o BÔNUS {nextLevel.name} {nextLevel.emoji}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};