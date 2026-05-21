"use client";

import React, { useState, useEffect } from 'react';
import { Timer, ShoppingBag } from 'lucide-react';

export function getLaunchState(now: Date = new Date()) {
  const day = now.getDay(); // 0 = Sunday, 4 = Thursday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  if (day !== 4) {
    return { active: false, step: 0 };
  }

  // Thursday 13:00 is 780 minutes
  // Thursday 17:17 is 1037 minutes
  // Thursday 20:17 is 1217 minutes
  // Thursday 23:59 is 1439 minutes

  if (timeInMinutes >= 780 && timeInMinutes < 1037) {
    // Step 1: Countdown to launch (13:00 to 17:17)
    const target = new Date(now);
    target.setHours(17, 17, 0, 0);
    return { active: true, step: 1, target, label: "Abertura do Carrinho em:" };
  } else if (timeInMinutes >= 1037 && timeInMinutes < 1217) {
    // Step 2: Launch active (17:17 to 20:17)
    const target = new Date(now);
    target.setHours(20, 17, 0, 0);
    return { active: true, step: 2, target, label: "CARRINHO ABERTO" };
  } else if (timeInMinutes >= 1217 && timeInMinutes <= 1439) {
    // Step 3: Finished (20:17 to 23:59)
    return { active: true, step: 3, label: "Lançamento terminou" };
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

  if (!launch.active) return null;

  return (
    <div className="mx-4 sm:mx-0 mb-6 bg-black border-2 border-[#44FF00] rounded-2xl p-5 shadow-[0_10px_30px_rgba(68,255,0,0.15)] relative overflow-hidden text-center">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#44FF00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#44FF00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <span className="text-[#44FF00] text-[11px] font-black tracking-[0.25em] uppercase block">
          LANÇAMENTO EXCLUSIVO
        </span>

        {launch.step === 1 && (
          <>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              {launch.label}
            </span>
            
            {/* Large Centered Timer */}
            <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl my-1">
              <Timer size={24} className="text-[#44FF00]" />
              <div className="flex items-center gap-2 text-white font-mono text-2xl sm:text-3xl font-black">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[#44FF00] animate-pulse">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[#44FF00] animate-pulse">:</span>
                <span className="text-[#44FF00]">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>

            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">
              Corra que é por pouco tempo
            </span>
          </>
        )}

        {launch.step === 2 && (
          <>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[#44FF00] text-sm font-black uppercase tracking-widest">
                CARRINHO ABERTO
              </span>
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                PEGUE JA O SEU SUPER PACK
              </span>
            </div>

            {/* Large Centered Timer */}
            <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl my-1">
              <Timer size={24} className="text-[#44FF00]" />
              <div className="flex items-center gap-2 text-white font-mono text-2xl sm:text-3xl font-black">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[#44FF00] animate-pulse">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[#44FF00] animate-pulse">:</span>
                <span className="text-[#44FF00]">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                const el = document.getElementById('cart-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full max-w-xs bg-[#44FF00] text-[#171717] py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-transform mt-2"
            >
              <ShoppingBag size={18} /> QUERO MEU PACK
            </button>
          </>
        )}

        {launch.step === 3 && (
          <div className="w-full flex flex-col items-center gap-3">
            <button 
              disabled
              className="w-full max-w-xs bg-gray-600 text-gray-300 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed"
            >
              {launch.label}
            </button>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">
              Obrigado a todas as participantes! ❤️
            </span>
          </div>
        )}
      </div>
    </div>
  );
};