import { supabase } from "@/lib/supabase";

const VAPID_PUBLIC_KEY = "BO__EiosHOgU5DrpBaS8Ox67qFSd8Vs49D9WW14BlZtwX8Y56ftpNeqQuFIGz_xOOXccDzqaovDC_icLOyBYAVw";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function isPushSupported(): Promise<boolean> {
  return "serviceWorker" in navigator && "PushManager" in window;
}

export async function getPushPermissionState(): Promise<NotificationPermission | "unsupported"> {
  if (!(await isPushSupported())) return "unsupported";
  return Notification.permission;
}

export async function subscribeToPush(usuarioId?: string): Promise<boolean> {
  try {
    if (!(await isPushSupported())) return false;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    const raw: any = subscription.toJSON();

    await supabase.from("push_subscriptions").upsert({
      usuario_id: usuarioId || null,
      endpoint: raw.endpoint,
      p256dh: raw.keys?.p256dh,
      auth: raw.keys?.auth
    }, { onConflict: "endpoint" });

    localStorage.setItem("amigumundo-push-ativado", "true");
    return true;
  } catch (e) {
    console.error("Erro ao inscrever push:", e);
    return false;
  }
}