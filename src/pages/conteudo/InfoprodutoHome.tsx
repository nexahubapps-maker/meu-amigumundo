"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { InfoprodutoCrossSell } from "@/components/features/infoprodutos/InfoprodutoCrossSell";

const InfoprodutoHome = () => {
  const { infoprodutoId } = useParams<{ infoprodutoId: string }>();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [tituloProduto, setTituloProduto] = useState("");

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const [{ data: modulosData }, { data: produtoData }] = await Promise.all([
        supabase.from("conteudo_modulos").select("modulo_numero, titulo").eq("infoproduto_id", infoprodutoId).order("modulo_numero"),
        supabase.from("infoprodutos").select("nome").eq("codigo", infoprodutoId).maybeSingle(),
      ]);
      setModulos(modulosData || []);
      setTituloProduto(produtoData?.nome || (infoprodutoId || "").replace(/-/g, " "));
      setCarregando(false);
    };
    carregar();
  }, [infoprodutoId]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#5D0599]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="relative bg-gradient-to-br from-[#5D0599] to-[#2E0350] px-6 pt-16 pb-14 text-white overflow-hidden text-center">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#E8734A]/15 -mb-16 -ml-16" />
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest mb-5">
            <Sparkles size={12} className="text-[#F4D160]" /> Conteúdo AmiguMundo
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase leading-[1.05] tracking-tight capitalize">
            {tituloProduto}
          </h1>
        </div>
      </div>

      <div className="h-4 bg-[#FDFBF7] relative -mt-4">
        <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-[#5D0599]/20" />
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10 space-y-3">
        {modulos.length === 0 ? (
          <p className="text-center text-gray-400 font-bold text-sm py-10">Conteúdo em construção.</p>
        ) : (
          modulos.map((m) => (
            <button
              key={m.modulo_numero}
              onClick={() => navigate(`/conteudo/${infoprodutoId}/modulo/${m.modulo_numero}`)}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3.5 hover:shadow-md active:scale-[0.99] transition-all text-left"
            >
              <div className="w-11 h-11 rounded-full bg-[#5D0599]/10 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-[#5D0599]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-[#E8734A] uppercase tracking-widest">Módulo {m.modulo_numero}</p>
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{m.titulo}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 shrink-0" />
            </button>
          ))
        )}
      </div>

      <InfoprodutoCrossSell currentId={infoprodutoId || ""} />
    </div>
  );
};

export default InfoprodutoHome;