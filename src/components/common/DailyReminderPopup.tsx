"use client";
import { useEffect } from "react";
import { showNotificationPopup } from "@/utils/toast";
import { getReceitaGratuita } from "@/utils/sheets";

const LAST_SHOWN_KEY = "amigumundo-lembrete-diario";

export const DailyReminderPopup = () => {
  useEffect(() => {
    const run = async () => {
      const now = new Date();
      const todayKey = now.toISOString().slice(0, 10);
      const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
      const hour = now.getHours();

      if (lastShown === todayKey || hour < 9) return;

      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const todayStr = `${day}/${month}/${year}`;

      const gratuitas = await getReceitaGratuita();
      const hoje = gratuitas.find(g => g.data === todayStr && g.ativo);

      showNotificationPopup(
        "Sua Receita Grátis de Hoje!",
        hoje ? `${hoje.nome} está te esperando — não perca o presente diário.` : "Não esqueça de resgatar o presente diário antes que acabe o dia.",
        hoje?.imagem_url || "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png"
      );
      localStorage.setItem(LAST_SHOWN_KEY, todayKey);
    };
    run();
  }, []);

  return null;
};