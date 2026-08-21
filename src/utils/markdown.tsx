import React from "react";

function renderInline(texto: string, keyPrefix: string): React.ReactNode[] {
  const partes: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let ultimo = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimo) {
      partes.push(texto.slice(ultimo, match.index));
    }
    if (match[1]) {
      partes.push(<strong key={`${keyPrefix}-b-${i}`} className="font-black text-gray-900">{match[2]}</strong>);
    } else if (match[3]) {
      partes.push(
        <a key={`${keyPrefix}-a-${i}`} href={match[5]} target="_blank" rel="noopener noreferrer" className="text-[#5D0599] font-bold underline decoration-2 underline-offset-2">
          {match[4]}
        </a>
      );
    }
    ultimo = regex.lastIndex;
    i++;
  }
  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return partes;
}

function estiloCallout(texto: string) {
  if (texto.includes("💡")) return { estilo: "bg-[#E8734A]/8 border-[#E8734A]/25", rotulo: "DICA" };
  if (texto.includes("📊")) return { estilo: "bg-[#5D0599]/8 border-[#5D0599]/25", rotulo: "DADO" };
  if (texto.includes("✅")) return { estilo: "bg-[#3CB19E]/8 border-[#3CB19E]/25", rotulo: "EXEMPLO" };
  if (texto.includes("💬")) return { estilo: "bg-gray-500/8 border-gray-300", rotulo: "CITAÇÃO" };
  return { estilo: "bg-[#5D0599]/8 border-[#5D0599]/25", rotulo: "DESTAQUE" };
}

export function renderMarkdown(conteudo: string): React.ReactNode {
  const linhas = conteudo.split("\n");
  const blocos: React.ReactNode[] = [];
  let i = 0;
  let chave = 0;

  const limparAsteriscos = (t: string) => t.replace(/\*\*/g, "").trim();

  while (i < linhas.length) {
    const linhaTrim = linhas[i].trim();

    if (linhaTrim === "") { i++; continue; }

    if (linhaTrim === "***" || linhaTrim === "---") {
      blocos.push(<div key={chave++} className="my-10 border-t-2 border-dashed border-[#5D0599]/20" />);
      i++;
      continue;
    }

    if (linhaTrim.startsWith("## ")) {
      blocos.push(
        <h2 key={chave++} className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight mt-10 mb-4 pb-3 border-b-2 border-dashed border-[#5D0599]/20 first:mt-0">
          {limparAsteriscos(linhaTrim.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (linhaTrim.startsWith("### ")) {
      blocos.push(
        <h3 key={chave++} className="text-base sm:text-lg font-black text-[#5D0599] uppercase tracking-tight mt-7 mb-3">
          {limparAsteriscos(linhaTrim.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (linhaTrim.startsWith(">")) {
      const linhasQuote: string[] = [];
      while (i < linhas.length && linhas[i].trim().startsWith(">")) {
        linhasQuote.push(linhas[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const textoCompleto = linhasQuote.join(" ");
      const { estilo, rotulo } = estiloCallout(textoCompleto);
      blocos.push(
        <blockquote key={chave++} className={`border-l-4 rounded-r-2xl px-5 py-4 my-6 ${estilo}`}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{rotulo}</p>
          <p className="text-sm text-gray-800 font-bold leading-relaxed">{renderInline(textoCompleto, `q${chave}`)}</p>
        </blockquote>
      );
      continue;
    }

    if (linhaTrim.startsWith("|")) {
      const linhasTabela: string[] = [];
      while (i < linhas.length && linhas[i].trim().startsWith("|")) {
        linhasTabela.push(linhas[i].trim());
        i++;
      }
      const cabecalho = linhasTabela[0].split("|").map((c) => c.trim()).filter((c) => c.length > 0);
      const corpo = linhasTabela.slice(2).map((l) => l.split("|").map((c) => c.trim()).filter((c) => c.length > 0));
      blocos.push(
        <div key={chave++} className="overflow-x-auto my-6 rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-[#5D0599] text-white">
              <tr>
                {cabecalho.map((c, idx) => (
                  <th key={idx} className="px-3 py-2.5 text-left font-black uppercase tracking-wide text-[10px] sm:text-xs">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corpo.map((linha, li) => (
                <tr key={li}>
                  {linha.map((c, ci) => (
                    <td key={ci} className="px-3 py-2.5 border-t border-gray-100 text-gray-700 font-medium">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (linhaTrim.startsWith("- ")) {
      const itens: string[] = [];
      while (i < linhas.length && linhas[i].trim().startsWith("- ")) {
        itens.push(linhas[i].trim().slice(2));
        i++;
      }
      blocos.push(
        <ul key={chave++} className="space-y-2 mb-5">
          {itens.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 font-medium leading-snug">
              <span className="text-[#E8734A] font-black shrink-0 mt-0.5">—</span>
              <span>{renderInline(item, `li${chave}-${idx}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    const linhasParagrafo: string[] = [linhaTrim];
    i++;
    while (
      i < linhas.length &&
      linhas[i].trim() !== "" &&
      !linhas[i].trim().startsWith("#") &&
      !linhas[i].trim().startsWith(">") &&
      !linhas[i].trim().startsWith("|") &&
      !linhas[i].trim().startsWith("- ") &&
      linhas[i].trim() !== "***"
    ) {
      linhasParagrafo.push(linhas[i].trim());
      i++;
    }
    blocos.push(
      <p key={chave++} className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium mb-4">
        {renderInline(linhasParagrafo.join(" "), `p${chave}`)}
      </p>
    );
  }

  return <>{blocos}</>;
}