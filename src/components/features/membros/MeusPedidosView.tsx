"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Receipt } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface MeusPedidosViewProps {
  onBack: () => void;
}

export const MeusPedidosView = ({ onBack }: MeusPedidosViewProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pedidosList, setPedidosList] = useState<any[]>([]);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      setIsLoadingPedidos(true);
      try {
        if (user) {
          const { data } = await supabase
            .from("pedidos")
            .select("id, criado_em, valor_total, status")
            .eq("usuario_id", user.id)
            .order("criado_em", { ascending: false });
          setPedidosList(data || []);
        } else {
          const idsSalvos: string[] = JSON.parse(localStorage.getItem("amigumundo-meus-pedidos") || "[]");
          if (idsSalvos.length === 0) {
            setPedidosList([]);
          } else {
            const { data } = await supabase
              .from("pedidos")
              .select("id, criado_em, valor_total, status")
              .in("id", idsSalvos)
              .order("criado_em", { ascending: false });
            setPedidosList(data || []);
          }
        }
      } catch (e) {
        console.error("Erro ao carregar pedidos:", e);
      } finally {
        setIsLoadingPedidos(false);
      }
    };
    fetchPedidos();
  }, [user]);

  return (
    <div className="fixed inset-0 z-[60] bg-[#F8F6F2] flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center active:scale-95 transition-all">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Meus Pedidos</h1>
      </div>

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {isLoadingPedidos ? (
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
        )}
      </div>
    </div>
  );
};