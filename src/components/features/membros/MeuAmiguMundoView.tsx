"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon, ExternalLink, Loader2, Pencil, LogOut, Heart, Trash2, Printer, Calculator, ListChecks, Ruler, Palette, Lock, Wrench, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type Perfil } from "@/utils/profile";
import { supabase } from "@/lib/supabase";
import { getRecipesByIds, getDriveFileUrl, getPacksByIds, getInfoprodutosByIds, getReceitaGratuitaDownloadUrl, getCategories, getRecipesByCategoria } from "@/utils/sheets";
import { CompleteProfileModal } from "@/components/CompleteProfileModal";
import { CalculadoraPreco } from "@/components/features/ferramentas/CalculadoraPreco";
import { ContadorCarreiras } from "@/components/features/ferramentas/ContadorCarreiras";
import { ConversorAgulha } from "@/components/features/ferramentas/ConversorAgulha";
import { CombinadorCores } from "@/components/features/ferramentas/CombinadorCores";
import { LightboxModal } from "@/components/features/catalog/LightboxModal";
import { ArtesaProfileHeader } from "@/components/features/membros/ArtesaProfileHeader";
import { showSuccess } from "@/utils/toast";

interface MeuAmiguMundoViewProps {
  onBack: () => void;
  onAddToCart: (items: any[]) => void;
}

type TabType = "Catálogo" | "Favoritos" | "Ferramentas";

const MENUS = [
  { id: "Catálogo", label: "Catálogo", icone: BookOpen, cor: "from-[#3CB19E] to-[#2c8577]", capaUrl: null },
  { id: "Favoritos", label: "Favoritos", icone: Heart, cor: "from-[#5D0599] to-[#42026b]", capaUrl: null },
  { id: "Ferramentas", label: "Ferramentas", icone: Wrench, cor: "from-[#3CB19E] to-[#2c8577]", capaUrl: null },
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

  const [favoritosList, setFavoritosList] = useState<any[]>([]);
  const [isLoadingFavoritos, setIsLoadingFavoritos] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [ferramentaAberta, setFerramentaAberta] = useState<string | null>(null);
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

  const handleAdicionarTudoAoCarrinho = async () => {
    const receitaIds = favoritosList.filter(f => f.tipo_item === "receita").map(f => f.codigo_item);

    const receitas = receitaIds.length > 0 ? await getRecipesByIds(receitaIds) : [];

    const items = [
      ...receitas.map((r: any) => ({ id: r.id, nome: r.nome, preco: r.preco, tipo: "recipe", imagem: r.imagem_url })),
    ];

    onAddToCart(items);
  };

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  };

  const displayName = profile?.nome || user?.email || "Visitante";
  const avatarUrl = profile?.foto_url;

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  const getLinkVisualizacao = (linkDownload: string | null): string | null => {
    if (!linkDownload) return null;
    const match = linkDownload.match(/id=([^&]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/view` : linkDownload;
  };

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

      <ArtesaProfileHeader
        nome={displayName}
        nomeAtelie={profile?.nome_atelie}
        fotoUrl={avatarUrl}
        bio={profile?.bio}
        cidade={profile?.cidade}
        tagEspecialidade={profile?.tag_especialidade}
        onCopiarLink={() => {
          const link = `${window.location.origin}/catalogo/${user?.id}`;
          navigator.clipboard.writeText(link);
          showSuccess("Link do seu catálogo copiado!");
        }}
        onVisualizarCatalogo={() => {
          window.open(`/catalogo/${user?.id}`, "_blank");
        }}
      />

      <div className="flex items-center justify-around border-t border-b border-gray-100 bg-white sticky top-[60px] z-[5]">
        {MENUS.map((menu) => {
          const Icone = menu.icone;
          const isActive = activeTab === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id as TabType)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 border-b-2 transition-colors ${isActive ? "border-[#5D0599] text-[#5D0599]" : "border-transparent text-gray-400"}`}
            >
              <Icone size={18} />
            </button>
          );
        })}
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      {activeTab && (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === "Catálogo" ? (
            categoriaSelecionadaCatalogo ? (
              <div className="max-w-4xl mx-auto space-y-3">
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
                                <a
                                  href={item.linkAcesso}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1 bg-[#5D0599] text-white py-1 rounded-lg font-black text-[8px] lg:text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                                >
                                  <ExternalLink size={10} /> Abrir
                                </a>
                                <a
                                  href={item.linkAcesso}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1 bg-gray-100 text-gray-800 py-1 rounded-lg font-black text-[8px] lg:text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                                >
                                  <Printer size={10} /> Imprimir
                                </a>
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
              <div className="max-w-4xl mx-auto">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                  Todas as Categorias
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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
              <div className="max-w-4xl mx-auto space-y-3">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                  Seus Itens Favoritados ({favoritosList.length})
                </p>

                <button
                  onClick={handleAdicionarTudoAoCarrinho}
                  className="w-full mb-3 bg-[#44FF00] hover:bg-[#3ee600] active:scale-95 text-[#171717] py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  Adicionar tudo ao carrinho ({favoritosList.length})
                </button>

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
            <div className="max-w-4xl mx-auto">
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

      {zoomImage && (
        <LightboxModal imageUrl={zoomImage} onClose={() => setZoomImage(null)} />
      )}
    </div>
  );
};