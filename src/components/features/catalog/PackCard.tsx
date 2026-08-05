"use client";

import { type Pack } from "@/data/packs";
import { Heart, Share2 } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { appendShareUTM } from "@/lib/tracking/utmify-service";

interface PackCardProps {
  pack: Pack & { imagem_url?: string };
  inCart: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAdd: () => void;
  onRemove: () => void;
}

export const PackCard = ({ pack, inCart, isFavorite, onToggleFavorite, onAdd, onRemove }: PackCardProps) => {
  const badge = pack.id === "pack1" ? { text: "MAIS VENDIDO", bg: "bg-[#44FF00] text-[#171717]" } : 
                pack.id === "pack2" ? { text: "NOVO", bg: "bg-blue-500 text-white" } : null;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = pack.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const shareUrl = appendShareUTM(`${window.location.origin}/pack/${slug}-${pack.id}`);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AmiguMundo - ' + pack.nome,
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
    <div className={`flex flex-col rounded-2xl overflow-hidden bg-white shadow-[0_12px_28px_rgba(0,0,0,0.15),_0_6px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200 ${inCart ? 'animate-pulse-subtle border-[#44FF00]' : ''}`}>
      <div className="relative aspect-square w-full bg-gray-50">
        <img
          src={pack.imagem_url || `https://picsum.photos/seed/${pack.id}/400/400`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        
        {badge && (
          <div className={`absolute top-2 left-2 ${badge.bg} text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider`}>
            {badge.text}
          </div>
        )}

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <button 
          onClick={handleShare}
          className="absolute top-12 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform text-gray-500 hover:text-gray-800"
          title="Compartilhar"
        >
          <Share2 size={20} />
        </button>
      </div>

      <div className="p-3 flex flex-col justify-between flex-1 bg-white">
        <div>
          <h3 className="text-xs sm:text-sm font-black leading-tight text-[#171717] uppercase tracking-tight line-clamp-2">
            {pack.nome}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1 leading-tight">
            {pack.descricao}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-gray-400 line-through text-[10px] sm:text-xs font-bold">R$ {pack.precoOriginal.toFixed(2)}</span>
            <span className="text-sm sm:text-base font-black text-[#171717]">R$ {pack.precoAtual.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex gap-1 mt-3">
          <button
            onClick={onAdd}
            disabled={inCart}
            className={`flex-1 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 ${
              inCart 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-[#44FF00] text-[#171717] hover:scale-[1.02]'
            }`}
          >
            {inCart ? "✓" : "Quero"}
          </button>
          {inCart && (
            <button 
              onClick={onRemove} 
              className="px-2.5 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};