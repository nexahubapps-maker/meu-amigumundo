"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeBannerProps {
  isDirectEntry: boolean;
}

export const WelcomeBanner = ({ isDirectEntry }: WelcomeBannerProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isDirectEntry) {
      const isDismissed = sessionStorage.getItem("amigumundo-welcome-dismissed");
      if (!isDismissed) {
        setIsVisible(true);
      }
    }
  }, [isDirectEntry]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem("amigumundo-welcome-dismissed", "true");
  };

  const handleNavigate = () => {
    setIsVisible(false);
    sessionStorage.setItem("amigumundo-welcome-dismissed", "true");
    navigate("/");
  };

  if (!isVisible) return null;

  return (
    <div 
      onClick={handleNavigate}
      className="fixed top-4 left-4 right-4 z-[100] bg-gradient-to-r from-[#0E5E6F] to-[#164B56] text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 cursor-pointer animate-in slide-in-from-top duration-500 flex items-center justify-between gap-3 max-w-xl mx-auto"
    >
      <div className="flex items-center gap-2.5">
        <div className="bg-[#44FF00]/20 p-2 rounded-xl text-[#44FF00] shrink-0 animate-bounce">
          <Sparkles size={18} />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#44FF00]">
            Bem-vinda ao AmiguMundo! 🌟
          </p>
          <p className="text-[11px] font-bold text-gray-100 leading-tight mt-0.5">
            Toque aqui para conhecer nosso catálogo completo de receitas.
          </p>
        </div>
      </div>
      <button 
        onClick={handleClose}
        className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors shrink-0"
        aria-label="Fechar"
      >
        <X size={14} />
      </button>
    </div>
  );
};