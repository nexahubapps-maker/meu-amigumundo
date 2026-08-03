const KEY = "amigumundo-notificacoes-lidas";

export function getReadNotificationIds(): string[] {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function markNotificationsAsRead(ids: string[]) {
  const current = getReadNotificationIds();
  const updated = Array.from(new Set([...current, ...ids]));
  localStorage.setItem(KEY, JSON.stringify(updated));
}