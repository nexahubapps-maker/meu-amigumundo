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
    <header className="sticky top-0 z-50 bg-white h-[64px] flex items-center px-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div 
          className="h-[44px] cursor-pointer flex items-center"
          onClick={() => navigate("/")}
        >
          <img 
            src="https://ik.imagekit.io/51b3srlsg/amigumundo_amigurumi.png" 
            alt="AmiguMundo" 
            className="h-full w-auto object-contain"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[8px] sm:text-[9px] font-black text-gray-300 uppercase tracking-widest">um produto</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#171717] uppercase">AMIGUMUNDO ARTES</span>
          </div>
          
          <button 
            onClick={scrollToCart}
            className="relative p-2.5 text-[#171717] hover:text-[#44FF00] transition-colors bg-gray-50 rounded-full"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#44FF00] text-[#171717] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};