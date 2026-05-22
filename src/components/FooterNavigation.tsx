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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] h-[60px] flex items-center justify-around px-6">
      <button
        onClick={onOpenFavorites}
        className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-[#44FF00] transition-colors relative py-1 px-4"
      >
        <div className="relative">
          <Heart size={20} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#44FF00] text-[#171717] text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
              {favoritesCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider">Favoritos</span>
      </button>

      <button
        onClick={onOpenNotifications}
        className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-[#44FF00] transition-colors relative py-1 px-4"
      >
        <div className="relative">
          <Bell size={20} />
          {notificationsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
              {notificationsCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider">Avisos</span>
      </button>
    </div>
  );
};