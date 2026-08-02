"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Phone, User as UserIcon, Camera } from "lucide-react";
import { updateProfile, uploadFotoPerfil } from "@/utils/profile";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | undefined;
  onSuccess: () => void;
  nomeAtual?: string | null;
  fotoAtual?: string | null;
  telefoneAtual?: string | null;
  emailAtual?: string | null;
}

export const CompleteProfileModal = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
  nomeAtual,
  fotoAtual,
  telefoneAtual,
  emailAtual,
}: CompleteProfileModalProps) => {
  const [nome, setNome] = useState(nomeAtual || "");
  const [telefone, setTelefone] = useState(telefoneAtual || "");
  const [fotoPreview, setFotoPreview] = useState<string | null>(fotoAtual || null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNome(nomeAtual || "");
      setTelefone(telefoneAtual || "");
      setFotoPreview(fotoAtual || null);
      setFotoFile(null);
      setErrorMessage(null);
    }
  }, [isOpen, nomeAtual, fotoAtual, telefoneAtual]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const redimensionarImagem = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const tamanho = 400;
        canvas.width = tamanho;
        canvas.height = tamanho;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Erro ao processar imagem"));
        const escala = Math.max(tamanho / img.width, tamanho / img.height);
        const w = img.width * escala;
        const h = img.height * escala;
        ctx.drawImage(img, (tamanho - w) / 2, (tamanho - h) / 2, w, h);
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Erro ao gerar imagem")), "image/jpeg", 0.85);
      };
      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let fotoUrl: string | undefined = undefined;
      if (fotoFile) {
        const blob = await redimensionarImagem(fotoFile);
        const url = await uploadFotoPerfil(userId, blob, fotoAtual);
        if (url) fotoUrl = url;
      }

      const { error } = await updateProfile(userId, {
        telefone,
        nome,
        ...(fotoUrl ? { foto_url: fotoUrl } : {}),
      });

      if (error) {
        setErrorMessage(error);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocorreu um erro ao salvar o perfil.");
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
      <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <div className="space-y-4">
          <div className="text-center space-y-1.5 mt-2">
            <div 
              style={textureLaranjaStyle}
              className="w-full py-1.5 px-3 shadow-sm rounded-xl text-center border border-gray-100 mb-2"
            >
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white m-0">
                Falta bem pouquinho!
              </h2>
            </div>
            <p className="text-xs text-gray-700 font-bold leading-relaxed">
              Complete seu perfil pra acessar sua área <strong className="text-gray-900">Meu AmiguMundo</strong>.
            </p>
            {emailAtual && (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Conectada como: {emailAtual}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
              <p className="text-red-600 font-bold text-xs uppercase leading-tight">
                ❌ {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#44FF00] cursor-pointer flex items-center justify-center group transition-colors shrink-0 shadow-sm"
                title="Toque para escolher foto"
              >
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Foto de Perfil" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="text-gray-400" size={32} />
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Camera size={20} />
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Toque para alterar a foto</span>
            </div>

            {/* Campo Nome */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                Como quer ser chamada?
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  required
                  className="w-full pl-11 pr-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-800 font-bold text-sm"
                />
              </div>
            </div>

            {/* Campo Telefone */}
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
                  className="w-full pl-11 pr-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-800 font-bold text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !telefone.trim() || !nome.trim()}
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