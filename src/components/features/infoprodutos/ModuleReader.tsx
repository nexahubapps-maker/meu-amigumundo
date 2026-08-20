"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: (props) => (
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight mt-10 mb-4 pb-3 border-b-2 border-dashed border-[#5D0599]/20 first:mt-0" {...props} />
            ),
            h3: (props) => (
              <h3 className="text-base sm:text-lg font-black text-[#5D0599] uppercase tracking-tight mt-7 mb-3" {...props} />
            ),
            p: (props) => (
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium mb-4" {...props} />
            ),
            strong: (props) => <strong className="font-black text-gray-900" {...props} />,
            ul: (props) => <ul className="space-y-2 mb-5" {...props} />,
            li: (props) => (
              <li className="flex items-start gap-2 text-sm text-gray-700 font-medium leading-snug">
                <span className="text-[#E8734A] font-black shrink-0 mt-0.5">—</span>
                <span>{props.children}</span>
              </li>
            ),
            a: (props) => (
              <a className="text-[#5D0599] font-bold underline decoration-2 underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />
            ),
            hr: () => <div className="my-10 border-t-2 border-dashed border-[#5D0599]/20" />,
            table: (props) => (
              <div className="overflow-x-auto my-6 rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-xs sm:text-sm" {...props} />
              </div>
            ),
            thead: (props) => <thead className="bg-[#5D0599] text-white" {...props} />,
            th: (props) => <th className="px-3 py-2.5 text-left font-black uppercase tracking-wide text-[10px] sm:text-xs" {...props} />,
            td: (props) => <td className="px-3 py-2.5 border-t border-gray-100 text-gray-700 font-medium" {...props} />,
            blockquote: ({ children }) => {
              const bruto = JSON.stringify(children);
              let estilo = "bg-[#5D0599]/8 border-[#5D0599]/25";
              let rotulo = "DESTAQUE";
              if (bruto.includes("💡")) { estilo = "bg-[#E8734A]/8 border-[#E8734A]/25"; rotulo = "DICA"; }
              else if (bruto.includes("📊")) { estilo = "bg-[#5D0599]/8 border-[#5D0599]/25"; rotulo = "DADO"; }
              else if (bruto.includes("✅")) { estilo = "bg-[#3CB19E]/8 border-[#3CB19E]/25"; rotulo = "EXEMPLO"; }
              else if (bruto.includes("💬")) { estilo = "bg-gray-500/8 border-gray-300"; rotulo = "CITAÇÃO"; }
              return (
                <blockquote className={`border-l-4 rounded-r-2xl px-5 py-4 my-6 ${estilo}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{rotulo}</p>
                  <div className="text-sm text-gray-800 font-bold leading-relaxed [&>p]:m-0">{children}</div>
                </blockquote>
              );
            },
          }}
        >
          {modulo.conteudo_markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ModuleReader;