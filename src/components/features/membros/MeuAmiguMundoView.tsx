"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, User as UserIcon, Download, ExternalLink, Loader2, ShoppingBag, Package, Pencil, LogOut, Heart, Trash2, Gift } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type Perfil } from "@/utils/profile";
import { supabase } from "@/lib/supabase";
import { getRecipesByIds, getDriveFileUrl, getPacksByIds, getInfoprodutosByIds, getReceitaGratuitaDownloadUrl } from "@/utils/sheets";
import { CompleteProfileModal } from "@/components/CompleteProfileModal";

interface MeuAmiguMundoViewProps {
  onBack: () => void;
  onAddToCart: (items: any[]) => void;
}

const TABS = [
  "Minhas Compras",
  "Packs & Promoções",
  "Receitas Gratuitas",
  "Favoritos",
  "Ferramentas",
] as const;

type TabType = (typeof TABS)[number];

export const MeuAmiguMundoView = ({ onBack, onAddToCart }: MeuAmiguMundoViewProps) => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Perfil | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Minhas Compras");

  const [comprasList, setComprasList] = useState<any[]>([]);
  const [isLoadingCompras, setIsLoadingCompras] = useState(false);

  const [packsList, setPacksList] = useState<any[]>([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(false);

  const [gratuitasList, setGratuitasList] = useState<any[]>([]);
  const [isLoadingGratuitas, setIsLoadingGratuitas] = useState(false);

  const [favoritosList, setFavoritosList] = useState<any[]>([]);
  const [isLoadingFavoritos, setIsLoadingFavoritos] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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

  useEffect(() => {
    const fetchGratuitas = async () => {
      if (activeTab !== "Receitas Gratuitas" || !user || gratuitasList.length > 0) return;
      setIsLoadingGratuitas(true);
      try {
        const { data } = await supabase
          .from("biblioteca")
          .select("*")
          .eq("usuario_id", user.id)
          .eq("tipo_item", "gratuita")
          .order("adicionado_em", { ascending: false });

        const itens = data || [];
        const resolved = await Promise.all(
          itens.map(async (item: any) => {
            const link = await getReceitaGratuitaDownloadUrl(item.codigo_item);
            return { ...item, linkAcesso: link };
          })
        );
        setGratuitasList(resolved);
      } catch (e) {
        console.error("Erro ao carregar receitas gratuitas:", e);
      } finally {
        setIsLoadingGratuitas(false);
      }
    };
    fetchGratuitas();
  }, [activeTab, user, gratuitasList.length]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (activeTab !== "Favoritos" || !user || favoritosList.length > 0) return;
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
  }, [activeTab, user, favoritosList.length]);

  const removerFavorito = async (item: any) => {
    await supabase.from("favoritos").delete().eq("id", item.id);
    setFavoritosList((prev) => prev.filter((f) => f.id !== item.id));
  };

  const handleAdicionarTudoAoCarrinho = async () => {
    const receitaIds = favoritosList.filter(f => f.tipo_item === "receita").map(f => f.codigo_item);
    const packIds = favoritosList.filter(f => f.tipo_item === "pack").map(f => f.codigo_item);
    const infoprodutoIds = favoritosList.filter(f => f.tipo_item === "infoproduto").map(f => f.codigo_item);

    const [receitas, packs, infoprodutos] = await Promise.all([
      receitaIds.length > 0 ? getRecipesByIds(receitaIds) : Promise.resolve([]),
      packIds.length > 0 ? getPacksByIds(packIds) : Promise.resolve([]),
      infoprodutoIds.length > 0 ? getInfoprodutosByIds(infoprodutoIds) : Promise.resolve([]),
    ]);

    const items = [
      ...receitas.map((r: any) => ({ id: r.id, nome: r.nome, preco: r.preco, tipo: "recipe", imagem: r.imagem_url })),
      ...packs.map((p: any) => ({ id: p.id, nome: p.nome, preco: p.preco, tipo: "pack", imagem: p.imagem_url })),
      ...infoprodutos.map((i: any) => ({ id: i.id, nome: i.nome, preco: i.preco, tipo: "upsell", imagem: i.imagem_url })),
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
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 min-w-0 flex-1">
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

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors active:scale-95"
            title="Editar perfil"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors active:scale-95"
            title="Sair da conta"
          >
            <LogOut size={16} />
          </button>
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
        ) : activeTab === "Receitas Gratuitas" ? (
          isLoadingGratuitas ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 size={32} className="animate-spin text-[#0E5E6F]" />
              <p className="text-xs font-bold uppercase tracking-wider">Carregando suas receitas gratuitas...</p>
            </div>
          ) : gratuitasList.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
              <Gift size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-black text-sm uppercase tracking-tight">
                Você ainda não salvou nenhuma receita gratuita.
              </p>
              <p className="text-gray-400 text-xs font-medium mt-1">
                Resgate o seu presente diário no AmiguMundo e clique em "Salvar na Biblioteca" para guardar aqui!
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                Suas Receitas Gratuitas Salvas ({gratuitasList.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gratuitasList.map((item, idx) => (
                  <div
                    key={item.id || idx}
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

      <CompleteProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userId={user?.id}
        nomeAtual={profile?.nome}
        fotoAtual={profile?.foto_url}
        telefoneAtual={profile?.telefone}
        onSuccess={() => {
          setIsEditProfileOpen(false);
          recarregarPerfil();
        }}
      />
    </div>
  );
};