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

/**
 * Helper to safely upsert data to Supabase, trying alternative table names and column mappings
 * if the primary attempt fails (e.g., due to English vs Portuguese naming).
 */
async function safeUpsert(
  primaryTable: string,
  alternativeTable: string,
  dataPortuguese: any[],
  dataEnglish: any[],
  conflictColumn: string = "id"
): Promise<{ success: boolean; count: number; error?: string; usedTable: string }> {
  // Try Portuguese table first
  try {
    const { data, error } = await supabase
      .from(primaryTable)
      .upsert(dataPortuguese, { onConflict: conflictColumn });

    if (!error) {
      return { success: true, count: dataPortuguese.length, usedTable: primaryTable };
    }
    
    console.warn(`Failed upsert to ${primaryTable}, trying alternative...`, error);
  } catch (e) {
    console.warn(`Exception during upsert to ${primaryTable}:`, e);
  }

  // Try English table/columns alternative
  try {
    const { data, error } = await supabase
      .from(alternativeTable)
      .upsert(dataEnglish, { onConflict: conflictColumn });

    if (!error) {
      return { success: true, count: dataEnglish.length, usedTable: alternativeTable };
    }
    
    return { 
      success: false, 
      count: 0, 
      error: error.message || JSON.stringify(error), 
      usedTable: alternativeTable 
    };
  } catch (e: any) {
    return { 
      success: false, 
      count: 0, 
      error: e.message || String(e), 
      usedTable: alternativeTable 
    };
  }
}

export async function syncGoogleSheetsToSupabase(): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  // 1. Sync Categories
  try {
    const categories = await getCategories();
    const validCategories = categories.filter(c => c.id && c.titulo);
    
    const ptData = validCategories.map(c => ({
      id: c.id,
      titulo: c.titulo,
      imagem: c.imagem,
      status: c.status ? "ativo" : "inativo"
    }));

    const enData = validCategories.map(c => ({
      id: c.id,
      title: c.titulo,
      image: c.imagem,
      status: c.status ? "active" : "inactive"
    }));

    const res = await safeUpsert("categorias", "categories", ptData, enData);
    results.push({
      table: `Categorias (${res.usedTable})`,
      success: res.success,
      count: res.count,
      error: res.error
    });
  } catch (e: any) {
    results.push({ table: "Categorias", success: false, count: 0, error: e.message || String(e) });
  }

  // 2. Sync Recipes
  try {
    const recipes = await getRecipes();
    const validRecipes = recipes.filter(r => r.id && r.nome);

    const ptData = validRecipes.map(r => ({
      id: r.id,
      nome: r.nome,
      slug: r.slug,
      preco: r.preco,
      url_foto: r.url_foto,
      categoria: r.categoria,
      ativo: r.ativo,
      disparar_push: r.disparar_push
    }));

    const enData = validRecipes.map(r => ({
      id: r.id,
      name: r.nome,
      slug: r.slug,
      price: r.preco,
      image_url: r.url_foto,
      category: r.categoria,
      active: r.ativo,
      trigger_push: r.disparar_push
    }));

    const res = await safeUpsert("receitas", "recipes", ptData, enData);
    results.push({
      table: `Receitas (${res.usedTable})`,
      success: res.success,
      count: res.count,
      error: res.error
    });
  } catch (e: any) {
    results.push({ table: "Receitas", success: false, count: 0, error: e.message || String(e) });
  }

  // 3. Sync Packs
  try {
    const packs = await getPacks();
    const validPacks = packs.filter(p => p.id && p.nome);

    const ptData = validPacks.map(p => ({
      id: p.id,
      nome: p.nome,
      slug: p.slug,
      preco: p.preco,
      url_foto: p.url_foto,
      descricao: p.descricao,
      ativo: p.ativo,
      disparar_push: p.disparar_push
    }));

    const enData = validPacks.map(p => ({
      id: p.id,
      name: p.nome,
      slug: p.slug,
      price: p.preco,
      image_url: p.url_foto,
      description: p.descricao,
      active: p.ativo,
      trigger_push: p.disparar_push
    }));

    const res = await safeUpsert("packs", "packs", ptData, enData);
    results.push({
      table: `Packs (${res.usedTable})`,
      success: res.success,
      count: res.count,
      error: res.error
    });
  } catch (e: any) {
    results.push({ table: "Packs", success: false, count: 0, error: e.message || String(e) });
  }

  // 4. Sync Infoproducts
  try {
    const infoproducts = await getInfoprodutos();
    const validInfos = infoproducts.filter(i => i.id && i.nome);

    const ptData = validInfos.map(i => ({
      id: i.id,
      nome: i.nome,
      slug: i.slug,
      preco: i.preco,
      url_foto: i.url_foto,
      descricao: i.descricao,
      ativo: i.ativo,
      disparar_push: i.disparar_push
    }));

    const enData = validInfos.map(i => ({
      id: i.id,
      name: i.nome,
      slug: i.slug,
      price: i.preco,
      image_url: i.url_foto,
      description: i.descricao,
      active: i.ativo,
      trigger_push: i.disparar_push
    }));

    const res = await safeUpsert("infoprodutos", "infoproducts", ptData, enData);
    results.push({
      table: `Infoprodutos (${res.usedTable})`,
      success: res.success,
      count: res.count,
      error: res.error
    });
  } catch (e: any) {
    results.push({ table: "Infoprodutos", success: false, count: 0, error: e.message || String(e) });
  }

  // 5. Sync Notifications
  try {
    const notifications = await getNotifications();
    const validNotifications = notifications.filter(n => n.id && n.titulo);

    const ptData = validNotifications.map(n => ({
      id: n.id,
      status: n.status,
      data_hora: n.data_hora,
      titulo: n.titulo,
      mensagem: n.mensagem,
      url_foto: n.url_foto,
      link: n.link
    }));

    const enData = validNotifications.map(n => ({
      id: n.id,
      status: n.status,
      date_time: n.data_hora,
      title: n.titulo,
      message: n.mensagem,
      image_url: n.url_foto,
      link: n.link
    }));

    const res = await safeUpsert("notificacoes_internas", "internal_notifications", ptData, enData);
    results.push({
      table: `Notificações (${res.usedTable})`,
      success: res.success,
      count: res.count,
      error: res.error
    });
  } catch (e: any) {
    results.push({ table: "Notificações", success: false, count: 0, error: e.message || String(e) });
  }

  // 6. Sync Free Recipes
  try {
    const freeRecipes = await getReceitaGratuita();
    const validFreeRecipes = freeRecipes.filter(f => f.codigo && f.nome);

    const ptData = validFreeRecipes.map(f => ({
      codigo: f.codigo,
      data: f.data,
      nome: f.nome,
      url_foto: f.url_foto,
      ativo: f.ativo
    }));

    const enData = validFreeRecipes.map(f => ({
      code: f.codigo,
      date: f.data,
      name: f.nome,
      image_url: f.url_foto,
      active: f.ativo
    }));

    const res = await safeUpsert("receitas_gratuitas", "free_recipes", ptData, enData, "codigo");
    results.push({
      table: `Receitas Gratuitas (${res.usedTable})`,
      success: res.success,
      count: res.count,
      error: res.error
    });
  } catch (e: any) {
    results.push({ table: "Receitas Gratuitas", success: false, count: 0, error: e.message || String(e) });
  }

  return results;
}