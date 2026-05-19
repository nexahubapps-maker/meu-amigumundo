"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, ShoppingCart } from 'lucide-react';

export function getLaunchState(now: Date = new Date()) {
  const day = now.getDay(); // 0 = Sunday, 4 = Thursday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // For testing purposes, if it's not Thursday, we can simulate it or keep it hidden.
  // Let's strictly follow the Thursday rule.
  if (day !== 4) {
    return { active: false, step: 0 };
  }

  // Thursday 12:00 is 720 minutes
  // Thursday 20:00 is 1200 minutes
  // Thursday 23:00 is 1380 minutes
  // Thursday 23:30 is 1410 minutes

  if (timeInMinutes >= 720 && timeInMinutes < 1200) {
    // Step 1: 8 hours before launch
    const target = new Date(now);
    target.setHours(20, 0, 0, 0);
    return { active: true, step: 1, target, label: "Abertura em:" };
  } else if (timeInMinutes >= 1200 && timeInMinutes < 1380) {
    // Step 2: Launch active (3 hours)
    const target = new Date(now);
    target.setHours(23, 0, 0, 0);
    return { active: true, step: 2, target, label: "Encerra em:" };
  } else if (timeInMinutes >= 1380 && timeInMinutes < 1410) {
    // Step 3: Finished (30 mins)
    return { active: true, step: 3, label: "Lançamento finalizado! Obrigado a todas as participantes! ❤️" };
  }

  return { active: false, step: 4 };
}

export const LaunchBanner = () => {
  const [launch, setLaunch] = useState(() => getLaunchState());
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const currentState = getLaunchState();
      setLaunch(currentState);

      if (currentState.active && currentState.target) {
        const diff = currentState.target.getTime() - Date.now();
        if (diff > 0) {
          setTimeLeft({
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60)
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // If not active, hide completely
  if (!launch.active) return null;

  return (
    <div className="mx-4 sm:mx-0 mb-6 bg-black border-2 border-[#D4AF37] rounded-2xl p-4 sm:p-6 shadow-[0_10px_30px_rgba(212,175,55,0.15)] relative overflow-hidden">
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

        {launch.step === 3 ? (
          <div className="text-[#D4AF37] font-bold text-sm text-center md:text-right">
            {launch.label}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Countdown Timer */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
              <Timer size={18} className="text-[#D4AF37]" />
              <div className="flex items-center gap-1.5 text-white font-mono text-sm sm:text-base font-bold">
                <span className="text-[10px] text-gray-400 font-sans uppercase mr-1">{launch.label}</span>
                <div className="flex flex-col items-center">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                </div>
                <span className="text-[#D4AF37]">:</span>
                <div className="flex flex-col items-center">
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                </div>
                <span className="text-[#D4AF37]">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-[#D4AF37]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Step 2: Buy Button appears */}
            {launch.step === 2 && (
              <button 
                onClick={() => {
                  const el = document.getElementById('cart-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#44FF00] text-[#171717] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                <ShoppingCart size={16} /> Aproveitar Agora
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};