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
    <div className="min-h-screen bg-white pb-12">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white border-2 border-[#171717] px-4 py-2 rounded-[8px] font-black text-[#171717] mb-8 uppercase text-sm"
          style={{ boxShadow: '4px 4px 0px 0px #171717' }}
        >
          <ChevronLeft size={20} strokeWidth={3} /> Voltar
        </button>

        <h1 className="text-[2.5rem] font-black leading-none mb-2 uppercase italic tracking-tighter">QUASE LÁ! 🎉</h1>
        <p className="text-[#171717] font-black mb-8 uppercase text-sm">Para enviarmos suas receitas, precisamos de:</p>

        <div className="space-y-6 mb-10">
          <div>
            <label className="block text-xs font-black mb-2 text-[#171717] uppercase tracking-widest">WhatsApp</label>
            <input
              type="text"
              placeholder="(44) 99999-8888"
              className="w-full px-5 py-4 rounded-[12px] border-4 border-[#171717] focus:bg-[#F8DD12] focus:outline-none transition-colors font-black placeholder:text-[#171717]/30"
              style={{ boxShadow: '4px 4px 0px 0px #171717' }}
            />
          </div>
          <div>
            <label className="block text-xs font-black mb-2 text-[#171717] uppercase tracking-widest">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full px-5 py-4 rounded-[12px] border-4 border-[#171717] focus:bg-[#F8DD12] focus:outline-none transition-colors font-black placeholder:text-[#171717]/30"
              style={{ boxShadow: '4px 4px 0px 0px #171717' }}
            />
          </div>
        </div>

        <div className="neo-card overflow-hidden mb-10">
          <button 
            onClick={() => setShowSummary(!showSummary)}
            className="w-full px-5 py-5 flex items-center justify-between font-black text-[#171717] uppercase italic"
          >
            <span className="flex items-center gap-3">
              {showSummary ? <ChevronUp size={24} strokeWidth={3} /> : <ChevronDown size={24} strokeWidth={3} />}
              Resumo do pedido
            </span>
            <span className="text-[1.2rem]">R$ {total.toFixed(2)}</span>
          </button>
          
          {showSummary && (
            <div className="px-5 pb-5 space-y-3 border-t-4 border-[#171717] pt-5 bg-[#F8DD12]/10">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm font-black uppercase">
                  <span className="text-[#171717]/60">{item.nome}</span>
                  <span>R$ {item.preco.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-4 border-t-2 border-[#171717] flex justify-between items-center font-black">
                <span className="text-lg">TOTAL</span>
                <span className="text-2xl">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-8">
          <button className="flex-[3] neo-btn-buy py-5 text-lg uppercase tracking-widest flex items-center justify-center gap-3">
            <Zap size={24} fill="#171717" strokeWidth={0} /> Pix ⚡
          </button>
          <button className="flex-[2] bg-white border-4 border-[#171717] text-[#171717] py-5 rounded-[12px] font-black flex items-center justify-center gap-3 uppercase text-sm" style={{ boxShadow: '4px 4px 0px 0px #171717' }}>
            <CreditCard size={24} strokeWidth={3} /> Cartão
          </button>
        </div>

        <div className="bg-[#F8DD12] border-4 border-[#171717] text-[#171717] py-3 px-6 rounded-[12px] text-center font-black text-sm mb-10 uppercase italic" style={{ boxShadow: '4px 4px 0px 0px #171717' }}>
          ⚡ Entrega em 5 segundos após pagamento
        </div>

        <button className="w-full neo-btn-buy py-6 rounded-full text-xl uppercase tracking-[0.2em] mb-12">
          PAGAR AGORA • R$ {total.toFixed(2)}
        </button>

        <div className="grid grid-cols-2 gap-6 pb-12">
          <div className="flex items-center gap-3 text-[11px] font-black text-[#171717] uppercase tracking-tighter">
            <ShieldCheck size={18} strokeWidth={3} /> SSL SEGURO
          </div>
          <div className="flex items-center gap-3 text-[11px] font-black text-[#171717] uppercase tracking-tighter">
            <Smartphone size={18} strokeWidth={3} /> MERCADO PAGO
          </div>
          <div className="flex items-center gap-3 text-[11px] font-black text-[#171717] uppercase tracking-tighter">
            <Zap size={18} strokeWidth={3} /> ENTREGA INSTANTÂNEA
          </div>
          <div className="flex items-center gap-3 text-[11px] font-black text-[#171717] uppercase tracking-tighter">
            <ShieldCheck size={18} strokeWidth={3} /> COMPRA PROTEGIDA
          </div>
        </div>
      </div>
    </div>
  );
}