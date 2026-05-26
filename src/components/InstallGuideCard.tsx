"use client";

import React, { useState } from "react";
import { Smartphone, ArrowRight } from "lucide-react";
import { InstallGuideModal } from "./InstallGuideModal";

export const InstallGuideCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Card de Chamada */}
      <div className="max-w-2xl mx-auto px-4 my-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-[#171717] to-[#262626] text-white p-4 rounded-2xl text-center shadow-lg flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-[0.99] transition-transform border border-white/10"
        >
          <div className="bg-[#44FF00]/10 p-2.5 rounded-xl text-[#44FF00] shrink-0">
            <Smartphone size={24} />
          </div>
          <div className="text-left flex-1">
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#44FF00]">
              Dica de Ouro! 📱
            </p>
            <p className="text-[11px] sm:text-xs font-bold text-gray-200 leading-tight mt-0.5">
              Não perca nenhuma <br />
              "Receita Gratuita e Promoções" <br />
              instale o Icone do aplicativo <br />
              no seu celular, é de graça!
            </p>
          </div>
          <ArrowRight size={16} className="text-gray-400 shrink-0" />
        </button>
      </div>

      {/* Modal Didático Compartilhado */}
      <InstallGuideModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};