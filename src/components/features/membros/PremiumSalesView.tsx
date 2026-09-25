"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Check, ChevronDown, Sparkles, BookOpen, Smartphone, Printer,
  History, Bell, Calculator, ListChecks, Ruler, Palette, Instagram,
  MessageCircle, Search as SearchIcon
} from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { getRecipes, getCategories, type SheetRecipe, type SheetCategoria } from "@/utils/sheets";

interface PremiumSalesViewProps {
  onBack: () => void;
}

/* ---------- animação de entrada ao rolar a página ---------- */
const Reveal = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
};

const FERRAMENTAS_REAIS = [
  { nome: "Calculadora de Preço", desc: "Descubra o preço justo do seu amigurumi em segundos, considerando material, tempo e lucro.", icone: Calculator },
  { nome: "Contador de Carreiras", desc: "Nunca mais perca a conta no meio da peça — o contador guarda seu progresso pra você.", icone: ListChecks },
  { nome: "Conversor de Agulha", desc: "Troque de agulha sem medo: converta medidas de qualquer receita na hora.", icone: Ruler },
  { nome: "Combinador de Cores", desc: "Monte combinações de cor bonitas pro seu amigurumi antes de começar a crochetar.", icone: Palette },
];

const CAPAS_INFOPRODUTOS: { slug: string; nome: string; capa: string; icone: any; cor: string }[] = [
  { slug: "instagram-profissional", nome: "Instagram Lucrativo pra Vender Amigurumi", capa: "https://ik.imagekit.io/di3huhaluc/instagram%20profissional.png?updatedAt=1790240758842", icone: Instagram, cor: "#E1306C" },
  { slug: "pinterest-profissional", nome: "Pinterest que Traz Clientes Todo Dia", capa: "https://ik.imagekit.io/di3huhaluc/pinterest%20profissional.png?updatedAt=1790240757594", icone: SearchIcon, cor: "#E60023" },
  { slug: "whatsapp-profissional", nome: "WhatsApp Profissional: Do \"Oi\" à Venda", capa: "https://ik.imagekit.io/di3huhaluc/whatsapp%20profissional.png?updatedAt=1790240758716", icone: MessageCircle, cor: "#25D366" },
];

const FAQS = [
  { p: "O que é o AmiguMundo Premium?", r: "É a assinatura que te dá acesso a toda a biblioteca de receitas de amigurumi do AmiguMundo — mais de 150 receitas hoje, crescendo toda semana — em vez de comprar uma receita por vez." },
  { p: "Quantas receitas eu recebo?", r: "Todas. Enquanto sua assinatura estiver ativa, você acessa a biblioteca inteira, sem limite de quantas pode abrir, salvar ou imprimir." },
  { p: "Entram receitas novas depois que eu assinar?", r: "Sim. Novas receitas são adicionadas continuamente, e quem já é assinante recebe automaticamente, sem pagar nada a mais." },
  { p: "Preciso baixar todas as receitas?", r: "Não. Você acessa direto pelo aplicativo, quando quiser. Não precisa guardar nada no celular se não quiser." },
  { p: "Posso imprimir as receitas?", r: "Pode. Toda receita pode ser impressa quando você quiser, ou acompanhada direto pela tela enquanto crocheta." },
  { p: "O que mais existe além das receitas?", r: "As 4 ferramentas (calculadora de preço, contador de carreiras, conversor de agulha e combinador de cores) e o Ateliê Lucrativo, com conteúdos pra te ajudar a vender mais — tudo incluído na assinatura." },
  { p: "Como funciona o cancelamento?", r: "Direto no aplicativo, quando você quiser. Sem ligação, sem multa, sem burocracia — você não paga o próximo ciclo e mantém acesso até o fim do período já pago." },
  { p: "Quanto custa?", r: "A partir de R$ 19,90/mês no plano mensal, com opções semestral e anual com desconto. Você escolhe no checkout." },
];

