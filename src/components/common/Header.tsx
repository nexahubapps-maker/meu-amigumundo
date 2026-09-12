"use client";

import { useNavigate } from "react-router-dom";

interface HeaderProps {
  cartCount?: number;
}

export const Header = ({ cartCount = 0 }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative mx-4 my-2 lg:mx-auto lg:max-w-6xl bg-white h-[92px] flex items-center px-4 shadow-[0_12px_28px_rgba(0,0,0,0.15),_0_6px_12px_rgba(0,0,0,0.1)] rounded-2xl border-2 border-gray-200">
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
        </div>
      </div>
    </div>
  );
};