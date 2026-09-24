"use client";
import { User as UserIcon, MapPin, LogOut } from "lucide-react";

interface ArtesaProfileHeaderProps {
  nome: string;
  nomeAtelie?: string | null;
  fotoUrl?: string | null;
  bio?: string | null;
  cidade?: string | null;
  tagEspecialidade?: string | null;
  capaUrl: string;
  onEditarPerfil?: () => void;
  onSair?: () => void;
}

const textoComSombra = { textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.7)" };

export const ArtesaProfileHeader = ({
  nome,
  nomeAtelie,
  fotoUrl,
  bio,
  cidade,
  tagEspecialidade,
  capaUrl,
  onEditarPerfil,
  onSair,
}: ArtesaProfileHeaderProps) => {
  const nomeExibido = nomeAtelie && nomeAtelie.trim() !== "" ? nomeAtelie : nome;

  return (
    <div className="relative w-full min-h-[130px] sm:min-h-[190px] sm:rounded-2xl overflow-hidden bg-[#171717] shrink-0">
      <img
        src={capaUrl}
        alt="AmiguMundo Premium"
        className="w-full h-auto block"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />

      {(onEditarPerfil || onSair) && (
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {onSair && (
            <button
              onClick={onSair}
              className="flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white px-3 py-2 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wide shadow-lg active:scale-95 transition-transform"
            >
              <LogOut size={14} /> Sair
            </button>
          )}
          {onEditarPerfil && (
            <button
              onClick={onEditarPerfil}
              className="flex items-center gap-1.5 bg-[#5D0599] text-white px-3 py-2 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wide shadow-lg active:scale-95 transition-transform"
            >
              Perfil
            </button>
          )}
        </div>
      )}

      {/* Gradiente inferior só pra garantir legibilidade do avatar/nome por cima da capa */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gradient-to-br from-[#5D0599] to-[#3CB19E] p-[3px] shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              {fotoUrl ? (
                <img src={fotoUrl} alt={nomeExibido} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="text-gray-300" size={36} />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 style={textoComSombra} className="text-white font-black text-lg sm:text-3xl uppercase tracking-tight leading-tight truncate">
              {nomeExibido}
            </h2>
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
          <p style={textoComSombra} className="text-white/90 text-[10px] sm:text-xs font-medium leading-snug mt-1.5 line-clamp-2">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
};