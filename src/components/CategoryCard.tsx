"use client";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div 
        className="w-full h-[80px] bg-[#F8DD12] border-2 border-[#171717] rounded-[12px] flex items-center justify-center transition-all group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none"
        style={{ boxShadow: '4px 4px 0px 0px #171717' }}
      >
        <span className="text-[2.2rem] drop-shadow-[2px_2px_0px_#171717]">🧶</span>
      </div>
      <span className="text-[#171717] text-[0.7rem] font-black text-center mt-2 leading-tight uppercase tracking-tighter">
        {nome}
      </span>
    </div>
  );
};