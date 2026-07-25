"use client";

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Download, Bookmark, Check, Loader2 } from 'lucide-react';
import { playHeartbeatSound } from '@/utils/audio';
import { getReceitaGratuita, getRecipesByIds, getDriveFileUrl, type SheetReceitaGratuita } from '@/utils/sheets';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export const DailyGiftSection = () => {
  const { user } = useAuth();
  const [dailyRecipe, setDailyRecipe] = useState<SheetReceitaGratuita | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

  const [linkDownload, setLinkDownload] = useState<string | null>(null);
  const [isSalvo, setIsSalvo] = useState(false);
  const [isSalvando, setIsSalvando] = useState(false);

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

  useEffect(() => {
    const resolveLink = async () => {
      if (!isOpened || !dailyRecipe) return;
      try {
        const recipes = await getRecipesByIds([dailyRecipe.codigo]);
        const categoria = recipes[0]?.categoria || "";
        const url = await getDriveFileUrl(dailyRecipe.codigo, categoria);
        setLinkDownload(url);
      } catch (e) {
        console.error("Erro ao gerar link de download:", e);
      }
    };

    resolveLink();
  }, [isOpened, dailyRecipe]);

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

  const handleSalvarBiblioteca = async () => {
    if (!user || !dailyRecipe) return;
    setIsSalvando(true);
    try {
      await supabase.from("biblioteca").upsert({
        usuario_id: user.id,
        tipo_item: "receita_gratuita",
        codigo_item: dailyRecipe.codigo,
        nome_item: dailyRecipe.nome,
        imagem_url: dailyRecipe.imagem_url,
        adicionado_em: new Date().toISOString(),
      }, { onConflict: "usuario_id,tipo_item,codigo_item" });
      setIsSalvo(true);
    } catch (e) {
      console.error("Erro ao salvar na biblioteca:", e);
    } finally {
      setIsSalvando(false);
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
                  src={dailyRecipe.imagem_url} 
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

              <div className="w-full space-y-3 max-w-md mt-2">
                {linkDownload ? (
                  <a
                    href={linkDownload}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#44FF00] hover:bg-[#3ee600] active:bg-[#38cc00] text-[#171717] py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all uppercase tracking-wider leading-tight"
                  >
                    <Download size={18} />
                    <span>Baixar Receita (PDF)</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-not-allowed uppercase tracking-wider"
                  >
                    <Loader2 size={18} className="animate-spin" />
                    <span>Gerando link...</span>
                  </button>
                )}

                {user ? (
                  <button
                    onClick={handleSalvarBiblioteca}
                    disabled={isSalvo || isSalvando}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
                      isSalvo 
                        ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' 
                        : 'bg-gray-100 hover:bg-gray-200 active:scale-[0.98] text-gray-800'
                    }`}
                  >
                    {isSalvando ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isSalvo ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        <span>Salvo! ✅</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={16} />
                        <span>Salvar na Biblioteca</span>
                      </>
                    )}
                  </button>
                ) : (
                  <p className="text-[11px] text-gray-500 font-bold leading-relaxed px-2 pt-1">
                    💡 Crie sua conta grátis pra salvar essa receita na sua Biblioteca e nunca mais perder o mimo do dia.
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};