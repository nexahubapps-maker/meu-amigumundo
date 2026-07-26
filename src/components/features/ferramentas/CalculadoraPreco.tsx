"use client";

import React, { useState } from "react";
import { ArrowLeft, Calculator, RotateCcw } from "lucide-react";

interface CalculadoraPrecoProps {
  onBack: () => void;
}

export const CalculadoraPreco = ({ onBack }: CalculadoraPrecoProps) => {
  const [custoNoveloStr, setCustoNoveloStr] = useState<string>("");
  const [quantidadeNovelosStr, setQuantidadeNovelosStr] = useState<string>("1");
  const [outrosCustosStr, setOutrosCustosStr] = useState<string>("");
  const [horasTrabalhadasStr, setHorasTrabalhadasStr] = useState<string>("");
  const [valorHoraStr, setValorHoraStr] = useState<string>("");
  const [percentualIndiretosStr, setPercentualIndiretosStr] = useState<string>("8");
  const [margemLucroStr, setMargemLucroStr] = useState<string>("30");

  const parseNum = (val: string): number => {
    const parsed = parseFloat(val.replace(",", "."));
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  };

  const custoNovelo = parseNum(custoNoveloStr);
  const quantidadeNovelos = parseNum(quantidadeNovelosStr);
  const outrosCustos = parseNum(outrosCustosStr);
  const horasTrabalhadas = parseNum(horasTrabalhadasStr);
  const valorHora = parseNum(valorHoraStr);
  const percentualIndiretos = parseNum(percentualIndiretosStr);
  const margemLucro = parseNum(margemLucroStr);

  const custoMateriais = custoNovelo * quantidadeNovelos + outrosCustos;
  const custoMaoDeObra = horasTrabalhadas * valorHora;
  const custosIndiretos = (custoMateriais + custoMaoDeObra) * (percentualIndiretos / 100);
  const custoTotal = custoMateriais + custoMaoDeObra + custosIndiretos;
  const precoSugerido = custoTotal * (1 + margemLucro / 100);
  const lucro = precoSugerido - custoTotal;

  const handleLimpar = () => {
    setCustoNoveloStr("");
    setQuantidadeNovelosStr("1");
    setOutrosCustosStr("");
    setHorasTrabalhadasStr("");
    setValorHoraStr("");
    setPercentualIndiretosStr("8");
    setMargemLucroStr("30");
  };

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
      {/* Cabeçalho Fixo com Textura Laranja */}
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
          <Calculator size={18} /> CALCULADORA DE PREÇO
        </h2>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-4">
        {/* Banner de Resultado em Destaque (#44FF00) */}
        <div className="bg-[#44FF00] text-[#171717] rounded-3xl p-5 shadow-lg border border-black/10 text-center space-y-1">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-80 block">
            Preço Sugerido de Venda
          </span>
          <p className="text-2xl sm:text-4xl font-black tracking-tight">
            R$ {precoSugerido.toFixed(2).replace(".", ",")}
          </p>
        </div>

        {/* Formulario de Entradas */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              1. Materiais & Produção
            </h3>
            <button
              onClick={handleLimpar}
              className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} /> Limpar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Custo do novelo/fio usado (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={custoNoveloStr}
                onChange={(e) => setCustoNoveloStr(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:outline-none focus:border-[#0E5E6F]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Quantidade de novelos
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="1"
                value={quantidadeNovelosStr}
                onChange={(e) => setQuantidadeNovelosStr(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:outline-none focus:border-[#0E5E6F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Outros custos diretos (olhos, enchimento, embalagem — R$)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={outrosCustosStr}
              onChange={(e) => setOutrosCustosStr(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:outline-none focus:border-[#0E5E6F]"
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">
              2. Mão de Obra
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Horas trabalhadas na peça
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="0"
                  value={horasTrabalhadasStr}
                  onChange={(e) => setHorasTrabalhadasStr(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:outline-none focus:border-[#0E5E6F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Valor da sua hora de trabalho (R$)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="0,00"
                  value={valorHoraStr}
                  onChange={(e) => setValorHoraStr(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:outline-none focus:border-[#0E5E6F]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">
              3. Custos Indiretos e Margem
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                  Custos indiretos / fixos (%)
                </label>
                <input
                  type="number"
                  step="1"
                  placeholder="8"
                  value={percentualIndiretosStr}
                  onChange={(e) => setPercentualIndiretosStr(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:outline-none focus:border-[#0E5E6F]"
                />
                <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1">
                  Energia, internet e desgaste de ferramentas. Sugestão: 5% a 10%.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                  Margem de lucro desejada (%)
                </label>
                <input
                  type="number"
                  step="1"
                  placeholder="30"
                  value={margemLucroStr}
                  onChange={(e) => setMargemLucroStr(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:outline-none focus:border-[#0E5E6F]"
                />
                <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1">
                  Faixa comum no mercado: 20% a 50%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalhamento de Custos */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-2 text-xs">
          <h4 className="font-black text-gray-900 uppercase tracking-wider text-[11px] mb-2 border-b border-gray-100 pb-2">
            Detalhamento do Preço
          </h4>
          <div className="flex justify-between items-center text-gray-600 font-medium">
            <span>Materiais:</span>
            <span className="font-bold text-gray-800">R$ {custoMateriais.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600 font-medium">
            <span>Mão de obra:</span>
            <span className="font-bold text-gray-800">R$ {custoMaoDeObra.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600 font-medium">
            <span>Custos indiretos ({percentualIndiretos}%):</span>
            <span className="font-bold text-gray-800">R$ {custosIndiretos.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between items-center text-gray-800 font-black pt-1.5 border-t border-dashed border-gray-200">
            <span>Custo Total do Amigurumi:</span>
            <span>R$ {custoTotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between items-center text-green-600 font-black pt-1">
            <span>Seu Lucro Real ({margemLucro}%):</span>
            <span>R$ {lucro.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};