"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon, ExternalLink, Loader2, Pencil, LogOut, Heart, Trash2, Printer, Calculator, ListChecks, Ruler, Palette, Lock, Wrench, BookOpen, ShoppingBag } from "lucide-react";
import { VisualizadorPDF } from "./VisualizadorPDF";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type Perfil } from "@/utils/profile";
import { supabase } from "@/lib/supabase";
import { getRecipesByIds, getDriveFileUrl, getPacksByIds, getInfoprodutosByIds, getInfoprodutos, type SheetInfoproduto, getReceitaGratuitaDownloadUrl, getCategories, getRecipesByCategoria } from "@/utils/sheets";
import { CompleteProfileModal } from "@/components/CompleteProfileModal";
import { CalculadoraPreco } from "@/components/features/ferramentas/CalculadoraPreco";
import { ContadorCarreiras } from "@/components/features/ferramentas/ContadorCarreiras";
import { ConversorAgulha } from "@/components/features/ferramentas/ConversorAgulha";
import { CombinadorCores } from "@/components/features/ferramentas/CombinadorCores";
import { LightboxModal } from "@/components/features/catalog/LightboxModal";
import { ArtesaProfileHeader } from "@/components/features/membros/ArtesaProfileHeader";
import { UpsellCard } from "@/components/features/upsell/UpsellCard";
import { LojaAmiguMundoView } from "@/components/features/membros/LojaAmiguMundoView";
import { SOMBRA_3D } from "@/lib/style3d";

interface MeuAmiguMundoViewProps {
  onBack: () => void;
  onAddToCart: (items: any[]) => void;
  esconderBotaoVoltar?: boolean;
}

type TabType = "Catálogo" | "Favoritos" | "Ferramentas";

const MENUS = [
  { id: "Catálogo", label: "Galeria", icone: BookOpen, cor: "#3CB19E", corAtiva: "#1F6F63" },
  { id: "Favoritos", label: "Favoritos", icone: Heart, cor: "#5D0599", corAtiva: "#42026b" },
  { id: "Ferramentas", label: "Ferramentas", icone: Wrench, cor: "#3CB19E", corAtiva: "#1F6F63" },
];

const FERRAMENTAS = [
  { id: "calculadora-preco", nome: "Calculadora de Preço", descricao: "Descubra o preço justo pra vender", icone: Calculator, disponivel: true },
  { id: "contador", nome: "Contador de Carreiras e Pontos", descricao: "Nunca mais perca a conta", icone: ListChecks, disponivel: true },
  { id: "conversor", nome: "Conversor de Agulha/Fio", descricao: "Tabela de conversão rápida", icone: Ruler, disponivel: true },
  { id: "cores", nome: "Combinador de Cores", descricao: "Paletas harmônicas pro seu amigurumi", icone: Palette, disponivel: true },
];

