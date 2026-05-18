"use client";

import { useState, useEffect } from "react";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoLetters = "AmiguMundo".split("");
  const logoColors: Record<string, string> = {
    A: "#FF3D9A",
    m: "#9B59B6",
    i: "#7BC843",
    g: "#FF6B35",
    u: "#F5A623",
    M: "#4A90D9",
    n: "#2EC4B6",
    d: "#FF3D9A",
    o: "#FF6B35",
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white shadow-sm transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {logoLetters.map((letter, i) => (
              <span key={i} style={{ color: logoColors[letter] || "#FF3D9A" }}>
                {letter}
              </span>
            ))}
          </h1>
        </div>
        <div className="bg-[#FFF0E0] border border-[#FF6B35] px-4 py-1.5 rounded-full text-sm font-semibold">
          ✨ Um produto AmiguMundo Artes
        </div>
      </div>
    </header>
  );
};