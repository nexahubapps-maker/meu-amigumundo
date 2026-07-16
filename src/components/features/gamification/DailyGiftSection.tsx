"use client";

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SuccessModal } from './SuccessModal';
import { playHeartbeatSound } from '@/utils/audio';
import { getReceitaGratuita, type SheetReceitaGratuita } from '@/utils/sheets';

export const DailyGiftSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dailyRecipe, setDailyRecipe] = useState<SheetReceitaGratuita | null>(null);
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchDailyGift = async () => {
      try {
        const receitasGratuitas = await getReceitaGratuita();

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayStr = `${day}/${month}/${year}`;

        let targetGift = receitasGratuitas.find(g => g.data === todayStr && g.ativo);
        
        if (!targetGift && receitasGratuitas.length > 0) {
          targetGift = receitasGratuitas.find(g => g.ativo) || receitasGratuitas[0];
        }

        if (!targetGift) {
          setIsVisible(false);
          return;
        }

        setDailyRecipe(targetGift);
        setIsVisible(true);
      } catch (error) {
        console.warn("Erro ao carregar presente diário, ocultando seção silenciosamente:", error);
        setIsVisible(false);
      }
    };

    fetchDailyGift();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 3.0;
      
      const handlePlay = () => {
        video.playbackRate = 3.0;
      };

      video.addEventListener('play', handlePlay);
      return () => {
        video.removeEventListener('play', handlePlay);
      };
    }
  }, [isOpened, dailyRecipe]);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (rawValue.length > 0) {
      formattedValue += `+55 (${rawValue.substring(2, 4)}`;
    }
    if (rawValue.length > 4) {
      formattedValue += `) ${rawValue.substring(4, 9)}`;
    }
    if (rawValue.length > 9) {
      formattedValue += `-${rawValue.substring(9, 13)}`;
    }

    setWhatsapp(formattedValue);
  };

  const handleOpenPresent = () => {
    if (isOpened) return;
    
    playHeartbeatSound();
    setIsOpened(true);
    
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawDigits = whatsapp.replace(/\D/g, "");
    if (rawDigits.length < 10) {
      setStatusMessage("❌ Por favor, digite um número de WhatsApp válido.");
      return;
    }

    if (!dailyRecipe) return;

    setIsSending(true);
    setStatusMessage("");
    playHeartbeatSound();

    try {
      const messageText = `Quero minha receita grátis: ${dailyRecipe.nome} (${dailyRecipe.codigo})`;
      const waUrl = `https://wa.me/5544999999999?text=${encodeURIComponent(messageText)}`;

      setStatusMessage("🎉 Redirecionando para o WhatsApp para liberar seu PDF instantaneamente...");
      setWhatsapp("");
      
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      setTimeout(() => {
        setIsModalOpen(true);
        window.open(waUrl, "_blank");
      }, 800);

    } catch (error) {
      console.error("Erro ao enviar presente:", error);
      setStatusMessage("❌ Ocorreu um erro ao enviar. Tente novamente mais tarde.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isVisible || !dailyRecipe) return null;

  const textureVerdeOlivaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_verde_oliva.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  return (
    <section style={textureVerdeOlivaStyle} className="py-6 px-4 text-center">
      <div className="max-w-xl mx-auto">
        <p className="text-white text-sm sm:text-base font-black uppercase tracking-wide mb-4">
          Volte todos os dias para retirar sua receita grátis e garantir seu presente diário!
        </p>

        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-white/50 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px]">
          
          {!isOpened ? (
            <div className="flex flex-col items-center gap-4 w-full animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <span className="text-2xl font-black uppercase tracking-widest block" style={{ color: '#9241B1' }}>
                  Mimo Exclusivo
                </span>
                <h3 className="text-black text-lg font-black uppercase tracking-tight leading-tight">
                  Você tem 1<br />PRESENTE LIBERADO!
                </h3>
                <p className="text-base font-bold leading-tight" style={{ color: '#9241B1' }}>
                  Toque na caixinha abaixo para<br />descobrir o que ganhou
                </p>
              </div>

              <div 
                onClick={handleOpenPresent}
                className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 shrink-0"
              >
                <video
                  ref={videoRef}
                  src="/gift-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  className="w-full h-full object-cover rounded-2xl"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>

              <button
                onClick={handleOpenPresent}
                className="bg-[#44FF00] text-[#171717] py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                TOQUE PARA ABRIR! 🎁
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 w-full animate-in fade-in zoom-in-95 duration-500">
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-b from-green-50 to-green-100/50 border-2 border-[#44FF00]/30 p-2 flex items-center justify-center shrink-0">
                <img 
                  src={dailyRecipe.url_foto} 
                  alt={dailyRecipe.nome} 
                  className="w-32 h-32 object-cover rounded-full shadow-lg border-2 border-white animate-pulse-subtle"
                />
                <div className="absolute -bottom-2 bg-[#44FF00] text-[#171717] text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  REVELADO! 🎉
                </div>
              </div>
              
              <div className="space-y-1 text-center">
                <p className="text-xs font-bold uppercase tracking-wider leading-tight" style={{ color: '#9241B1' }}>
                  Parabéns!<br />Você ganhou a receita do:
                </p>
                <h3 className="text-[#171717] text-xl sm:text-2xl font-black uppercase tracking-tight">
                  {dailyRecipe.nome}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9241B1' }}>
                  Disponível apenas hoje ({dailyRecipe.codigo})
                </p>
              </div>

              <form onSubmit={handleSendGift} className="w-full space-y-3 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                    placeholder="+55 (00) 00000-0000"
                    maxLength={19}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-center font-black text-gray-700 focus:outline-none focus:border-[#44FF00] transition-all shadow-sm focus:shadow-md placeholder:text-gray-300 text-base"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#44FF00] hover:bg-[#3ee600] active:bg-[#38cc00] text-[#171717] py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-wider leading-tight"
                >
                  {isSending ? "Enviando..." : (
                    <span>
                      Quero receber meu<br />Presente no WhatsApp
                    </span>
                  )}
                </button>
              </form>

              {statusMessage && (
                <p className="text-xs font-bold text-gray-700 mt-1 animate-fade-in">{statusMessage}</p>
              )}
            </div>
          )}

        </div>
      </div>

      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};