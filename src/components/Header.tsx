"use client";

import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  cartCount?: number;
}

export const Header = ({ cartCount = 0 }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white h-[56px] flex items-center px-4 border-b-2 border-[#171717]">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <h1 
          className="text-[1.5rem] font-black leading-none cursor-pointer text-[#171717] uppercase tracking-tighter"
          onClick={() => navigate("/")}
        >
          AmiguMundo
        </h1>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block bg-[#F8DD12] border-2 border-[#171717] px-3 py-1 rounded-[8px] text-[10px] font-black text-[#171717] uppercase">
            Artes Premium
          </div>
          
          <button 
            onClick={() => navigate("/checkout")}
            className="relative p-2 bg-white border-2 border-[#171717] rounded-[8px] text-[#171717] hover:bg-[#F8DD12] transition-colors"
            style={{ boxShadow: '2px 2px 0px 0px #171717' }}
          >
            <ShoppingCart size={20} strokeWidth={3} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#44FF00] text-[#171717] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#171717]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};