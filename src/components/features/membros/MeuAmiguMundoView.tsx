"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type Perfil } from "@/utils/profile";

interface MeuAmiguMundoViewProps {
  onBack: () => void;
}

const TABS = [
  "Minhas Compras",
  "Packs & Promoções",
  "Receitas Gratuitas",
  "Favoritos",
  "Ferramentas",
] as const;

type TabType = (typeof TABS)[number];

export const MeuAmiguMundoView = ({ onBack }: MeuAmiguMundoViewProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Perfil | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Minhas Compras");

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const p = await getProfile(user.id);
        setProfile(p);
      }
    }
    loadProfile();
  }, [user]);

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  };

  const displayName = profile?.nome || user?.email || "Visitante";
  const avatarUrl = profile?.foto_url;

  return (
    <div className="fixed inset-0 z-[90] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
      {/* Cabeçalho Fixo com Textura Laranja */}
      <div
        style={textureLaranjaStyle}
        className="sticky top-0 z-10 py-4 px-4 flex items-center justify-between shadow-md shrink-0"
      >
        <button
          onClick={onBack}
          className="text-white hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 font-black text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <h2 className="text-white font-black text-sm uppercase tracking-widest m-0">
          MEU AMIGUMUNDO
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Faixa de Perfil */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0 shadow-sm">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="text-gray-400" size={22} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
            Área de Membros
          </p>
          <h3 className="text-sm font-black text-gray-900 truncate uppercase leading-tight">
            {displayName}
          </h3>
        </div>
      </div>

      {/* Navegação de Abas (Estilo Instagram) */}
      <div className="bg-white border-b border-gray-200 px-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
        <nav className="flex space-x-6 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-xs font-black uppercase tracking-wider transition-colors relative border-b-2 ${
                  isActive
                    ? "border-[#171717] text-[#171717]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-sm w-full">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">
            {activeTab}
          </p>
          <p className="text-gray-600 font-black text-sm uppercase">Em breve</p>
        </div>
      </div>
    </div>
  );
};