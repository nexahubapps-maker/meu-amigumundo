"use client";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
  return (
    <div className="card-float overflow-hidden relative" style={{ height: "140px" }}>
      <div className="absolute inset-0">
        <img
          src={`https://picsum.photos/seed/${nome.toLowerCase().replace(/ /g, "-")}/400/300`}
          alt={nome}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3
          className="text-white text-base font-bold"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          {nome}
        </h3>
      </div>
    </div>
  );
};