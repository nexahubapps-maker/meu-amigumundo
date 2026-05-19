"use client";

export const Header = () => {
  const logoLetters = "AmiguMundo".split("");
  const logoColors: Record<string, string> = {
    A: "#FF3D9A", m: "#9B59B6", i: "#7BC843", g: "#FF6B35", u: "#F5A623",
    M: "#4A90D9", n: "#2EC4B6", d: "#FF3D9A", o: "#FF6B35",
  };

  return (
    <header className="sticky top-0 z-50 bg-white h-[56px] flex items-center px-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <h1 className="text-[1.4rem] font-extrabold leading-none flex gap-[1px]">
          {logoLetters.map((letter, i) => (
            <span key={i} style={{ color: logoColors[letter] || "#FF3D9A" }}>{letter}</span>
          ))}
        </h1>
        <div className="bg-[#FFF0E0] border border-[#FF6B35] px-3 py-1 rounded-full text-[10px] font-bold text-[#FF6B35]">
          ✨ AmiguMundo Artes
        </div>
      </div>
    </header>
  );
};