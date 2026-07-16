"use client";

import React from 'react';
import { PartyPopper, Star } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-[#171717] rounded-[32px] w-full max-w-[340px] p-8 text-center shadow-2xl border border-white/10">
        <div className="absolute -top-2 -left-2 text-[#44FF00] animate-bounce">
          <Star size={24} fill="currentColor" />
        </div>
        <div className="absolute -top-2 -right-2 text-[#F8DD12] animate-bounce delay-150">
          <Star size={24} fill="currentColor" />
        </div>

        <div className="mx-auto w-16 h-16 bg-[#44FF00]/10 rounded-full flex items-center justify-center mb-6">
          <PartyPopper size={32} className="text-[#44FF00]" />
        </div>

        <h2 className="text-2xl font-black text-white mb-4 tracking-tight">
          🎉 PARABÉNS! 🥳
        </h2>
        
        <div className="space-y-3 mb-8">
          <p className="text-gray-300 text-sm font-medium">
            Sua receita gratuita foi liberada com sucesso.
          </p>
          <p className="text-white text-base font-bold uppercase">
            VOLTE AMANHÃ QUE TEM MAIS!
          </p>
          <p className="text-[#44FF00] text-xs font-bold italic">
            Aproveite e visite nossa loja acima para conhecer os lançamentos!
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#44FF00] text-[#171717] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_20px_rgba(68,255,0,0.3)] active:scale-95 transition-transform"
        >
          Explorar Loja
        </button>
      </div>
    </div>
  );
};