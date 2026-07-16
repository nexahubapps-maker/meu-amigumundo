"use client";

export const initMetaPixel = (pixelId: string) => {
  console.log(`[Meta Pixel] Inicializado com ID: ${pixelId}`);
};

export const trackPixelEvent = (eventName: string, data?: any) => {
  console.log(`[Meta Pixel Event] Rastreando: ${eventName}`, data);
};