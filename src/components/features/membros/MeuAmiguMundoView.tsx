"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, User as UserIcon, Download, ExternalLink, Loader2, ShoppingBag, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type Perfil } from "@/utils/profile";
import { supabase } from "@/lib/supabase";
import { getRecipesByIds, getDriveFileUrl, getPacksByIds, getInfoprodutosByIds } from "@/utils/sheets";

interface MeuAmiguMundoViewProps {
  onBack: () => void;
}

const TABS = [
  "Minhas Compras",
  "Packs & Promoções",
  "Receitas Gratuitas",
  "Favoritos",
  "Ferramentas",
] as const;

type TabType = (typeof TABS)[number];

export const MeuAmiguMundoView = ({ onBack }: MeuAmiguMundoViewProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Perfil | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Minhas Compras");

  const [comprasList, setComprasList] = useState<any[]>([]);
  const [isLoadingCompras, setIsLoadingCompras] = useState(false);

  const [packsList, setPacksList] = useState<any[]>([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const p = await getProfile(user.id);
        setProfile(p);
      }
    }
    loadProfile();
  }, [user]);

  useEffect(() => {
    const fetchCompras = async () => {
      if (activeTab !== "Minhas Compras" || !user || comprasList.length > 0) return;
      setIsLoadingCompras(true);
      try {
        const { data } = await supabase
          .from("pedido_itens")
          .select("*, pedidos!inner(usuario_id, status)")
          .eq("pedidos.usuario_id", user.id)
          .eq("pedidos.status", "aprovado")
          .eq("tipo_produto", "receita");

        const itens = data || [];
        const resolved = await Promise.all(
          itens.map(async (item: any) => {
            const receitas = await getRecipesByIds([item.codigo_produto]);
            const categoria = receitas[0]?.categoria || "";
            const link = await getDriveFileUrl(item.codigo_produto, categoria);
            return { ...item, linkAcesso: link };
          })
        );
        setComprasList(resolved);
      } catch (e) {
        console.error("Erro ao carregar compras:", e);
      } finally {
        setIsLoadingCompras(false);
      }
    };
    fetchCompras();
  }, [activeTab, user, comprasList.length]);

  useEffect(() => {
    const fetchPacks = async () => {
      if (activeTab !== "Packs & Promoções" || !user || packsList.length > 0) return;
      setIsLoadingPacks(true);
      try {
        const { data } = await supabase
          .from("pedido_itens")
          .select("*, pedidos!inner(usuario_id, status)")
          .eq("pedidos.usuario_id", user.id)
          .eq("pedidos.status", "aprovado")
          .in("tipo_produto", ["pack", "infoproduto"]);

        const itens = data || [];
        const resolved = await Promise.all(
          itens.map(async (item: any) => {
            const results = item.tipo_produto === "pack"
              ? await getPacksByIds([item.codigo_produto])
              : await getInfoprodutosByIds([item.codigo_produto]);
            return { ...item, linkAcesso: results[0]?.link_entrega || null };
          })
        );
        setPacksList(resolved);
      } catch (e) {
        console.error("Erro ao carregar packs/infoprodutos:", e);
      } finally {
        setIsLoadingPacks(false);
      }
    };
    fetchPacks();
  }, [activeTab, user, packsList.length]);

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  };

  const displayName = profile?.nome || user?.email || "Visitante";
  const avatarUrl = profile?.foto_url;

  return (
    <div className="fixed inset-0 z-[90] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
      {/* Cabeçalho Fixo com Textura Laranja */}
      <div
        style={textureLaranjaStyle}
        className="sticky top-0 z-10 py-4 px-4 flex items-center justify-between shadow-md shrink-0"
      >
        <button
          onClick={onBack}
          className="text-white hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 font-black text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <h2 className="text-white font-black text-sm uppercase tracking-widest m-0">
          MEU AMIGUMUNDO
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Faixa de Perfil */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0 shadow-sm">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="text-gray-400" size={22} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
            Área de Membros
          </p>
          <h3 className="text-sm font-black text-gray-900 truncate uppercase leading-tight">
            {displayName}
          </h3>
        </div>
      </div>

      {/* Navegação de Abas (Estilo Instagram) */}
      <div className="bg-white border-b border-gray-200 px-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
        <nav className="flex space-x-6 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-xs font-black uppercase tracking-wider transition-colors relative border-b-2 ${
                  isActive
                    ? "border-[#171717] text-[#171717]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {activeTab === "Minhas Compras" ? (
          isLoadingCompras ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 size={32} className="animate-spin text-[#0E5E6F]" />
              <p className="text-xs font-bold uppercase tracking-wider">Carregando suas compras...</p>
            </div>
          ) : comprasList.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
              <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-black text-sm uppercase tracking-tight">
                Você ainda não comprou nenhuma receita avulsa.
              </p>
              <p className="text-gray-400 text-xs font-medium mt-1">
                Suas receitas compradas aparecerão aqui para você baixar sempre que quiser!
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                Suas Receitas Adquiridas ({comprasList.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {comprasList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center gap-3"
                  >
                    <img
                      src={item.imagem_url || `https://picsum.photos/seed/${item.codigo_produto}/150/150`}
                      alt={item.nome_produto}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-16">
                      <div>
                        <h4 className="text-xs font-black text-gray-900 uppercase leading-tight line-clamp-1">
                          {item.nome_produto}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
                          Código: {item.codigo_produto}
                        </span>
                      </div>

                      <div>
                        {item.linkAcesso ? (
                          <a
                            href={item.linkAcesso}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#44FF00] hover:bg-[#3ee600] active:scale-95 text-[#171717] px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shadow-sm"
                          >
                            <Download size={12} />
                            Baixar Receita (PDF)
                            <ExternalLink size={10} className="opacity-70" />
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg inline-block">
                            Link indisponível no momento
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : activeTab === "Packs & Promoções" ? (
          isLoadingPacks ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 size={32} className="animate-spin text-[#0E5E6F]" />
              <p className="text-xs font-bold uppercase tracking-wider">Carregando seus packs e promoções...</p>
            </div>
          ) : packsList.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
              <Package size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-black text-sm uppercase tracking-tight">
                Você ainda não comprou nenhum pack ou infoproduto.
              </p>
              <p className="text-gray-400 text-xs font-medium mt-1">
                Seus packs e cursos comprados aparecerão aqui para você acessar o conteúdo sempre que quiser!
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                Seus Packs & Cursos Adquiridos ({packsList.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packsList.map((item, idx) => {
                  const buttonLabel = item.tipo_produto === "pack" ? "Acessar Pasta" : "Acessar Conteúdo";
                  return (
                    <div
                      key={item.id || idx}
                      className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center gap-3"
                    >
                      <img
                        src={item.imagem_url || `https://picsum.photos/seed/${item.codigo_produto}/150/150`}
                        alt={item.nome_produto}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-16">
                        <div>
                          <h4 className="text-xs font-black text-gray-900 uppercase leading-tight line-clamp-1">
                            {item.nome_produto}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
                            {item.tipo_produto === "pack" ? "Pack Especial" : "Curso / Guia"}
                          </span>
                        </div>

                        <div>
                          {item.linkAcesso ? (
                            <a
                              href={item.linkAcesso}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#44FF00] hover:bg-[#3ee600] active:scale-95 text-[#171717] px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shadow-sm"
                            >
                              <ExternalLink size={12} />
                              {buttonLabel}
                            </a>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg inline-block">
                              Link indisponível no momento
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-sm w-full">
              <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">
                {activeTab}
              </p>
              <p className="text-gray-600 font-black text-sm uppercase">Em breve</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};