"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';
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

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Se fechou o modal após clicar em instalar, verifica se marcou como instalado para sumir com o banner
    const isInstalled = localStorage.getItem('amigumundo-installed');
    if (isInstalled) {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="mx-4 sm:mx-0 mb-6 bg-gradient-to-r from-[#171717] to-[#262626] text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 border border-white/10 animate-in slide-in-from-top duration-500">
        <div className="flex items-center gap-3">
          <div className="bg-[#44FF00]/10 p-2.5 rounded-xl text-[#44FF00] shrink-0">
            <Smartphone size={22} />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#44FF00]">Dica de Ouro! 📱</h4>
            <p className="text-[10px] sm:text-xs text-gray-200 font-bold leading-tight mt-1">
              Para não perder nenhuma <strong className="text-white">"Receita Gratuita e Promoções"</strong> instale o Icone do aplicativo no seu celular, é de graça!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleInstallClick}
            className="bg-[#44FF00] text-[#171717] px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:scale-105 active:scale-95 transition-transform"
          >
            Instalar <Download size={12} />
          </button>
          <button 
            onClick={handleDismiss}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Modal Didático Compartilhado */}
      <InstallGuideModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
};