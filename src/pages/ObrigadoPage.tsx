"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Download, ExternalLink, ArrowLeft, Loader2, AlertCircle, ShoppingBag, RefreshCw, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { 
  getRecipesByIds, 
  getPacksByIds, 
  getInfoprodutosByIds, 
  getDriveFileUrl 
} from "@/utils/sheets";
import { Header } from "@/components/common/Header";
import { SupportButton } from "@/components/common/SupportButton";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";

interface Pedido {
  id: string;
  email_comprador?: string;
  nome_comprador?: string;
  valor_total?: number;
  status?: string;
  criado_em?: string;
}

interface PedidoItem {
  id: string;
  pedido_id: string;
  tipo_produto: "receita" | "pack" | "infoproduto" | string;
  codigo_produto: string;
  nome_produto: string;
  imagem_url?: string;
  preco_unitario: number;
  quantidade: number;
  linkAcesso?: string | null;
}

export default function ObrigadoPage() {
  const { idPedido } = useParams<{ idPedido: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [itens, setItens] = useState<PedidoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadPedido = useCallback(async () => {
    if (!idPedido) {
      setErrorMessage("Identificador do pedido não informado.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Busca os dados do pedido e dos itens no Supabase
      const [resPedido, resItens] = await Promise.all([
        supabase.from("pedidos").select("*").eq("id", idPedido).single(),
        supabase.from("pedido_itens").select("*").eq("pedido_id", idPedido)
      ]);

      if (resPedido.error || !resPedido.data) {
        setErrorMessage("Pedido não encontrado ou indisponível.");
        setIsLoading(false);
        return;
      }

      setPedido(resPedido.data);

      const rawItens: PedidoItem[] = resItens.data || [];

      // 2. Resolve linkAcesso em paralelo para cada item do pedido
      const itensComLinks = await Promise.all(
        rawItens.map(async (item) => {
          let linkAcesso: string | null = null;

          try {
            if (item.tipo_produto === "receita") {
              const recipes = await getRecipesByIds([item.codigo_produto]);
              if (recipes && recipes.length > 0) {
                const cat = recipes[0].categoria;
                linkAcesso = await getDriveFileUrl(item.codigo_produto, cat);
              }
            } else if (item.tipo_produto === "pack") {
              const packs = await getPacksByIds([item.codigo_produto]);
              if (packs && packs.length > 0) {
                linkAcesso = packs[0].link_entrega || null;
              }
            } else if (item.tipo_produto === "infoproduto") {
              const infoproducts = await getInfoprodutosByIds([item.codigo_produto]);
              if (infoproducts && infoproducts.length > 0) {
                linkAcesso = infoproducts[0].link_entrega || null;
              }
            }
          } catch (err) {
            console.warn(`Erro ao resolver linkAcesso para o item ${item.codigo_produto}:`, err);
          }

          return {
            ...item,
            linkAcesso
          };
        })
      );

      setItens(itensComLinks);
    } catch (err: any) {
      console.error("Erro ao carregar dados do pedido:", err);
      setErrorMessage("Erro ao carregar os dados do pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [idPedido]);

  useEffect(() => {
    loadPedido();
  }, [loadPedido]);

  const getButtonText = (tipo: string) => {
    switch (tipo) {
      case "receita":
        return "Baixar receita (PDF)";
      case "pack":
        return "Acessar pasta do Pack";
      case "infoproduto":
        return "Acessar conteúdo";
      default:
        return "Acessar conteúdo";
    }
  };

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-24">
      <Header />

      <div className="max-w-2xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold mb-4 transition-colors text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Voltar para a loja
        </button>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#0E5E6F]" />
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Carregando dados do pedido...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-red-100 flex flex-col items-center gap-3">
            <AlertCircle size={40} className="text-red-500" />
            <h2 className="text-base font-black text-gray-900 uppercase">Aviso</h2>
            <p className="text-xs font-medium text-gray-600">{errorMessage}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 bg-[#0E5E6F] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Ir para a página inicial
            </button>
          </div>
        ) : pedido && pedido.status !== "aprovado" ? (
          /* Tela quando o pagamento ainda não foi aprovado */
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-blue-100 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Clock size={32} className="animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
                Status: {pedido.status || "Pendente"}
              </span>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                Aguardando confirmação do pagamento...
              </h2>
            </div>

            <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-md">
              Seu pagamento ainda está sendo processado pelo banco. Assim que for confirmado, seus links de acesso aparecerão aqui automaticamente.
            </p>

            <button
              onClick={() => loadPedido()}
              className="mt-2 bg-[#0E5E6F] hover:bg-[#164B56] active:scale-95 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw size={14} />
              Atualizar Status
            </button>

            {pedido && (
              <div className="pt-4 border-t border-gray-100 w-full flex justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Pedido #{pedido.id}</span>
                {pedido.valor_total && (
                  <span>Total: R$ {Number(pedido.valor_total).toFixed(2)}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Tela quando o pagamento foi aprovado */
          <div className="space-y-4">
            {/* Cabecalho de Agradecimento */}
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 space-y-3">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-[#22C55E] mx-auto shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest block">
                  Pagamento Aprovado!
                </span>
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight mt-0.5">
                  Obrigada pela sua compra! 🎉
                </h1>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-md mx-auto">
                Seus arquivos já estão liberados! Clique nos botões abaixo para baixar ou acessar seus conteúdos agora mesmo.
              </p>

              {pedido && (
                <div className="pt-2 border-t border-gray-100 flex justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span>Pedido #{pedido.id}</span>
                  {pedido.valor_total && (
                    <span>Total: R$ {Number(pedido.valor_total).toFixed(2)}</span>
                  )}
                </div>
              )}
            </div>

            {/* Lista de Itens do Pedido */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                <ShoppingBag size={16} className="text-[#0E5E6F]" />
                Seus Itens Liberados ({itens.length})
              </h2>

              <div className="divide-y divide-gray-100">
                {itens.map((item) => (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imagem_url || `https://picsum.photos/seed/${item.codigo_produto}/150/150`}
                        alt={item.nome_produto}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                      />
                      <div className="min-w-0">
                        <h3 className="text-xs font-black text-gray-800 uppercase leading-tight line-clamp-2">
                          {item.nome_produto}
                        </h3>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
                          Código: {item.codigo_produto}
                        </span>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
                      {item.linkAcesso ? (
                        <a
                          href={item.linkAcesso}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto bg-[#44FF00] hover:bg-[#3ee600] active:scale-95 text-[#171717] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Download size={14} />
                          {getButtonText(item.tipo_produto)}
                          <ExternalLink size={12} className="opacity-70" />
                        </a>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center">
                          <p className="text-[10px] font-bold text-amber-700 uppercase leading-tight">
                            Link temporariamente indisponível. <br />
                            Entre em contato com o suporte abaixo.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco de incentivo para criar conta grátis (apenas para compras deslogadas) */}
            {!user && (
              <div className="bg-gradient-to-br from-[#171717] to-[#2A2A2A] rounded-2xl p-6 text-white text-center shadow-xl border border-white/10 space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-[#44FF00]/10 rounded-full flex items-center justify-center text-[#44FF00] mx-auto">
                  <Sparkles size={24} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                    Nunca mais perca uma receita! 🧶
                  </h3>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-md mx-auto">
                    Crie sua conta grátis e tudo que você comprar fica guardado automaticamente no seu <strong className="text-white">Meu AmiguMundo</strong> — sem precisar baixar ou salvar nada. Acesse quando quiser, quantas vezes quiser.
                  </p>
                </div>

                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto bg-[#44FF00] hover:bg-[#3ee600] active:scale-95 text-[#171717] px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md"
                >
                  Quero minha conta grátis →
                </button>
              </div>
            )}

            {/* Agradecimento Final & Botao Voltar */}
            <div className="text-center pt-2">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Continuar comprando na loja →
              </button>
            </div>
          </div>
        )}
      </div>

      <SupportButton />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}