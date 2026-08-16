"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, Calendar, ExternalLink } from 'lucide-react';
import { type SheetNotification } from '@/utils/sheets';
import { getReadNotificationIds, markNotificationsAsRead } from '@/utils/notificacoesLidas';
import { getPrimeiroAcesso } from "@/utils/primeiroAcesso";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SheetNotification[];
}

export const NotificationsModal = ({ isOpen, onClose, notifications }: NotificationsModalProps) => {
  const navigate = useNavigate();
  const [readIds, setReadIds] = useState<string[]>(() => getReadNotificationIds());
  const [selectedNotif, setSelectedNotif] = useState<SheetNotification | null>(null);

  if (!isOpen) return null;

  const primeiroAcesso = new Date(getPrimeiroAcesso());
  const activeNotifications = notifications.filter(n => {
    const dataNotif = new Date(n.data_hora.replace(" ", "T"));
    return n.ativo && dataNotif <= new Date() && dataNotif >= primeiroAcesso;
  });

  const handleOpenDetail = (notif: SheetNotification) => {
    setSelectedNotif(notif);
    markNotificationsAsRead([notif.id]);
    setReadIds(getReadNotificationIds());
  };

  const handleGoToLink = (link: string) => {
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else if (link.includes("#")) {
      const [path, hash] = link.split("#");
      navigate(path || "/");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      navigate(link);
    }
    setSelectedNotif(null);
    onClose();
  };

  const formatDate = (raw: string) => {
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    if (!match) return raw;
    const [, , month, day, hour, minute] = match;
    return `${day}/${month} - ${hour}:${minute}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="text-[#44FF00]" size={20} />
            <h2 className="text-base font-black uppercase tracking-tight text-gray-800">Histórico de Notificações</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Bell size={48} className="text-gray-200 mb-3" />
              <p className="text-gray-400 font-black text-xs uppercase tracking-wider">Nenhum aviso recente</p>
              <p className="text-gray-300 text-[10px] mt-1">Fique de olho aqui para novidades e promoções!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeNotifications.map((notif) => {
                const isUnread = !readIds.includes(notif.id);
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleOpenDetail(notif)}
                    className={`relative p-3 rounded-2xl border space-y-2 cursor-pointer active:scale-[0.99] transition-all ${isUnread ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
                  >
                    {isUnread && (
                      <span className="absolute -top-2 -right-2 bg-[#44FF00] text-[#171717] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Nova
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-gray-800 uppercase leading-tight">
                          {notif.titulo}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold mt-1">
                          <Calendar size={10} />
                          <span>{formatDate(notif.data_hora)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      {notif.imagem_url && (
                        <img
                          src={notif.imagem_url}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                      )}
                      <p className="text-xs text-gray-600 font-medium leading-relaxed flex-1 line-clamp-2">
                        {notif.mensagem}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedNotif && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedNotif(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-black text-gray-800 uppercase leading-tight pr-2">{selectedNotif.titulo}</h3>
              <button onClick={() => setSelectedNotif(null)} className="p-1 text-gray-400 hover:text-gray-600 shrink-0">
                <X size={18} />
              </button>
            </div>
            {selectedNotif.imagem_url && (
              <img src={selectedNotif.imagem_url} alt="" className="w-full h-40 object-cover rounded-2xl border border-gray-100 mb-3" />
            )}
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4">{selectedNotif.mensagem}</p>
            <div className="flex items-center gap-1 text-[12px] text-gray-400 font-bold mb-4">
              <Calendar size={11} />
              <span>{formatDate(selectedNotif.data_hora)}</span>
            </div>
            {selectedNotif.link && (
              <button
                onClick={() => handleGoToLink(selectedNotif.link)}
                className="w-full bg-[#44FF00] text-[#171717] py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5"
              >
                Ver agora <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};