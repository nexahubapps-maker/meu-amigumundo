"use client";

interface SupportButtonProps {
  className?: string;
}

export const SupportButton = ({ className }: SupportButtonProps) => {
  const handleSupport = () => {
    window.open("https://wa.me/5544999999999", "_blank");
  };

  return (
    <button
      onClick={handleSupport}
      className={`!fixed !bottom-[15px] !right-[15px] !z-[9999] hover:scale-110 transition-transform active:scale-95 flex items-center justify-center focus:outline-none ${className || ''}`}
      aria-label="Suporte WhatsApp"
    >
      <div className="w-[55px] h-[55px] rounded-[14px] overflow-hidden bg-transparent shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center">
        <img 
          src="https://ik.imagekit.io/51b3srlsg/icone_whatsApp_amigumundo.png" 
          alt="Suporte WhatsApp" 
          className="w-full h-full object-cover"
          style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0', display: 'block' }}
        />
      </div>
    </button>
  );
};