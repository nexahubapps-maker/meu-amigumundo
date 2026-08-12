"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon, Download, ExternalLink, Loader2, ShoppingBag, Package, Pencil, LogOut, Heart, Trash2, Gift, Printer, Calculator, ListChecks, Ruler, Palette, Lock, Wrench, Receipt } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type Perfil } from "@/utils/profile";
import { supabase } from "@/lib/supabase";
import { getRecipesByIds, getDriveFileUrl, getPacksByIds, getInfoprodutosByIds, getReceitaGratuitaDownloadUrl, getCategories } from "@/utils/sheets";
import { CategoryCard } from "@/components/features/catalog/CategoryCard";
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

type TabType = "Minhas Compras" | "Packs & Promoções" | "Receitas Gratuitas" | "Favoritos" | "Meus Pedidos" | "Ferramentas";

const MENUS = [
  { id: "Minhas Compras", label: "Minhas Compras", icone: ShoppingBag, cor: "from-[#3CB19E] to-[#2c8577]", capaUrl: null },
  { id: "Packs & Promoções", label: "Packs & Promoções", icone: Package, cor: "from-[#5D0599] to-[#42026b]", capaUrl: null },
  { id: "Receitas Gratuitas", label: "Receitas Gratuitas", icone: Gift, cor: "from-[#3CB19E] to-[#2c8577]", capaUrl: null },
  { id: "Favoritos", label: "Favoritos", icone: Heart, cor: "from-[#5D0599] to-[#42026b]", capaUrl: null },
  { id: "Meus Pedidos", label: "Meus Pedidos", icone: Receipt, cor: "from-[#3CB19E] to-[#2c8577]", capaUrl: null },
  { id: "Ferramentas", label: "Ferramentas", icone: Wrench, cor: "from-[#5D0599] to-[#42026b]", capaUrl: null },
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
  const [activeTab, setActiveTab] = useState<TabType>("Minhas Compras");

  const [comprasList, setComprasList] = useState<any[]>([]);
  const [isLoadingCompras, setIsLoadingCompras] = useState(false);

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [categoriaAbertaCompras, setCategoriaAbertaCompras] = useState<string | null>(null);

  const [packsList, setPacksList] = useState<any[]>([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(false);

  const [pedidosList, setPedidosList] = useState<any[]>([]);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(false);

  const [gratuitasList, setGratuitasList] = useState<any[]>([]);
  const [isLoadingGratuitas, setIsLoadingGratuitas] = useState(false);

  const [favoritosList, setFavoritosList] = useState<any[]>([]);
  const [isLoadingFavoritos, setIsLoadingFavoritos] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [ferramentaAberta, setFerramentaAberta] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [packDetalheAberto, setPackDetalheAberto] = useState<any | null>(null);
  const [receitasDoPack, setReceitasDoPack] = useState<any[]>([]);
  const [isLoadingPackDetalhe, setIsLoadingPackDetalhe] = useState(false);

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
    if (activeTab === "Minhas Compras" && categoriesList.length === 0) {
      getCategories().then(setCategoriesList);
    }
  }, [activeTab, categoriesList.length]);

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
            return { ...item, linkAcesso: link, categoria };
          })
        );
        const deduped = Object.values(
          resolved.reduce((acc: any, item: any) => {
            const existing = acc[item.codigo_produto];
            if (!existing || item.id > existing.id) {
              acc[item.codigo_produto] = item;
            }
            return acc;
          }, {})
        );
        setComprasList(deduped);
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
            return { ...item, linkAcesso: results[0]?.link_entrega || null, receitasIncluidas: results[0]?.receitas_incluidas || "" };
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
    const fetchPedidos = async () => {
      if (activeTab !== "Meus Pedidos" || !user || pedidosList.length > 0) return;
      setIsLoadingPedidos(true);
      try {
        const { data } = await supabase
          .from("pedidos")
          .select("id, criado_em, valor_total, status")
          .eq("usuario_id", user.id)
          .order("criado_em", { ascending: false });
        setPedidosList(data || []);
      } catch (e) {
        console.error("Erro ao carregar pedidos:", e);
      } finally {
        setIsLoadingPedidos(false);
      }
    };
    fetchPedidos();
  }, [activeTab, user, pedidosList.length]);

  const handleAbrirPack = async (item: any) => {
    setPackDetalheAberto(item);
    setIsLoadingPackDetalhe(true);
    try {
      const codigos = item.receitasIncluidas
        .split(",")
        .map((c: string) => c.trim())
        .filter((c: string) => c.length > 0);
      const receitas = await getRecipesByIds(codigos);
      const resolved = await Promise.all(
        receitas.map(async (r: any) => {
          const link = await getDriveFileUrl(r.id, r.categoria);
          return { ...r, linkAcesso: link };
        })
      );
      setReceitasDoPack(resolved);
    } catch (e) {
      console.error("Erro ao carregar receitas do pack:", e);
      setReceitasDoPack([]);
    } finally {
      setIsLoadingPackDetalhe(false);
    }
  };

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
            ) : (() => {
              const categoriasComCompra = categoriesList.filter((cat) =>
                comprasList.some((item) => item.categoria === cat.id)
              );

              if (categoriaAbertaCompras === null) {
                return (
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-[#5D0599]/10 border border-[#5D0599]/20 rounded-xl p-2.5 mb-3">
                      <p className="text-[10px] font-black text-[#5D0599] uppercase tracking-wider mb-0.5">
                        AmiguMundo Inteligente
                      </p>
                      <p className="text-[10px] text-gray-600 font-medium leading-snug">
                        Receitas que vêm de dentro de um pack ou combo já aparecem aqui, organizadas por categoria — e o pack continua disponível inteiro em "Packs & Promoções", pra você acessar quando quiser.
                      </p>
                    </div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                      Suas Categorias Compradas
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {categoriasComCompra.map((cat) => (
                        <CategoryCard
                          key={cat.id}
                          nome={cat.titulo}
                          imagem={cat.imagem_url}
                          onClick={() => setCategoriaAbertaCompras(cat.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              }

              const receitasDaCategoria = comprasList.filter((item) => item.categoria === categoriaAbertaCompras);
              const categoriaAtual = categoriesList.find((c) => c.id === categoriaAbertaCompras);

              return (
                <div className="max-w-4xl mx-auto space-y-3">
                  <button
                    onClick={() => setCategoriaAbertaCompras(null)}
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-600 hover:text-gray-900 mb-2"
                  >
                    <ArrowLeft size={14} /> Voltar às categorias
                  </button>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                    {categoriaAtual?.titulo} ({receitasDaCategoria.length})
                  </p>
                  <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4">
                    {receitasDaCategoria.map((item, idx) => (
                      <div key={item.id || idx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between p-1">
                        <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg">
                          {!item.visualizado_em && (
                            <span className="absolute top-1 right-1 bg-[#3CB19E] text-white text-[7px] lg:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                              Nova
                            </span>
                          )}
                          <img
                            src={item.imagem_url || `https://picsum.photos/seed/${item.codigo_produto}/400/400`}
                            alt={item.nome_produto}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => {
                              setZoomImage(item.imagem_url || `https://picsum.photos/seed/${item.codigo_produto}/400/400`);
                              if (!item.visualizado_em) {
                                const agora = new Date().toISOString();
                                supabase.from("pedido_itens").update({ visualizado_em: agora }).eq("id", item.id).then(() => {});
                                setComprasList((prev: any[]) => prev.map((c) => c.id === item.id ? { ...c, visualizado_em: agora } : c));
                              }
                            }}
                          />
                        </div>
                        <div className="pt-1.5 flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="text-[9px] lg:text-xs font-black text-gray-800 uppercase tracking-tight line-clamp-1 leading-none mb-1">
                              {item.nome_produto}
                            </h4>
                            <span className="text-[8px] lg:text-[10px] text-gray-400 font-bold block mb-1.5">
                              ({item.codigo_produto})
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            {item.linkAcesso ? (
                              <>
                                <a
                                  href={item.linkAcesso}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1 bg-[#44FF00] text-[#171717] py-1 rounded-lg font-black text-[8px] lg:text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                                >
                                  <Download size={10} /> Baixar
                                </a>
                                <a
                                  href={getLinkVisualizacao(item.linkAcesso) || item.linkAcesso}
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
                    ))}
                  </div>
                </div>
              );
            })()
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
                <div className="bg-[#5D0599]/10 border border-[#5D0599]/20 rounded-xl p-2.5 mb-3">
                  <p className="text-[10px] font-black text-[#5D0599] uppercase tracking-wider mb-0.5">
                    AmiguMundo Inteligente
                  </p>
                  <p className="text-[10px] text-gray-600 font-medium leading-snug">
                    Packs com receitas separadas já distribuem tudo automaticamente nas suas categorias — e você também pode ver a coleção completa direto por aqui, sem sair do app.
                  </p>
                </div>
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
                            {item.receitasIncluidas && item.receitasIncluidas.trim() !== "" && (
                              <button
                                onClick={() => handleAbrirPack(item)}
                                className="mt-1 bg-[#5D0599] text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg active:scale-95 transition-transform"
                              >
                                Ver Receitas do Pack
                              </button>
                            )}
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
                            <div className="flex items-center gap-2">
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
                              <a
                                href={getLinkVisualizacao(item.linkAcesso) || item.linkAcesso}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shadow-sm"
                              >
                                <Printer size={12} />
                                Imprimir
                              </a>
                            </div>
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
          ) : activeTab === "Meus Pedidos" ? (
            isLoadingPedidos ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 size={32} className="animate-spin text-[#5D0599]" />
                <p className="text-xs font-bold uppercase tracking-wider">Carregando seus pedidos...</p>
              </div>
            ) : pedidosList.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
                <Receipt size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-700 font-black text-sm uppercase tracking-tight">
                  Você ainda não fez nenhum pedido.
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-2">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                  Seus Pedidos ({pedidosList.length})
                </p>
                {pedidosList.map((pedido) => {
                  const match = (pedido.criado_em || "").match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
                  const dataFormatada = match ? `${match[3]}/${match[2]} - ${match[4]}:${match[5]}` : pedido.criado_em;
                  const statusCores: Record<string, string> = {
                    aprovado: "bg-green-100 text-green-700",
                    pendente: "bg-amber-100 text-amber-700",
                    recusado: "bg-red-100 text-red-700",
                    cancelado: "bg-gray-100 text-gray-600",
                    reembolsado: "bg-gray-100 text-gray-600",
                  };
                  return (
                    <button
                      key={pedido.id}
                      onClick={() => navigate(`/obrigado/${pedido.id}`)}
                      className="w-full bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:shadow-md active:scale-[0.99] transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#5D0599]/10 flex items-center justify-center shrink-0">
                          <Receipt size={18} className="text-[#5D0599]" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 uppercase">Pedido #{pedido.id}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{dataFormatada}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">R$ {Number(pedido.valor_total).toFixed(2)}</p>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${statusCores[pedido.status] || "bg-gray-100 text-gray-600"}`}>
                          {pedido.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
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

      {packDetalheAberto && (
        <div className="fixed inset-0 z-[130] bg-white overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4">
            <button
              onClick={() => { setPackDetalheAberto(null); setReceitasDoPack([]); }}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-600 hover:text-gray-900 mb-3"
            >
              <ArrowLeft size={14} /> Voltar aos Packs
            </button>
            <p className="text-sm font-black text-gray-900 uppercase mb-1">{packDetalheAberto.nome_produto}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">
              {receitasDoPack.length} receita(s) nesse pack
            </p>

            {isLoadingPackDetalhe ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 size={32} className="animate-spin text-[#5D0599]" />
                <p className="text-xs font-bold uppercase tracking-wider">Carregando as receitas do pack...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4">
                {receitasDoPack.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between p-1">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg">
                      <img
                        src={r.imagem_url}
                        alt={r.nome}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setZoomImage(r.imagem_url)}
                      />
                    </div>
                    <div className="pt-1.5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-[9px] lg:text-xs font-black text-gray-800 uppercase tracking-tight line-clamp-1 leading-none mb-1">
                          {r.nome}
                        </h4>
                        <span className="text-[8px] lg:text-[10px] text-gray-400 font-bold block mb-1.5">
                          ({r.id})
                        </span>
                      </div>
                      {r.linkAcesso && (
                        <a
                          href={r.linkAcesso}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 bg-[#44FF00] text-[#171717] py-1 rounded-lg font-black text-[8px] lg:text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                        >
                          Baixar
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};