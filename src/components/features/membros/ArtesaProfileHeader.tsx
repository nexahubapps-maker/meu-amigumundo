"use client";
import { User as UserIcon, MapPin, Link2, Eye } from "lucide-react";

interface ArtesaProfileHeaderProps {
  nome: string;
  nomeAtelie?: string | null;
  fotoUrl?: string | null;
  bio?: string | null;
  cidade?: string | null;
  tagEspecialidade?: string | null;
  onCopiarLink?: () => void;
  onVisualizarCatalogo?: () => void;
}

export const ArtesaProfileHeader = ({
  nome,
  nomeAtelie,
  fotoUrl,
  bio,
  cidade,
  tagEspecialidade,
  onCopiarLink,
  onVisualizarCatalogo
}: ArtesaProfileHeaderProps) => {
  const nomeExibido = nomeAtelie && nomeAtelie.trim() !== "" ? nomeAtelie : nome;

  return (
    <div className="bg-white px-4 pt-5 pb-3">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#5D0599] to-[#3CB19E] p-[3px] shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
            {fotoUrl ? (
              <img src={fotoUrl} alt={nomeExibido} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="text-gray-300" size={32} />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-gray-900 font-black text-base uppercase tracking-tight leading-tight truncate">
            {nomeExibido}
          </h2>
          {nomeAtelie && nomeAtelie.trim() !== "" && (
            <p className="text-gray-400 text-[10px] font-bold">{nome}</p>
          )}
        </div>
      </div>

      {(bio || cidade || tagEspecialidade) && (
        <div className="mt-3 space-y-1">
          {bio && <p className="text-gray-700 text-xs font-medium leading-snug">{bio}</p>}
          <div className="flex items-center gap-2 flex-wrap">
            {cidade && (
              <span className="flex items-center gap-1 text-gray-500 text-[10px] font-bold">
                <MapPin size={11} /> {cidade}
              </span>
            )}
            {tagEspecialidade && (
              <span className="bg-[#5D0599]/10 text-[#5D0599] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {tagEspecialidade}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={onCopiarLink}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#5D0599] text-white py-2 rounded-xl font-black text-[11px] uppercase tracking-wide active:scale-95 transition-transform"
        >
          <Link2 size={13} /> Copiar Link
        </button>
        <button
          onClick={onVisualizarCatalogo}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#3CB19E] text-white py-2 rounded-xl font-black text-[11px] uppercase tracking-wide active:scale-95 transition-transform"
        >
          <Eye size={13} /> Ver Meu Catálogo
        </button>
      </div>
    </div>
  );
};