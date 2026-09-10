import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore - o Vite resolve esse import como a URL final do arquivo do worker
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { X, Printer, Loader2 } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

interface VisualizadorPDFProps {
  fileId: string;
  titulo: string;
  onClose: () => void;
}

export const VisualizadorPDF = ({ fileId, titulo, onClose }: VisualizadorPDFProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let cancelado = false;

    const carregarPdf = async () => {
      try {
        const url = `/premium-pdf/${fileId}`;
        const pdf = await pdfjsLib.getDocument(url).promise;
        if (cancelado || !containerRef.current) return;
        containerRef.current.innerHTML = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.style.margin = "0 auto 16px auto";
          canvas.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
          const context = canvas.getContext("2d");
          if (!context) continue;
          await page.render({ canvasContext: context, viewport }).promise;
          if (cancelado) return;
          containerRef.current?.appendChild(canvas);
        }
        if (!cancelado) setCarregando(false);
      } catch (e) {
        console.error("Erro ao carregar PDF no visualizador:", e);
        if (!cancelado) {
          setErro(true);
          setCarregando(false);
        }
      }
    };

    carregarPdf();
    return () => {
      cancelado = true;
    };
  }, [fileId]);

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#F5F5F7] flex flex-col">
      <div className="print:hidden sticky top-0 z-10 bg-white shadow-md flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={onClose} className="text-gray-700 flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
          <X size={18} /> Fechar
        </button>
        <h2 className="font-black text-xs sm:text-sm uppercase truncate max-w-[45%] text-center">{titulo}</h2>
        <button
          onClick={handleImprimir}
          className="bg-[#3CB19E] text-white flex items-center gap-1.5 font-black text-xs uppercase px-3 py-2 rounded-lg"
        >
          <Printer size={16} /> Imprimir
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {carregando && !erro && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-2">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm font-bold">Carregando receita...</p>
          </div>
        )}
        {erro && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-center px-6 gap-2">
            <p className="text-sm font-bold">
              Não foi possível carregar essa receita agora. Tente fechar e abrir de novo em alguns instantes.
            </p>
          </div>
        )}
        <div ref={containerRef} id="visualizador-pdf-paginas" />
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #visualizador-pdf-paginas, #visualizador-pdf-paginas * { visibility: visible; }
          #visualizador-pdf-paginas { position: absolute; left: 0; top: 0; }
        }
      `}</style>
    </div>
  );
};
