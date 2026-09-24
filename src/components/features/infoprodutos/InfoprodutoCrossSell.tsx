"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInfoprodutos, type SheetInfoproduto } from "@/utils/sheets";
import { InfoprodutoSalesModal } from "./InfoprodutoSalesModal";

interface InfoprodutoCrossSellProps {
  currentId: string;
  isPremium?: boolean;
}

export const InfoprodutoCrossSell = ({ currentId, isPremium = false }: InfoprodutoCrossSellProps) => {
  const navigate = useNavigate();
  const [outros, setOutros] = useState<SheetInfoproduto[]>([]);
  const [selecionado, setSelecionado] = useState<SheetInfoproduto | null>(null);

  useEffect(() => {
    getInfoprodutos().then((lista) => {
      setOutros(lista.filter((i) => i.ativo && i.id !== currentId));
    });
  }, [currentId]);

  if (outros.length === 0) return null;

  const abrirItem = (item: SheetInfoproduto) => {
    if (isPremium) {
      try {
        navigate(new URL(item.link_entrega).pathname);
      } catch {
        console.warn("link_entrega inválido pro infoproduto:", item.id);
      }
      return;
    }
    setSelecionado(item);
  };

  return (
    <div className="bg-[#F1ECE3] py-10 px-5 border-t-2 border-dashed border-[#5D0599]/20">
      <p className="text-center text-[11px] font-black uppercase tracking-widest text-[#5D0599] mb-1">
        Continue evoluindo
      </p>
      <h3 className="text-center text-lg font-black text-gray-900 uppercase tracking-tight mb-6">
        Outros Conteúdos Pra Você
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory">
        {outros.map((item) => (
          <button
            key={item.id}
            onClick={() => abrirItem(item)}
            className="snap-start shrink-0 w-40 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left hover:-translate-y-1 transition-transform"
          >
            <div className="aspect-[4/3] bg-gray-50">
              <img src={item.imagem_url || `https://picsum.photos/seed/${item.id}/300/220`} alt={item.nome} className="w-full h-full object-cover" />
            </div>
            <div className="p-2.5">
              <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight mb-1">
                {item.nome}
              </p>
              {isPremium ? (
                <p className="text-[10px] font-black text-[#5D0599] uppercase tracking-wide">Abrir →</p>
              ) : (
                <p className="text-xs font-black text-[#5D0599]">R$ {item.preco.toFixed(2)}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {selecionado && !isPremium && (
        <InfoprodutoSalesModal infoproduto={selecionado} onClose={() => setSelecionado(null)} />
      )}
    </div>
  );
};