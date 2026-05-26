"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';
import { showInfo } from '@/utils/toast';

export const PwaPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      const isDismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback: Show the prompt anyway after 3 seconds if not dismissed,
    // so users on iOS (which doesn't support beforeinstallprompt) can still see instructions
    const isDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (!isDismissed && !deferredPrompt) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      // We've used the prompt, and can't use it again
      setDeferredPrompt(null);
      setIsVisible(false);
    } else {
      // Fallback for iOS / browsers that don't support beforeinstallprompt
      showInfo("Para instalar no iPhone/iPad:\n1. Toque no botão de Compartilhar (ícone de seta para cima)\n2. Selecione 'Adicionar à Tela de Início' 📱");
      localStorage.setItem('pwa-prompt-dismissed', 'true');
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mx-4 sm:mx-0 mb-6 bg-gradient-to-r from-[#171717] to-[#262626] text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 border border-white/10 animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3">
        <div className="bg-[#44FF00]/10 p-2 rounded-xl text-[#44FF00]">
          <Smartphone size={20} />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider">Instalar App AmiguMundo</h4>
          <p className="text-[10px] text-gray-400 font-medium">Acesse suas receitas direto da tela inicial do seu celular!</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleInstall}
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
  );
};