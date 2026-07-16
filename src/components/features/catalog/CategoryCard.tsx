"use client";

import { Share2 } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface CategoryCardProps {
  nome: string;
  imagem: string;
  onClick?: () => void;
}

export const CategoryCard = ({ nome, imagem, onClick }: CategoryCardProps) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const shareUrl = `${window.location.origin}/categoria/${slug}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AmiguMundo - ' + nome,
          text: 'Olha o que encontrei no AmiguMundo! Tudo sem ocupar espaço na memória do celular.',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess("Link copiado com sucesso!");
      }
    } catch (err) {
      console.warn("Erro ao compartilhar:", err);
      try {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess("Link copiado com sucesso!");
      } catch (clipErr) {
        console.error(clipErr);
      }
    }
  };

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer group w-full relative"
    >
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100 relative lg:max-w-[140px] lg:mx-auto">
        <img 
          src={imagem || `https://picsum.photos/seed/${encodeURIComponent(nome)}/400/400`} 
          alt={nome} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <button 
          onClick={handleShare}
          className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform text-gray-500 hover:text-gray-800 z-10"
          title="Compartilhar Categoria"
        >
          <Share2 size={12} />
        </button>
      </div>
      <span className="text-[#171717] text-[11px] sm:text-[13px] lg:text-xs font-black text-center uppercase tracking-tight truncate w-full mt-1.5">
        {nome}
      </span>
    </div>
  );
};