"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShoppingBag, Search, ExternalLink, Sparkles } from "lucide-react";
import { getLojaParceiros, type SheetLojaParceiro } from "@/utils/sheets";

interface LojaAmiguMundoViewProps {
  onBack: () => void;
}

const CATEGORIAS = [
  { id: "fios_linhas", label: "Fios & Linhas", emoji: "🧶" },
  { id: "agulhas_ferramentas", label: "Agulhas & Ferramentas", emoji: "🪡" },
  { id: "materiais_amigurumi", label: "Materiais para Amigurumi", emoji: "👀" },
  { id: "organizacao", label: "Organização", emoji: "🧺" },
  { id: "kits", label: "Kits", emoji: "🎁" },
] as const;

function formatarPreco(preco: number | null): string | null {
  if (preco === null || isNaN(preco)) return null;
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const ProdutoCard = ({ produto }: { produto: SheetLojaParceiro }) => {
  const precoFormatado = formatarPreco(produto.preco);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col shrink-0 w-[168px] sm:w-full">
      <div className="aspect-square bg-gray-50">
        <img
          src={produto.imagem_url || `https://picsum.photos/seed/${produto.codigo}/300/300`}
          alt={produto.nome}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-[11px] font-black text-gray-900 uppercase leading-tight line-clamp-2">
          {produto.nome}
        </h3>
        {produto.descricao && (
          <p className="text-[10px] text-gray-500 font-medium leading-snug line-clamp-2">
            {produto.descricao}
          </p>
        )}
        <div className="mt-auto pt-1.5 flex items-center justify-between gap-2">
          {precoFormatado ? (
            <span className="text-xs font-black text-[#171717]">{precoFormatado}</span>
          ) : (
            <span className="text-[10px] font-bold text-gray-400 uppercase">Ver preço</span>
          )}
        </div>
        <a
          href={produto.link_externo}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-1 w-full flex items-center justify-center gap-1.5 bg-[#5D0599] text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-wide active:scale-95 transition-transform"
        >
          Ver Produto <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
};

export const LojaAmiguMundoView = ({ onBack }: LojaAmiguMundoViewProps) => {
  const [produtos, setProdutos] = useState<SheetLojaParceiro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    getLojaParceiros().then((lista) => {
      if (ativo) {
        setProdutos(lista.filter((p) => p.ativo));
        setCarregando(false);
      }
    });
    return () => {
      ativo = false;
    };
  }, []);

  const destaques = useMemo(() => produtos.filter((p) => p.destaque), [produtos]);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return produtos.filter((p) => {
      const bateCategoria = !categoriaAtiva || p.categoria === categoriaAtiva;
      const bateBusca =
        !termo ||
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo);
      return bateCategoria && bateBusca;
    });
  }, [produtos, busca, categoriaAtiva]);

  return (
    <div className="fixed inset-0 z-[95] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
      {/* Cabeçalho */}
      <div className="sticky top-0 z-10 bg-[#5D0599] py-4 px-4 flex items-center justify-between shadow-md shrink-0">
        <button
          onClick={onBack}
          className="text-white hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 font-black text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <h2 className="text-white font-black text-sm uppercase tracking-widest m-0 flex items-center gap-2">
          <ShoppingBag size={18} /> Loja AmiguMundo
        </h2>
        <div className="w-12" />
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#5D0599] to-[#7a1ac2] rounded-3xl p-5 sm:p-7 text-white shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/70 mb-1">
            Tudo para ajudar você a continuar criando
          </p>
          <h1 className="text-lg sm:text-2xl font-black leading-tight mb-2">
            Materiais e ferramentas selecionados pra quem ama amigurumi
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-md">
            Encontre produtos que podem facilitar seu trabalho, melhorar seus materiais e ajudar você a criar ainda mais — sem precisar sair procurando pela internet.
          </p>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="O que você está procurando?"
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#5D0599]/30"
          />
        </div>

        {carregando ? (
          <div className="py-16 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Carregando a vitrine...</p>
          </div>
        ) : (
          <>
            {/* Recomendados */}
            {destaques.length > 0 && !busca && !categoriaAtiva && (
              <div>
                <h2 className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                  <Sparkles size={13} className="text-[#5D0599]" />
                  Recomendados pelo AmiguMundo
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
                  {destaques.map((p) => (
                    <ProdutoCard key={p.codigo} produto={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Categorias */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setCategoriaAtiva(null)}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-black text-[10px] uppercase tracking-wide transition-colors ${
                  !categoriaAtiva ? "bg-[#171717] text-white" : "bg-white text-gray-600 border border-gray-100"
                }`}
              >
                Todas
              </button>
              {CATEGORIAS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoriaAtiva(c.id === categoriaAtiva ? null : c.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-[10px] uppercase tracking-wide transition-colors ${
                    categoriaAtiva === c.id ? "bg-[#171717] text-white" : "bg-white text-gray-600 border border-gray-100"
                  }`}
                >
                  <span>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>

            {/* Grade de produtos (só esta parte fica vazia esperando a planilha) */}
            {produtos.length === 0 ? (
              <div className="py-14 text-center bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
                <ShoppingBag size={26} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-black text-gray-700 uppercase tracking-wide mb-1">
                  Em breve, novidades por aqui
                </p>
                <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto">
                  Estamos preparando a seleção certinha de materiais e ferramentas pra você. Volte em breve!
                </p>
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <p className="text-center text-xs font-bold text-gray-400 py-10">
                Nada por aqui com esse filtro ainda. Tenta outra busca ou categoria.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {produtosFiltrados.map((p) => (
                  <ProdutoCard key={p.codigo} produto={p} />
                ))}
              </div>
            )}

            {/* Como funciona */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4">
                Como funciona
              </h2>
              <div className="space-y-3">
                {[
                  "Escolha o produto que deseja conhecer.",
                  "Clique em Ver Produto.",
                  "Você será direcionada pro site parceiro pra concluir.",
                ].map((texto, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#5D0599]/10 text-[#5D0599] flex items-center justify-center font-black text-[11px]">
                      {i + 1}
                    </span>
                    <p className="text-xs text-gray-600 font-medium pt-0.5">{texto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Texto institucional */}
            <div className="text-center px-2 py-2">
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-md mx-auto">
                Selecionamos produtos que podem ser úteis na sua jornada no amigurumi, de fios e agulhas a materiais, acessórios e itens pra organizar seu ateliê — pra facilitar sua busca e colocar boas opções ao seu alcance.
              </p>
            </div>
          </>
        )}

        {/* Aviso de afiliados, discreto */}
        <p className="text-center text-[10px] text-gray-400 font-medium leading-relaxed pt-2 pb-6">
          Alguns produtos desta página podem utilizar links de afiliados. Quando você compra por eles, o AmiguMundo pode receber uma comissão, sem custo adicional pra você.
        </p>
      </div>
    </div>
  );
};
