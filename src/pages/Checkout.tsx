"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Zap, CreditCard, Mail, User, FileText, Lock, Loader2, Copy, Check } from "lucide-react";
import { SupportButton } from "@/components/common/SupportButton";
import { playHeartbeatSound } from "@/utils/audio";
import { getRecipesByIds, getInfoprodutos, getPacks } from "@/utils/sheets";
import { calculateCart } from "@/utils/pricing";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";

const MERCADOPAGO_TEST_PUBLIC_KEY = "TEST-f2993981-4aad-4e7a-a767-ad00a2c0634e";

export default function Checkout() {
  const navigate = useNavigate();
  const { id: checkoutProductId } = useParams();
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  
  const [email, setEmail] = useState(() => localStorage.getItem("amigumundo-email") || "");
  const [nomeCompleto, setNomeCompleto] = useState(() => localStorage.getItem("amigumundo-nome") || "");
  const [cpf, setCpf] = useState(() => localStorage.getItem("amigumundo-cpf") || "");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [pixData, setPixData] = useState<{ pedidoId: number; qrCode: string; qrCodeBase64: string } | null>(null);
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const savedPix = localStorage.getItem("amigumundo-pix-pendente");
    if (savedPix) {
      try {
        const parsed = JSON.parse(savedPix);
        if (parsed && parsed.pedidoId && parsed.qrCode) {
          setPixData(parsed);
          setIsWaitingPayment(true);
        }
      } catch (e) {
        console.error("Erro ao ler PIX pendente do localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isWaitingPayment || !pixData) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("pedidos")
        .select("status")
        .eq("id", pixData.pedidoId)
        .single();

      if (data?.status === "approved") {
        clearInterval(interval);
        setIsWaitingPayment(false);
        localStorage.removeItem("amigumundo-pix-pendente");
        if (!checkoutProductId) localStorage.removeItem("amigumundo-cart");
        localStorage.removeItem("amigumundo-favorites");
        navigate(`/obrigado/${pixData.pedidoId}`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isWaitingPayment, pixData, checkoutProductId, navigate]);

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (checkoutProductId) {
        const [recipesData, infoprodutosList, packsList] = await Promise.all([
          getRecipesByIds([checkoutProductId]),
          getInfoprodutos(),
          getPacks()
        ]);

        const foundProduct = 
          recipesData.find(r => r.id === checkoutProductId) ||
          infoprodutosList.find(i => i.id === checkoutProductId) ||
          packsList.find(p => p.id === checkoutProductId);

        if (foundProduct) {
          setCart([{
            id: foundProduct.id,
            nome: foundProduct.nome,
            preco: foundProduct.preco,
            tipo: "recipe"
          }]);
          return;
        }
      }

      const savedCart = localStorage.getItem("amigumundo-cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    };

    loadCheckoutData();
  }, [checkoutProductId]);

  useEffect(() => {
    localStorage.setItem("amigumundo-email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("amigumundo-nome", nomeCompleto);
  }, [nomeCompleto]);

  useEffect(() => {
    localStorage.setItem("amigumundo-cpf", cpf);
  }, [cpf]);

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

  const isNomeValid = nomeCompleto.trim().length > 3;
  const isCpfValid = cpf.replace(/\D/g, "").length === 11;
  const isEmailValid = email.includes("@") && email.includes(".");
  
  const isCardValid = 
    cardNumber.replace(/\s/g, "").length >= 15 &&
    cardName.trim().length > 3 &&
    cardExpiry.length === 5 &&
    cardCvv.length >= 3;

  const isFormValid = isNomeValid && isCpfValid && isEmailValid && (paymentMethod === "pix" || isCardValid) && !isProcessing;

  const calculated = calculateCart(cart);
  const total = calculated.total;

  function detectPaymentMethodId(cardNumber: string): string {
    const digits = cardNumber.replace(/\s/g, "");
    if (/^4/.test(digits)) return "visa";
    if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "master";
    if (/^3[47]/.test(digits)) return "amex";
    if (/^636368|^438935|^504175|^451416|^636297/.test(digits)) return "elo";
    return "visa";
  }

  const generateCardToken = async () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    const [expiryMonth, expiryYear] = cardExpiry.split("/");
    const fullYear = expiryYear ? `20${expiryYear}` : "";

    try {
      const response = await fetch(
        `https://api.mercadopago.com/v1/card_tokens?public_key=${MERCADOPAGO_TEST_PUBLIC_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            card_number: cleanCardNumber,
            expiration_month: parseInt(expiryMonth, 10),
            expiration_year: parseInt(fullYear, 10),
            security_code: cardCvv,
            cardholder: {
              name: cardName,
            },
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Erro ao gerar token do cartão");
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Failed to generate card token:", error);
      throw error;
    }
  };

  const handlePaymentSubmit = async () => {
    if (!isFormValid) return;

    setIsProcessing(true);
    playHeartbeatSound();

    let cardToken = "";
    if (paymentMethod === "card") {
      try {
        cardToken = await generateCardToken();
      } catch (err: any) {
        showError(err.message || "Erro ao validar os dados do cartão.");
        setIsProcessing(false);
        return;
      }
    }

    const itemsPayload = calculated.items.map((item) => ({
      id: item.id,
      nome: item.nome,
      preco: item.precoFinal,
      tipo: item.tipo === "recipe" ? "receita" : item.tipo === "upsell" ? "infoproduto" : "pack",
      imagem_url: item.imagem || "",
    }));

    const paymentMethodId = paymentMethod === "card" ? detectPaymentMethodId(cardNumber) : undefined;

    try {
      const response = await fetch("/.netlify/functions/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          paymentMethodId,
          cardToken: paymentMethod === "card" ? cardToken : undefined,
          amount: total,
          email,
          nome: nomeCompleto,
          cpf: cpf.replace(/\D/g, ""),
          items: itemsPayload,
          usuarioId: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "Não foi possível processar o pagamento. Tente novamente.");
        setIsProcessing(false);
        return;
      }

      if (paymentMethod === "card") {
        if (!checkoutProductId) localStorage.removeItem("amigumundo-cart");
        localStorage.removeItem("amigumundo-favorites");
        navigate(`/obrigado/${data.pedidoId}`);
        return;
      }

      setPixData({ pedidoId: data.pedidoId, qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64 });
      setIsWaitingPayment(true);
      localStorage.setItem("amigumundo-pix-pendente", JSON.stringify({ 
        pedidoId: data.pedidoId, qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64 
      }));
    } catch (e) {
      console.error("Payment submission error:", e);
      showError("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[#F4F7F9] font-sans">
      <div 
        className="max-w-2xl mx-auto px-4 pt-3 pb-[140px]" 
        style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
      >
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold mb-3 transition-colors text-sm"
        >
          <ChevronLeft size={16} /> Voltar para a loja
        </button>

        <div className="text-center mb-3">
          <h1 className="text-xl font-black text-gray-900 mb-1.5 tracking-tight">QUASE LÁ!</h1>
          <div className="bg-[#0E5E6F] text-white border border-white/10 rounded-xl p-3 text-center max-w-md mx-auto shadow-sm">
            <p className="font-semibold text-xs leading-relaxed">
              Preencha seus dados para finalizar a compra com segurança.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3">
          <div className="flex items-center gap-2 mb-3 text-gray-800">
            <ShieldCheck size={18} className="text-blue-500" />
            <h2 className="font-bold uppercase tracking-tight text-xs">Dados para Entrega</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder="Seu Nome Completo"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">CPF</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3">
          <div className="flex items-center mb-2 text-gray-800">
            <h2 className="font-bold uppercase tracking-tight text-xs">Resumo do Pedido</h2>
          </div>
          <div className="space-y-2">
            {calculated.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-gray-600">
                  {item.nome} {item.isBonus && <span className="text-green-600 font-bold">(BRINDE)</span>}
                </span>
                <span className="font-bold text-gray-800">
                  {item.precoFinal === 0 ? "Grátis" : `R$ ${item.precoFinal.toFixed(2)}`}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
              <span className="font-bold text-xs text-gray-800">Total</span>
              <span className="text-lg font-black text-blue-600">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {pixData && isWaitingPayment ? (
          <div className="bg-white rounded-xl shadow-sm border-2 border-blue-500 p-5 mb-4 text-center space-y-4 animate-in fade-in">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <h3 className="font-black text-sm text-blue-900 uppercase tracking-tight">
                Pagamento Via Pix Gerado!
              </h3>
              <p className="text-xs text-blue-700 font-medium mt-0.5">
                Escaneie o código abaixo com o aplicativo do seu banco ou copie a chave Pix.
              </p>
            </div>

            {pixData.qrCodeBase64 && (
              <div className="flex justify-center my-2">
                <img 
                  src={`data:image/png;base64,${pixData.qrCodeBase64}`} 
                  alt="QR Code Pix"
                  className="w-48 h-48 rounded-xl border border-gray-200 shadow-sm"
                />
              </div>
            )}

            {pixData.qrCode && (
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-bold text-gray-500 uppercase">
                  Código Copia e Cola
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixData.qrCode}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-700 select-all truncate outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixData.qrCode);
                      setCopiedPix(true);
                      showSuccess("Código Pix copiado com sucesso!");
                      setTimeout(() => setCopiedPix(false), 3000);
                    }}
                    className="bg-[#22C55E] hover:bg-[#16a34a] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
                  >
                    {copiedPix ? <Check size={14} /> : <Copy size={14} />}
                    {copiedPix ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Aguardando confirmação do pagamento...
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-md">
                Depois de pagar, não feche esta aba — a confirmação aparece aqui sozinha em alguns segundos.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3 text-gray-800">
              <CreditCard size={18} className="text-blue-500" />
              <h2 className="font-bold uppercase tracking-tight text-xs">Forma de Pagamento</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button 
                onClick={() => setPaymentMethod("pix")}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all ${paymentMethod === "pix" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
              >
                <Zap size={20} className={paymentMethod === "pix" ? "text-blue-600" : "text-gray-400"} fill={paymentMethod === "pix" ? "currentColor" : "none"} />
                <span className={`text-[11px] font-bold uppercase ${paymentMethod === "pix" ? "text-blue-700" : "text-gray-500"}`}>Pix</span>
              </button>
              <button 
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all ${paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
              >
                <CreditCard size={20} className={paymentMethod === "card" ? "text-blue-600" : "text-gray-400"} />
                <span className={`text-[11px] font-bold uppercase ${paymentMethod === "card" ? "text-blue-700" : "text-gray-500"}`}>Cartão</span>
              </button>
            </div>

            {paymentMethod === "pix" && (
              <div className="bg-[#e6eedc] border border-[#c8dcb4] rounded-xl p-3 mb-3">
                <p className="text-[#4a613c] text-[10px] font-bold text-center uppercase tracking-wider">
                  Liberação imediata ao pagar no Pix!
                </p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3 mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Dados do Cartão de Crédito
                </p>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">Nome Impresso no Cartão</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                    className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm uppercase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">Validade (MM/AA)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">Código (CVV)</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={handleCardCvvChange}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={handlePaymentSubmit}
              disabled={!isFormValid}
              className={`w-full py-3.5 rounded-xl font-black text-base shadow-md transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${isFormValid ? 'bg-[#22C55E] hover:bg-[#16a34a] text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              <Lock size={18} /> {isProcessing ? "Processando..." : "Finalizar Pagamento"}
            </button>
          </div>
        )}

        <div className="w-full overflow-visible mb-6">
          <div className="relative grid grid-cols-2 gap-3 w-full bg-[#0f172a] border border-[#22c55e] rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col items-center gap-1.5 text-center p-2.5 bg-[#1e293b] rounded-xl border border-white/10">
              <Lock size={24} className="text-[#22c55e]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">SSL SEGURO</span>
                <span className="text-[8px] text-gray-400 font-medium mt-0.5">Seus dados protegidos</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center p-2.5 bg-[#1e293b] rounded-xl border border-white/10">
              <ShieldCheck size={24} className="text-[#22c55e]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">MERCADO PAGO</span>
                <span className="text-[8px] text-gray-400 font-medium mt-0.5">Pagamento certificado</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center p-2.5 bg-[#1e293b] rounded-xl border border-white/10">
              <Zap size={24} className="text-[#22c55e]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">ENTREGA INSTANTÂNEA</span>
                <span className="text-[8px] text-gray-400 font-medium mt-0.5">Receitas em segundos</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center p-2.5 bg-[#1e293b] rounded-xl border border-white/10">
              <ShieldCheck size={24} className="text-[#f59e0b]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">COMPRE PROTEGIDA</span>
                <span className="text-[8px] text-gray-400 font-medium mt-0.5">Garantia de entrega</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center pb-4">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">AmiguMundo Artes 2016</p>
        </footer>
      </div>

      <SupportButton />
    </div>
  );
}