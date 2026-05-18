"use client";

interface SectionTitleProps {
  children: React.ReactNode;
  color: string;
}

export const SectionTitle = ({ children, color }: SectionTitleProps) => (
  <div className="text-center mb-8">
    <h2
      className="text-2xl font-bold"
      style={{ fontFamily: "'Fredoka One', cursive", color }}
    >
      {children}
    </h2>
    <div
      className="mx-auto mt-2 w-16 h-4 rounded"
      style={{ backgroundColor: color }}
    />
  </div>
);