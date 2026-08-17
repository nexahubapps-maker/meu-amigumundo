import { toast } from "sonner";
import React from "react";
import { ChevronRight } from "lucide-react";

export const showSuccess = (message: string) => {
  toast.custom((t) => React.createElement(
    "div",
    {
      className: "bg-white border border-gray-100 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 max-w-sm w-full mx-auto pointer-events-auto animate-in slide-in-from-top duration-300",
      onClick: () => toast.dismiss(t)
    },
    React.createElement(
      "div",
      { className: "w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0 font-bold text-sm" },
      "✓"
    ),
    React.createElement(
      "div",
      { className: "flex-1 min-w-0" },
      React.createElement("p", { className: "text-xs font-black text-gray-900 uppercase tracking-tight" }, "Sucesso!"),
      React.createElement("p", { className: "text-[11px] text-gray-500 font-medium leading-tight mt-0.5" }, message)
    )
  ), { duration: 3000 });
};

export const showError = (message: string) => {
  toast.custom((t) => React.createElement(
    "div",
    {
      className: "bg-white border border-gray-100 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 max-w-sm w-full mx-auto pointer-events-auto animate-in slide-in-from-top duration-300",
      onClick: () => toast.dismiss(t)
    },
    React.createElement(
      "div",
      { className: "w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0 font-bold text-sm" },
      "✕"
    ),
    React.createElement(
      "div",
      { className: "flex-1 min-w-0" },
      React.createElement("p", { className: "text-xs font-black text-gray-900 uppercase tracking-tight" }, "Erro!"),
      React.createElement("p", { className: "text-[11px] text-gray-500 font-medium leading-tight mt-0.5" }, message)
    )
  ), { duration: 3000 });
};

export const showInfo = (message: string) => {
  toast.custom((t) => React.createElement(
    "div",
    {
      className: "bg-white<dyad-write path="src/utils/toast.ts" description="Adiciona botão visual de call-to-action (Ver mais) em showNotificationPopup quando há link">
import { toast } from "sonner";
import React from "react";
import { ChevronRight } from "lucide-react";

export const showSuccess = (message: string) => {
  toast.custom((t) => React.createElement(
    "div",
    {
      className: "bg-white border border-gray-100 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 max-w-sm w-full mx-auto pointer-events-auto animate-in slide-in-from-top duration-300",
      onClick: () => toast.dismiss(t)
    },
    React.createElement(
      "div",
      { className: "w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0 font-bold text-sm" },
      "✓"
    ),
    React.createElement(
      "div",
      { className: "flex-1 min-w-0" },
      React.createElement("p", { className: "text-xs font-black text-gray-900 uppercase tracking-tight" }, "Sucesso!"),
      React.createElement("p", { className: "text-[11px] text-gray-500 font-medium leading-tight mt-0.5" }, message)
    )
  ), { duration: 3000 });
};

export const showError = (message: string) => {
  toast.custom((t) => React.createElement(
    "div",
    {
      className: "bg-white border border-gray-100 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 max-w-sm w-full mx-auto pointer-events-auto animate-in slide-in-from-top duration-300",
      onClick: () => toast.dismiss(t)
    },
    React.createElement(
      "div",
      { className: "w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0 font-bold text-sm" },
      "✕"
    ),
    React.createElement(
      "div",
      { className: "flex-1 min-w-0" },
      React.createElement("p", { className: "text-xs font-black text-gray-900 uppercase tracking-tight" }, "Erro!"),
      React.createElement("p", { className: "text-[11px] text-gray-500 font-medium leading-tight mt-0.5" }, message)
    )
  ), { duration: 3000 });
};

export const showInfo = (message: string) => {
  toast.custom((t) => React.createElement(
    "div",
    {
      className: "bg-white border border-gray-100 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 max-w-sm w-full mx-auto pointer-events-auto animate-in slide-in-from-top duration-300",
      onClick: () => toast.dismiss(t)
    },
    React.createElement(
      "div",
      { className: "w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 font-bold text-sm" },
      "ℹ"
    ),
    React.createElement(
      "div",
      { className: "flex-1 min-w-0" },
      React.createElement("p", { className: "text-xs font-black text-gray-900 uppercase tracking-tight" }, "Aviso"),
      React.createElement("p", { className: "text-[11px] text-gray-500 font-medium leading-tight mt-0.5" }, message)
    )
  ), { duration: 5000 });
};

export const showCartAdd = (message: string) => {
  toast.custom((t) => React.createElement(
    "div",
    {
      className: "bg-white border-2 border-[#44FF00] rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-3 max-w-sm w-full mx-auto pointer-events-auto animate-in slide-in-from-top duration-300",
      onClick: () => toast.dismiss(t)
    },
    React.createElement(
      "div",
      { className: "w-8 h-8 rounded-full bg-[#44FF00]/10 flex items-center justify-center text-[#171717] shrink-0 text-sm" },
      "🛍️"
    ),
    React.createElement(
      "div",
      { className: "flex-1 min-w-0" },
      React.createElement("p", { className: "text-xs font-black text-gray-900 uppercase tracking-tight" }, "Adicionado!"),
      React.createElement("p", { className: "text-[11px] text-gray-500 font-medium leading-tight mt-0.5" }, message)
    )
  ), { duration: 3000 });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const showNotificationPopup = (titulo: string, mensagem: string, imagemUrl?: string, link?: string) => {
  toast.custom((t) => React.createElement(
    "div",
    {
      className: "bg-[#5D0599] border border-[#5D0599] rounded-3xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)] flex items-start gap-3.5 max-w-md w-full mx-auto pointer-events-auto animate-in slide-in-from-top duration-300 overflow-hidden",
      onClick: () => {
        toast.dismiss(t);
        if (link) window.location.href = link;
      }
    },
    imagemUrl ? React.createElement("img", {
      src: imagemUrl,
      alt: "",
      className: "w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-sm"
    }) : null,
    React.createElement(
      "div",
      { className: "flex-1 min-w-0 py-0.5" },
      React.createElement("p", { className: "text-base font-black text-white uppercase tracking-tight leading-tight" }, "🔔 " + titulo),
      React.createElement("p", { className: "text-sm text-white/90 font-bold leading-snug mt-1.5" }, mensagem),
      link ? React.createElement(
        "span",
        { className: "inline-flex items-center gap-1 bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full mt-2" },
        "Ver mais",
        React.createElement(ChevronRight, { size: 14 })
      ) : null
    )
  ), { duration: 10000 });
};