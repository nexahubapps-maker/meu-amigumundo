"use client";

import React from "react";
import { X } from "lucide-react";

interface LightboxModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const LightboxModal = ({ imageUrl, onClose }: LightboxModalProps) => {
  return (
    <div 
      className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <img 
        src={imageUrl} 
        alt="Zoom" 
        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
  );
};