"use client";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
  // Mapeamento de imagens para as categorias (usando placeholders por enquanto)
  const categoryImages: Record<string, string> = {
    "Princesas": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=400&auto=format&fit=crop",
    "Personagens TV": "https://images.unsplash.com/photo-1558679908-541bcf1249ff?q=80&w=400&auto=format&fit=crop",
    "Super-Herois": "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=400&auto=format&fit=crop",
    "Animais da Fazenda": "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400&auto=format&fit=crop",
    "Animais Selvagens": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=400&auto=format&fit=crop",
    "Fundo do Mar": "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=400&auto=format&fit=crop",
  };

  const imageUrl = categoryImages[nome] || `https://picsum.photos/seed/${nome}/400/400`;

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden shadow-md card-hover group cursor-pointer">
      <img 
        src={imageUrl} 
        alt={nome} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
        <span className="text-white text-[0.75rem] sm:text-[0.85rem] font-black leading-tight uppercase tracking-tighter">
          {nome}
        </span>
      </div>
    </div>
  );
};