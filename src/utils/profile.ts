import { supabase } from "@/lib/supabase";

export interface Perfil {
  id: string;
  nome: string | null;
  email: string;
  telefone: string | null;
  foto_url: string | null;
  assinatura_status: string | null;
  bio: string | null;
  cidade: string | null;
  tag_especialidade: string | null;
}

export async function getProfile(userId: string): Promise<Perfil | null> {
  const { data, error } = await supabase
    .from("perfis")
    .select("id, nome, email, telefone, foto_url, assinatura_status, bio, cidade, tag_especialidade")
    .eq("id", userId)
    .single();

  if (error) {
    console.warn("Erro ao buscar perfil:", error);
    return null;
  }

  return data;
}

export async function updatePhoneNumber(userId: string, telefone: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("perfis")
    .update({ telefone, atualizado_em: new Date().toISOString() })
    .eq("id", userId);

  return { error: error ? error.message : null };
}

export async function uploadFotoPerfil(
  userId: string,
  blob: Blob,
  fotoAntigaUrl?: string | null
): Promise<string | null> {
  try {
    if (fotoAntigaUrl) {
      const partes = fotoAntigaUrl.split("/fotos-perfil/");
      if (partes[1]) {
        await supabase.storage.from("fotos-perfil").remove([partes[1]]);
      }
    }

    const fileName = `${userId}-${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from("fotos-perfil")
      .upload(fileName, blob, { contentType: "image/jpeg", upsert: true });

    if (error) {
      console.warn("Erro ao subir foto de perfil:", error);
      return null;
    }

    const { data } = supabase.storage.from("fotos-perfil").getPublicUrl(fileName);
    return data.publicUrl;
  } catch (e) {
    console.warn("Erro inesperado ao subir foto:", e);
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: { telefone?: string; nome?: string; foto_url?: string; bio?: string; cidade?: string; tag_especialidade?: string }
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("perfis")
    .update({ ...updates, atualizado_em: new Date().toISOString() })
    .eq("id", userId);

  return { error: error ? error.message : null };
}

export function getWhatsappLink(telefone: string | null | undefined): string | null {
  if (!telefone) return null;
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length < 10) return null;
  const comCodigoPais = digitos.startsWith("55") ? digitos : `55${digitos}`;
  return `https://wa.me/${comCodigoPais}`;
}