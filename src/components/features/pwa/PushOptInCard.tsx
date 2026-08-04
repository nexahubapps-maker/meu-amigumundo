"use client";
import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { subscribeToPush, getPushPermissionState } from "@/utils/pushNotifications";
import { useAuth } from "@/context/AuthContext";

export const PushOptInCard = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = async () => {
      const dismissed = localStorage.getItem("amigumundo-push-dispensado");
      const state = await getPushPermissionState();
      if (!dismissed && state === "default") {
        setVisible(true);
      }
    };
    check();
  }, []);

  const handleAtivar = async () => {
    const ok = await subscribeToPush(user?.id);
    if (ok) setVisible(false);
    else {
      localStorage.setItem("amigumundo-push-dispensado", "true");
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("amigumundo-push-dispensado", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-3">
      <div className="bg-[#171717] rounded-2xl p-4 flex items-center gap-3 shadow-lg relative">
        <button onClick={handleDismiss} className="absolute top-2 right-2 text-white/40 hover:text-white/70 p-1">
          <X size={16} />
        </button>
        <div className="w-10 h-10 bg-[#44FF00]/10 rounded-full flex items-center justify-center text-[#44FF00] shrink-0">
          <Bell size={20} />
        </div>
        <div className="flex-1">
          <p className="text-white text-xs font-black uppercase tracking-tight">Ative as notificações</p>
          <p className="text-white/60 text-[11px] font-medium mt-0.5">Fique sabendo de promoções e receitas novas, mesmo com o app fechado.</p>
        </div>
        <button
          onClick={handleAtivar}
          className="bg-[#44FF00] text-[#171717] text-[10px] font-black uppercase px-3 py-2 rounded-xl shrink-0 active:scale-95 transition-transform"
        >
          Ativar
        </button>
      </div>
    </div>
  );
};