"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, Calendar, ExternalLink } from 'lucide-react';
import { type SheetNotification } from '@/utils/sheets';
import { getReadNotificationIds, markNotificationsAsRead } from '@/utils/notificacoesLidas';

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
  const navigate = useNavigate();
  if (!isOpen) return null;

  const activeNotifications = notifications.filter(n => n.ativo);
  const readIds = getReadNotificationIds();

  const handleClose = () => {
    markNotificationsAsRead(activeNotifications.map(n => n.id));
    onClose();
  };

  const handleNotificationClick = (link: string) => {
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else if (link.includes("#")) {
      const [path, hash] = link.split("#");
      navigate(path || "/");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      handleClose();
    } else {
      navigate(link);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="text-[#44FF00]" size={20} />
            <h2 className="text-base font-black uppercase tracking-tight text-gray-800">Histórico de Notificações</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
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
                const date = new Date(notif.data_hora);
                const formattedDate = isNaN(date.getTime())
                  ? notif.data_hora
                  : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
                const isUnread = !readIds.includes(notif.id);

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.link)}
                    className={`p-3 bg-gray-50 rounded-2xl border space-y-2 transition-all ${notif.link ? 'cursor-pointer hover:bg-gray-100/80 active:scale-[0.99]' : ''} ${isUnread ? 'border-[#44FF00]/50' : 'border-gray-100'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-gray-800 uppercase leading-tight flex items-center gap-1.5">
                          {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-[#44FF00] shrink-0" />}
                          {notif.titulo}
                          {notif.link && <ExternalLink size={10} className="text-gray-400" />}
                        </h4>
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold mt-1">
                          <Calendar size={10} />
                          <span>{formattedDate}</span>
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
                      <p className="text-xs text-gray-600 font-medium leading-relaxed flex-1">
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
    </div>
  );
};