"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { renderMarkdown } from "@/utils/markdown";

export const ModuleReader = () => {
  const { infoprodutoId, numero } = useParams<{ infoprodutoId: string; numero: string }>();
  const navigate = useNavigate();
  const [modulo, setModulo] = useState<{ titulo: string; conteudo_markdown: string } | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const { data } = await supabase
        .from("conteudo_modulos")
        .select("titulo, conteudo_markdown")
        .eq("infoproduto_id", infoprodutoId)
        .eq("modulo_numero", Number(numero))
        .single();
      setModulo(data);
      setCarregando(false);
    };
    carregar();
    window.scrollTo(0, 0);
  }, [infoprodutoId, numero]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#5D0599]" />
      </div>
    );
  }

  if (!modulo) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-500 font-bold">Esse módulo ainda não está disponível.</p>
        <button
          onClick={() => navigate(`/conteudo/${infoprodutoId}`)}
          className="text-[#5D0599] font-black text-xs uppercase tracking-wider"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(`/conteudo/${infoprodutoId}`)}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <p className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{modulo.titulo}</p>
      </div>

      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10">
        {renderMarkdown(modulo.conteudo_markdown)}
      </div>
    </div>
  );
};

export default ModuleReader;