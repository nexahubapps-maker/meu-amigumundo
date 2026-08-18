"use client";

import React from 'react';
import { Bell, Receipt, Crown } from 'lucide-react';

interface FooterNavigationProps {
  onOpenMeuAmiguMundo: () => void;
  onOpenNotifications: () => void;
  onOpenMeusPedidos: () => void;
  notificationsCount: number;
}

export const FooterNavigation = ({
  onOpenMeuAmiguMundo,
  onOpenNotifications,
  onOpenMeusPedidos,
  notificationsCount
}: FooterNavigationProps) => {
  const tealBackgroundStyle = {
    backgroundColor: "#0E5E6F",
  };

  return (
    <div
      style={tealBackgroundStyle}
      className="fixed bottom-0 left-0 right-0 z-50 min-h-[58px] flex items-center justify-between gap-2 px-3 py-2 shadow-[0_-4px_15px_rgba(0,0,0,0.15)] border-t border-white/10"
    >
      <button
        onClick={onOpenNotifications}
        translate="no"
        className="notranslate flex-1 flex items-center justify-center gap-1.5 text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all py-1.5 px-2 rounded-full border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >
        <div className="relative shrink-0">
          <Bell size={15} className="text-[#44FF00]" fill="#44FF00" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-black w-3 h-3 rounded-full flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </div>
        <span translate="no" className="notranslate text-[10px] font-black uppercase tracking-wider text-white leading-tight text-left">Notificações</span>
      </button>

      <button
        onClick={onOpenMeusPedidos}
        translate="no"
        className="notranslate flex-1 flex items-center justify-center gap-1.5 text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all py-1.5 px-2 rounded-full border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >
        <Receipt size={15} className="text-[#44FF00] shrink-0" />
        <span translate="no" className="notranslate flex flex-col leading-[1.1] text-[10px] font-black uppercase tracking-wider text-white text-left">
          <span>Meus</span>
          <span>Pedidos</span>
        </span>
      </button>

      <button
        onClick={onOpenMeuAmiguMundo}
        translate="no"
        className="notranslate flex-1 flex items-center justify-center gap-1.5 text-[#3A2A00] bg-gradient-to-r from-[#F4D160] to-[#C9971C] hover:brightness-105 active:scale-95 transition-all py-1.5 px-2 rounded-full border border-[#B8860B]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
      >
        <Crown size={15} className="text-[#3A2A00] shrink-0" fill="#3A2A00" />
        <span translate="no" className="notranslate flex flex-col leading-[1.1] text-[10px] font-black uppercase tracking-wider text-[#3A2A00] text-left">
          <span>AmiguMundo</span>
          <span>Premium</span>
        </span>
      </button>
    </div>
  );
};