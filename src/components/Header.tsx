"use client";

import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  cartCount?: number;
}

export const Header = ({ cartCount = 0 }: HeaderProps) => {
  const navigate = useNavigate();
  const logoLetters = "AmiguMundo".split("");
  const logoColors: Record<string, string> = {
    A: "#E8472A", m: "#F5C842", i: "#E8689A", g: "#4CAF50", u: "#5B9BD5",
    M: "#F0A0C0", n: "#E8472A", d: "#F5C842", o: "#E8689A",
  };

  return (
    <header className="sticky top-0 z-50 bg-white h-[48px] flex items-center px-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <h1 
          className="text-[1.3rem] font-extrabold leading-none flex gap-[1px] cursor-pointer"
          onClick={() => navigate("/")}
        >
          {logoLetters.map((letter, i) => (
            <span key={i} style={{ color: logoColors[letter] || "#E8472A" }}>{letter}</span>
          ))}
        </h1>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block bg-[#FFF0E0] border border-[#E8472A] px-2 py-0.5 rounded-full text-[9px] font-bold text-[#E8472A]">
            ✨ AmiguMundo Artes
          </div>
          
          <button 
            onClick={() => navigate("/checkout")}
            className="relative p-1.5 text-gray-700 hover:text-[#E8472A] transition-colors"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#E8472A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};