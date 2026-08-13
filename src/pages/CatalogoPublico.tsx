"use client";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User as UserIcon, MapPin, Search, ZoomIn, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getWhatsappLink } from "@/utils/profile";
import { LightboxModal } from "@/components/features/catalog/LightboxModal";

export default function CatalogoPublico() {
  const { userId } = useParams();
  const [perfil, setPerfil] = useState<any | null>(null);
  const [itens, setItens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    const carregar = async () => {
      if (!userId) return;
      setIsLoading(true);
      const [{ data: perfilData }, { data: itensData }] = await Promise.all([
        supabase.from("catalogo_publico_perfil").select("*").eq("usuario_id", userId).single(),
        supabase.from("catalogo_publico_itens").select("*").eq("usuario_id", userId),
      ]);
      setPerfil(perfilData || null);
      setItens(itensData || []);
      setIsLoading(false);
    };
    carregar();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8F6F2]">
        <Loader2 size={32} className="animate-spin text-[#5D0599]" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Carregando catálogo...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8F6F2] px-4 text-center">
        <p className="text-gray-700 font-black text-sm uppercase">Catálogo não encontrado.</p>
      </div>
    );
  }

  const nomeExibido = perfil.nome_atelie && perfil.nome_atelie.trim() !== "" ? perfil.nome_atelie : perfil.nome;
  const linkWhats = getWhatsappLink(perfil.telefone);

  const categorias = Array.from(new Set(itens.map((i) => i.categoria).filter(Boolean)));

  const itensFiltrados = itens.filter((i) => {
    const bateBusca = !busca || i.nome_produto.toLowerCase().includes(busca.toLowerCase());
    const bateCategoria = !categoriaAtiva || i.categoria === categoriaAtiva;
    return bateBusca && bateCategoria;
  });

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="bg-white px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#5D0599] to-[#3CB19E] p-[3px] shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              {perfil.foto_url ? (
                <img src={perfil.foto_url} alt={nomeExibido} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="text-gray-300" size={32} />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-gray-900 font-black text-lg uppercase tracking-tight leading-tight truncate">
              {nomeExibido}
            </h1>
          </div>
        </div>

        {(perfil.bio || perfil.cidade || perfil.tag_especialidade) && (
          <div className="mt-3 space-y-1">
            {perfil.bio && <p className="text-gray-700 text-xs font-medium leading-snug">{perfil.bio}</p>}
            <div className="flex items-center gap-2 flex-wrap">
              {perfil.cidade && (
                <span className="flex items-center gap-1 text-gray-500 text-[10px] font-bold">
                  <MapPin size={11} /> {perfil.cidade}
                </span>
              )}
              {perfil.tag_especialidade && (
                <span className="bg-[#5D0599]/10 text-[#5D0599] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  {perfil.tag_especialidade}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="sticky top-0 z-10 bg-[#F8F6F2] px-4 py-2.5 border-b border-gray-200/60 space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar pelo nome da receita..."
            className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold focus:outline-none focus:border-[#5D0599]"
          />
        </div>
        {linkWhats && (
          <a
            href={linkWhats}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#3CB19E] text-white py-2.5 rounded-full font-black text-xs uppercase tracking-wider active:scale-95 transition-transform"
          >
            Falar com a Artesã
          </a>
        )}
      </div>

      {categorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-2.5" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setCategoriaAtiva(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide ${!categoriaAtiva ? "bg-[#5D0599] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide ${categoriaAtiva === cat ? "bg-[#5D0599] text-white" : "bg-white text-gray-500 border border-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="px-4">
        <div className="bg-white border border-gray-100 rounded-xl p-2.5 mb-3 flex items-center gap-2">
          <ZoomIn size={14} className="text-gray-400 shrink-0" />
          <p className="text-[10px] text-gray-500 font-bold leading-snug">
            Anote os códigos dos amigurumis que quiser e faça seu pedido pelo WhatsApp. Clique nas imagens para ampliá-las.
          </p>
        </div>
      </div>

      {itensFiltrados.length === 0 ? (
        <div className="text-center py-16 px-4">
          <p className="text-gray-500 font-black text-sm uppercase tracking-tight">
            Em breve, novidades chegando por aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2 px-4 pb-8">
          {itensFiltrados.map((item) => (
            <div key={item.codigo_produto} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-1">
              <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg">
                <img
                  src={item.imagem_url}
                  alt={item.nome_produto}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setZoomImage(item.imagem_url)}
                />
              </div>
              <div className="pt-1.5">
                <h4 className="text-[9px] lg:text-xs font-black text-gray-800 uppercase tracking-tight leading-tight">
                  {item.nome_produto}
                </h4>
                <span className="text-[8px] lg:text-[10px] text-gray-400 font-bold">
                  ({item.codigo_produto})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {zoomImage && <LightboxModal imageUrl={zoomImage} onClose={() => setZoomImage(null)} />}
    </div>
  );
}