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
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] py-4 sm:py-3 px-4 sm:px-6"
      style={{
        borderBottom: "4px solid",
        borderImage: "linear-gradient(90deg, #FF3D9A, #FF6B35, #F5A623, #7BC843, #2EC4B6, #4A90D9, #9B59B6) 1"
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <h1 
            className="text-[2.2rem] sm:text-[2.8rem] font-bold leading-tight" 
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            {logoLetters.map((letter, i) => (
              <span 
                key={i} 
                style={{ 
                  color: logoColors[letter] || "#FF3D9A", 
                  textShadow: "2px 3px 0px rgba(0,0,0,0.12)" 
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>
        <div className="bg-[#FFF0E0] border border-[#FF6B35] px-5 py-2 rounded-full text-sm font-bold text-[#FF6B35] shadow-sm">
          ✨ Um produto AmiguMundo Artes
        </div>
      </div>
    </header>
  );
};