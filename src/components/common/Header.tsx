"use client";

import { useState } from "react";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";

interface HeaderProps {
  cartCount?: number;
}

export const Header = ({ cartCount = 0 }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const scrollToCart = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const cartElement = document.getElementById('cart-section');
        if (cartElement) {
          cartElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const cartElement = document.getElementById('cart-section');
      if (cartElement) {
        cartElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative mx-4 my-2 lg:mx-auto lg:max-w-6xl bg-white h-[92px] flex items-center px-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl border border-gray-100/80">
      <div className="w-full flex items-center justify-between">
        <div 
          className="flex flex-col items-start cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img 
            src="https://ik.imagekit.io/51b3srlsg/logomarca_amigumundo_01.png" 
            alt="AmiguMundo" 
            className="h-[60px] w-auto object-contain"
          />
          <span className="text-[11px] font-black text-black -mt-1 leading-none">
            Uma Comunidade apaixonada por Amigurumis
          </span>
        </div>
        
        <div className="flex flex-col items-center justify-center h-full gap-2 shrink-0">
          <div className="bg-[#44FF00] text-[#171717] px-2 py-0.5 rounded-md flex flex-col items-center leading-none text-[7px] font-black uppercase border border-black/5">
            <span className="text-[5px] text-[#171717]/60 font-bold">um produto</span>
            <span className="tracking-tight">AMIGUMUNDO ARTES</span>
          </div>
          
          <div className="flex flex-row gap-2 items-center">
            <button 
              onClick={scrollToCart}
              className="relative p-1.5 text-[#171717] hover:text-[#44FF00] transition-colors bg-gray-50 rounded-full flex items-center justify-center"
              title="Ver Carrinho"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#44FF00] text-[#171717] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button 
                onClick={() => signOut()}
                className="relative p-1.5 text-[#44FF00] hover:text-red-500 transition-colors bg-gray-50 rounded-full flex items-center justify-center"
                title="Sair da Conta"
              >
                <LogOut size={22} />
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="relative p-1.5 text-[#171717] hover:text-[#44FF00] transition-colors bg-gray-50 rounded-full flex items-center justify-center"
                title="Entrar / Cadastrar"
              >
                <User size={22} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};