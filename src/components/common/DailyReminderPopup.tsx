"use client";
import { useEffect } from "react";
import { showNotificationPopup } from "@/utils/toast";

const LAST_SHOWN_KEY = "amigumundo-lembrete-diario";

export const DailyReminderPopup = () => {
  useEffect(() => {
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
    const hour = now.getHours();

    if (lastShown !== todayKey && hour >= 9) {
      showNotificationPopup(
        "Sua Receita Grátis de Hoje!",
        "Não esqueça de resgatar o presente diário antes que acabe o dia.",
        "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png"
      );
      localStorage.setItem(LAST_SHOWN_KEY, todayKey);
    }
  }, []);

  return null;
};