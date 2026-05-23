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
      className={`!fixed !bottom-[15px] !right-[15px] !z-[9999] !w-auto !max-w-[60px] hover:scale-110 transition-transform active:scale-95 flex items-center justify-center focus:outline-none rounded-[14px] overflow-hidden ${className || ''}`}
      style={{ borderRadius: '14px', overflow: 'hidden' }}
      aria-label="Suporte WhatsApp"
    >
      <div className="w-[55px] h-[55px] rounded-[14px] overflow-hidden bg-transparent flex items-center justify-center">
        <img 
          src="https://ik.imagekit.io/51b3srlsg/icone_whatsApp_amigumundo.png" 
          alt="Suporte WhatsApp" 
          className="w-full h-full object-cover !bg-transparent !border-none !p-0 !shadow-none"
          style={{ background: 'transparent', backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: '0', display: 'block' }}
        />
      </div>
    </button>
  );
};