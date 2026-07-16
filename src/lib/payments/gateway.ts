"use client";

export interface PaymentPayload {
  amount: number;
  email: string;
  whatsapp: string;
  items: any[];
}

export const processPayment = async (payload: PaymentPayload) => {
  console.log("[Payment Gateway] Processando pagamento...", payload);
  return { success: true, transactionId: "tx_" + Math.random().toString(36).substr(2, 9) };
};