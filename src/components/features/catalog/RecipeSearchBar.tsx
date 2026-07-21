"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecipeSearchBarProps {
  placeholder?: string;
}

export const RecipeSearchBar = ({ placeholder = "Buscar receita pelo nome..." }: RecipeSearchBarProps) => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = term.trim();
    if (trimmed) {
      navigate(`/busca/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto px-4 my-3">
      <div className="relative flex items-center">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-4 pr-12 bg-white border-2 border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#44FF00] transition-all shadow-sm focus:shadow-md"
        />
        <button
          type="submit"
          className="absolute right-2 p-2 text-gray-400 hover:text-gray-700 active:scale-95 transition-transform"
          aria-label="Buscar"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};