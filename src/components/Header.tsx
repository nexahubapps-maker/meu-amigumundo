"use client";

import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  cartCount?: number;
}

export const Header = ({ cartCount = 0 }: HeaderProps) => {
  const navigate = useNavigate();

  const scrollToCart = () => {
    const cartElement = document.getElementById('cart-section');
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="sticky top-3 z-50 mx-4 my-2 bg-white h-[64px] flex items-center px-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl border border-gray-100/80">
      <div className="w-full flex items-center justify-between">
        <div 
          className="flex flex-col items-start cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img 
            src="https://ik.imagekit.io/51b3srlsg/logomarca_amigumundo.png" 
            alt="AmiguMundo" 
            className="h-[36px] w-auto object-contain"
          />
          <span className="text-[8px] font-bold text-gray-400 mt-0.5 leading-none">
            Uma Comunidade apaixonada por Amigurumis
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-[#44FF00] text-[#171717] px-2 py-0.5 rounded-md flex flex-col items-end leading-none text-[7px] font-black uppercase shrink-0 border border-black/5">
            <span className="text-[5px] text-[#171717]/60 font-bold">um produto</span>
            <span className="tracking-tight">AMIGUMUNDO ARTES</span>
          </div>
          
          <button 
            onClick={scrollToCart}
            className="relative p-2 text-[#171717] hover:text-[#44FF00] transition-colors bg-gray-50 rounded-full"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#44FF00] text-[#171717] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};