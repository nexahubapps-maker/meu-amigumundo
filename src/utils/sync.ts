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

function normalizarDataHora(valor: string): string {
  if (!valor) return valor;
  const formatoBrasileiro = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(:(\d{2}))?/);
  if (formatoBrasileiro) {
    const [, dia, mes, ano, hora, minuto, , segundo] = formatoBrasileiro;
    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo || "00"}-03:00`;
  }
  const formatoISO = valor.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(:(\d{2}))?/);
  if (formatoISO) {
    const [, ano, mes, dia, hora, minuto, , segundo] = formatoISO;
    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo || "00"}-03:00`;
  }
  return valor;
}

async function removerAusentes(tabela: string, coluna: string, idsValidos: (string | number)[]) {
  if (idsValidos.length === 0) return;
  const lista = idsValidos.map(id => `"${id}"`).join(",");
  const { error } = await supabase.from(tabela).delete().not(coluna, "in", `(${lista})`);
  if (error) console.error(`Erro ao remover itens ausentes de ${tabela}:`, error);
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

    const { error } = await supabase.from("categorias").upsert(data, { onConflict: "id" });
    if (!error) await removerAusentes("categorias", "id", validCategories.map(c => c.id));

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

    const { error } = await supabase.from("receitas").upsert(data, { onConflict: "codigo" });
    if (!error) await removerAusentes("receitas", "codigo", validRecipes.map(r => r.id));

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
      disparar_push: p.disparar_push,
      link_entrega: p.link_entrega,
      receitas_incluidas: p.receitas_incluidas
    }));

    const { error } = await supabase.from("packs").upsert(data, { onConflict: "codigo" });
    if (!error) await removerAusentes("packs", "codigo", validPacks.map(p => p.id));

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
      disparar_push: i.disparar_push,
      link_entrega: i.link_entrega,
      bump_ativo: i.bump_ativo
    }));

    const { error } = await supabase.from("infoprodutos").upsert(data, { onConflict: "codigo" });
    if (!error) await removerAusentes("infoprodutos", "codigo", validInfos.map(i => i.id));

    results.push({ table: "infoprodutos", success: !error, count: data.length, error: error?.message });
  } catch (e: any) {
    results.push({ table: "infoprodutos", success: false, count: 0, error: e.message || String(e) });
  }

  // 5. Notificações Internas
  try {
    const notifications = await getNotificationsFromSheet();
    const validNotifications = notifications.filter(n => n.id && n.titulo);

    const { data: dbNotifs } = await supabase
      .from("notificacoes_internas")
      .select("id, data_hora, push_enviado_em");

    const mapaAtuais = new Map<string, { data_hora: string; push_enviado_em: string | null }>();
    (dbNotifs || []).forEach((row: any) => {
      mapaAtuais.set(String(row.id), {
        data_hora: row.data_hora,
        push_enviado_em: row.push_enviado_em,
      });
    });

    const data = validNotifications.map(n => {
      const dataHoraNormalizada = normalizarDataHora(n.data_hora);
      const atual = mapaAtuais.get(String(n.id));

      const item: any = {
        id: n.id,
        ativo: n.ativo,
        data_hora: dataHoraNormalizada,
        titulo: n.titulo,
        mensagem: n.mensagem,
        imagem_url: n.imagem_url,
        link: n.link,
        disparar_push: n.disparar_push
      };

      if (atual && atual.push_enviado_em !== null) {
        const timeNovo = new Date(dataHoraNormalizada).getTime();
        const timeAtual = new Date(atual.data_hora).getTime();
        if (!isNaN(timeNovo) && !isNaN(timeAtual) && timeNovo !== timeAtual) {
          item.push_enviado_em = null;
        }
      }

      return item;
    });

    const { error } = await supabase.from("notificacoes_internas").upsert(data, { onConflict: "id" });
    if (!error) await removerAusentes("notificacoes_internas", "id", validNotifications.map(n => n.id));

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

    const { error } = await supabase.from("receitas_gratuitas").upsert(data, { onConflict: "codigo" });
    if (!error) await removerAusentes("receitas_gratuitas", "codigo", validFreeRecipes.map(f => f.codigo));

    results.push({ table: "receitas_gratuitas", success: !error, count: data.length, error: error?.message });
  } catch (e: any) {
    results.push({ table: "receitas_gratuitas", success: false, count: 0, error: e.message || String(e) });
  }

  return results;
}