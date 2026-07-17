"use client";

import React, { useState } from "react";
import { Database, RefreshCw, CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { syncGoogleSheetsToSupabase, type SyncResult } from "@/utils/sync";
import { showSuccess, showError } from "@/utils/toast";

interface AdminSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSyncModal = ({ isOpen, onClose }: AdminSyncModalProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [results, setResults] = useState<SyncResult[] | null>(null);

  if (!isOpen) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    setResults(null);
    try {
      const syncResults = await syncGoogleSheetsToSupabase();
      setResults(syncResults);
      
      const hasError = syncResults.some(r => !r.success);
      if (hasError) {
        showError("Sincronização concluída com alguns avisos.");
      } else {
        showSuccess("Sincronização concluída com sucesso! 🎉");
      }
    } catch (e: any) {
      showError("Erro ao executar sincronização: " + (e.message || String(e)));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[28px] w-full max-w-md p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSyncing}
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2 mb-6 mt-2">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto">
            <Database size={24} />
          </div>
          <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
            Sincronizador Supabase
          </h3>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            Importe e atualize instantaneamente as categorias, receitas, packs e infoprodutos da Planilha Mestre para o seu banco de dados Supabase.
          </p>
        </div>

        {results && (
          <div className="space-y-2.5 mb-6 max-h-[200px] overflow-y-auto p-1">
            {results.map((res, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold ${
                  res.success 
                    ? "bg-green-50/50 border-green-100 text-green-800" 
                    : "bg-red-50/50 border-red-100 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {res.success ? (
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-red-600 shrink-0" />
                  )}
                  <span className="truncate uppercase tracking-tight">{res.table}</span>
                </div>
                <div className="shrink-0 text-right">
                  {res.success ? (
                    <span>{res.count} itens</span>
                  ) : (
                    <span className="text-[10px] font-medium block max-w-[150px] truncate" title={res.error}>
                      {res.error || "Erro"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full bg-[#44FF00] text-[#171717] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSyncing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Sincronizar Agora
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isSyncing}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors text-center"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};