"use client";

import { MessageCircle } from "lucide-react";

export const SupportButton = () => {
  const handleSupport = () => {
    window.open("https://wa.me/5544999999999", "_blank"); // Substitua pelo seu número real
  };

  return (
    <button
      onClick={handleSupport}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center"
      aria-label="Suporte WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" />
    </button>
  );
};