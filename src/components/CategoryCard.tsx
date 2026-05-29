"use client";

import { Share2 } from "lucide-react";
import { showSuccess } from "@/utils/toast";

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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const shareUrl = `${window.location.origin}/categoria/${slug}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Coleção ${nome} - AmiguMundo`,
          text: `Confira as melhores receitas de Amigurumi da categoria ${nome} no AmiguMundo!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess(`Link da categoria ${nome} copiado para a área de transferência!`);
      }
    } catch (err) {
      console.warn("Erro ao compartilhar:", err);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer group w-full relative"
    >
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100 relative">
        <img 
          src={imageUrl} 
          alt={nome} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Botão de Compartilhamento no Canto Superior Direito */}
        <button 
          onClick={handleShare}
          className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform text-gray-500 hover:text-gray-800 z-10"
          title="Compartilhar Categoria"
        >
          <Share2 size={12} />
        </button>
      </div>
      <span className="text-[#171717] text-[11px] sm:text-[13px] font-black text-center uppercase tracking-tight truncate w-full mt-1.5">
        {nome}
      </span>
    </div>
  );
};