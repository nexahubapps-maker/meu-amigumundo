"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { name: "Bronze", emoji: "🥉", recipes: 3, price: 3.00, color: "#CD7F32" },
    { name: "Prata", emoji: "🥈", recipes: 6, price: 2.00, color: "#A8A9AD" },
    { name: "Ouro", emoji: "🥇", recipes: 9, price: 1.00, color: "#FFD700" },
    { name: "Mimo", emoji: "🎁", recipes: 10, price: 0, color: "#FF3D9A" },
  ];

  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-4 my-4 text-white max-h-[180px] overflow-hidden shadow-lg">
      <h2 className="text-sm font-bold text-center mb-3 text-[#FF6B35] uppercase tracking-widest">
        🎁 Super Mimo AmiguMundo
      </h2>
      <div className="space-y-2">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center justify-between text-[0.75rem] sm:text-[0.8rem]">
            <div className="flex items-center gap-2">
              <span>{level.emoji}</span>
              <span className="font-bold" style={{ color: level.color }}>{level.name}</span>
              <span className="text-white/60">({level.recipes} un)</span>
            </div>
            <span className="font-medium">
              {level.price > 0 ? `R$ ${level.price.toFixed(2)} cada` : `GRÁTIS!`}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#7BC843] to-[#2EC4B6] transition-all duration-500"
          style={{ width: `${Math.min((cartCount / 10) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};