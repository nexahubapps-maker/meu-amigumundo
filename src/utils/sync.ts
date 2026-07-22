"use client";

import { supabase } from "@/lib/supabase";
import {
  getRecipesFromSheet,
  getCategoriesFromSheet,
  getPacksFromSheet,
  getInfoprodutosFromSheet,
  getNotificationsFromSheet,
  getReceitaGratuitaFromSheet
} from "./googleSheetsSource";

export interface SyncResult {
  table: string;
  success: boolean;
  count: number;
  error?: string;
}

export async function syncGoogleSheetsToSupabase(): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  // 1. Categorias
  try {
    const categories = await getCategoriesFromSheet();
    const validCategories = categories.filter(c => c.id && c.titulo);

    const data = validCategories.map(c => ({
      id: c.id,
      titulo: c.titulo,
      imagem_url: c.imagem_url,
      ativo: c.ativo
    }));

    const { error } = await supabase
      .from("categorias")
      .upsert(data, { onConflict: "id" });

    results.push({ table: "categorias", success: !error, count: data.length, error: error?.message });
  } catch (e: any) {
    results.push({ table: "categorias", success: false, count: 0, error: e.message || String(e) });
  }

  // 2. Receitas
  try {
    const recipes = await getRecipesFromSheet();
    const validRecipes = recipes.filter(r => r.id && r.nome);

    const data = validRecipes.map(r => ({
      codigo: r.id,
      nome: r.nome,
      slug: r.slug,
      preco: r.preco,
      imagem_url: r.imagem_url,
      categoria: r.categoria,
      ativo: r.ativo,
      disparar_push: r.disparar_push
    }));

    const { error } = await supabase
      .from("receitas")
      .upsert(data, { onConflict: "codigo" });

    results.push({ table: "receitas", success: !error, count: data.length, error: error?.message });
  } catch (e: any) {
    results.push({ table: "receitas", success: false, count: 0, error: e.message || String(e) });
  }

  // 3. Packs
  try {
    const packs = await getPacksFromSheet();
    const validPacks = packs.filter(p => p.id && p.nome);

    const data = validPacks.map(p => ({
      codigo: p.id,
      nome: p.nome,
      slug: p.slug,
      preco: p.preco,
      imagem_url: p.imagem_url,
      descricao: p.descricao,
      ativo: p.ativo,
      disparar_push: p.disparar_push
    }));

    const { error } = await supabase
      .from("packs")
      .upsert(data, { onConflict: "codigo" });

    results.push({ table: "packs", success: !error, count: data.length, error: error?.message });
  } catch (e: any) {
    results.push({ table: "packs", success: false, count: 0, error: e.message || String(e) });
  }

  // 4. Infoprodutos
  try {
    const infoproducts = await getInfoprodutosFromSheet();
    const validInfos = infoproducts.filter(i => i.id && i.nome);

    const data = validInfos.map(i => ({
      codigo: i.id,
      nome: i.nome,
      slug: i.slug,
      preco: i.preco,
      imagem_url: i.imagem_url,
      descricao: i.descricao,
      ativo: i.ativo,
      disparar_push: i.disparar_push
    }));

    const { error } = await supabase
      .from("infoprodutos")
      .upsert(data, { onConflict: "codigo" });

    results.push({ table: "infoprodutos", success: !error, count: data.length, error: error?.message });
  } catch (e: any) {
    results.push({ table: "infoprodutos", success: false, count: 0, error: e.message || String(e) });
  }

  // 5. Notificações Internas
  try {
    const notifications = await getNotificationsFromSheet();
    const validNotifications = notifications.filter(n => n.id && n.titulo);

    const data = validNotifications.map(n => ({
      id: n.id,
      ativo: n.ativo,
      data_hora: n.data_hora,
      titulo: n.titulo,
      mensagem: n.mensagem,
      imagem_url: n.imagem_url,
      link: n.link,
      disparar_push: n.disparar_push
    }));

    const { error } = await supabase
      .from("notificacoes_internas")
      .upsert(data, { onConflict: "id" });

    results.push({ table: "notificacoes_internas", success: !error, count: data.length, error: error?.message });
  } catch (e: any) {
    results.push({ table: "notificacoes_internas", success: false, count: 0, error: e.message || String(e) });
  }

  // 6. Receitas Gratuitas
  try {
    const freeRecipes = await getReceitaGratuitaFromSheet();
    const validFreeRecipes = freeRecipes.filter(f => f.codigo && f.nome);

    const data = validFreeRecipes.map(f => ({
      codigo: f.codigo,
      data: f.data,
      nome: f.nome,
      imagem_url: f.imagem_url,
      ativo: f.ativo
    }));

    const { error } = await supabase
      .from("receitas_gratuitas")
      .upsert(data, { onConflict: "codigo" });

    results.push({ table: "receitas_gratuitas", success: !error, count: data.length, error: error?.message });
  } catch (e: any) {
    results.push({ table: "receitas_gratuitas", success: false, count: 0, error: e.message || String(e) });
  }

  return results;
}