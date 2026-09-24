"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Lock, CreditCard, Check, Loader2, Sparkles, LogIn } from "lucide-react";
import { showError } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";
import { getStoredUTMs } from "@/lib/tracking/utmify-service";
import { AuthModal } from "@/components/AuthModal";

const MERCADOPAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || "TEST-f2993981-4aad-4e7a-a767-ad00a2c0634e";
const VALOR_MENSAL = 19.9;

const BENEFICIOS = [
  "Acesso a TODAS as receitas de todas as categorias, sem comprar uma por uma",
  "Ateliê Lucrativo: todos os infoprodutos da Loja de bônus, sem pagar nada a mais",
  "Novidades toda semana direto na sua Biblioteca",
  "Cancele quando quiser, sem fidelidade",
];

export default function PremiumCheckout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [email, setEmail] = useState(user?.email || "");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 11);
    let formatted = value;
    if (value.length > 9) {
      formatted = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9)}`;
    } else if (value.length > 6) {
      formatted = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6)}`;
    } else if (value.length > 3) {
      formatted = `${value.substring(0, 3)}.${value.substring(3)}`;
    }
    setCpf(formatted);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExpiry(formatted);
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCardCvv(value);
  };

  const isFormValid =
    email.includes("@") &&
    nomeCompleto.trim().length > 2 &&
    cpf.replace(/\D/g, "").length === 11 &&
    cardNumber.replace(/\s/g, "").length >= 15 &&
    cardName.trim().length > 2 &&
    cardExpiry.length === 5 &&
    cardCvv.length >= 3;

  const generateCardToken = async () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    const [expiryMonth, expiryYear] = cardExpiry.split("/");
    const fullYear = expiryYear ? `20${expiryYear}` : "";

    const response = await fetch(
      `https://api.mercadopago.com/v1/card_tokens?public_key=${MERCADOPAGO_PUBLIC_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_number: cleanCardNumber,
          expiration_month: parseInt(expiryMonth, 10),
          expiration_year: parseInt(fullYear, 10),
          security_code: cardCvv,
          cardholder: { name: cardName },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Erro ao validar os dados do cartão.");
    }

    const data = await response.json();
    return data.id as string;
  };

  const handleAssinar = async () => {
    if (!isFormValid || isProcessing) return;
    setIsProcessing(true);

    let cardToken = "";
    try {
      cardToken = await generateCardToken();
    } catch (err: any) {
      showError(err.message || "Confira os dados do cartão e tente de novo.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/criar-assinatura-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...getStoredUTMs(),
          cardToken,
          email,
          nome: nomeCompleto,
          cpf: cpf.replace(/\D/g, ""),
          usuarioId: user?.id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "Não foi possível processar a assinatura. Tente novamente.");
        setIsProcessing(false);
        return;
      }

      if (data.status === "authorized") {
        navigate("/premium");
        return;
      }

      // pending / in_process: o cartão precisa de confirmação adicional do banco.
      showError("Seu cartão está em análise pelo banco. Assim que for aprovado, seu acesso é liberado automaticamente.");
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      showError("Erro de conexão. Tente novamente em instantes.");
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#5D0599]/10 flex items-center justify-center">
          <LogIn size={24} className="text-[#5D0599]" />
        </div>
        <h1 className="text-base font-black text-gray-900 uppercase tracking-tight">
          Entre na sua conta pra assinar
        </h1>
        <p className="text-xs text-gray-500 font-bold max-w-xs leading-relaxed">
          Precisamos saber quem é você pra liberar o acesso automaticamente assim que o pagamento for aprovado.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-[#5D0599] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wide active:scale-95 transition-transform"
        >
          Entrar ou criar conta
        </button>
        <button onClick={() => navigate("/premium")} className="text-[11px] text-gray-400 font-bold underline">
          Voltar
        </button>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/premium")} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center active:scale-95 transition-all shrink-0">
            <ChevronLeft size={18} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-gray-500 uppercase tracking-wide">
            <Lock size={12} /> Checkout seguro
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10 items-start">
        {/* Coluna do formulário */}
        <div className="order-2 lg:order-1 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4">Seus dados</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#5D0599] outline-none transition-all text-gray-800 font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nome completo</label>
                <input
                  type="text"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder="Seu nome como está no cartão"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#5D0599] outline-none transition-all text-gray-800 font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#5D0599] outline-none transition-all text-gray-800 font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-2">
              <CreditCard size={16} /> Cartão de crédito
            </h2>
            <p className="text-[10px] text-gray-400 font-bold mb-4">
              A assinatura é recorrente e por isso só aceita cartão de crédito — é o único método que permite a cobrança automática todo mês, sem você precisar pagar manualmente toda vez.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Número do cartão</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#5D0599] outline-none transition-all text-gray-800 font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Nome impresso no cartão</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#5D0599] outline-none transition-all text-gray-800 font-bold text-sm"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Validade</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardExpiry}
                    onChange={handleCardExpiryChange}
                    placeholder="MM/AA"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#5D0599] outline-none transition-all text-gray-800 font-bold text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">CVV</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardCvv}
                    onChange={handleCardCvvChange}
                    placeholder="000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-[#5D0599] outline-none transition-all text-gray-800 font-bold text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAssinar}
            disabled={!isFormValid || isProcessing}
            className="w-full bg-[#5D0599] hover:bg-[#4a047a] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Processando...
              </>
            ) : (
              <>Assinar por R$ {VALOR_MENSAL.toFixed(2).replace(".", ",")}/mês</>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
            <ShieldCheck size={14} /> Pagamento processado com segurança pelo Mercado Pago
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-[#5D0599] to-[#3CB19E] p-5 text-white">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-90 mb-1">
                <Sparkles size={12} /> AmiguMundo Premium
              </div>
              <p className="text-2xl font-black">
                R$ {VALOR_MENSAL.toFixed(2).replace(".", ",")}
                <span className="text-sm font-bold opacity-80">/mês</span>
              </p>
            </div>
            <div className="p-5 space-y-3">
              {BENEFICIOS.map((b) => (
                <div key={b} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#3CB19E]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#3CB19E]" strokeWidth={3} />
                  </div>
                  <p className="text-[11px] text-gray-600 font-bold leading-snug">{b}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-5 py-4 flex items-center justify-between">
              <span className="text-xs font-black text-gray-900 uppercase">Total hoje</span>
              <span className="text-lg font-black text-gray-900">R$ {VALOR_MENSAL.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
