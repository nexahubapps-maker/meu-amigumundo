"use client";

import React from 'react';
import { Heart, Bell } from 'lucide-react';

interface FooterNavigationProps {
  onOpenFavorites: () => void;
  onOpenNotifications: () => void;
  favoritesCount: number;
  notificationsCount: number;
}

export const FooterNavigation = ({
  onOpenFavorites,
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
      className="fixed bottom-0 left-0 right-0 z-50 h-[40px] flex items-center justify-around px-6 shadow-[0_-4px_15px_rgba(0,0,0,0.15)] border-t border-white/10"
    >
      <button
        onClick={onOpenNotifications}
        translate="no"
        className="notranslate flex items-center justify-center gap-2 text-white hover:bg-white/10 active:scale-95 transition-all py-1 px-4 rounded-full"
      >
        <div className="relative">
          <Bell size={16} className="text-[#44FF00]" fill="#44FF00" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[7px] font-black w-3 h-3 rounded-full flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </div>
        <span translate="no" className="notranslate text-xs font-black uppercase tracking-wider text-white">Notificações</span>
      </button>

      <button
        onClick={onOpenFavorites}
        translate="no"
        className="notranslate flex items-center justify-center gap-2 text-white hover:bg-white/10 active:scale-95 transition-all py-1 px-4 rounded-full"
      >
        <div className="relative">
          <Heart size={16} className="text-[#44FF00]" fill="#44FF00" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#171717] text-[7px] font-black w-3 h-3 rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </div>
        <span translate="no" className="notranslate text-xs font-black uppercase tracking-wider text-white">Favoritos</span>
      </button>
    </div>
  );
};