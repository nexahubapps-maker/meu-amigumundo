"use client";

import React, { useState } from "react";
import { Smartphone, X, Download, ArrowRight, Chrome, Compass } from "lucide-react";

export const InstallGuideCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"android" | "ios">("android");

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  return (
    <>
      {/* Card de Chamada */}
      <div className="max-w-2xl mx-auto px-4 my-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-[#171717] to-[#262626] text-white p-4 rounded-2xl text-center shadow-lg flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-[0.99] transition-transform border border-white/10"
        >
          <div className="bg-[#44FF00]/10 p-2.5 rounded-xl text-[#44FF00] shrink-0">
            <Smartphone size={24} />
          </div>
          <div className="text-left flex-1">
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#44FF00]">
              Dica de Ouro! 📱
            </p>
            <p className="text-[11px] sm:text-xs font-bold text-gray-200 leading-tight mt-0.5">
              Para não perder nenhuma receita gratuita, instale o Icone do aplicativo no seu celular, é de graça
            </p>
          </div>
          <ArrowRight size={16} className="text-gray-400 shrink-0" />
        </button>
      </div>

      {/* Modal Didático */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[28px] w-full max-w-md p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setIsOpen(false)}
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

            {/* Conteúdo Didático */}
            {activeTab === "android" ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">1</div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Abra o site no navegador <strong className="text-gray-900">Google Chrome</strong> do seu celular.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">2</div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Toque no ícone de <strong className="text-gray-900">três pontinhos (Menu)</strong> no canto superior direito.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">3</div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Selecione a opção <strong className="text-gray-900">"Instalar aplicativo"</strong> ou <strong className="text-gray-900">"Adicionar à tela inicial"</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">1</div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Abra o site usando o navegador padrão <strong className="text-gray-900">Safari</strong> do seu iPhone.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">2</div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Toque no botão de <strong className="text-gray-900">Compartilhar</strong> (ícone de um quadrado com uma seta para cima no rodapé).
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#44FF00] text-[#171717] font-black text-xs flex items-center justify-center shrink-0">3</div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Role a lista para baixo e toque em <strong className="text-gray-900">"Adicionar à Tela de Início"</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Botão de Fechar/Entendido */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#44FF00] text-[#171717] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-transform mt-6"
            >
              Entendido, vou instalar! 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
};