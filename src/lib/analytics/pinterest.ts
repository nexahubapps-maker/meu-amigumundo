"use client";

export const initPinterestTag = (tagId: string) => {
  console.log(`[Pinterest Tag] Inicializada com ID: ${tagId}`);
};

export const trackPinterestEvent = (eventName: string, data?: any) => {
  console.log(`[Pinterest Event] Rastreando: ${eventName}`, data);
};