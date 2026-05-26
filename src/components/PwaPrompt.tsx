"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, X, ArrowRight } from 'lucide-react';
import { InstallGuideModal } from './InstallGuideModal';

export const PwaPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já marcou como instalado
    const isInstalled = localStorage.getItem('amigumundo-installed');
    
    if (!isInstalled) {
      // Surge após 3 segundos
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      // Some automaticamente após 10 segundos adicionais (total 13s)
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 13000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleInstallClick = () => {
    setIsModalOpen(true);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir o modal ao clicar no botão de fechar
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 mb-6 animate-in slide-in-from-top duration-500 relative">
        {/* Botão de Fechar absoluto bem colado no canto superior direito */}
        <button 
          onClick={handleDismiss}
          className="absolute top-1.5 right-5 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
          aria-label="Fechar"
        >
          <X size={14} />
        </button>

        <div
          onClick={handleInstallClick}
          className="w-full bg-gradient-to-r from-[#171717] to-[#262626] text-white p-4 rounded-2xl text-center shadow-lg flex items-center justify-between gap-4 hover:scale-[1.01] active:scale-[0.99] transition-transform border border-white/10 cursor-pointer relative"
        >
          {/* Ícone idêntico ao do rodapé */}
          <div className="bg-[#44FF00]/10 p-2.5 rounded-xl text-[#44FF00] shrink-0">
            <Smartphone size={24} />
          </div>
          
          {/* Textos com quebras de linha exatas */}
          <div className="text-left flex-1">
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#44FF00]">
              Dica de Ouro! 📱
            </p>
            <p className="text-[11px] sm:text-xs font-bold text-gray-200 leading-tight mt-0.5">
              Não perca nenhuma <br />
              "Receita Gratuita e Promoções" <br />
              instale o Icone do aplicativo <br />
              no seu celular, é de graça!
            </p>
          </div>

          {/* Ações: Seta indicativa */}
          <div className="flex items-center shrink-0 pr-2">
            <ArrowRight size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Modal Didático Compartilhado */}
      <InstallGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};