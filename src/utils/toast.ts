import { toast } from "sonner";
import React from "react";

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