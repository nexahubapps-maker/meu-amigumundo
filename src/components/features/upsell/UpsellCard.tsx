"use client";

import { type Upsell } from "@/data/upsells";
import { Heart, Share2 } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { appendShareUTM } from "@/lib/tracking/utmify-service";

interface UpsellCardProps {
  upsell: Upsell & { imagem_url?: string };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  onZoomImage?: (url: string) => void;
}

export const UpsellCard = ({ upsell, isFavorite, onToggleFavorite, onOpen, onZoomImage }: UpsellCardProps) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = upsell.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const shareUrl = appendShareUTM(`${window.location.origin}/infoproduto/${slug}-${upsell.id}`);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AmiguMundo - ' + upsell.nome,
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
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.35),0_10px_18px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_28px_55px_-10px_rgba(0,0,0,0.45)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square sm:aspect-[16/10] w-full bg-gray-50 cursor-pointer" onClick={onOpen}>
        <img 
          src={upsell.imagem_url || `https://picsum.photos/seed/${upsell.id}/600/375`} 
          alt={upsell.nome} 
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={(e) => {
            e.stopPropagation();
            if (upsell.imagem_url) {
              onZoomImage?.(upsell.imagem_url);
            }
          }}
        />
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform z-10 ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <button 
          onClick={handleShare}
          className="absolute top-12 right-2.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform text-gray-500 hover:text-gray-800 z-10"
          title="Compartilhar"
        >
          <Share2 size={20} />
        </button>
      </div>

      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-gray-900 leading-tight mb-1 uppercase tracking-tight line-clamp-2">
            {upsell.nome}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-gray-500 leading-snug mb-3 line-clamp-2 sm:line-clamp-3">
            {upsell.descricao}
          </p>
        </div>

        <button
          onClick={onOpen}
          className="w-full bg-[#171717] hover:bg-black text-white py-2 sm:py-2.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md flex items-center justify-center gap-1"
        >
          Saiba Mais →
        </button>
      </div>
    </div>
  );
};