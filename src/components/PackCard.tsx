"use client";

import { type Pack } from "@/data/packs";

interface PackCardProps {
  pack: Pack;
  inCart: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export const PackCard = ({ pack, inCart, onAdd, onRemove }: PackCardProps) => {
  return (
    <div className="neo-card overflow-hidden flex flex-col h-[300px]">
      <div className="relative h-[180px] w-full border-b-2 border-[#171717]">
        <img
          src={`https://picsum.photos/seed/${pack.id}/600/400`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-[#F8DD12] border-2 border-[#171717] text-[#171717] text-[10px] font-black px-3 py-1 rounded-[4px]">
          {pack.emoji} {pack.receitas} RECEITAS
        </div>
      </div>
      <div className="h-[120px] p-4 flex flex-col justify-between bg-white">
        <div>
          <h3 className="text-[1rem] font-black leading-tight truncate text-[#171717] uppercase">{pack.nome}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[#171717]/40 line-through text-[0.8rem]">R${pack.precoOriginal.toFixed(2)}</span>
            <span className="text-[1.1rem] font-black text-[#171717]">R${pack.precoAtual.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            disabled={inCart}
            className={`flex-1 py-2.5 text-[0.8rem] uppercase ${inCart ? 'bg-gray-100 text-gray-400 border-gray-300' : 'neo-btn-buy'}`}
          >
            {inCart ? "✓ ADICIONADO" : "+ ADICIONAR AO CARRINHO"}
          </button>
          {inCart && (
            <button 
              onClick={onRemove} 
              className="px-3 bg-white border-2 border-[#171717] rounded-[8px] text-red-500 font-black"
              style={{ boxShadow: '2px 2px 0px 0px #171717' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};