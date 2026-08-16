const KEY = "amigumundo-primeiro-acesso";

export function getPrimeiroAcesso(): string {
  let valor = localStorage.getItem(KEY);
  if (!valor) {
    valor = new Date().toISOString();
    localStorage.setItem(KEY, valor);
  }
  return valor;
}