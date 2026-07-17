"use client";

import { supabase } from "@/lib/supabase";
import { 
  getRecipes, 
  getCategories, 
  getPacks, 
  getInfoprodutos, 
  getNotifications, 
  getReceitaGratuita 
} from "./sheets";

export interface SyncResult {
  table: string;
  success: boolean;
  count: number;
  error?: string;
}

export async function syncGoogleSheetsToSupabase(): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  // 1. Sincronizar Categorias
  try {
    const categories = await getCategories();
    const validCategories = categories.filter(c => c.id && c.titulo);
    
    const data = validCategories.map(c => ({
      id: c.id,
      titulo: c.titulo,
      imagem: c.imagem, // Se no banco for imagem_url, mude para imagem_url: c.imagem
      status: c.status // Enviando como boolean puro (true/false)
    }));

    const { error } = await supabase
      .from("categorias")
      .upsert(data, { onConflict: "id" });

    results.push({
      table: "categorias",
      success: !error,
      count: data.length,
      error: error ? error.message : undefined
    });
  } catch (e: any) {
    results.push({ table: "categorias", success: false, count: 0, error: e.message || String(e) });
  }

  // 2. Sincronizar Receitas
  try {
    const recipes = await getRecipes();
    const validRecipes = recipes.filter(r => r.id && r.nome);

    const data = validRecipes.map(r => ({
      id: r.id,
      nome: r.nome,
      slug: r.slug,
      preco: r.preco,
      imagem_url: r.url_foto, // Corrigido para imagem_url conforme solicitado
      categoria: r.categoria,
      ativo: r.ativo,
      disparar_push: r.disparar_push
    }));

    const { error } = await supabase
      .from("receitas")
      .upsert(data, { onConflict: "id" });

    results.push({
      table: "receitas",
      success: !error,
      count: data.length,
      error: error ? error.message : undefined
    });
  } catch (e: any) {
    results.push({ table: "receitas", success: false, count: 0, error: e.message || String(e) });
  }

  // 3. Sincronizar Packs
  try {
    const packs = await getPacks();
    const validPacks = packs.filter(p => p.id && p.nome);

    const data = validPacks.map(p => ({
      id: p.id,
      nome: p.nome,
      slug: p.slug,
      preco: p.preco,
      url_foto: p.url_foto,
      descricao: p.descricao,
      ativo: p.ativo,
      disparar_push: p.disparar_push
    }));

    const { error } = await supabase
      .from("packs")
      .upsert(data, { onConflict: "id" });

    results.push({
      table: "packs",
      success: !error,
      count: data.length,
      error: error ? error.message : undefined
    });
  } catch (e: any) {
    results.push({ table: "packs", success: false, count: 0, error: e.message || String(e) });
  }

  // 4. Sincronizar Infoprodutos
  try {
    const infoproducts = await getInfoprodutos();
    const validInfos = infoproducts.filter(i => i.id && i.nome);

    const data = validInfos.map(i => ({
      id: i.id,
      nome: i.nome,
      slug: i.slug,
      preco: i.preco,
      url_foto: i.url_foto,
      descricao: i.descricao,
      ativo: i.ativo,
      disparar_push: i.disparar_push
    }));

    const { error } = await supabase
      .from("infoprodutos")
      .upsert(data, { onConflict: "id" });

    results.push({
      table: "infoprodutos",
      success: !error,
      count: data.length,
      error: error ? error.message : undefined
    });
  } catch (e: any) {
    results.push({ table: "infoprodutos", success: false, count: 0, error: e.message || String(e) });
  }

  // 5. Sincronizar Notificações Internas
  try {
    const notifications = await getNotifications();
    const validNotifications = notifications.filter(n => n.id && n.titulo);

    const data = validNotifications.map(n => ({
      id: n.id,
      status: n.status,
      data_hora: n.data_hora,
      titulo: n.titulo,
      mensagem: n.mensagem,
      url_foto: n.url_foto,
      link: n.link
    }));

    const { error } = await supabase
      .from("notificacoes_internas")
      .upsert(data, { onConflict: "id" });

    results.push({
      table: "notificacoes_internas",
      success: !error,
      count: data.length,
      error: error ? error.message : undefined
    });
  } catch (e: any) {
    results.push({ table: "notificacoes_internas", success: false, count: 0, error: e.message || String(e) });
  }

  // 6. Sincronizar Receitas Gratuitas
  try {
    const freeRecipes = await getReceitaGratuita();
    const validFreeRecipes = freeRecipes.filter(f => f.codigo && f.nome);

    const data = validFreeRecipes.map(f => ({
      codigo: f.codigo,
      data: f.data,
      nome: f.nome,
      url_foto: f.url_foto,
      ativo: f.ativo
    }));

    const { error } = await supabase
      .from("receitas_gratuitas")
      .upsert(data, { onConflict: "codigo" });

    results.push({
      table: "receitas_gratuitas",
      success: !error,
      count: data.length,
      error: error ? error.message : undefined
    });
  } catch (e: any) {
    results.push({ table: "receitas_gratuitas", success: false, count: 0, error: e.message || String(e) });
  }

  return results;
}