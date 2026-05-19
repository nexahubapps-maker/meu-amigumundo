"use client";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
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
    <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 card-hover group cursor-pointer flex flex-col gap-2">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
        <img 
          src={imageUrl} 
          alt={nome} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <span className="text-[#171717] text-[0.75rem] font-black text-center uppercase tracking-tight truncate px-1">
        {nome}
      </span>
    </div>
  );
};