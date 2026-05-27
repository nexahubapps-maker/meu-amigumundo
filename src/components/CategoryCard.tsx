"use client";

interface CategoryCardProps {
  nome: string;
  onClick?: () => void;
}

export const CategoryCard = ({ nome, onClick }: CategoryCardProps) => {
  const categoryImages: Record<string, string> = {
    "Animais": "https://ik.imagekit.io/di3huhaluc/animais.jpeg",
    "Bonecas": "https://ik.imagekit.io/di3huhaluc/bonecas.jpeg",
    "Princesas": "https://ik.imagekit.io/di3huhaluc/princesas.jpeg",
    "Heróis": "https://ik.imagekit.io/di3huhaluc/herois.jpeg",
    "Naninhas": "https://ik.imagekit.io/di3huhaluc/naninhas.png",
    "Chocalhos": "https://ik.imagekit.io/di3huhaluc/chocalhos.png",
    "Games": "https://ik.imagekit.io/di3huhaluc/games.jpeg",
    "Filmes": "https://ik.imagekit.io/di3huhaluc/filmes.jpeg",
    "Animes": "https://ik.imagekit.io/di3huhaluc/animes.jpeg",
    "Plantas": "https://ik.imagekit.io/di3huhaluc/plantas.jpeg",
    "Dinossauros": "https://ik.imagekit.io/di3huhaluc/dinossauros.jpeg",
    "Desenhos": "https://ik.imagekit.io/di3huhaluc/desenhos.jpeg",
    "Minis": "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=400&auto=format&fit=crop",
    "Natal": "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop",
    "Marinhos": "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=400&auto=format&fit=crop",
    "Gatos": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop",
    "Cachorros": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop",
    "Comidinhas": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop",
  };

  const imageUrl = categoryImages[nome] || `https://picsum.photos/seed/${encodeURIComponent(nome)}/400/400`;

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer group w-full"
    >
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
        <img 
          src={imageUrl} 
          alt={nome} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <span className="text-[#171717] text-[11px] sm:text-[13px] font-black text-center uppercase tracking-tight truncate w-full mt-1.5">
        {nome}
      </span>
    </div>
  );
};