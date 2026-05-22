"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Zap, CreditCard, Smartphone, Mail, Phone, Lock } from "lucide-react";
import { SupportButton } from "@/components/SupportButton";
import { playHeartbeatSound } from "@/utils/audio";
import { getRecipes, getInfoprodutos, getPacks } from "@/utils/sheets";

export default function Checkout() {
  const navigate = useNavigate();
  const { id: checkoutProductId } = useParams();
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  
  const [email, setEmail] = useState(() => localStorage.getItem("amigumundo-email") || "");
  const [whatsapp, setWhatsapp] = useState(() => localStorage.getItem("amigumundo-whatsapp") || "");

  // Fix scroll bug: Ensure page starts at the absolute top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load cart or direct product
  useEffect(() => {
    const loadCheckoutData = async () => {
      if (checkoutProductId) {
        // Fetch from sheets to find the specific product
        const [recipesList, infoprodutosList, packsList] = await Promise.all([
          getRecipes(),
          getInfoprodutos(),
          getPacks()
        ]);

        const foundProduct = 
          recipesList.find(r => r.id === checkoutProductId) ||
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

  const rawWhatsappDigits = whatsapp.replace(/\D/g, "");
  const isWhatsappValid = rawWhatsappDigits.length === 11;
  const isEmailValid = email.includes("@") && email.includes(".");
  const isFormValid = isWhatsappValid && isEmailValid;

  const total = cart.reduce((sum, item) => sum + item.preco, 0);

  const triggerAdminWebhook = async (saleData: any) => {
    try {
      const webhookUrl = "https://api.amigumundo.com/v1/webhooks/sales";
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...saleData,
          timestamp: new Date().toISOString(),
          triggerNotificationSound: "tom-tom"
        })
      });
    } catch (e) {
      console.log("Webhook disparado em segundo plano (simulado):", saleData);
    }
  };

  const handlePaymentSubmit = () => {
    if (!isFormValid) return;

    playHeartbeatSound();

    const saleData = {
      email,
      whatsapp: rawWhatsappDigits,
      items: cart,
      total,
      paymentMethod
    };

    triggerAdminWebhook(saleData);

    alert("Pagamento processado com sucesso! Suas receitas foram enviadas para o seu WhatsApp.");
    if (!checkoutProductId) {
      localStorage.removeItem("amigumundo-cart");
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] pb-20 font-sans">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold mb-6 transition-colors"
        >
          <ChevronLeft size={20} /> Voltar para a loja
        </button>

        {/* Resumo do Pedido no Topo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4 text-gray-800">
            <h2 className="font-bold uppercase tracking-tight text-sm">Resumo do Pedido</h2>
          </div>
          <div className="space-y-3">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{item.nome}</span>
                <span className="font-bold text-gray-800">R$ {item.preco.toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-xl font-black text-blue-600">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Mensagem de Boas-vindas */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">QUASE LÁ!</h1>
          
          {/* Elegant Instructions Card */}
          <div className="bg-[#FDFBF7] border border-gray-200 rounded-xl p-4 text-center max-w-md mx-auto shadow-sm">
            <p className="text-gray-700 font-semibold text-sm">
              Para enviarmos suas receitas, preencha seu e-mail e WhatsApp.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Você receberá as receitas em segundos após a confirmação do pagamento.
            </p>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <ShieldCheck size={20} className="text-blue-500" />
            <h2 className="font-bold uppercase tracking-tight text-sm">Dados para Entrega</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  placeholder="(00) 90000-0000"
                  maxLength={15}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block ml-1">Digite o DDD + seu número</span>
            </div>
          </div>
        </div>

        {/* Pagamento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <CreditCard size={20} className="text-blue-500" />
            <h2 className="font-bold uppercase tracking-tight text-sm">Forma de Pagamento</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => setPaymentMethod("pix")}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === "pix" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
            >
              <Zap size={24} className={paymentMethod === "pix" ? "text-blue-600" : "text-gray-400"} fill={paymentMethod === "pix" ? "currentColor" : "none"} />
              <span className={`text-xs font-bold uppercase ${paymentMethod === "pix" ? "text-blue-700" : "text-gray-500"}`}>Pix</span>
            </button>
            <button 
              onClick={() => setPaymentMethod("card")}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
            >
              <CreditCard size={24} className={paymentMethod === "card" ? "text-blue-600" : "text-gray-400"} />
              <span className={`text-xs font-bold uppercase ${paymentMethod === "card" ? "text-blue-700" : "text-gray-500"}`}>Cartão</span>
            </button>
          </div>

          {paymentMethod === "pix" && (
            <div className="bg-[#e6eedc] border border-[#c8dcb4] rounded-xl p-4 mb-6">
              <p className="text-[#4a613c] text-xs font-bold text-center uppercase tracking-wider">
                Liberação imediata ao pagar no Pix!
              </p>
            </div>
          )}

          {/* Vibrant Green Checkout Button */}
          <button 
            onClick={handlePaymentSubmit}
            disabled={!isFormValid}
            className={`w-full py-5 rounded-xl font-black text-lg shadow-md transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${isFormValid ? 'bg-[#22C55E] hover:bg-[#16a34a] text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
          >
            <Lock size={20} /> Finalizar Pagamento
          </button>
        </div>

        {/* High Contrast Security Badges Footer */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 shadow-sm">
          <div className="flex flex-col items-center gap-1.5 text-center p-2">
            <ShieldCheck size={26} className="text-gray-800" />
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">SSL Seguro</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center p-2">
            <Smartphone size={26} className="text-gray-800" />
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">Mercado Pago</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center p-2">
            <Zap size={26} className="text-gray-800" />
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">Entrega Instantânea</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center p-2">
            <ShieldCheck size={26} className="text-gray-800" />
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">Compra Protegida</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-10">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">AmiguMundo Artes 2016</p>
        </footer>
      </div>

      {/* Botão de Suporte */}
      <SupportButton />
    </div>
  );
}