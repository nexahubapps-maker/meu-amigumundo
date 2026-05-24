"use client";

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SuccessModal } from './SuccessModal';
import { Send } from 'lucide-react';
import { playHeartbeatSound } from '@/utils/audio';
import { getReceitaGratuita, getRecipes, getDriveFileUrl, type SheetRecipe } from '@/utils/sheets';

const EVOLUTION_API_URL = "https://api.evolution-api.com/v1/messages/sendMedia";
const EVOLUTION_API_TOKEN = "YOUR_EVOLUTION_API_TOKEN";

export const DailyGiftSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dailyRecipe, setDailyRecipe] = useState<SheetRecipe | null>(null);
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Gamification States
  const [isOpened, setIsOpened] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchDailyGift = async () => {
      try {
        const [receitasGratuitas, recipes] = await Promise.all([
          getReceitaGratuita(),
          getRecipes()
        ]);

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayStr = `${day}/${month}/${year}`;

        // Tenta encontrar o presente de hoje
        let targetGift = receitasGratuitas.find(g => g.data === todayStr);
        
        // Fallback: Se a data de hoje não estiver na planilha, usa o primeiro presente disponível
        if (!targetGift && receitasGratuitas.length > 0) {
          targetGift = receitasGratuitas[0];
        }

        if (!targetGift) {
          setIsVisible(false);
          return;
        }

        const matchedRecipe = recipes.find(r => r.id === targetGift.codigo);
        if (!matchedRecipe) {
          setIsVisible(false);
          return;
        }

        setDailyRecipe(matchedRecipe);
        setIsVisible(true);
      } catch (error) {
        console.warn("Erro ao carregar presente diário, ocultando seção silenciosamente:", error);
        setIsVisible(false);
      }
    };

    fetchDailyGift();
  }, []);

  // Acelera o vídeo para 3x assim que ele carregar
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 3.0;
    }
  }, [dailyRecipe]);

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
    
    // Trigger a small burst of confetti when clicked
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    // Smoothly reveal the form shortly after the opening animation starts
    setTimeout(() => {
      setShowForm(true);
    }, 300);
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
      // Busca dinamicamente o link do PDF no Google Drive usando o código universal
      const pdfUrl = await getDriveFileUrl(dailyRecipe.id);

      const payload = {
        number: rawDigits,
        mediatype: "document",
        media: pdfUrl,
        fileName: `${dailyRecipe.nome}.pdf`,
        caption: "Aqui está o seu presente diário! 🎁"
      };

      // Trigger direct WhatsApp redirection as a fallback/primary action to guarantee delivery
      const messageText = `Olá! Quero desbloquear meu presente diário: ${dailyRecipe.nome} (Código: ${dailyRecipe.id})`;
      const waUrl = `https://wa.me/5544999999999?text=${encodeURIComponent(messageText)}`;

      // Send to Evolution API in background
      fetch(EVOLUTION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_API_TOKEN
        },
        body: JSON.stringify(payload)
      }).catch(err => console.warn("Evolution API background send failed:", err));

      // Success feedback
      setStatusMessage("🎉 Redirecionando para o WhatsApp para liberar seu PDF instantaneamente...");
      setWhatsapp("");
      
      // Dispara confetes comemorativos
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
    <section style={textureVerdeOlivaStyle} className="py-12 px-4 text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-white font-extrabold text-[1.5rem] leading-tight mb-3 uppercase tracking-tight">
          SEU MIMO GRATUITO <br /> DO DIA CHEGOU
        </h2>
        <p className="text-white/90 text-[0.95rem] font-medium mb-10">
          Nos visite todos os dias para retirar sua receita grátis e garantir seu presente diário!
        </p>

        {/* Card Branco com Espaçamento Premium e Confortável */}
        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-white/50 flex flex-col items-center gap-6 relative overflow-hidden">
          
          {/* Recipiente do Vídeo da Caixinha Roxa com Animação de Pulo Elástico */}
          {!isOpened && (
            <div 
              onClick={handleOpenPresent}
              className="relative w-44 h-44 flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95"
            >
              <video
                ref={videoRef}
                src="/Purple_gift_box_bouncing_animation_202605240042.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-2xl"
                style={{ mixBlendMode: 'multiply' }}
              />
              <span className="absolute -bottom-2 bg-[#44FF00] text-[#171717] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider animate-bounce shadow-md">
                Toque para Abrir! 🎁
              </span>
            </div>
          )}

          {/* Revelado: Polvinho de Crochê surgindo com fade-in e scale-in */}
          {isOpened && (
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-b from-green-50 to-green-100/50 border-2 border-[#44FF00]/30 p-2 flex items-center justify-center animate-in zoom-in-75 duration-500">
              <img 
                src={dailyRecipe.url_foto} 
                alt={dailyRecipe.nome} 
                className="w-32 h-32 object-cover rounded-full shadow-lg border-2 border-white animate-pulse-subtle"
              />
              <div className="absolute -bottom-1 bg-[#44FF00] text-[#171717] text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                REVELADO! 🎉
              </div>
            </div>
          )}
          
          {/* Identificação do Produto e Código */}
          <div className="space-y-1.5 text-center">
            <h3 className="text-[#171717] text-xl sm:text-2xl font-black uppercase tracking-tight font-sans">
              {dailyRecipe.nome}
            </h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Disponível apenas hoje (CÓD: {dailyRecipe.id})
            </p>
          </div>

          {/* Formulário de Captura de Lead com Transição Suave */}
          <div className={`w-full transition-all duration-700 ease-out ${showForm ? 'opacity-100 max-h-[300px] translate-y-0' : 'opacity-30 max-h-[120px] pointer-events-none translate-y-2'}`}>
            
            {!showForm && (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider animate-pulse mb-2">
                🔒 Toque no presente acima para liberar o formulário de resgate
              </p>
            )}

            <form onSubmit={handleSendGift} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  placeholder="+55 (00) 00000-0000"
                  maxLength={19}
                  disabled={!showForm}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-center font-black text-gray-700 focus:outline-none focus:border-[#44FF00] transition-all shadow-sm focus:shadow-md placeholder:text-gray-300 text-base"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSending || !showForm}
                className="w-full bg-[#44FF00] hover:bg-[#3ee600] active:bg-[#38cc00] text-[#171717] py-4.5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-wider"
              >
                {isSending ? "Enviando..." : "Desbloquear Meu Presente Diário no WhatsApp"}
              </button>
            </form>

            {statusMessage && (
              <p className="text-xs font-bold text-gray-700 mt-3 animate-fade-in">{statusMessage}</p>
            )}
          </div>
        </div>
      </div>

      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};