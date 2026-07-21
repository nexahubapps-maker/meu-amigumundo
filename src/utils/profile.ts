import { supabase } from "@/lib/supabase";

export interface Perfil {
  id: string;
  nome: string | null;
  email: string;
  telefone: string | null;
  foto_url: string | null;
  assinatura_status: string | null;
}

export async function getProfile(userId: string): Promise<Perfil | null> {
  const { data, error } = await supabase
    .from("perfis")
    .select("id, nome, email, telefone, foto_url, assinatura_status")
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