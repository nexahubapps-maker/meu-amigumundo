"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Zap, CreditCard, Smartphone, Mail, Phone } from "lucide-react";
import { SupportButton } from "@/components/SupportButton";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  
  // Estados para os campos com persistência
  const [email, setEmail] = useState(() => localStorage.getItem("amigumundo-email") || "");
  const [whatsapp, setWhatsapp] = useState(() => localStorage.getItem("amigumundo-whatsapp") || "");

  useEffect(() => {
    const savedCart = localStorage.getItem("amigumundo-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Salva os dados sempre que mudarem
  useEffect(() => {
    localStorage.setItem("amigumundo-email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("amigumundo-whatsapp", whatsapp);
  }, [whatsapp]);

  const total = cart.reduce((sum, item) => sum + item.preco, 0);

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <Smartphone size={20} className="text-blue-500" />
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">QUASE LÁ! 🎉</h1>
          <p className="text-gray-600 font-medium">
            Para enviarmos suas receitas, <span className="text-blue-600 font-bold">PREENCHA EMAIL E WHATSAPP:</span>
          </p>
          <p className="text-sm text-green-600 font-bold mt-1">Você recebe as receitas em segundos!</p>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <ShieldCheck size={20} className="text-blue-500" />
            <h2 className="font-bold uppercase tracking-tight text-sm">Dados para Entrega</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pagamento */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <CreditCard size={20} className="text-blue-500" />
            <h2 className="font-bold uppercase tracking-tight text-sm">Forma de Pagamento</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => setPaymentMethod("pix")}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === "pix" ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}
            >
              <Zap size={24} className={paymentMethod === "pix" ? "text-blue-600" : "text-gray-400"} fill={paymentMethod === "pix" ? "currentColor" : "none"} />
              <span className={`text-xs font-bold uppercase ${paymentMethod === "pix" ? "text-blue-700" : "text-gray-500"}`}>Pix</span>
            </button>
            <button 
              onClick={() => setPaymentMethod("card")}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}
            >
              <CreditCard size={24} className={paymentMethod === "card" ? "text-blue-600" : "text-gray-400"} />
              <span className={`text-xs font-bold uppercase ${paymentMethod === "card" ? "text-blue-700" : "text-gray-500"}`}>Cartão</span>
            </button>
          </div>

          {paymentMethod === "pix" && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
              <p className="text-green-700 text-xs font-bold text-center uppercase tracking-wider">
                ⚡ LIBERAÇÃO IMEDIATA AO PAGAR NO PIX!
              </p>
            </div>
          )}

          <button className="w-full bg-[#00D177] hover:bg-[#00B868] text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-green-200 transition-all active:scale-[0.98] uppercase tracking-widest">
            Finalizar Pagamento
          </button>
        </div>

        {/* Selos de Segurança */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="flex flex-col items-center gap-1 text-center">
            <ShieldCheck size={20} className="text-gray-400" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">SSL Seguro</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Smartphone size={20} className="text-gray-400" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">Mercado Pago</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Zap size={20} className="text-gray-400" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">Entrega Instantânea</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <ShieldCheck size={20} className="text-gray-400" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">Compra Protegida</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-10">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">AmiguMundo Artes 2016</p>
        </footer>
      </div>

      {/* Botão de Suporte */}
      <SupportButton />
    </div>
  );
}