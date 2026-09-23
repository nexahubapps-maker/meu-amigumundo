"use client";
import { User as UserIcon, MapPin, Link2, Eye } from "lucide-react";

interface ArtesaProfileHeaderProps {
  nome: string;
  nomeAtelie?: string | null;
  fotoUrl?: string | null;
  bio?: string | null;
  cidade?: string | null;
  tagEspecialidade?: string | null;
  capaUrl: string;
  onCopiarLink?: () => void;
  onVisualizarCatalogo?: () => void;
}

const textoComSombra = { textShadow: "0 1px 4px rgba(0,0,0,0.85)" };

export const ArtesaProfileHeader = ({
  nome,
  nomeAtelie,
  fotoUrl,
  bio,
  cidade,
  tagEspecialidade,
  capaUrl,
  onCopiarLink,
  onVisualizarCatalogo
}: ArtesaProfileHeaderProps) => {
  const nomeExibido = nomeAtelie && nomeAtelie.trim() !== "" ? nomeAtelie : nome;

  return (
    <div className="relative w-full aspect-[3/1] overflow-hidden bg-[#171717] shrink-0">
      <img
        src={capaUrl}
        alt="AmiguMundo Premium"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradiente inferior só pra garantir legibilidade do avatar/nome/botões por cima da capa */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#5D0599] to-[#3CB19E] p-[2.5px] shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              {fotoUrl ? (
                <img src={fotoUrl} alt={nomeExibido} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="text-gray-300" size={22} />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 style={textoComSombra} className="text-white font-black text-xs sm:text-base uppercase tracking-tight leading-tight truncate">
              {nomeExibido}
            </h2>
            {nomeAtelie && nomeAtelie.trim() !== "" && (
              <p style={textoComSombra} className="text-white/80 text-[9px] sm:text-[10px] font-bold truncate">{nome}</p>
            )}
            {(cidade || tagEspecialidade) && (
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                {cidade && (
                  <span style={textoComSombra} className="flex items-center gap-1 text-white/90 text-[9px] sm:text-[10px] font-bold">
                    <MapPin size={10} /> {cidade}
                  </span>
                )}
                {tagEspecialidade && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    {tagEspecialidade}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {bio && (
          <p style={textoComSombra} className="text-white/90 text-[10px] sm:text-xs font-medium leading-snug mt-1.5 line-clamp-2 hidden sm:block">
            {bio}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onCopiarLink}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#5D0599] text-white py-1.5 sm:py-2 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wide active:scale-95 transition-transform shadow-lg"
          >
            <Link2 size={12} /> Copiar Link
          </button>
          <button
            onClick={onVisualizarCatalogo}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#3CB19E] text-white py-1.5 sm:py-2 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wide active:scale-95 transition-transform shadow-lg"
          >
            <Eye size={12} /> Ver Meu Catálogo
          </button>
        </div>
      </div>
    </div>
  );
};