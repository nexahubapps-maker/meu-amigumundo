"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SuccessModal } from './SuccessModal';
import { Download } from 'lucide-react';

export const DailyGiftSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // CONFIGURAÇÃO DINÂMICA DO MIMO DIÁRIO
  const dailyGift = {
    nome: "Receita: Polvinho da Sorte 🐙",
    downloadUrl: "#", // Substitua pelo link real do PDF
  };

  const handleDownload = () => {
    // Efeito de Confete
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Simula o download e abre o modal
    setTimeout(() => {
      setIsModalOpen(true);
    }, 500);
  };

  return (
    <section className="bg-[#E0F2FE] py-10 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-[#171717] font-extrabold text-[1.3rem] leading-tight mb-2">
          🎉 SEU MIMO GRATUITO DO DIA CHEGOU! 🎉
        </h2>
        <p className="text-[#171717] text-[0.9rem] font-medium mb-8">
          Nos visite todos os dias para retirar sua receita grátis e garantir seu presente diário!
        </p>

        <div className="bg-white rounded-[24px] p-6 shadow-xl border border-white/50 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#E0F2FE] rounded-2xl flex items-center justify-center text-3xl">
            🎁
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[#171717] text-[0.95rem] font-bold">
              {dailyGift.nome}
            </h3>
            <p className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider">
              Disponível apenas hoje
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-[#44FF00] text-[#171717] py-4 rounded-2xl font-black text-[0.9rem] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            Baixar Receita Grátis <Download size={18} />
          </button>
        </div>
      </div>

      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};