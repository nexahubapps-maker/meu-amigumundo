"use client";

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SuccessModal } from './SuccessModal';
import { Download, Send } from 'lucide-react';
import { playHeartbeatSound } from '@/utils/audio';
import { getReceitaGratuita, getRecipes, type SheetRecipe } from '@/utils/sheets';

const EVOLUTION_API_URL = "https://api.evolution-api.com/v1/messages/sendMedia";
const EVOLUTION_API_TOKEN = "YOUR_EVOLUTION_API_TOKEN";

export function sanitizeDriveUrl(url: string): string {
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

export const DailyGiftSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dailyRecipe, setDailyRecipe] = useState<SheetRecipe | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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

        // Try to find today's gift
        let targetGift = receitasGratuitas.find(g => g.data === todayStr);
        
        // Fallback: If today's date is not found, use the first available gift in the list
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
        setPdfUrl(sanitizeDriveUrl(targetGift.pdf_url));
        setIsVisible(true);
      } catch (error) {
        console.warn("Error loading daily gift, hiding section silently:", error);
        setIsVisible(false);
      }
    };

    fetchDailyGift();
  }, []);

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

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawDigits = whatsapp.replace(/\D/g, "");
    if (rawDigits.length < 10) {
      setStatusMessage("❌ Por favor, digite um número de WhatsApp válido.");
      return;
    }

    setIsSending(true);
    setStatusMessage("");
    playHeartbeatSound();

    try {
      const payload = {
        number: rawDigits,
        mediatype: "document",
        media: pdfUrl,
        fileName: `${dailyRecipe?.nome || "Receita_Gratis"}.pdf`,
        caption: "Aqui está o seu presente diário! 🎁"
      };

      const response = await fetch(EVOLUTION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_API_TOKEN
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatusMessage("🎉 Presente enviado! Abra seu WhatsApp, o arquivo PDF já chegou para você.");
        setWhatsapp("");
        
        // Trigger confetti
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
        }, 500);
      } else {
        throw new Error("Failed to send via Evolution API");
      }
    } catch (error) {
      console.error("Error sending gift:", error);
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
    <section style={textureVerdeOlivaStyle} className="py-10 px-4 text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-white font-extrabold text-[1.4rem] leading-tight mb-2 uppercase tracking-tight">
          SEU MIMO GRATUITO <br /> DO DIA CHEGOU
        </h2>
        <p className="text-white/90 text-[0.9rem] font-medium mb-8">
          Nos visite todos os dias para retirar sua receita grátis e garantir seu presente diário!
        </p>

        <div className="bg-white rounded-[24px] p-6 shadow-xl border border-white/50 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#E0F2FE] rounded-2xl flex items-center justify-center text-3xl">
            🎁
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[#171717] text-[0.95rem] font-bold uppercase">
              {dailyRecipe.nome}
            </h3>
            <p className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider">
              Disponível apenas hoje
            </p>
          </div>

          <form onSubmit={handleSendGift} className="w-full space-y-3">
            <input
              type="text"
              value={whatsapp}
              onChange={handleWhatsappChange}
              placeholder="+55 (00) 00000-0000"
              maxLength={19}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-bold text-gray-700 focus:outline-none focus:border-[#44FF00] transition-colors"
              required
            />
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-[#44FF00] text-[#171717] py-4 rounded-2xl font-black text-[0.9rem] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              {isSending ? "Enviando..." : "Receber Receita Grátis no meu WhatsApp"} <Send size={18} />
            </button>
          </form>

          {statusMessage && (
            <p className="text-xs font-bold text-gray-700 mt-2">{statusMessage}</p>
          )}
        </div>
      </div>

      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};