export const PremiumSalesView = ({ onBack }: PremiumSalesViewProps) => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [receitas, setReceitas] = useState<SheetRecipe[]>([]);
  const [categorias, setCategorias] = useState<SheetCategoria[]>([]);
  const [faqAberta, setFaqAberta] = useState<number | null>(null);

  useEffect(() => {
    getRecipes().then((lista) => setReceitas(lista.filter((r) => r.ativo && r.imagem_url)));
    getCategories().then(setCategorias);
  }, []);

  const handleAssinar = () => navigate("/premium/assinar");
  const receitasCarrossel = [...receitas, ...receitas].slice(0, 40); // duplica pra loop infinito

  return (
    <div className="fixed inset-0 z-[60] bg-[#FDFBF7] overflow-y-auto">
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 40s linear infinite; }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center active:scale-95 transition-all">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight flex-1">AmiguMundo Premium</h1>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="text-[11px] font-black uppercase tracking-wide text-[#5D0599] active:scale-95 transition-transform"
        >
          Já sou assinante
        </button>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#F3E8FF] to-[#FDFBF7] px-5 pt-10 pb-12">
        <div className="absolute -top-10 -left-16 w-64 h-64 rounded-full bg-[#5D0599]/10 blur-2xl" />
        <div className="absolute top-20 -right-16 w-56 h-56 rounded-full bg-[#3CB19E]/15 blur-2xl" />
        <div className="relative max-w-md mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white border border-[#5D0599]/15 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#5D0599] shadow-sm mb-5">
            <Sparkles size={12} /> AmiguMundo Premium
          </span>
          <h1 className="text-[28px] leading-[1.08] font-black text-gray-900 tracking-tight">
            Pare de comprar receitas de <span className="text-[#5D0599]">amigurumi</span> uma por uma.
          </h1>
          <p className="text-sm text-gray-600 font-bold mt-4 leading-relaxed">
            Onde antes você compraria 4 receitas por R$20... no AmiguMundo, por R$19,90/mês, você tem acesso a uma biblioteca inteira.
          </p>

          {receitas.length > 0 && (
            <div className="flex justify-center -space-x-4 mt-7">
              {receitas.slice(0, 4).map((r, i) => (
                <div
                  key={r.id}
                  style={{ zIndex: 4 - i, transform: `rotate(${(i - 1.5) * 6}deg)` }}
                  className="w-16 h-16 rounded-2xl border-[3px] border-white shadow-lg overflow-hidden bg-gray-100"
                >
                  <img src={r.imagem_url} alt={r.nome} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleAssinar}
            className="w-full sm:w-auto mt-7 bg-[#5D0599] hover:bg-[#4a047a] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide shadow-xl shadow-[#5D0599]/25 active:scale-95 transition-all"
          >
            Quero entrar no Premium →
          </button>
          <p className="text-lg font-black text-gray-900 mt-3">
            R$ 19,90<span className="text-xs text-gray-400 font-bold">/mês</span>
          </p>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wide">
            Acesso pelo aplicativo · Novidades todos os dias · Cancele quando quiser
          </p>
        </div>
      </div>

      {/* Ticker */}
      <div className="bg-[#171717] py-2.5 overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track">
          {Array(4).fill(0).map((_, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-widest text-white/80 px-6">
              Receitas todos os dias ✦ Aplicativo próprio ✦ Imprima quando quiser ✦ 150+ receitas ✦
            </span>
          ))}
        </div>
      </div>

      {/* O PROBLEMA */}
      <Reveal className="px-5 py-16 max-w-lg mx-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#E1306C] mb-2">O problema</p>
        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-6">
          Você já viu quanto pode gastar com "só mais uma receitinha"?
        </h2>
        <div className="space-y-2 text-sm text-gray-600 font-bold mb-5">
          <p>Uma receita custa R$3. <span className="text-gray-900">"É baratinho." Você compra.</span></p>
          <p>Aparece outra por R$5. Compra.</p>
          <p>Depois encontra aquela linda por R$7. Compra também.</p>
          <p>Mais uma por R$5. E mais outra por R$9.</p>
        </div>
        <div className="bg-[#FFE8EC] rounded-2xl p-5 border border-[#E1306C]/10">
          <p className="font-black text-gray-900 text-sm mb-1">Separadamente, parece pouco.</p>
          <p className="text-xs text-gray-600 font-bold mb-3">Mas somando compra por compra, o dinheiro vai embora.</p>
          <p className="text-[10px] font-black uppercase text-[#E1306C] tracking-wide mb-1">Tem um problema ainda maior:</p>
          <p className="text-xs text-gray-600 font-bold">
            Muitas dessas receitas ficam esquecidas no celular e nunca são feitas. <span className="text-gray-900">Você paga primeiro, e só depois descobre se vai realmente usar.</span>
          </p>
        </div>
      </Reveal>

      {/* FAÇA O CONTRÁRIO */}
      <Reveal className="bg-[#171717] px-5 py-16 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#F4D160] mb-3">Faça o contrário</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight max-w-md mx-auto mb-8">
          Em vez de comprar a receita antes... tenha acesso à biblioteca e escolha depois.
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-9 text-left">
          {["Quer fazer um ursinho? Acesse.", "Quer fazer um coelhinho? Acesse.", "Quer outro animal? Procure.", "Mudou de ideia? Escolha outra."].map((t) => (
            <div key={t} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-[11px] text-white/80 font-bold leading-snug">{t}</p>
            </div>
          ))}
        </div>
        <p className="text-white/50 text-xs font-bold mb-1">Você não precisa comprar cada possibilidade.</p>
        <p className="text-white font-black text-sm mb-6">Você paga uma única mensalidade e escolhe o que quer fazer.</p>
        <button
          onClick={handleAssinar}
          className="bg-white text-[#171717] px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wide active:scale-95 transition-transform"
        >
          Quero acessar o AmiguMundo →
        </button>
        <p className="text-white/40 text-[10px] font-bold mt-3">Por apenas R$19,90/mês</p>
      </Reveal>

      {/* FAÇA UMA CONTA SIMPLES */}
      <Reveal className="px-5 py-16 max-w-lg mx-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#E1306C] mb-2">Uma comparação</p>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Faça uma conta simples.</h2>
        <p className="text-xs text-gray-500 font-bold mb-5">Se você encontra receitas por aproximadamente R$5 cada:</p>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[["1 receita", "R$5"], ["2 receitas", "R$10"], ["3 receitas", "R$15"], ["4 receitas", "R$20"]].map(([label, val], i) => (
            <div key={label} className={`rounded-xl p-3 text-center ${i === 3 ? "bg-[#5D0599] text-white" : "bg-gray-50 text-gray-900"}`}>
              <p className={`text-[8px] font-black uppercase tracking-wide mb-1 ${i === 3 ? "text-white/70" : "text-gray-400"}`}>{label}</p>
              <p className="text-base font-black">{val}</p>
            </div>
          ))}
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-[10px] font-black uppercase text-[#E1306C] tracking-wide mb-1">Agora olhe pro AmiguMundo</p>
            <p className="text-4xl font-black text-gray-900">R$ 19,90<span className="text-sm text-gray-400 font-bold">/mês</span></p>
          </div>
          <div className="bg-[#E8F3FF] rounded-2xl p-4 flex-1 min-w-[220px]">
            <p className="font-black text-gray-900 text-sm mb-1">Mais de 150 receitas disponíveis</p>
            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              Você não está escolhendo apenas quatro. Entra na biblioteca e escolhe entre centenas de possibilidades, quando quiser.
            </p>
          </div>
        </div>
        <div className="border-l-4 border-[#F4D160] pl-4">
          <p className="text-xs text-gray-500 font-bold mb-1">E tem mais: <span className="text-gray-900">o mês continua.</span> Porque novas receitas continuam chegando.</p>
          <p className="font-black text-gray-900 leading-snug">
            Depois de aproximadamente 4 receitas, você já teria chegado ao valor da mensalidade — e o mês ainda está só começando.
          </p>
        </div>
      </Reveal>

      {/* TODO DIA TEM NOVIDADE */}
      <Reveal className="bg-gradient-to-br from-[#D7F5EC] to-[#C4EFE0] px-5 py-16">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0E5E6F] mb-2">Novo mecanismo</p>
          <h2 className="text-2xl font-black text-gray-900 leading-tight mb-5">Todo dia tem novidade no AmiguMundo.</h2>
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#3CB19E]/15 flex items-center justify-center">
                <Bell size={15} className="text-[#3CB19E]" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase">Agora</p>
                <p className="text-[11px] font-bold text-gray-800">Uma nova receita disponível</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-2.5 space-y-1">
              <p className="text-[11px] text-gray-500 font-bold">Hoje tem uma.</p>
              <p className="text-[11px] text-gray-500 font-bold">Amanhã tem outra.</p>
              <p className="text-[11px] text-gray-500 font-bold">E depois, outra.</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 font-bold mb-1">Enquanto você continua Premium, a biblioteca continua recebendo novas receitas.</p>
          <p className="font-black text-gray-900 leading-snug">
            Você entra em uma biblioteca enorme. E ela continua crescendo depois que você entra.
          </p>
        </div>
      </Reveal>

      {/* PDF PERDIDO */}
      <Reveal className="px-5 py-16 max-w-lg mx-auto">
        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">Isso não é mais um monte de PDF perdido no seu celular.</h2>
        <p className="text-[#E1306C] font-bold text-sm mb-6">É uma biblioteca de amigurumi dentro de um aplicativo.</p>
        <p className="text-xs text-gray-500 font-bold leading-relaxed mb-6">
          Chega de procurar aquela receita que você comprou meses atrás. Chega de lembrar em qual conversa do WhatsApp ela estava. Chega de abrir pastas até encontrar o que você procura.
        </p>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {[["Abra.", Smartphone], ["Economize.", Sparkles], ["Escolha.", BookOpen], ["Faça.", Check]].map(([label, Icon]: any) => (
            <div key={label} className="bg-[#FFF6DD] rounded-xl p-3.5">
              <Icon size={16} className="text-[#B8860B] mb-1.5" />
              <p className="font-black text-gray-900 text-sm">{label}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#171717] rounded-xl px-4 py-3.5 flex items-center justify-between gap-2 mt-3">
          <div>
            <p className="text-white text-xs font-bold flex items-center gap-1.5"><Printer size={13} className="text-[#F4D160]" /> E quando quiser: imprima sua receita.</p>
            <p className="text-white/50 text-[10px] font-bold mt-0.5">Ou simplesmente abra e acompanhe pela tela.</p>
          </div>
          <Smartphone size={22} className="text-[#F4D160] shrink-0" />
        </div>
      </Reveal>

      {/* CARROSSEL DE RECEITAS REAIS */}
      <Reveal className="bg-gradient-to-br from-[#5D0599] to-[#7A1BC4] py-16 overflow-hidden">
        <div className="px-5 max-w-lg mx-auto text-center mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#F4D160] mb-2">Biblioteca</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">Mais de 150 receitas já esperando por você.</h2>
          <p className="text-white/70 text-xs font-bold">Uma biblioteca pra explorar quando quiser — você não precisa saber hoje qual receita vai querer amanhã.</p>
        </div>

        {receitasCarrossel.length > 0 && (
          <div className="flex whitespace-nowrap marquee-track">
            {receitasCarrossel.map((r, i) => (
              <div key={`${r.id}-${i}`} className="inline-block w-32 shrink-0 mx-1.5">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl bg-white/10">
                  <img src={r.imagem_url} alt={r.nome} className="w-full h-full object-cover" />
                </div>
                <p className="text-white text-[10px] font-bold mt-1.5 truncate whitespace-normal line-clamp-1 w-32">{r.nome}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-center text-[#F4D160] text-xs font-black uppercase tracking-wide mt-8">
          Quanto mais você explora, mais valor encontra.
        </p>
      </Reveal>

      {/* FUNCIONALIDADES DO APP */}
      <Reveal className="px-5 py-16 max-w-lg mx-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#E1306C] mb-2">Aplicativo</p>
        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-6">
          Veja o que acontece quando suas receitas deixam de ser apenas arquivos.
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            ["Biblioteca de receitas", "Encontre suas receitas dentro do aplicativo.", BookOpen, "bg-[#E8F3FF]"],
            ["Receita na tela", "Abra e acompanhe o passo a passo direto pelo celular.", Smartphone, "bg-[#FFF6DD]"],
            ["Impressão", "Prefere papel? Você pode imprimir.", Printer, "bg-[#E8F3FF]"],
            ["Histórico", "Acompanhe as novidades adicionadas ao acervo.", History, "bg-[#FFF6DD]"],
            ["Notificações", "Saiba na hora quando uma receita nova estiver disponível.", Bell, "bg-[#E8F3FF]"],
          ].map(([nome, desc, Icon, bg]: any) => (
            <div key={nome} className={`${bg} rounded-xl p-3.5`}>
              <Icon size={17} className="text-gray-700 mb-2" />
              <p className="font-black text-gray-900 text-xs mb-0.5">{nome}</p>
              <p className="text-[10px] text-gray-500 font-bold leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* FERRAMENTAS REAIS */}
      <Reveal className="bg-gradient-to-br from-[#D7EEFB] to-[#C3E4F7] px-5 py-16">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0E5E6F] mb-2">Ferramentas</p>
          <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">E o Premium não é só receita.</h2>
          <p className="text-xs text-gray-500 font-bold mb-6">Você também encontra ferramentas de verdade no AmiguMundo.</p>
          <div className="grid grid-cols-2 gap-3">
            {FERRAMENTAS_REAIS.map((f) => (
              <div key={f.nome} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#5D0599]/10 flex items-center justify-center mb-2.5">
                  <f.icone size={17} className="text-[#5D0599]" />
                </div>
                <p className="font-black text-gray-900 text-xs mb-1 leading-tight">{f.nome}</p>
                <p className="text-[10px] text-gray-500 font-bold leading-snug mb-2">{f.desc}</p>
                <span className="inline-block bg-[#3CB19E]/10 text-[#1F6F63] text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Disponível agora</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 font-bold text-center mt-5">
            E o AmiguMundo pode continuar evoluindo — novos recursos são adicionados com o tempo.
          </p>
        </div>
      </Reveal>

      {/* ATELIÊ LUCRATIVO */}
      <Reveal className="px-5 py-16 max-w-lg mx-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#E1306C] mb-2">Conteúdos extras</p>
        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-6">
          Você entrou pra encontrar receitas... mas pode encontrar muito mais pra ajudar a vender seus amigurumis.
        </h2>
        <div className="space-y-3">
          {CAPAS_INFOPRODUTOS.map((p) => (
            <div key={p.slug} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex items-center bg-white">
              <img src={p.capa} alt={p.nome} className="w-24 h-24 object-cover shrink-0" />
              <div className="p-3.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1" style={{ color: p.cor }}>
                  <p.icone size={12} />
                  <span className="text-[9px] font-black uppercase tracking-wide">Ateliê Lucrativo</span>
                </div>
                <p className="font-black text-gray-900 text-xs leading-snug line-clamp-2">{p.nome}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 font-bold text-center mt-4">Incluído na assinatura, sem pagar nada a mais.</p>
      </Reveal>

      {/* VOTAÇÃO DE TEMAS */}
      {categorias.length > 0 && (
        <Reveal className="bg-gradient-to-br from-[#F4D160] to-[#F2C441] px-5 py-16">
          <div className="max-w-lg mx-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#7A4A00] mb-2">Você participa</p>
            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-6">
              O AmiguMundo também quer saber o que você quer fazer.
            </h2>
            <p className="text-[11px] font-black text-gray-700 uppercase tracking-wide mb-2">Qual você mais gosta?</p>
            <div className="space-y-1.5 mb-6">
              {categorias.slice(0, 5).map((c, i) => (
                <div key={c.id} className={`flex items-center justify-between rounded-xl px-4 py-3 ${i === 0 ? "bg-[#171717]" : "bg-white"}`}>
                  <span className={`text-xs font-bold ${i === 0 ? "text-white" : "text-gray-700"}`}>{c.titulo}</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${i === 0 ? "bg-[#F4D160] border-[#F4D160]" : "border-gray-300"}`} />
                </div>
              ))}
            </div>
            <p className="font-black text-gray-900 text-sm mb-1">Você não é apenas quem recebe o conteúdo.</p>
            <p className="text-xs text-gray-700 font-bold">Você também pode ajudar a indicar o que vem a seguir.</p>
          </div>
        </Reveal>
      )}

      {/* AGORA JUNTE TUDO */}
      <Reveal className="px-5 py-16 max-w-lg mx-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#E1306C] mb-2">O valor</p>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Agora junte tudo.</h2>
        <p className="text-xs text-gray-500 font-bold mb-6">Por R$19,90/mês, você recebe:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {[
            ["150+ receitas de amigurumi", "Uma biblioteca inteira pra explorar."],
            ["Novas receitas toda semana", "Conteúdo novo entrando continuamente."],
            ["Aplicativo AmiguMundo", "Tudo reunido em um único lugar."],
            ["Visualização e impressão", "Use suas receitas do jeito que preferir."],
            ["Aviso de novidades", "Saiba na hora quando algo novo chegar."],
            ["Histórico de novidades", "Acompanhe o crescimento da biblioteca."],
            ["4 ferramentas prontas", "Calculadora, contador, conversor e cores."],
            ["Ateliê Lucrativo", "Instagram, Pinterest e WhatsApp pra vender mais."],
            ["Você ajuda a decidir", "Vote nos próximos temas do AmiguMundo."],
          ].map(([t, d]) => (
            <div key={t} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#3CB19E]/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-[#3CB19E]" strokeWidth={3} />
              </div>
              <div>
                <p className="font-black text-gray-900 text-xs leading-snug">{t}</p>
                <p className="text-[10px] text-gray-400 font-bold">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* DUAS FORMAS */}
      <Reveal className="bg-[#171717] px-5 py-16">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#F4D160] mb-2">A grande comparação</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-7">Duas formas de comprar receitas.</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-7">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-wide mb-1">1</p>
              <p className="font-black text-white text-sm mb-3">Comprar uma por uma</p>
              <ul className="space-y-2 text-[11px] text-white/60 font-bold">
                <li>Você abriu uma receita? Paga.</li>
                <li>Encontrou outra? Paga novamente.</li>
                <li>Outra? Pague novamente.</li>
                <li className="text-white/80">E aquela que você comprou e nunca fez? <span className="text-white">O dinheiro já foi.</span></li>
              </ul>
            </div>
            <div className="bg-[#5D0599] rounded-2xl p-5">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-wide mb-1">2</p>
              <p className="font-black text-white text-sm mb-3">AmiguMundo Premium — R$19,90/mês</p>
              <ul className="space-y-2 text-[11px] text-white/90 font-bold">
                <li>Encontrou uma receita? Acesse.</li>
                <li>Quer outra? Acesse.</li>
                <li>Mudou de ideia? Escolha outra.</li>
                <li>Entrou uma novidade? Confira. Quer imprimir? Imprima.</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-[#F4D160] font-black text-sm mb-2">Uma assinatura. Uma biblioteca. Muitas possibilidades.</p>
          <p className="text-center text-white/50 text-xs font-bold mb-6">Você pode continuar comprando receitas uma por uma. Ou pode ter um lugar onde escolher a próxima.</p>
          <div className="text-center">
            <button
              onClick={handleAssinar}
              className="bg-white text-[#171717] px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wide active:scale-95 transition-transform"
            >
              Quero entrar no AmiguMundo Premium →
            </button>
          </div>
        </div>
      </Reveal>

      {/* OBJEÇÕES */}
      <Reveal className="px-5 py-16 max-w-lg mx-auto space-y-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#E1306C] -mb-6">Objeções</p>
        <div>
          <h3 className="text-xl font-black text-gray-900 mb-3">"Mas eu não vou fazer 150 receitas..."</h3>
          <p className="text-xs text-gray-500 font-bold leading-relaxed mb-2">E você não precisa. Você não está pagando para ser obrigada a fazer 150 amigurumis — está pagando para ter opções quando quiser fazer algo novo.</p>
          <p className="text-xs text-gray-500 font-bold leading-relaxed">Hoje pode ser uma. Amanhã, outra. Daqui a um mês, uma completamente diferente. <span className="font-black text-gray-900">A vantagem é justamente não precisar decidir tudo antecipadamente.</span></p>
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 mb-3">"Eu já tenho muitas receitas."</h3>
          <p className="text-xs text-gray-500 font-bold leading-relaxed mb-3">Quantas estão espalhadas pelo seu celular? Quantas você consegue encontrar rápido? Quantas você comprou e nunca mais encontrou?</p>
          <div className="bg-[#FFE8EC] rounded-xl p-4">
            <p className="font-black text-gray-900 text-xs mb-1">Ter muitos arquivos não é a mesma coisa que ter uma biblioteca.</p>
            <p className="text-[11px] text-gray-600 font-bold">Um lugar pra encontrar. Um lugar pra usar.</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 mb-3">"E se eu não quiser continuar?"</h3>
          <p className="text-xs text-gray-500 font-bold leading-relaxed mb-3">Você tem controle total sobre sua assinatura.</p>
          <div className="border-2 border-dashed border-[#E1306C]/30 rounded-xl p-4">
            <p className="text-[10px] font-black uppercase text-[#E1306C] tracking-wide mb-1">Cancelamento simples</p>
            <p className="text-xs text-gray-600 font-bold">Direto pelo aplicativo, sem complicação e sem precisar continuar pagando por algo que você não quer mais usar.</p>
          </div>
        </div>
      </Reveal>

      {/* 30 DIAS */}
      <Reveal className="bg-gradient-to-br from-[#D7F5EC] to-[#C4EFE0] px-5 py-16">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0E5E6F] mb-2">Daqui a 30 dias</p>
          <h2 className="text-2xl font-black text-gray-900 leading-tight mb-6">Imagine abrir o AmiguMundo daqui a 30 dias.</h2>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {[
              ["Você entra.", "Tem receita nova. Você olha. Gostou? Abra."],
              ["Quer imprimir?", "Imprima. Quer procurar outra? Pesquise na biblioteca."],
              ["Alguns dias depois", "Nova receita disponível. Você entra de novo."],
              ["Depois", "Nova votação. Você escolhe o tema que gostaria de ver."],
            ].map(([t, d]) => (
              <div key={t} className="bg-white rounded-xl p-3.5">
                <p className="font-black text-gray-900 text-xs mb-1">{t}</p>
                <p className="text-[10px] text-gray-500 font-bold leading-snug">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 font-bold mb-1">E enquanto isso: a biblioteca continua crescendo.</p>
          <p className="font-black text-gray-900 text-base leading-snug">
            Essa é a diferença entre comprar uma receita... e ter acesso a uma biblioteca.
          </p>
        </div>
      </Reveal>

      {/* OFERTA FINAL */}
      <Reveal className="relative overflow-hidden bg-gradient-to-br from-[#5D0599] to-[#3B0263] px-5 py-16 text-center">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-[24px] border-[#7A1BC4]/40" />
        <div className="relative max-w-md mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#F4D160] mb-3">Oferta</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
            Chega de pagar toda vez que encontrar uma receita nova.
          </h2>
          <p className="text-white/70 text-xs font-bold leading-relaxed mb-6">
            Entre para o AmiguMundo Premium. Acesso a uma biblioteca com mais de 150 receitas, novidades toda semana, ferramentas, conteúdos extras e muito mais — tudo dentro do aplicativo.
          </p>
          <p className="text-[10px] font-black uppercase text-white/50 tracking-wide mb-1">A partir de</p>
          <p className="text-5xl font-black text-white mb-1">R$ 19,90<span className="text-base font-bold text-white/60">/mês</span></p>
          <p className="text-[11px] text-white/60 font-bold mb-1">O equivalente a aproximadamente 4 receitas de R$5.</p>
          <p className="text-[#F4D160] text-xs font-black mb-7">Só que aqui você não recebe apenas quatro opções. Você entra na biblioteca inteira.</p>
          <button
            onClick={handleAssinar}
            className="bg-white text-[#5D0599] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide shadow-xl active:scale-95 transition-transform"
          >
            Quero meu acesso ao Premium →
          </button>
        </div>
      </Reveal>

      {/* FAQ */}
      <Reveal className="px-5 py-16 max-w-lg mx-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#E1306C] mb-2">Perguntas frequentes</p>
        <h2 className="text-2xl font-black text-gray-900 mb-6">Perguntas frequentes.</h2>
        <div className="divide-y divide-gray-100">
          {FAQS.map((f, i) => (
            <div key={f.p}>
              <button
                onClick={() => setFaqAberta(faqAberta === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 py-4 text-left"
              >
                <span className="text-xs font-black text-gray-900">{f.p}</span>
                <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${faqAberta === i ? "rotate-180" : ""}`} />
              </button>
              {faqAberta === i && (
                <p className="text-xs text-gray-500 font-bold leading-relaxed pb-4 pr-6">{f.r}</p>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* CTA FINAL */}
      <div className="bg-[#171717] px-5 py-16 text-center">
        <p className="text-[#F4D160] text-xs font-black mb-2 max-w-xs mx-auto leading-relaxed">
          Você já gastou R$3, R$5, R$7 ou R$9 quando encontra uma receita que quer.
        </p>
        <h2 className="text-2xl font-black text-white leading-tight mb-3">Por que continuar comprando uma por uma?</h2>
        <p className="text-white/50 text-xs font-bold mb-8">Por R$19,90/mês, você pode ter uma biblioteca inteira à sua disposição.</p>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-white/50 uppercase tracking-wide mb-1">
          <Sparkles size={12} className="text-[#F4D160]" /> AmiguMundo Premium
        </div>
        <p className="text-3xl font-black text-white mb-5">R$ 19,90<span className="text-sm text-white/50 font-bold">/mês</span></p>
        <button
          onClick={handleAssinar}
          className="bg-[#F4D160] text-[#171717] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide active:scale-95 transition-transform mb-3"
        >
          Quero entrar agora →
        </button>
        <p className="text-white/40 text-[10px] font-bold">Pare de comprar cada receita separadamente. Entre na biblioteca.</p>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};
