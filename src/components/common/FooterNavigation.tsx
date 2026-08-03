"use client";

import React from 'react';
import { User, Bell } from 'lucide-react';

interface FooterNavigationProps {
  onOpenMeuAmiguMundo: () => void;
  onOpenNotifications: () => void;
  favoritesCount: number;
  notificationsCount: number;
}

export const FooterNavigation = ({
  onOpenMeuAmiguMundo,
  onOpenNotifications,
  favoritesCount,
  notificationsCount
}: FooterNavigationProps) => {
  const tealBackgroundStyle = {
    backgroundColor: "#0E5E6F",
  };

  return (
    <div 
      style={tealBackgroundStyle}
      className="fixed bottom-0 left-0 right-0 z-50 h-[40px] flex items-center justify-between px-4 shadow-[0_-4px_15px_rgba(0,0,0,0.15)] border-t border-white/10"
    >
      <button
        onClick={onOpenNotifications}
        translate="no"
        className="notranslate flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all py-1.5 px-4 rounded-full border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >
        <div className="relative">
          <Bell size={16} className="text-[#44FF00]" fill="#44FF00" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-black w-3 h-3 rounded-full flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </div>
        <span translate="no" className="notranslate text-xs font-black uppercase tracking-wider text-white">Notificações</span>
      </button>

      <button
        onClick={onOpenMeuAmiguMundo}
        translate="no"
        className="notranslate flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all py-1.5 px-4 rounded-full border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >
        <div className="relative">
          <User size={16} className="text-[#44FF00]" fill="#44FF00" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-[#171717] text-[7px] font-black w-3 h-3 rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </div>
        <span translate="no" className="notranslate text-xs font-black uppercase tracking-wider text-white">Meu AmiguMundo</span>
      </button>
    </div>
  );
};