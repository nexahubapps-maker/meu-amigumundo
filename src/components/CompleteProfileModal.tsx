"use client";

import React, { useState } from "react";
import { X, Phone } from "lucide-react";
import { updatePhoneNumber } from "@/utils/profile";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | undefined;
  onSuccess: () => void;
}

export const CompleteProfileModal = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: CompleteProfileModalProps) => {
  const [telefone, setTelefone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (rawValue.length > 0) {
      formattedValue += `(${rawValue.substring(0, 2)}`;
    }
    if (rawValue.length > 2) {
      formattedValue += `) ${rawValue.substring(2, 7)}`;
    }
    if (rawValue.length > 7) {
      formattedValue += `-${rawValue.substring(7, 11)}`;
    }

    setTelefone(formattedValue || e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await updatePhoneNumber(userId, telefone);
      if (error) {
        setErrorMessage(error);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocorreu um erro ao salvar o telefone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-300">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <div className="space-y-5">
          <div className="text-center space-y-1.5 mt-2">
            <div 
              style={textureLaranjaStyle}
              className="w-full py-1.5 px-3 shadow-sm rounded-xl text-center border border-gray-100 mb-2"
            >
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white m-0">
                Falta bem pouquinho!
              </h2>
            </div>
            <p className="text-sm text-gray-700 font-bold leading-relaxed">
              Pra acessar sua área <strong className="text-gray-900">Meu AmiguMundo</strong>, a gente precisa do seu telefone de contato.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
              <p className="text-red-600 font-bold text-xs uppercase leading-tight">
                ❌ {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                Número de WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={telefone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 90000-0000"
                  required
                  className="w-full pl-11 pr-3 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-800 font-bold text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !telefone.trim()}
              className="w-full bg-[#44FF00] text-[#171717] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isSubmitting ? "Salvando..." : "Salvar e continuar →"}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold uppercase tracking-wider transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};