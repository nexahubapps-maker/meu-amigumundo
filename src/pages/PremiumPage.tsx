"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type Perfil } from "@/utils/profile";
import { CompleteProfileModal } from "@/components/CompleteProfileModal";
import { MeuAmiguMundoView } from "@/components/features/membros/MeuAmiguMundoView";
import { PremiumSalesView } from "@/components/features/membros/PremiumSalesView";
import { Loader2 } from "lucide-react";

const PremiumPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Perfil | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }
      const p = await getProfile(user.id);
      setProfile(p);
      setIsLoadingProfile(false);
      if (p?.assinatura_status === "ativo" && !p?.telefone) {
        setIsCompleteProfileOpen(true);
      }
    };
    load();
  }, [user]);

  if (isLoadingProfile) {
    return (
      <div className="fixed inset-0 bg-[#F8F6F2] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#5D0599]" />
      </div>
    );
  }

  if (!user || profile?.assinatura_status !== "ativo") {
    return <PremiumSalesView onBack={() => navigate("/")} />;
  }

  if (!profile?.telefone) {
    return (
      <div className="fixed inset-0 bg-[#F8F6F2]">
        <CompleteProfileModal
          isOpen={isCompleteProfileOpen}
          onClose={() => setIsCompleteProfileOpen(false)}
          userId={user?.id}
          nomeAtual={profile?.nome}
          nomeAtelieAtual={profile?.nome_atelie}
          fotoAtual={profile?.foto_url}
          telefoneAtual={profile?.telefone}
          emailAtual={user?.email}
          bioAtual={profile?.bio}
          cidadeAtual={profile?.cidade}
          tagAtual={profile?.tag_especialidade}
          onSuccess={async () => {
            setIsCompleteProfileOpen(false);
            const p = await getProfile(user.id);
            setProfile(p);
          }}
        />
      </div>
    );
  }

  return <MeuAmiguMundoView onBack={() => navigate("/")} onAddToCart={() => {}} />;
};

export default PremiumPage;