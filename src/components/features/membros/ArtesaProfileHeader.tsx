"use client";
import { User as UserIcon, MapPin } from "lucide-react";

interface ArtesaProfileHeaderProps {
  nome: string;
  fotoUrl?: string | null;
  bio?: string | null;
  cidade?: string | null;
  tagEspecialidade?: string | null;
}

export const ArtesaProfileHeader = ({ nome, fotoUrl, bio, cidade, tagEspecialidade }: ArtesaProfileHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-[#5D0599] to-[#3CB19E] px-4 pt-6 pb-8 rounded-b-[32px]">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 border-4 border-white/40 flex items-center justify-center shrink-0 shadow-lg">
          {fotoUrl ? (
            <img src={fotoUrl} alt={nome} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="text-white" size={40} />
          )}
        </div>
        <h2 className="text-white font-black text-lg uppercase tracking-tight mt-1">{nome}</h2>
        {bio && (
          <p className="text-white/90 text-xs font-medium leading-snug max-w-xs">{bio}</p>
        )}
        <div className="flex items-center gap-2 flex-wrap justify-center mt-1">
          {cidade && (
            <span className="flex items-center gap-1 bg-white/15 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              <MapPin size={10} /> {cidade}
            </span>
          )}
          {tagEspecialidade && (
            <span className="bg-[#F8F6F2] text-[#5D0599] text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              {tagEspecialidade}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};