"use client";

export const SupportButton = () => {
  const handleSupport = () => {
    window.open("https://wa.me/5544999999999", "_blank"); // Substitua pelo seu número real
  };

  return (
    <button
      onClick={handleSupport}
      className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform active:scale-95 flex items-center justify-center focus:outline-none drop-shadow-xl"
      aria-label="Suporte WhatsApp"
    >
      <img 
        src="https://ik.imagekit.io/51b3srlsg/icone_whatsApp_amigumundo.png" 
        alt="Suporte WhatsApp" 
        className="h-[56px] w-auto object-contain"
      />
    </button>
  );
};