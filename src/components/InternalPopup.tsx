"use client";

import React, { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { type SheetNotification } from '@/utils/sheets';

interface InternalPopupProps {
  notifications: SheetNotification[];
}

export const InternalPopup = ({ notifications }: InternalPopupProps) => {
  const [activePopup, setActivePopup] = useState<SheetNotification | null>(null);

  useEffect(() => {
    const active = notifications.find(n => {
      if (!n.status) return false;
      
      // Check if already dismissed in localStorage
      const isDismissed = localStorage.getItem(`popup-dismissed-${n.id}`);
      if (isDismissed) return false;

      // Check if created within the last 24 hours
      const createdTime = new Date(n.data_hora).getTime();
      const now = Date.now();
      const diffHours = (now - createdTime) / (1000 * 60 * 60);
      
      return diffHours <= 24;
    });

    if (active) {
      setActivePopup(active);
    }
  }, [notifications]);

  const handleDismiss = () => {
    if (activePopup) {
      localStorage.setItem(`popup-dismissed-${activePopup.id}`, "true");
      setActivePopup(null);
    }
  };

  if (!activePopup) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] w-full max-w-sm p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-3 mt-2">
          <div className="w-12 h-12 bg-[#44FF00]/10 rounded-full flex items-center justify-center text-[#44FF00]">
            <Bell size={24} />
          </div>
          
          <div className="space-y-1">
            <span className="text-[9px] font-black text-[#44FF00] uppercase tracking-widest">Aviso Importante</span>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight">
              {activePopup.titulo}
            </h3>
          </div>

          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            {activePopup.mensagem}
          </p>

          <button
            onClick={handleDismiss}
            className="w-full bg-[#44FF00] text-[#171717] py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-transform mt-2"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};