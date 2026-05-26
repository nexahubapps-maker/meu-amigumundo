"use client";

import React, { useState } from "react";
import { Smartphone, X, Chrome, Compass } from "lucide-react";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal = ({ isOpen, onClose }: InstallGuideModalProps) => {
  const [activeTab, setActiveTab] = useState<"android" | "ios">("android");

  if (!isOpen) return null;

  const handleConfirmInstall = () => {
    localStorage.setItem('amigumundo-installed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[28px] w-full max-w-md p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div className="text-center space-y-1.5 mb-5 mt-2">
          <div className="w-12 h-12 bg-[#44FF00]/10 rounded-full flex items-center justify-center text-[#44FF00] mx-auto">
            <Smartphone size={24} />
          </div>
          <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
            Como Instalar o App
          </h3>
          <p className="text-[11px] text-gray-500 font-medium">
            Tenha acesso rápido às suas receitas direto da tela inicial!
          </p>
        </div>

        {/* Abas de Seleção de Sistema */}
        <div className="grid grid-cols-2 gap-2 mb-5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("android")}
            className={`py-2.5 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "android" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Chrome size={14} /> Android
          </button>
          <button
            onClick={() => setActiveTab("ios")}
            className={`py-2.5 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "ios" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Compass size={14} /> iPhone (iOS)
          </button>
        </div>

        {/* Conteúdo Didático Simplificado */}
        {activeTab === "android" ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs font-black text-gray-800 uppercase tracking-wider">
              São 2 passos simples:
            </p>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">2</div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Toque no ícone de <strong className="text-gray-900">três pontinhos (Menu)</strong> no canto superior direito.
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">3</div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Selecione a opção <strong className="text-gray-900">"Instalar aplicativo"</strong> ou <strong className="text-gray-900">"Adicionar à tela inicial"</strong> e Pronto.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs font-black text-gray-800 uppercase tracking-wider">
              São 2 passos simples:
            </p>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">2</div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Toque no botão de <strong className="text-gray-900">Compartilhar</strong> (ícone de um quadrado com uma seta para cima no rodapé).
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">3</div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Role a lista para baixo e toque em <strong className="text-gray-900">"Adicionar à Tela de Início"</strong> e Pronto.
              </p>
            </div>
          </div>
        )}

        {/* Botão de Fechar/Entendido */}
        <button
          onClick={handleConfirmInstall}
          className="w-full bg-[#44FF00] text-[#171717] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-transform mt-6"
        >
          Entendido, vou instalar! 👍
        </button>
      </div>
    </div>
  );
};