"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';
import { InstallGuideModal } from './InstallGuideModal';

export const PwaPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstallClick = () => {
    setIsModalOpen(true);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="mx-4 sm:mx-0 mb-6 bg-gradient-to-r from-[#171717] to-[#262626] text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 border border-white/10 animate-in slide-in-from-top duration-500">
        <div className="flex items-center gap-3">
          <div className="bg-[#44FF00]/10 p-2 rounded-xl text-[#44FF00]">
            <Smartphone size={20} />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black uppercase tracking-wider">Instalar App AmiguMundo</h4>
            <p className="text-[10px] text-gray-400 font-medium">Acesse suas receitas direto da tela inicial do seu celular!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleInstallClick}
            className="bg-[#44FF00] text-[#171717] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:scale-105 active:scale-95 transition-transform shrink-0"
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
      <InstallGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};