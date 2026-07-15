"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Zap, CreditCard, Mail, Phone, Lock } from "lucide-react";
import { SupportButton } from "@/components/SupportButton";
import { playHeartbeatSound } from "@/utils/audio";
import { getRecipes, getInfoprodutos, getPacks } from "@/utils/sheets";
import { calculateCart } from "@/utils/pricing";
import { showSuccess, showError } from "@/utils/toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { id: checkoutProductId } = useParams();
  const [cart, setCart] = useState<any[]>([]);
  const [recipesList, setRecipesList] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  
  const [email, setEmail] = useState(() => localStorage.getItem("amigumundo-email") || "");
  const [whatsapp, setWhatsapp] = useState(() => localStorage.getItem("amigumundo-whatsapp") || "");

  // Card States
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fix scroll bug: Ensure page starts at the absolute top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load cart or direct product
  useEffect(() => {
    const loadCheckoutData = async () => {
      const [recipesData, infoprodutosList, packsList] = await Promise.all([
        getRecipes(),
        getInfoprodutos(),
        getPacks()
      ]);
      setRecipesList(recipesData);

      if (checkoutProductId) {
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

      // Fallback to general cart
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
    localStorage.setItem("amigumundo-whatsapp", whatsapp);
  }, [whatsapp]);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (rawValue.length > 0) {
      formattedValue += `(${rawValue.substring(0, 2)}`;
    }
    if (rawValue.length > 2) {
      formattedValue += `) ${rawValue.substring(2, 7)}`;
    }
    if (rawValue.length > 7) {
      formattedValue += `-${rawValue.substring(7, 11)}`;
    }

    setWhatsapp(formattedValue);
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

  const rawWhatsappDigits = whatsapp.replace(/\D/g, "");
  const isWhatsappValid = rawWhatsappDigits.length === 11;
  const isEmailValid = email.includes("@") && email.includes(".");
  
  const isCardValid = 
    cardNumber.replace(/\s/g, "").length >= 15 &&
    cardName.trim().length > 3 &&
    cardExpiry.length === 5 &&
    cardCvv.length >= 3;

  const isFormValid = isWhatsappValid && isEmailValid && (paymentMethod === "pix" || isCardValid) && !isProcessing;

  // Calculate cart values using the centralized pricing utility to sync discounts
  const calculated = calculateCart(cart, recipesList);
  const total = calculated.total;

  const generateCardToken = async () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    const [expiryMonth, expiryYear] = cardExpiry.split("/");
    const fullYear = expiryYear ? `20${expiryYear}` : "";

    try {
      const response = await fetch(
        `https://api.mercadopago.com/v1/card_tokens?public_key=APP_USR-cb091ede-b395-4bf8-b8f0-555846ae0acc`,
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
        showError(err.message || "Erro ao validar os dados do cartão. Verifique os campos.");
        setIsProcessing(false);
        return;
      }
    }

    // Sanitize WhatsApp to only digits with DDI 55
    const sanitizedWhatsapp = rawWhatsappDigits.startsWith("55") ? rawWhatsappDigits : "55" + rawWhatsappDigits;
    
    // Gather recipe codes
    const codigosReceitas = calculated.items.map(item => item.id).join(",");

    // Simulate a payment ID
    const simulatedId = `pay_${Math.random().toString(36).substring(2, 15)}`;

    const payload = {
      action: "payment.created",
      data: {
        id: simulatedId
      },
      payer: {
        email: email
      },
      metadata: {
        whatsapp: sanitizedWhatsapp,
        codigos_receitas: codigosReceitas,
        payment_method: paymentMethod,
        card_token: cardToken || undefined
      }
    };

    try {
      // Send POST request directly to Google Apps Script Webhook
      await fetch(
        "https://script.google.com/macros/s/AKfycbwPW3Qj7VAmCX6B8BdzMFDd9OBHih26uQo1lHipIm9dRikC1nkcN53WONbqXdTVevvWwg/exec",
        {
          method: "POST",
          mode: "no-cors", // Safe mode for Google Apps Script redirects
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      showSuccess("Pagamento processado com sucesso! Suas receitas foram enviadas para o seu WhatsApp.");
      
      if (!checkoutProductId) {
        localStorage.removeItem("amigumundo-cart");
      }
      localStorage.removeItem("amigumundo-favorites");

      navigate("/");
    } catch (e) {
      console.error("Webhook error:", e);
      showError("Ocorreu um erro ao processar o pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[#F4F7F9] font-sans">
      {/* Container de Scroll com aceleração de GPU isolada */}
      <div 
        className="max-w-2xl mx-auto px-4 pt-3 pb-[140px]" 
        style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
      >
        
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold mb-3 transition-colors text-sm"
        >
          <ChevronLeft size={16} /> Voltar para a loja
        </button>

        {/* Mensagem de Boas-vindas no Topo */}
        <div className="text-center mb-3">
          <h1 className="text-xl font-black text-gray-900 mb-1.5 tracking-tight">QUASE LÁ!</h1>
          
          {/* Elegant Instructions Card with Teal Background and White Text */}
          <div className="bg-[#0E5E6F] text-white border border-white/10 rounded-xl p-3 text-center max-w-md mx-auto shadow-sm">
            <p className="font-semibold text-xs leading-relaxed">
              Para enviarmos suas receitas, preencha <br />
              seu e-mail e WhatsApp.<br />
              Você receberá as receitas em segundos após a confirmação do pagamento.
            </p>
          </div>
        </div>

        {/* Dados Pessoais (Dados para Entrega) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3">
          <div className="flex items-center gap-2 mb-3 text-gray-800">
            <ShieldCheck size={18} className="text-blue-500" />
            <h2 className="font-bold uppercase tracking-tight text-xs">Dados para Entrega</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
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
            <div className="relative">
              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  placeholder="(00) 90000-0000"
                  maxLength={15}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm"
                />
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 block ml-1">Digite o DDD + seu número</span>
            </div>
          </div>
        </div>

        {/* Resumo do Pedido (Posicionado abaixo de Dados para Entrega) */}
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

        {/* Pagamento */}
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

          {/* Vibrant Green Checkout Button */}
          <button 
            onClick={handlePaymentSubmit}
            disabled={!isFormValid}
            className={`w-full py-3.5 rounded-xl font-black text-base shadow-md transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${isFormValid ? 'bg-[#22C55E] hover:bg-[#16a34a] text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
          >
            <Lock size={18} /> {isProcessing ? "Processando..." : "Finalizar Pagamento"}
          </button>
        </div>

        {/* Premium Security Badges Footer */}
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

        {/* Footer */}
        <footer className="text-center pb-4">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">AmiguMundo Artes 2016</p>
        </footer>
      </div>

      {/* Botão de Suporte posicionado fora do container transformado para manter o position: fixed perfeito */}
      <SupportButton />
    </div>
  );
}