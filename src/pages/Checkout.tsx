"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp, ShieldCheck, Zap, CreditCard, Smartphone } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("amigumundo-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.preco, 0);

  return (
    <div className="min-h-screen bg-[#FFF8F2] pb-12">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-[#E8472A] font-bold mb-6"
        >
          <ChevronLeft size={20} /> Voltar
        </button>

        <h1 className="text-[1.8rem] font-extrabold leading-tight mb-2">Quase lá! 🎉</h1>
        <p className="text-gray-600 font-medium mb-8">Para enviarmos suas receitas, precisamos de:</p>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold mb-1.5 text-gray-700">WhatsApp</label>
            <input
              type="text"
              placeholder="(44) 99999-8888"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8472A] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5 text-gray-700">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8472A] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden mb-8">
          <button 
            onClick={() => setShowSummary(!showSummary)}
            className="w-full px-4 py-4 flex items-center justify-between font-bold text-gray-700"
          >
            <span className="flex items-center gap-2">
              {showSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              Resumo do pedido
            </span>
            <span className="text-[#4CAF50]">R$ {total.toFixed(2)}</span>
          </button>
          
          {showSummary && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-50 pt-4">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.nome}</span>
                  <span className="font-bold">R$ {item.preco.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center font-extrabold">
                <span>Total</span>
                <span className="text-[#4CAF50] text-lg">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          <button className="flex-[3] bg-[#E8472A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#E8472A]/20">
            <Zap size={20} fill="white" /> Pix ⚡
          </button>
          <button className="flex-[2] bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            <CreditCard size={20} /> Cartão
          </button>
        </div>

        <div className="bg-[#F5C842] text-gray-900 py-2 px-4 rounded-full text-center font-bold text-sm mb-8">
          ⚡ Entrega em 5 segundos após pagamento
        </div>

        <div className="bg-[#1a1a2e] text-white py-4 px-6 rounded-2xl text-center text-sm font-medium mb-8">
          📱 Suas receitas chegam no seu WhatsApp em segundos após o pagamento
        </div>

        <button className="w-full bg-[#4CAF50] text-white py-5 rounded-full font-extrabold text-lg shadow-lg shadow-[#4CAF50]/20 transition-transform active:scale-95 mb-12">
          Pagar com Pix • R$ {total.toFixed(2)}
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <ShieldCheck size={14} /> SSL Seguro
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <Smartphone size={14} /> Mercado Pago
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <Zap size={14} /> Entrega Instantânea
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <ShieldCheck size={14} /> Compra Protegida
          </div>
        </div>
      </div>
    </div>
  );
}