"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbsProps {
  categoria?: string;
  produtoNome?: string;
}

export const Breadcrumbs = ({ categoria, produtoNome }: BreadcrumbsProps) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 overflow-x-auto whitespace-nowrap py-1">
      <button 
        onClick={() => navigate("/")}
        className="hover:text-gray-700 flex items-center gap-1 transition-colors"
      >
        <Home size={12} /> Início
      </button>
      
      {categoria && (
        <>
          <ChevronRight size={10} className="text-gray-300 shrink-0" />
          <button 
            onClick={() => navigate(`/categoria/${encodeURIComponent(categoria.toLowerCase())}`)}
            className="hover:text-gray-700 transition-colors"
          >
            {categoria}
          </button>
        </>
      )}

      {produtoNome && (
        <>
          <ChevronRight size={10} className="text-gray-300 shrink-0" />
          <span className="text-gray-600 truncate max-w-[150px] sm:max-w-[250px]">
            {produtoNome}
          </span>
        </>
      )}
    </nav>
  );
};