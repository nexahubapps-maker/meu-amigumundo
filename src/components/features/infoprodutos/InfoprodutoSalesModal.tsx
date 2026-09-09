"use client";

import { useNavigate } from "react-router-dom";
import { X, Lightbulb, CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import type { SheetInfoproduto } from "@/utils/sheets";

interface InfoprodutoSalesModalProps {
  infoproduto: SheetInfoproduto;
  onClose: () => void;
}

interface ConteudoVenda {
  subtitulo: string;
  bullets: string[];
}

const CONTEUDO_POR_PRODUTO: Record<string, ConteudoVenda> = {
  "instagram-profissional": {
    subtitulo: "Um perfil organizado vende mesmo enquanto você está ocupada crochetando.",
    bullets: [
      "Monte um perfil que passa profissionalismo já na primeira olhada",
      "Aprenda a fotografar seus amigurumis pra parecerem ainda mais desejáveis",
      "Saiba exatamente o que postar toda semana, sem depender de inspiração",
      "Responda no direct de um jeito que fecha venda, sem parecer forçado",
    ],
  },
  "pinterest-profissional": {
    subtitulo: "Descubra como aparecer pra quem já está procurando o que você faz.",
    bullets: [
      "Organize seu perfil pra aparecer nas buscas certas, pro público certo",
      "Crie Pins que fazem as pessoas pararem de rolar e clicarem",
      "Descubra as palavras que suas clientes realmente digitam ao procurar um presente",
      "Antecipe datas comemorativas e venda antes da concorrência",
    ],
  },
  "whatsapp-profissional": {
    subtitulo: "Transforme conversas em vendas, sem parecer robótica nem forçada.",
    bullets: [
      "Transforme seu WhatsApp comum num catálogo profissional, com respostas prontas",
      "Aprenda a responder objeções como \"achei caro\" sem perder a venda",
      "Descubra os melhores horários pra vender sem parecer inconveniente",
      "Monte uma rotina de pós-venda que faz a cliente comprar de novo",
    ],
  },
};

const CONTEUDO_PADRAO: ConteudoVenda = {
  subtitulo: "Um passo a passo prático pra vender mais, sem enrolação.",
  bullets: [
    "Passo a passo prático, sem enrolação",
    "Linguagem simples, pensada pra quem crocheta",
    "Aplicável ainda hoje, mesmo com pouco tempo livre",
    "Acesso vitalício — volte sempre que precisar consultar",
  ],
};

export const InfoprodutoSalesModal = ({ infoproduto, onClose }: InfoprodutoSalesModalProps) => {
  const navigate = useNavigate();
  const idConteudo = infoproduto.link_entrega?.split("/").filter(Boolean).pop() || "";
  const conteudo = CONTEUDO_POR_PRODUTO[idConteudo] || CONTEUDO_PADRAO;
  const precoOriginal = infoproduto.preco / 0.4;

  const handleComprar = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("amigumundo-cart") || "[]");
      const jaTem = cart.find((i: any) => i.id === infoproduto.id);
      const atualizado = jaTem ? cart : [...cart, { id: infoproduto.id, nome: infoproduto.nome, preco: infoproduto.preco, tipo: "upsell", imagem: infoproduto.imagem_url }];
      localStorage.setItem("amigumundo-cart", JSON.stringify(atualizado));
    } catch (e) {
      console.error("Erro ao adicionar ao carrinho:", e);
    }
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-[28px] rounded-t-[28px] max-h-[92vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-10 pb-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#F4D160] to-[#E8734A] flex items-center justify-center">
            <Lightbulb size={26} className="text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight text-gray-900">
            {infoproduto.nome}
          </h2>
          <p className="text-gray-500 italic text-sm font-medium mt-2 max-w-sm mx-auto">
            {conteudo.subtitulo}
          </p>

          <p className="text-sm text-gray-700 font-medium mt-4 text-left">
            {infoproduto.descricao}
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mt-5 text-left">
            <p className="text-xs font-black uppercase tracking-wider text-gray-700 mb-3">O que você vai receber:</p>
            <div className="space-y-2.5">
              {conteudo.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-[#3CB19E] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800 font-medium leading-snug">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-xl py-2.5 mt-5 text-xs font-black uppercase tracking-wider">
            <AlertTriangle size={14} /> Oferta por tempo limitado
          </div>

          <div className="mt-5">
            <p className="text-gray-400 line-through text-sm font-bold">De R$ {precoOriginal.toFixed(2)}</p>
            <p className="text-gray-900 font-black text-lg mt-1">
              Por apenas{" "}
              <span className="bg-[#3CB19E]/15 text-[#0E5E6F] px-2 py-1 rounded-lg">
                R$ {infoproduto.preco.toFixed(2)}
              </span>
            </p>
          </div>

          <button
            onClick={handleComprar}
            className="w-full bg-[#3CB19E] hover:bg-[#2c8577] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#3CB19E]/30 active:scale-[0.98] transition-all mt-5"
          >
            Adicionar e ir para o pagamento →
          </button>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-bold mt-3">
            <Lock size={12} /> Pagamento 100% seguro
          </p>
        </div>
      </div>
    </div>
  );
};
