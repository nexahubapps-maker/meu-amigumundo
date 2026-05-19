"use client";

import { useState } from "react";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
  const [hover, setHover] = useState(false);
  return (
    <div className="card-float overflow-hidden relative h-[110px] sm:h-[180px] rounded-xl shadow-lg bg-white cursor-pointer">
      <div className="relative h-full w-full">
        <img
          src={`https://picsum.photos/seed/${nome.toLowerCase().replace(/ /g, "-")}/400/300`}
          alt={nome}
          className={`w-full h-full object-cover transition-transform duration-300 ${hover ? "scale-110" : ""}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
        <div className="absolute inset-0 bg-black/40 flex items-end p-2 sm:p-4">
          <h3 className="text-white text-[0.85rem] sm:text-base font-bold leading-tight">
            {nome}
          </h3>
        </div>
      </div>
    </div>
  );
};