"use client";

import { useState } from "react";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
  const [hover, setHover] = useState(false);
  return (
    <div className="card-float overflow-hidden relative h-160 sm:h-180 rounded-lg shadow-lg bg-white cursor-pointer">
      <div className="relative inset-0">
        <img
          src={`https://picsum.photos/seed/${nome.toLowerCase().replace(/ /g, "-")}/400/300`}
          alt={nome}
          className={`w-full h-full object-cover transition-transform duration-300 ${hover ? "scale-108" : ""}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/85 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-70">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-base font-bold text-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-family-'Fredoka One'">
              {nome}
            </h3>
          </div>
        </div>
      </div>
      {hover && (
        <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">🔍</span>
        </div>
      )}
    </div>
  );
};