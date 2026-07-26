"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Undo2, RotateCcw, Target, Hash, Trash2 } from "lucide-react";

interface ContadorCarreirasProps {
  onBack: () => void;
}

interface HistoricoItem {
  tipo: "ponto" | "carreira";
  pontosAntes: number;
  carreirasAntes: number;
}

interface Projeto {
  id: string;
  nome: string;
  pontos: number;
  carreiras: number;
  metaCarreiras: number | null;
  historico: HistoricoItem[];
}

export const ContadorCarreiras = ({ onBack }: ContadorCarreirasProps) => {
  const [projetos, setProjetos] = useState<Projeto[]>(() => {
    try {
      const saved = localStorage.getItem("amigumundo-contadores");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Erro ao ler contadores do localStorage:", e);
    }
    // Projeto inicial padrão se nada estiver salvo
    return [
      {
        id: "proj-1",
        nome: "Meu Amigurumi",
        pontos: 0,
        carreiras: 0,
        metaCarreiras: null,
        historico: [],
      },
    ];
  });

  const [projetoAtivoId, setProjetoAtivoId] = useState<string | null>(() => {
    return projetos.length > 0 ? projetos[0].id : null;
  });

  // Garante que haja um projeto selecionado quando a lista muda
  useEffect(() => {
    if (projetos.length > 0) {
      if (!projetoAtivoId || !projetos.some((p) => p.id === projetoAtivoId)) {
        setProjetoAtivoId(projetos[0].id);
      }
    } else {
      setProjetoAtivoId(null);
    }
  }, [projetos, projetoAtivoId]);

  // Persistência automática no localStorage
  useEffect(() => {
    localStorage.setItem("amigumundo-contadores", JSON.stringify(projetos));
  }, [projetos]);

  const projetoAtivo = projetos.find((p) => p.id === projetoAtivoId) || null;

  const handleCriarProjeto = () => {
    const nome = prompt("Digite o nome do projeto (ex: Ursinho Mel):");
    if (!nome || !nome.trim()) return;

    const novoProjeto: Projeto = {
      id: "proj-" + Date.now(),
      nome: nome.trim(),
      pontos: 0,
      carreiras: 0,
      metaCarreiras: null,
      historico: [],
    };

    setProjetos((prev) => [...prev, novoProjeto]);
    setProjetoAtivoId(novoProjeto.id);
  };

  const handleExcluirProjeto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const proj = projetos.find((p) => p.id === id);
    if (!proj) return;

    if (confirm(`Tem certeza que deseja excluir o projeto "${proj.nome}"?`)) {
      setProjetos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleIncrementarPonto = () => {
    if (!projetoAtivo) return;

    setProjetos((prev) =>
      prev.map((p) => {
        if (p.id !== projetoAtivo.id) return p;
        const novoHistorico = [
          ...p.historico,
          { tipo: "ponto" as const, pontosAntes: p.pontos, carreirasAntes: p.carreiras },
        ];
        return {
          ...p,
          pontos: p.pontos + 1,
          historico: novoHistorico,
        };
      })
    );
  };

  const handleFinalizarCarreira = () => {
    if (!projetoAtivo) return;

    setProjetos((prev) =>
      prev.map((p) => {
        if (p.id !== projetoAtivo.id) return p;
        const novoHistorico = [
          ...p.historico,
          { tipo: "carreira" as const, pontosAntes: p.pontos, carreirasAntes: p.carreiras },
        ];
        return {
          ...p,
          carreiras: p.carreiras + 1,
          pontos: 0,
          historico: novoHistorico,
        };
      })
    );
  };

  const handleDesfazer = () => {
    if (!projetoAtivo || projetoAtivo.historico.length === 0) return;

    setProjetos((prev) =>
      prev.map((p) => {
        if (p.id !== projetoAtivo.id) return p;
        const historicoCopia = [...p.historico];
        const ultimoItem = historicoCopia.pop();

        if (!ultimoItem) return p;

        return {
          ...p,
          pontos: ultimoItem.pontosAntes,
          carreiras: ultimoItem.carreirasAntes,
          historico: historicoCopia,
        };
      })
    );
  };

  const handleDefinirMeta = () => {
    if (!projetoAtivo) return;

    const valorStr = prompt(
      "Digite a quantidade total de carreiras para este projeto (ou deixe em branco para remover a meta):",
      projetoAtivo.metaCarreiras ? String(projetoAtivo.metaCarreiras) : ""
    );

    if (valorStr === null) return; // Clicou em Cancelar

    if (valorStr.trim() === "") {
      setProjetos((prev) =>
        prev.map((p) => (p.id === projetoAtivo.id ? { ...p, metaCarreiras: null } : p))
      );
      return;
    }

    const num = parseInt(valorStr, 10);
    if (!isNaN(num) && num > 0) {
      setProjetos((prev) =>
        prev.map((p) => (p.id === projetoAtivo.id ? { ...p, metaCarreiras: num } : p))
      );
    } else {
      alert("Por favor, digite um número inteiro maior que zero.");
    }
  };

  const handleZerarProjeto = () => {
    if (!projetoAtivo) return;

    if (confirm(`Deseja zerar a contagem do projeto "${projetoAtivo.nome}"?`)) {
      setProjetos((prev) =>
        prev.map((p) =>
          p.id === projetoAtivo.id
            ? { ...p, pontos: 0, carreiras: 0, historico: [] }
            : p
        )
      );
    }
  };

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  };

  const percentualMeta =
    projetoAtivo && projetoAtivo.metaCarreiras && projetoAtivo.metaCarreiras > 0
      ? Math.min(100, Math.round((projetoAtivo.carreiras / projetoAtivo.metaCarreiras) * 100))
      : 0;

  return (
    <div className="fixed inset-0 z-[90] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
      {/* Cabeçalho Fixo */}
      <div
        style={textureLaranjaStyle}
        className="sticky top-0 z-10 py-4 px-4 flex items-center justify-between shadow-md shrink-0"
      >
        <button
          onClick={onBack}
          className="text-white hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 font-black text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <h2 className="text-white font-black text-sm uppercase tracking-widest m-0 flex items-center gap-2">
          <Hash size={18} /> CONTADOR DE CARREIRAS
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Barra de Abas de Projetos */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0 flex items-center gap-2">
        {projetos.map((p) => {
          const isSelected = p.id === projetoAtivoId;
          return (
            <div
              key={p.id}
              onClick={() => setProjetoAtivoId(p.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                isSelected
                  ? "bg-[#171717] text-white border-[#171717] shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span className="truncate max-w-[120px]">{p.nome}</span>
              <button
                onClick={(e) => handleExcluirProjeto(p.id, e)}
                className={`p-0.5 rounded-full hover:bg-white/20 transition-colors ${
                  isSelected ? "text-gray-300 hover:text-white" : "text-gray-400 hover:text-red-500"
                }`}
                title="Excluir projeto"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        <button
          onClick={handleCriarProjeto}
          className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-green-200 shrink-0 active:scale-95"
          title="Novo Projeto"
        >
          <Plus size={14} /> Novo Projeto
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-4 sm:p-6 max-w-xl mx-auto w-full flex flex-col justify-between">
        {projetos.length === 0 || !projetoAtivo ? (
          <div className="my-auto text-center py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-md mx-auto space-y-4">
            <Hash size={48} className="text-gray-300 mx-auto" />
            <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">
              Crie seu primeiro projeto pra começar a contar!
            </h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Organize seus amigurumis, conte carreiras e pontos sem se perder e salve tudo automaticamente.
            </p>
            <button
              onClick={handleCriarProjeto}
              className="bg-[#44FF00] text-[#171717] px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Plus size={16} /> Criar Projeto Agora
            </button>
          </div>
        ) : (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Bloco Superior: Contadores de Carreiras e Pontos */}
            <div className="space-y-3">
              {/* Card de Progresso / Meta */}
              {projetoAtivo.metaCarreiras !== null && (
                <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-xs font-black text-gray-700 uppercase tracking-wide">
                    <span>Progresso da Peça</span>
                    <span className="text-[#0E5E6F]">
                      Carreira {projetoAtivo.carreiras} de {projetoAtivo.metaCarreiras} ({percentualMeta}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#0E5E6F] rounded-full transition-all duration-300"
                      style={{ width: `${percentualMeta}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Placar Principal */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-1">
                  <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">
                    Carreiras
                  </span>
                  <p className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                    {projetoAtivo.carreiras}
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-1">
                  <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">
                    Pontos na Carreira
                  </span>
                  <p className="text-4xl sm:text-5xl font-black text-green-600 tracking-tight">
                    {projetoAtivo.pontos}
                  </p>
                </div>
              </div>
            </div>

            {/* Botões Grandes de Ação de Crochê */}
            <div className="space-y-3 my-4">
              {/* Botão +1 Ponto (Gigante Verde) */}
              <button
                onClick={handleIncrementarPonto}
                className="w-full bg-[#44FF00] hover:bg-[#3ee600] active:scale-95 text-[#171717] py-8 rounded-3xl font-black text-2xl uppercase tracking-widest shadow-xl transition-all border-b-4 border-green-600 flex items-center justify-center gap-3 select-none cursor-pointer"
              >
                <Plus size={32} /> + 1 PONTO
              </button>

              {/* Botão Finalizar Carreira */}
              <button
                onClick={handleFinalizarCarreira}
                className="w-full bg-[#171717] hover:bg-black active:scale-95 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 select-none cursor-pointer"
              >
                ✓ FINALIZAR CARREIRA
              </button>
            </div>

            {/* Ações Secundárias e Auxiliares */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleDesfazer}
                  disabled={projetoAtivo.historico.length === 0}
                  className={`flex-1 py-3 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                    projetoAtivo.historico.length > 0
                      ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 active:scale-95 shadow-sm"
                      : "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed"
                  }`}
                >
                  <Undo2 size={16} /> Desfazer Passo
                </button>

                <button
                  onClick={handleDefinirMeta}
                  className="flex-1 py-3 px-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <Target size={16} className="text-[#0E5E6F]" />
                  {projetoAtivo.metaCarreiras ? "Editar Meta" : "Definir Meta"}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleZerarProjeto}
                  className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors inline-flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Zerar contagem deste projeto
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};