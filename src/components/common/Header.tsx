"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { getProfile, type Perfil } from "@/utils/profile";

interface HeaderProps {
  cartCount?: number;
  onOpenMeuAmiguMundo?: () => void;
}

export const Header = ({ cartCount = 0, onOpenMeuAmiguMundo }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [profile, setProfile] = useState<Perfil | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const p = await getProfile(user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
    }
    fetchProfile();
  }, [user]);

  return (
    <div className="relative mx-4 my-2 lg:mx-auto lg:max-w-6xl bg-white h-[92px] flex items-center px-4 shadow-[0_12px_28px_rgba(0,0,0,0.15),_0_6px_12px_rgba(0,0,0,0.1)] rounded-2xl border-2 border-gray-200">
      <div className="w-full flex items-center justify-between">
        <div 
          className="flex flex-col items-start cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img 
            src="https://ik.imagekit.io/51b3srlsg/logomarca_amigumundo_01.png" 
            alt="AmiguMundo" 
            className="h-[60px] w-auto object-contain"
          />
          <span className="text-[11px] font-black text-black -mt-1 leading-none">
            Uma Comunidade apaixonada por Amigurumis
          </span>
        </div>
        
        <div className="flex flex-col items-center justify-center h-full gap-2 shrink-0">
          <div className="bg-[#44FF00] text-[#171717] px-2 py-0.5 rounded-md flex flex-col items-center leading-none text-[7px] font-black uppercase border border-black/5">
            <span className="text-[5px] text-[#171717]/60 font-bold">um produto</span>
            <span className="tracking-tight">AMIGUMUNDO ARTES</span>
          </div>
          
          <div className="flex flex-row gap-2 items-center">
            {user ? (
              <button 
                onClick={onOpenMeuAmiguMundo}
                className="flex flex-col items-center gap-0.5 max-w-[64px]"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-[#44FF00] flex items-center justify-center shrink-0">
                  {profile?.foto_url ? (
                    <img src={profile.foto_url} alt={profile.nome || "Perfil"} className="w-full h-full object-cover" />
                  ) : (
                    <User size={22} className="text-gray-400" />
                  )}
                </div>
                <span className="text-[10px] font-black text-gray-700 uppercase truncate w-full text-center leading-tight">
                  {profile?.nome || "Perfil"}
                </span>
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="relative p-1.5 text-[#171717] hover:text-[#44FF00] transition-colors bg-gray-50 rounded-full flex items-center justify-center"
                title="Entrar / Cadastrar"
              >
                <User size={22} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};