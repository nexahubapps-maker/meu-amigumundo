export function isPwaInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const isStandaloneDisplay = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = (window.navigator as any).standalone === true;
  const hasManualFlag = localStorage.getItem('amigumundo-installed') === 'true';
  return isStandaloneDisplay || isIosStandalone || hasManualFlag;
}