export const MeuAmiguMundoView = ({ onBack, onAddToCart }: MeuAmiguMundoViewProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Perfil | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Catálogo");

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [categoriaSelecionadaCatalogo, setCategoriaSelecionadaCatalogo] = useState<any | null>(null);
  const [receitasDaCategoriaSelecionada, setReceitasDaCategoriaSelecionada] = useState<any[]>([]);
  const [isLoadingReceitasCategoria, setIsLoadingReceitasCategoria] = useState(false);

  const [infoprodutosList, setInfoprodutosList] = useState<SheetInfoproduto[]>([]);
  const ateliePromissionalRef = useRef<HTMLDivElement>(null);

  const [favoritosList, setFavoritosList] = useState<any[]>([]);
  const [isLoadingFavoritos, setIsLoadingFavoritos] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isConfirmSairOpen, setIsConfirmSairOpen] = useState(false);
  const [ferramentaAberta, setFerramentaAberta] = useState<string | null>(null);
  const [lojaParceirosAberta, setLojaParceirosAberta] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const recarregarPerfil = async () => {
    if (user) {
      const p = await getProfile(user.id);
      setProfile(p);
    }
  };

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
    if (activeTab === "Catálogo" && categoriesList.length === 0) {
      getCategories().then(setCategoriesList);
    }
  }, [activeTab, categoriesList.length]);

  useEffect(() => {
    if (activeTab === "Catálogo" && infoprodutosList.length === 0) {
      getInfoprodutos().then((lista) => setInfoprodutosList(lista.filter((i) => i.ativo)));
    }
  }, [activeTab, infoprodutosList.length]);

  useEffect(() => {
    const fetchReceitasDaCategoria = async () => {
      if (!categoriaSelecionadaCatalogo) return;
      setIsLoadingReceitasCategoria(true);
      try {
        const receitas = await getRecipesByCategoria(categoriaSelecionadaCatalogo.id);
        const resolved = await Promise.all(
          receitas.map(async (r: any) => {
            const link = await getDriveFileUrl(r.id, r.categoria);
            return { ...r, linkAcesso: link };
          })
        );
        setReceitasDaCategoriaSelecionada(resolved);
      } catch (e) {
        console.error("Erro ao carregar receitas da categoria:", e);
        setReceitasDaCategoriaSelecionada([]);
      } finally {
        setIsLoadingReceitasCategoria(false);
      }
    };
    fetchReceitasDaCategoria();
  }, [categoriaSelecionadaCatalogo]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!user || favoritosList.length > 0) return;
      setIsLoadingFavoritos(true);
      try {
        const { data } = await supabase
          .from("favoritos")
          .select("*")
          .eq("usuario_id", user.id)
          .order("favoritado_em", { ascending: false });
        setFavoritosList(data || []);
      } catch (e) {
        console.error("Erro ao carregar favoritos:", e);
      } finally {
        setIsLoadingFavoritos(false);
      }
    };
    fetchFavoritos();
  }, [user, favoritosList.length]);

  const removerFavorito = async (item: any) => {
    await supabase.from("favoritos").delete().eq("id", item.id);
    setFavoritosList((prev) => prev.filter((f) => f.id !== item.id));
  };

  const toggleFavoritoReceita = async (item: any) => {
    if (!user) return;
    const existente = favoritosList.find((f) => f.codigo_item === item.id);
    if (existente) {
      await supabase.from("favoritos").delete().eq("id", existente.id);
      setFavoritosList((prev) => prev.filter((f) => f.id !== existente.id));
    } else {
      const { data } = await supabase
        .from("favoritos")
        .insert({ usuario_id: user.id, tipo_item: "receita", codigo_item: item.id, nome_item: item.nome, imagem_url: item.imagem_url })
        .select()
        .single();
      if (data) setFavoritosList((prev) => [data, ...prev]);
    }
  };

  const CAPA_PREMIUM_URL = "https://ik.imagekit.io/di3huhaluc/capa%20do%20app%20mestre%20cuca%20premium.png";

  const displayName = profile?.nome || user?.email || "Visitante";
  const avatarUrl = profile?.foto_url;

  const handleSignOut = async () => {
    await signOut();
  };

  const getLinkVisualizacao = (linkDownload: string | null): string | null => {
    if (!linkDownload) return null;
    const match = linkDownload.match(/id=([^&]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/view` : linkDownload;
  };

  const extrairFileId = (linkDownload: string | null): string | null => {
    if (!linkDownload) return null;
    const match = linkDownload.match(/id=([^&]+)/);
    return match ? match[1] : null;
  };

  const [pdfAberto, setPdfAberto] = useState<{ fileId: string; titulo: string } | null>(null);

  return (
    <div className="fixed inset-0 z-[90] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
      <div className="sm:max-w-6xl sm:mx-auto sm:mt-6">
        <ArtesaProfileHeader
          nome={displayName}
          nomeAtelie={profile?.nome_atelie}
          fotoUrl={avatarUrl}
          bio={profile?.bio}
          cidade={profile?.cidade}
          tagEspecialidade={profile?.tag_especialidade}
          capaUrl={CAPA_PREMIUM_URL}
          onEditarPerfil={() => setIsEditProfileOpen(true)}
          onSair={() => setIsConfirmSairOpen(true)}
        />
      </div>

      <div className="border-t border-b border-gray-100 bg-white sticky top-0 z-[5] px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          {MENUS.map((menu) => {
            const Icone = menu.icone;
            const isActive = activeTab === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => setActiveTab(menu.id as TabType)}
                style={{
                  backgroundColor: menu.cor,
                  borderColor: isActive ? menu.corAtiva : "transparent",
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wide text-white border-2 transition-all active:scale-95 hover:-translate-y-0.5 duration-200 ${SOMBRA_3D}`}
              >
                <Icone size={14} /> {menu.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Atalho pro Ateliê Lucrativo (infoprodutos bônus) */}
      <div className="border-t border-gray-100 bg-white px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab("Catálogo");
              setCategoriaSelecionadaCatalogo(null);
              setTimeout(() => ateliePromissionalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wide text-white bg-[#5D0599] active:scale-95 transition-transform hover:-translate-y-0.5 duration-200 ${SOMBRA_3D}`}
          >
            Ateliê Lucrativo
          </button>
          <button
            onClick={() => setLojaParceirosAberta(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wide text-white bg-[#5D0599] active:scale-95 transition-transform hover:-translate-y-0.5 duration-200 ${SOMBRA_3D}`}
          >
            <ShoppingBag size={13} />
            Loja AmiguMundo
          </button>
        </div>
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      {activeTab && (
        <div className="flex-1 p-4 sm:p-6">
          {activeTab === "Catálogo" ? (
            categoriaSelecionadaCatalogo ? (
              <div className="max-w-6xl mx-auto space-y-3">
                <button
                  onClick={() => { setCategoriaSelecionadaCatalogo(null); setReceitasDaCategoriaSelecionada([]); }}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-600 hover:text-gray-900 mb-2"
                >
                  <ArrowLeft size={14} /> Voltar às categorias
                </button>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                  {categoriaSelecionadaCatalogo.titulo} ({receitasDaCategoriaSelecionada.length})
                </p>
                {isLoadingReceitasCategoria ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500">
                    <Loader2 size={32} className="animate-spin text-[#0E5E6F]" />
                    <p className="text-xs font-bold uppercase tracking-wider">Carregando receitas...</p>
                  </div>
                ) : receitasDaCategoriaSelecionada.length === 0 ? (
                  <p className="text-xs text-gray-400 font-bold text-center py-10">Nenhuma receita nessa categoria ainda.</p>
                ) : (
                  <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4">
                    {receitasDaCategoriaSelecionada.map((item) => {
                      const isFav = favoritosList.some((f) => f.codigo_item === item.id);
                      return (
                      <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between p-1">
                        <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg">
                          <img
                            src={item.imagem_url || `https://picsum.photos/seed/${item.id}/400/400`}
                            alt={item.nome}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => setZoomImage(item.imagem_url || `https://picsum.photos/seed/${item.id}/400/400`)}
                          />
                          <button
                            onClick={() => toggleFavoritoReceita(item)}
                            className={`absolute top-1 right-1 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md ${isFav ? "text-[#44FF00]" : "text-gray-400"}`}
                          >
                            <Heart size={13} fill={isFav ? "currentColor" : "none"} />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm text-white text-[7px] lg:text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                            ({item.id})
                          </div>
                        </div>
                        <div className="pt-1.5 flex flex-col justify-between flex-1">
                          <h4 className="text-[9px] lg:text-xs font-black text-gray-800 uppercase tracking-tight line-clamp-1 leading-none mb-1.5">
                            {item.nome}
                          </h4>
                          <div className="flex flex-col gap-1">
                            {item.linkAcesso ? (
                              <>
                                <button
                                  onClick={() => {
                                    const fileId = extrairFileId(item.linkAcesso);
                                    if (fileId) setPdfAberto({ fileId, titulo: item.nome });
                                  }}
                                  className="flex items-center justify-center gap-1 bg-[#5D0599] text-white py-1 rounded-lg font-black text-[8px] lg:text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                                >
                                  <ExternalLink size={10} /> Abrir
                                </button>
                                <button
                                  onClick={() => {
                                    const fileId = extrairFileId(item.linkAcesso);
                                    if (fileId) setPdfAberto({ fileId, titulo: item.nome });
                                  }}
                                  className="flex items-center justify-center gap-1 bg-gray-100 text-gray-800 py-1 rounded-lg font-black text-[8px] lg:text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                                >
                                  <Printer size={10} /> Imprimir
                                </button>
                              </>
                            ) : (
                              <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 py-1 rounded-lg text-center">
                                Indisponível
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                  Todas as Categorias
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {categoriesList.filter((cat) => cat.ativo).map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setCategoriaSelecionadaCatalogo(cat)}
                      className="flex flex-col items-center cursor-pointer group w-full relative"
                    >
                      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-[0_8px_20px_rgba(0,0,0,0.12),_0_4px_8px_rgba(0,0,0,0.08)] border-2 border-gray-200/80 relative lg:max-w-[140px] lg:mx-auto transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={cat.imagem_url || `https://picsum.photos/seed/${encodeURIComponent(cat.titulo)}/400/400`}
                          alt={cat.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[#171717] text-[11px] sm:text-[13px] lg:text-xs font-black text-center uppercase tracking-tight truncate w-full mt-1.5">
                        {cat.titulo}
                      </span>
                    </div>
                  ))}
                </div>

                {infoprodutosList.length > 0 && (
                  <div ref={ateliePromissionalRef} className="mt-10 pt-8 border-t border-gray-200">
                    <img
                      src="https://ik.imagekit.io/di3huhaluc/atelie%20amigumundo%202.png"
                      alt="Ateliê Lucrativo"
                      className="w-full h-auto rounded-2xl mb-6"
                    />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {infoprodutosList.map((info) => (
                        <UpsellCard
                          key={info.id}
                          upsell={{
                            id: info.id,
                            nome: info.nome,
                            descricao: "",
                            descricaoLonga: "",
                            precoOriginal: 0,
                            precoAtual: 0,
                            emoji: "💡",
                            cor: "#5D0599",
                            beneficios: [],
                            copiaVendas: [],
                            imagem_url: info.imagem_url,
                          }}
                          mostrarAcoes={false}
                          ctaLabel="Abrir"
                          onOpen={() => {
                            try {
                              const path = new URL(info.link_entrega).pathname;
                              navigate(path);
                            } catch {
                              console.warn("link_entrega inválido pro infoproduto:", info.id);
                            }
                          }}
                          onZoomImage={setZoomImage}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          ) : activeTab === "Favoritos" ? (
            isLoadingFavoritos ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 size={32} className="animate-spin text-[#0E5E6F]" />
                <p className="text-xs font-bold uppercase tracking-wider">Carregando seus favoritos...</p>
              </div>
            ) : favoritosList.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
                <Heart size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-700 font-black text-sm uppercase tracking-tight">
                  Você ainda não favoritou nada.
                </p>
                <p className="text-gray-400 text-xs font-medium mt-1">
                  Toque no coração dos itens da loja para salvá-los aqui e acessar rapidinho!
                </p>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto space-y-3">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                  Seus Itens Favoritados ({favoritosList.length})
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoritosList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center gap-3"
                    >
                      <img
                        src={item.imagem_url || `https://picsum.photos/seed/${item.codigo_item}/150/150`}
                        alt={item.nome_item}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-16">
                        <div>
                          <h4 className="text-xs font-black text-gray-900 uppercase leading-tight line-clamp-1">
                            {item.nome_item}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
                            Código: {item.codigo_item}
                          </span>
                        </div>

                        <div>
                          <button
                            onClick={() => removerFavorito(item)}
                            className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 active:scale-95 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                          >
                            <Trash2 size={12} />
                            Remover dos Favoritos
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : activeTab === "Ferramentas" ? (
            <div className="max-w-6xl mx-auto">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                Ferramentas Gratuitas
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FERRAMENTAS.map((f) => {
                  const Icone = f.icone;
                  return (
                    <button
                      key={f.id}
                      onClick={() => f.disponivel && setFerramentaAberta(f.id)}
                      disabled={!f.disponivel}
                      className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 transition-all ${
                        f.disponivel ? "hover:shadow-md active:scale-95 cursor-pointer" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#44FF00]/15 flex items-center justify-center relative">
                        <Icone size={22} className="text-[#171717]" />
                        {!f.disponivel && (
                          <div className="absolute -top-1 -right-1 bg-gray-300 rounded-full p-1">
                            <Lock size={10} className="text-[#171717]" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-[11px] font-black text-gray-900 uppercase leading-tight">{f.nome}</h4>
                      <p className="text-[10px] text-gray-400 font-medium leading-tight">
                        {f.disponivel ? f.descricao : "Em breve"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
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
      )}

      <CompleteProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userId={user?.id}
        nomeAtual={profile?.nome}
        nomeAtelieAtual={profile?.nome_atelie}
        fotoAtual={profile?.foto_url}
        telefoneAtual={profile?.telefone}
        emailAtual={user?.email}
        bioAtual={profile?.bio}
        cidadeAtual={profile?.cidade}
        tagAtual={profile?.tag_especialidade}
        onSuccess={() => {
          setIsEditProfileOpen(false);
          recarregarPerfil();
        }}
      />

      {isConfirmSairOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-sm p-6 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Sair da conta?</h3>
            <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
              Você vai precisar entrar de novo pra acessar sua área Meu AmiguMundo.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setIsConfirmSairOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-black text-xs uppercase tracking-wide active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setIsConfirmSairOpen(false);
                  handleSignOut();
                }}
                className="flex-1 bg-[#171717] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wide active:scale-95 transition-transform"
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}

      {ferramentaAberta === "calculadora-preco" && (
        <CalculadoraPreco onBack={() => setFerramentaAberta(null)} />
      )}

      {ferramentaAberta === "contador" && (
        <ContadorCarreiras onBack={() => setFerramentaAberta(null)} />
      )}

      {ferramentaAberta === "conversor" && (
        <ConversorAgulha onBack={() => setFerramentaAberta(null)} />
      )}

      {ferramentaAberta === "cores" && (
        <CombinadorCores onBack={() => setFerramentaAberta(null)} />
      )}

      {lojaParceirosAberta && (
        <LojaAmiguMundoView onBack={() => setLojaParceirosAberta(false)} />
      )}

      {zoomImage && (
        <LightboxModal imageUrl={zoomImage} onClose={() => setZoomImage(null)} />
      )}

      {pdfAberto && (
        <VisualizadorPDF
          fileId={pdfAberto.fileId}
          titulo={pdfAberto.titulo}
          onClose={() => setPdfAberto(null)}
        />
      )}

      {(ferramentaAberta || categoriaSelecionadaCatalogo || pdfAberto || zoomImage || isEditProfileOpen) && (
        <button
          onClick={() => {
            if (pdfAberto) return setPdfAberto(null);
            if (zoomImage) return setZoomImage(null);
            if (isEditProfileOpen) return setIsEditProfileOpen(false);
            if (ferramentaAberta) return setFerramentaAberta(null);
            if (categoriaSelecionadaCatalogo) {
              setCategoriaSelecionadaCatalogo(null);
              setReceitasDaCategoriaSelecionada([]);
            }
          }}
          aria-label="Voltar"
          className="fixed bottom-6 right-4 z-[9998] bg-[#171717]/90 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      )}
    </div>
  );
};