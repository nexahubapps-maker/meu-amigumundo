"use client";

import { useEffect, useState } from "react";

interface SupportButtonProps {
  className?: string;
}

export const SupportButton = ({ className }: SupportButtonProps) => {
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    // Detecta se o usuário está na página de checkout
    setIsCheckout(window.location.pathname.includes("/checkout"));
  }, []);

  const handleSupport = () => {
    window.open("https://wa.me/5544999999999", "_blank");
  };

  if (isCheckout) {
    return (
      <button
        onClick={handleSupport}
        className="!fixed !bottom-[15px] !right-[15px] !z-[9999] bg-white border-2 border-green-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform active:scale-95 flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full focus:outline-none"
        aria-label="Suporte WhatsApp"
      >
        <span className="text-[11px] font-black text-gray-800 leading-tight text-left max-w-[180px]">
          Dúvidas ou problemas no pagamento? Nos chame no WhatsApp!
        </span>
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-transparent flex items-center justify-center relative shrink-0">
          <img 
            src="/Gemini_Generated_Image_c43hoxc43hoxc43h (1).png" 
            alt="Suporte WhatsApp" 
            className="w-full h-full object-cover scale-[1.12] origin-center"
            style={{ display: 'block' }}
          />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleSupport}
      className={`!fixed !bottom-[15px] !right-[15px] !z-[9999] !w-auto !max-w-[60px] hover:scale-110 transition-transform active:scale-95 flex items-center justify-center focus:outline-none rounded-[14px] overflow-hidden ${className || ''}`}
      style={{ borderRadius: '14px', overflow: 'hidden' }}
      aria-label="Suporte WhatsApp"
    >
      <div className="w-[55px] h-[55px] rounded-[14px] overflow-hidden bg-transparent flex items-center justify-center relative">
        <img 
          src="/Gemini_Generated_Image_c43hoxc43hoxc43h (1).png" 
          alt="Suporte WhatsApp" 
          className="w-full h-full object-cover scale-[1.12] origin-center"
          style={{ display: 'block' }}
        />
      </div>
    </button>
  );
};