"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getProfile, type Perfil } from "@/utils/profile";
import { CompleteProfileModal } from "@/components/CompleteProfileModal";
import { MeuAmiguMundoView } from "@/components/features/membros/MeuAmiguMundoView";
import { PremiumSalesView } from "@/components/features/membros/PremiumSalesView";

const PremiumPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Perfil | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (authLoading) return; // ainda não sabemos se existe sessão — espera antes de decidir
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
  }, [user, authLoading]);

  if (authLoading || isLoadingProfile) {
    // Sem tela própria aqui de propósito: a splash nativa do PWA (definida no
    // manifest-premium.json) já cobre esse instante de carregamento. Renderizar
    // uma segunda tela aqui criava a sensação de duas telas de abertura em sequência.
    return null;
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

  return <MeuAmiguMundoView onBack={() => navigate("/")} onAddToCart={() => {}} esconderBotaoVoltar={true} />;
};

export default PremiumPage;