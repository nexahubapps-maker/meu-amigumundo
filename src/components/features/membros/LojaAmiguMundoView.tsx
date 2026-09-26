"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShoppingBag, Search, ExternalLink, Sparkles, Check } from "lucide-react";
import { getLojaParceiros, type SheetLojaParceiro } from "@/utils/sheets";
import { SOMBRA_3D } from "@/lib/style3d";

interface LojaAmiguMundoViewProps {
  onBack: () => void;
}

const VERDE = "#3CB19E";
const VERDE_ATIVO = "#1F6F63";
const ROXO = "#5D0599";
const ROXO_ATIVO = "#42026b";

// 6 botões de menu (categorias + "Todas"), organizados em 2 linhas de 3.
const MENU_ITEMS: {
  id: string | null;
  label: string;
  emoji: string;
  cor: string;
  corAtiva: string;
}[] = [
  // linha 1 — verde / roxo / verde
  { id: null, label: "Todas", emoji: "🛍️", cor: VERDE, corAtiva: VERDE_ATIVO },
  { id: "materiais_amigurumi", label: "Materiais p/ Amigurumi", emoji: "👀", cor: ROXO, corAtiva: ROXO_ATIVO },
  { id: "fios_linhas", label: "Fios & Linhas", emoji: "🧶", cor: VERDE, corAtiva: VERDE_ATIVO },
  // linha 2 — roxo / verde / roxo
  { id: "kits", label: "Kits", emoji: "🎁", cor: ROXO, corAtiva: ROXO_ATIVO },
  { id: "agulhas_ferramentas", label: "Agulhas & Ferramentas", emoji: "🪡", cor: VERDE, corAtiva: VERDE_ATIVO },
  { id: "organizacao", label: "Organização", emoji: "🧺", cor: ROXO, corAtiva: ROXO_ATIVO },
];

const LINHA1 = MENU_ITEMS.slice(0, 3);
const LINHA2 = MENU_ITEMS.slice(3, 6);
const COLS_GRID = "grid-cols-[1fr_1.3fr_1.7fr]";

function formatarPreco(preco: number | null): string | null {
  if (preco === null || isNaN(preco)) return null;
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const ProdutoCard = ({ produto }: { produto: SheetLojaParceiro }) => {
  const precoFormatado = formatarPreco(produto.preco);

  return (
    <div className={`bg-white rounded-2xl overflow-hidden flex flex-col shrink-0 w-[168px] sm:w-full transition-transform duration-200 hover:-translate-y-1 ${SOMBRA_3D}`}>
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

      <div className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-6 py-5 space-y-6">
        {/* Hero */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-sm bg-[#5D0599] bg-cover bg-center aspect-[16/9] flex items-end"
          style={{ backgroundImage: "url('https://ik.imagekit.io/di3huhaluc/capa%20loja%20amigumundo%20premium.png')" }}
        >
          <div className="relative p-2.5 sm:p-3.5 w-full flex justify-start">
            <span
              className="inline-block px-3.5 py-1.5 rounded-xl"
              style={{ backgroundColor: VERDE }}
            >
              <span className="text-sm sm:text-lg font-black uppercase tracking-wide text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">
                Tudo para você continuar criando
              </span>
            </span>
          </div>
        </div>

        {/* Título e subtítulo, fora da imagem */}
        <div className="px-2 sm:px-0">
          <h1 className="text-lg sm:text-2xl font-black leading-tight text-gray-900 mb-2">
            Materiais e ferramentas selecionados pra quem ama amigurumi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-md">
            Encontre produtos que podem facilitar seu trabalho, melhorar seus materiais e ajudar você a criar ainda mais — sem precisar sair procurando pela internet.
          </p>
        </div>

        {/* Busca */}
        <div className="relative px-2 sm:px-0">
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
              <div className="px-2 sm:px-0">
                <h2 className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                  <Sparkles size={13} className="text-[#5D0599]" />
                  Recomendados pelo AmiguMundo
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
                  {destaques.map((p) => (
                    <ProdutoCard key={p.codigo} produto={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Menus (2 linhas de 3, pequeno/médio/grande, cores alternadas verde/roxo, com efeito 3D) */}
            <div className="px-2 sm:px-0 space-y-2">
              {[LINHA1, LINHA2].map((linha, linhaIdx) => (
                <div key={linhaIdx} className={`grid ${COLS_GRID} gap-2`}>
                  {linha.map((item) => {
                    const ativo = item.id !== null && categoriaAtiva === item.id;
                    return (
                      <button
                        key={item.label}
                        onClick={() => setCategoriaAtiva(item.id === categoriaAtiva ? null : item.id)}
                        style={{ backgroundColor: ativo ? item.corAtiva : item.cor }}
                        className={`relative flex flex-col items-center justify-center gap-0.5 py-3 px-1.5 rounded-2xl text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wide leading-tight text-center transition-transform active:scale-95 hover:-translate-y-0.5 duration-200 ${SOMBRA_3D}`}
                      >
                        {ativo && (
                          <span className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5">
                            <Check size={10} strokeWidth={3.5} style={{ color: item.corAtiva }} />
                          </span>
                        )}
                        <span className="text-base sm:text-lg">{item.emoji}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Grade de produtos (só esta parte fica vazia esperando a planilha) */}
            <div className="px-2 sm:px-0">
            {produtos.length === 0 ? (
              <div className={`py-14 text-center bg-white rounded-3xl px-6 ${SOMBRA_3D}`}>
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
            </div>

            {/* Como funciona */}
            <div className={`bg-white rounded-3xl p-5 mx-2 sm:mx-0 ${SOMBRA_3D}`}>
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
            <div className="text-center px-4 py-2">
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-md mx-auto">
                Selecionamos produtos que podem ser úteis na sua jornada no amigurumi, de fios e agulhas a materiais, acessórios e itens pra organizar seu ateliê — pra facilitar sua busca e colocar boas opções ao seu alcance.
              </p>
            </div>
          </>
        )}

        {/* Aviso de afiliados, discreto */}
        <p className="text-center text-[10px] text-gray-400 font-medium leading-relaxed pt-2 pb-6 px-4">
          Alguns produtos desta página podem utilizar links de afiliados. Quando você compra por eles, o AmiguMundo pode receber uma comissão, sem custo adicional pra você.
        </p>
      </div>
    </div>
  );
};
