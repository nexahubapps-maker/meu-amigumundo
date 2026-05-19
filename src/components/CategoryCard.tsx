"use client";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
  const categoryStyles: Record<string, { color: string; emoji: string }> = {
    "Princesas": { color: "#FF3D9A", emoji: "👸" },
    "Personagens TV": { color: "#4A90D9", emoji: "📺" },
    "Super-Herois": { color: "#9B59B6", emoji: "🦸" },
    "Animais da Fazenda": { color: "#F5A623", emoji: "🐄" },
    "Animais Selvagens": { color: "#7BC843", emoji: "🦁" },
    "Fundo do Mar": { color: "#2EC4B6", emoji: "🌊" },
    "Frutas e Verduras": { color: "#FF6B35", emoji: "🍓" },
    "Bebes e Fofuras": { color: "#FFB3C6", emoji: "👶" },
    "Natal e Festas": { color: "#e74c3c", emoji: "🎄" },
    "Religiosos": { color: "#8e44ad", emoji: "✝️" },
    "Bonecas": { color: "#FF3D9A", emoji: "🪆" },
    "Unicornios e Fantasia": { color: "#9B59B6", emoji: "🦄" },
    "Dinossauros": { color: "#27ae60", emoji: "🦕" },
    "Esportes": { color: "#2980b9", emoji: "⚽" },
    "Profissoes": { color: "#F5A623", emoji: "👷" },
    "Flores e Natureza": { color: "#7BC843", emoji: "🌸" },
  };

  const style = categoryStyles[nome] || { color: "#FF6B35", emoji: "🧶" };

  return (
    <div 
      className="rounded-2xl flex flex-col items-center justify-center p-2 h-[100px] sm:h-[120px] transition-transform active:scale-95 cursor-pointer shadow-sm"
      style={{ backgroundColor: style.color }}
    >
      <span className="text-3xl sm:text-4xl mb-1">{style.emoji}</span>
      <span className="text-white text-[0.75rem] sm:text-[0.85rem] font-bold text-center leading-tight">
        {nome}
      </span>
    </div>
  );
};