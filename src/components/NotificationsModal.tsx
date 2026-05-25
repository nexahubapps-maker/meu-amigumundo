"use client";

import React from 'react';
import { X, Bell, Calendar } from 'lucide-react';
import { type SheetNotification } from '@/utils/sheets';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SheetNotification[];
}

export const NotificationsModal = ({
  isOpen,
  onClose,
  notifications
}: NotificationsModalProps) => {
  if (!isOpen) return null;

  const activeNotifications = notifications.filter(n => n.status);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="text-[#44FF00]" size={20} />
            <h2 className="text-base font-black uppercase tracking-tight text-gray-800">Histórico de Notificações</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Bell size={48} className="text-gray-200 mb-3" />
              <p className="text-gray-400 font-black text-xs uppercase tracking-wider">Nenhum aviso recente</p>
              <p className="text-gray-300 text-[10px] mt-1">Fique de olho aqui para novidades e promoções!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeNotifications.map((notif) => {
                const date = new Date(notif.data_hora);
                const formattedDate = isNaN(date.getTime()) 
                  ? notif.data_hora 
                  : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={notif.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-black text-gray-800 uppercase leading-tight">{notif.titulo}</h4>
                      <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold shrink-0">
                        <Calendar size={10} />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{notif.mensagem}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};