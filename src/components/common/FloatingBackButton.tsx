"use client";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const FloatingBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Voltar"
      className="fixed bottom-28 right-4 z-[9998] bg-[#171717]/90 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-transform"
    >
      <ArrowLeft size={20} />
    </button>
  );
};