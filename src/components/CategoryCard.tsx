"use client";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
  return (
    <div className="flex flex-col items-center card-hover">
      <div 
        className="w-full h-[80px] bg-white rounded-[12px] flex items-center justify-center shadow-md cursor-pointer"
      >
        <span className="text-[2rem]">🧶</span>
      </div>
      <span className="text-[#171717] text-[0.7rem] font-semibold text-center mt-1 leading-tight uppercase tracking-tighter">
        {nome}
      </span>
    </div>
  );
};