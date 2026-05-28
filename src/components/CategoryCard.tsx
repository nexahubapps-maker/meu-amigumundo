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
    "Bonecos": "https://ik.imagekit.io/di3huhaluc/bonecos.png",
    "Móbiles": "https://ik.imagekit.io/di3huhaluc/mobiles.png",
    "Minis": "https://ik.imagekit.io/di3huhaluc/minis.png",
    "Bruxas": "https://ik.imagekit.io/di3huhaluc/bruxas.jpeg",
    "Cachorros": "https://ik.imagekit.io/di3huhaluc/cachorros.jpeg",
    "Marinhos": "https://ik.imagekit.io/di3huhaluc/marinho.jpeg",
    "Comidinhas": "https://ik.imagekit.io/di3huhaluc/comidinhas.jpeg",
    "Prendedores": "https://ik.imagekit.io/di3huhaluc/prendedores.png",
    "Veículos": "https://ik.imagekit.io/di3huhaluc/carros.jpeg",
    "Natal": "https://ik.imagekit.io/di3huhaluc/natal.jpeg",
    "Profissões": "https://ik.imagekit.io/di3huhaluc/profiss%C3%B5es.jpeg",
    "Signos": "https://ik.imagekit.io/di3huhaluc/signos.jpeg",
    "Fadas": "https://ik.imagekit.io/di3huhaluc/fadas.jpeg",
    "Gatos": "https://ik.imagekit.io/di3huhaluc/gatos.jpeg",
    "Dragões": "https://ik.imagekit.io/di3huhaluc/drag%C3%B5es.jpeg",
    "Religiosos": "https://ik.imagekit.io/di3huhaluc/religiosos.jpeg",
    "Insetos": "https://ik.imagekit.io/di3huhaluc/insetos.jpeg",
    "Místicos": "https://ik.imagekit.io/di3huhaluc/misticos.jpeg",
    "Aves": "https://ik.imagekit.io/di3huhaluc/aves.jpeg",
    "Monstrinhos": "https://ik.imagekit.io/di3huhaluc/monstrinho.jpeg",
    "Acessórios": "https://ik.imagekit.io/di3huhaluc/acessorios.png",
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