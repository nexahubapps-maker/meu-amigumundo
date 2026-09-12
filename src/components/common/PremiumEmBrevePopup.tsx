"use client";

import React from 'react';
import { X, Crown } from 'lucide-react';

interface PremiumEmBrevePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumEmBrevePopup = ({ isOpen, onClose }: PremiumEmBrevePopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] w-full max-w-sm p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-3 mt-2">
          <div className="w-14 h-14 bg-gradient-to-r from-[#F4D160] to-[#C9971C] rounded-full flex items-center justify-center text-[#3A2A00] shadow-md">
            <Crown size={26} fill="#3A2A00" />
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-black text-[#C9971C] uppercase tracking-widest">AmiguMundo Premium</span>
            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight leading-tight">
              Aguarde! Em breve teremos<br />o lançamento do<br />AmiguMundo Premium
            </h3>
          </div>

          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Estamos preparando algo especial pra você. Fique de olho nas nossas novidades! ✨
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#F4D160] to-[#C9971C] text-[#3A2A00] py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-transform mt-2"
          >
            Combinado!
          </button>
        </div>
      </div>
    </div>
  );
};
