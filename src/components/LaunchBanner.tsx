"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Timer } from 'lucide-react';

export const LaunchBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Find next Thursday at 20:00 (8 PM)
      const nextThursday = new Date();
      nextThursday.setDate(now.getDate() + ((5 + 7 - now.getDay()) % 7));
      nextThursday.setHours(20, 0, 0, 0);

      if (nextThursday.getTime() <= now.getTime()) {
        nextThursday.setDate(nextThursday.getDate() + 7);
      }

      const difference = nextThursday.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-4 sm:mx-0 mb-6 bg-black border-2 border-[#D4AF37] rounded-2xl p-4 sm:p-6 shadow-[0_10px_30px_rgba(212,175,55,0.15)] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 text-center md:text-left flex-col md:flex-row">
          <div className="bg-[#D4AF37]/10 p-2.5 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.2em] uppercase block mb-0.5">
              Lançamento Exclusivo
            </span>
            <h2 className="text-white text-lg sm:text-xl font-black uppercase tracking-tight">
              ⚡ NOVIDADES DE QUINTA-FEIRA ⚡
            </h2>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
          <Timer size={18} className="text-[#D4AF37]" />
          <div className="flex items-center gap-1.5 text-white font-mono text-sm sm:text-base font-bold">
            <div className="flex flex-col items-center">
              <span>{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[8px] text-gray-500 font-sans uppercase font-bold">Dias</span>
            </div>
            <span className="text-[#D4AF37] -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[8px] text-gray-500 font-sans uppercase font-bold">Horas</span>
            </div>
            <span className="text-[#D4AF37] -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[8px] text-gray-500 font-sans uppercase font-bold">Min</span>
            </div>
            <span className="text-[#D4AF37] -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[#D4AF37]">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[8px] text-gray-500 font-sans uppercase font-bold">Seg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};