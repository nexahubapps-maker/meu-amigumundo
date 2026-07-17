"use client";

import React, { useState } from "react";
import { Database } from "lucide-react";
import { AdminSyncModal } from "./AdminSyncModal";

export const AdminSyncButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[15px] left-[15px] z-[9999] bg-white border-2 border-blue-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform active:scale-95 flex items-center justify-center w-[55px] h-[55px] rounded-[14px] text-blue-600 focus:outline-none"
        aria-label="Sincronizar Supabase"
        title="Sincronizar Planilha com Supabase"
      >
        <Database size={24} />
      </button>

      <AdminSyncModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};