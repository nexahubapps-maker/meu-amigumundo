"use client";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export const captureUTMs = (): UTMParams => {
  const params = new URLSearchParams(window.location.search);
  const utms: UTMParams = {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_term: params.get("utm_term") || undefined,
    utm_content: params.get("utm_content") || undefined,
  };

  if (Object.values(utms).some(Boolean)) {
    localStorage.setItem("amigumundo-utms", JSON.stringify(utms));
  }

  return utms;
};

export const getStoredUTMs = (): UTMParams => {
  const stored = localStorage.getItem("amigumundo-utms");
  return stored ? JSON.parse(stored) : {};
};