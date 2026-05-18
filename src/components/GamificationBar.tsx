"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { name: "Bronze", emoji: "🥉", recipes: 3, price: 3.0, color: "#CD7F32" },
    { name: "Prata", emoji: "🥈", recipes: 6, price: 2.0, color: "#A8A9AD" },
    { name: "Ouro", emoji: "🥇", recipes: 9, price: 1.0, color: "#FFD700" },
    { name: "Super Presente", emoji: "🎁", recipes: 10, price: 0, color: "#FF3D9A" },
  ];

  const nextLevel =
    cartCount < 3
      ? 0
      : cartCount < 6
      ? 1
      : cartCount < 9
      ? 2
      : cartCount < 10
      ? 3
      : -1;

  const progress =
    nextLevel === -1
      ? 100
      : (cartCount / levels[nextLevel].recipes) * 100;

  return (
    <div className="card-float p-6 my-6 max-w-lg mx-auto relative border-3 border-[#FF6B35] bg-gradient-to-b from-[#ffffff] to-[#FFF5EE] backdrop-filter-blur-2">
      <h2
        className="text-xl sm:text-2xl text-center mb-4"
        style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}
      >
        🎁 Super Mimo AmiguMundo
      </h2>

      <div className="space-y-2 mb-4">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-lg">{level.emoji}</span>
            <span
              className="px-4 py-1 rounded-full text-white font-bold"
              style={{ backgroundColor: level.color }}
            >
              {level.name}: {level.recipes} receitas
            </span>
            {level.price > 0 ? (
              <span className="text-gray-500">
                → ganhe 3 por R$ {level.price.toFixed(2)} cada
              </span>
            ) : (
              <span className="text-gray-500">→ 3 receitas GRÁTIS!</span>
            )}
          </div>
        ))}
      </div>

      <div className="relative h-12 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] via-[#F5A623] to-[#7BC843] transition-all duration-600"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>

      <p className="text-center text-sm mt-2 text-gray-600">
        Faltam{" "}
        {nextLevel === -1 ? 0 : levels[nextLevel].recipes - cartCount} receitas
        para o próximo nível
      </p>
    </div>
  );
};