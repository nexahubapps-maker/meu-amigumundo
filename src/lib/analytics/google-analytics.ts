"use client";

export const initGoogleAnalytics = (measurementId: string) => {
  console.log(`[Google Analytics] Inicializado com ID: ${measurementId}`);
};

export const trackGAEvent = (eventName: string, params?: any) => {
  console.log(`[GA Event] Rastreando: ${eventName}`, params);
};