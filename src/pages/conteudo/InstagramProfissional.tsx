"use client";

import { useState } from "react";
import { ChevronDown, Instagram, Camera, MessageCircle, Calendar, Sparkles } from "lucide-react";
import { InfoprodutoCrossSell } from "@/components/features/infoprodutos/InfoprodutoCrossSell";

const SECOES = [
  {
    icone: Camera,
    titulo: "Sua Bio Que Vende Sozinha",
    texto: "A bio é a vitrine da sua loja — e a maioria das artesãs deixa esse espaço sem dizer nada de verdade. Aqui vai a fórmula: o que você faz, pra quem, e como comprar, em até 3 linhas. Sem enrolação, sem emoji jogado aleatoriamente.",
    dica: "Troque 'Amo crochê ❤️' por 'Amigurumis sob encomenda • Envio pra todo Brasil • Peça pelo WhatsApp 👇'",
    imagem: "https://picsum.photos/seed/bio-instagram/800/600",
  },
  {
    icone: Instagram,
    titulo: "Destaques Que Fecham Venda",
    texto: "Seus destaques são o catálogo que a cliente vê antes de decidir se vale a pena continuar rolando o feed. Organize por categoria, não por data — 'Bonecas', 'Chaveiros', 'Como Comprar', 'Depoimentos'.",
    dica: "Todo destaque precisa responder uma pergunta: o que é, quanto custa, como pedir.",
    imagem: "https://picsum.photos/seed/destaques-insta/800/600",
  },
  {
    icone: Calendar,
    titulo: "O Que Postar Toda Semana",
    texto: "Não precisa postar todo dia — precisa postar com intenção. Uma semana simples: segunda (processo de produção), quarta (peça pronta com preço visível), sexta (depoimento ou bastidor), domingo (novidade da semana).",
    dica: "Peças em produção geram mais engajamento que peças prontas — mostre o processo, não só o resultado.",
    imagem: "https://picsum.photos/seed/conteudo-semanal/800/600",
  },
  {
    icone: MessageCircle,
    titulo: "Do Direct ao Pix",
    texto: "A cliente chamou no direct — e agora? Ter um roteiro pronto evita enrolação e fecha venda mais rápido: acolha, confirme o que ela quer, dê o preço com segurança, e já direcione pro pagamento.",
    dica: "Nunca deixe uma pergunta de preço sem resposta em menos de algumas horas — é aí que a venda esfria.",
    imagem: "https://picsum.photos/seed/direct-venda/800/600",
  },
];

const InstagramProfissional = () => {
  const [aberto, setAberto] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="relative bg-gradient-to-br from-[#5D0599] to-[#2E0350] px-6 pt-16 pb-24 text-white overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#E8734A]/15 -mb-16 -ml-16" />
        <div className="relative max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest mb-5">
            <Sparkles size={12} className="text-[#F4D160]" /> Conteúdo AmiguMundo
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase leading-[1.05] tracking-tight">
            O Guia do Instagram Que Vende Amigurumi
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-medium mt-4 max-w-lg mx-auto leading-relaxed">
            O passo a passo prático pra transformar sua bio, seus destaques e seu feed em máquina de vender — sem precisar virar expert em marketing.
          </p>
        </div>
      </div>

      <div className="h-4 bg-[#FDFBF7] relative -mt-4">
        <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-[#5D0599]/20" />
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10 space-y-5">
        {SECOES.map((secao, i) => {
          const Icone = secao.icone;
          const estaAberto = aberto === i;
          return (
            <div
              key={i}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 100}ms`, animationDuration: "600ms", animationFillMode: "backwards" }}
            >
              <div className="aspect-[16/9] bg-gray-50">
                <img src={secao.imagem} alt={secao.titulo} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => setAberto(estaAberto ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-[#5D0599]/10 flex items-center justify-center shrink-0">
                  <Icone size={17} className="text-[#5D0599]" />
                </div>
                <h3 className="flex-1 text-sm font-black text-gray-900 uppercase tracking-tight leading-snug">
                  {secao.titulo}
                </h3>
                <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform ${estaAberto ? "rotate-180" : ""}`} />
              </button>
              {estaAberto && (
                <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-300">
                  <p className="text-sm text-gray-700 leading-relaxed font-medium mb-3">
                    {secao.texto}
                  </p>
                  <div className="bg-[#E8734A]/8 border border-[#E8734A]/20 rounded-xl px-3.5 py-3 flex items-start gap-2.5">
                    <span className="text-[#E8734A] font-black text-xs shrink-0">DICA</span>
                    <span className="text-xs text-gray-700 font-bold leading-snug">{secao.dica}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <InfoprodutoCrossSell currentId="instagram-profissional" />
    </div>
  );
};

export default InstagramProfissional;