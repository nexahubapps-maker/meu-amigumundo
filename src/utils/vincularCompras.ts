import { supabase } from "@/lib/supabase";

export async function vincularComprasAntigas(userId: string, email: string): Promise<void> {
  try {
    await supabase
      .from("pedidos")
      .update({ usuario_id: userId })
      .eq("email_comprador", email)
      .is("usuario_id", null);
  } catch (error) {
    console.warn("Erro ao vincular compras antigas:", error);
  }
}