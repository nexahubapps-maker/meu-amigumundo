"use client";

import { supabase } from "@/lib/supabase";

export interface SheetRecipe {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  imagem_url: string;
  categoria: string;
  ativo: boolean;
  disparar_push: boolean;
}

export interface SheetInfoproduto {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  imagem_url: string;
  descricao: string;
  ativo: boolean;
  disparar_push: boolean;
}

export interface SheetPack {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  imagem_url: string;
  descricao: string;
  ativo: boolean;
  disparar_push: boolean;
}

export interface SheetNotification {
  id: string;
  ativo: boolean;
  data_hora: string;
  titulo: string;
  mensagem: string;
  imagem_url: string;
  link: string;
  disparar_push: boolean;
}

export interface SheetReceitaGratuita {
  codigo: string;
  data: string;
  nome: string;
  imagem_url: string;
  ativo: boolean;
}

export interface SheetCategoria {
  id: string;
  titulo: string;
  imagem_url: string;
  ativo: boolean;
}

export const GOOGLE_DRIVE_FOLDER_ID = "1yrrZX5yqhLC8pi4phyOt8fxNzMiG1BoV";
export const GOOGLE_DRIVE_API_KEY = "AIzaSyBJiL8IdTPi25jPZM0P6kl3dDUO8YHvVu4";

let categoriaFolderCache: Record<string, string> | null = null;

async function getCategoriaFolderMap(): Promise<Record<string, string>> {
  if (categoriaFolderCache) return categoriaFolderCache;
  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${GOOGLE_DRIVE_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name)&key=${GOOGLE_DRIVE_API_KEY}&pageSize=100`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json();
    const map: Record<string, string> = {};
    (data.files || []).forEach((f: any) => {
      const match = f.name.match(/^CARD(\d+)/i);
      if (match) {
        const code = `card${match[1].padStart(2, "0")}`;
        map[code.toLowerCase()] = f.id;
      }
    });
    categoriaFolderCache = map;
    return map;
  } catch (e) {
    console.warn("Erro ao mapear pastas de categoria no Drive:", e);
    return {};
  }
}

async function getRecipeCoverFallback(codigo: string, categoria: string): Promise<string | null> {
  try {
    const folderMap = await getCategoriaFolderMap();
    const subfolderId = folderMap[(categoria || "").toLowerCase()];
    if (!subfolderId) return null;

    const url = `https://www.googleapis.com/drive/v3/files?q='${subfolderId}'+in+parents+and+name+contains+'${codigo}'+and+mimeType='application/pdf'+and+trashed=false&fields=files(id,name)&key=${GOOGLE_DRIVE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return `https://drive.google.com/thumbnail?id=${data.files[0].id}&sz=w800`;
    }
    return null;
  } catch (e) {
    console.warn("Erro ao buscar capa fallback no Drive:", e);
    return null;
  }
}

async function resolveImagensReceitas(recipes: SheetRecipe[]): Promise<SheetRecipe[]> {
  return Promise.all(
    recipes.map(async (r) => {
      const semImagem = !r.imagem_url || r.imagem_url.trim() === "-" || r.imagem_url.trim() === "";
      if (!semImagem) return r;
      const fallback = await getRecipeCoverFallback(r.id, r.categoria);
      return fallback ? { ...r, imagem_url: fallback } : r;
    })
  );
}

export async function getRecipes(): Promise<SheetRecipe[]> {
  const { data, error } = await supabase
    .from("receitas")
    .select("codigo, nome, slug, preco, imagem_url, categoria, ativo, disparar_push");

  if (error) {
    console.warn("Erro ao buscar receitas no Supabase:", error);
    return [];
  }

  const mapped = (data || []).map((row) => ({
    id: row.codigo,
    nome: row.nome || "",
    slug: row.slug || "",
    preco: Number(row.preco) || 0,
    imagem_url: row.imagem_url || "",
    categoria: row.categoria || "",
    ativo: !!row.ativo,
    disparar_push: !!row.disparar_push
  }));

  return resolveImagensReceitas(mapped);
}

export async function getInfoprodutos(): Promise<SheetInfoproduto[]> {
  const { data, error } = await supabase
    .from("infoprodutos")
    .select("codigo, nome, slug, preco, imagem_url, descricao, ativo, disparar_push");

  if (error) {
    console.warn("Erro ao buscar infoprodutos no Supabase:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.codigo,
    nome: row.nome || "",
    slug: row.slug || "",
    preco: Number(row.preco) || 0,
    imagem_url: row.imagem_url || "",
    descricao: row.descricao || "",
    ativo: !!row.ativo,
    disparar_push: !!row.disparar_push
  }));
}

export async function getPacks(): Promise<SheetPack[]> {
  const { data, error } = await supabase
    .from("packs")
    .select("codigo, nome, slug, preco, imagem_url, descricao, ativo, disparar_push");

  if (error) {
    console.warn("Erro ao buscar packs no Supabase:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.codigo,
    nome: row.nome || "",
    slug: row.slug || "",
    preco: Number(row.preco) || 0,
    imagem_url: row.imagem_url || "",
    descricao: row.descricao || "",
    ativo: !!row.ativo,
    disparar_push: !!row.disparar_push
  }));
}

export async function getNotifications(): Promise<SheetNotification[]> {
  const { data, error } = await supabase
    .from("notificacoes_internas")
    .select("id, ativo, data_hora, titulo, mensagem, imagem_url, link, disparar_push");

  if (error) {
    console.warn("Erro ao buscar notificações no Supabase:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: String(row.id),
    ativo: !!row.ativo,
    data_hora: row.data_hora || new Date().toISOString(),
    titulo: row.titulo || "",
    mensagem: row.mensagem || "",
    imagem_url: row.imagem_url || "",
    link: row.link || "",
    disparar_push: !!row.disparar_push
  }));
}

export async function getReceitaGratuita(): Promise<SheetReceitaGratuita[]> {
  const { data, error } = await supabase
    .from("receitas_gratuitas")
    .select("codigo, data, nome, imagem_url, ativo");

  if (error) {
    console.warn("Erro ao buscar receitas gratuitas no Supabase:", error);
    return [];
  }

  return (data || []).map((row) => ({
    codigo: row.codigo,
    data: row.data || "",
    nome: row.nome || "",
    imagem_url: row.imagem_url || "",
    ativo: !!row.ativo
  }));
}

export async function getCategories(): Promise<SheetCategoria[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, titulo, imagem_url, ativo");

  if (error) {
    console.warn("Erro ao buscar categorias no Supabase:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    titulo: row.titulo || "",
    imagem_url: row.imagem_url || "",
    ativo: !!row.ativo
  }));
}

export async function getDriveFileUrl(codigo: string, categoria: string): Promise<string | null> {
  try {
    const folderMap = await getCategoriaFolderMap();
    const subfolderId = folderMap[(categoria || "").toLowerCase()];
    if (!subfolderId) return null;

    const url = `https://www.googleapis.com/drive/v3/files?q='${subfolderId}'+in+parents+and+name+contains+'${codigo}'+and+mimeType='application/pdf'+and+trashed=false&fields=files(id,name)&key=${GOOGLE_DRIVE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return `https://drive.google.com/uc?export=download&id=${data.files[0].id}`;
    }
    return null;
  } catch (e) {
    console.warn("Erro ao buscar arquivo no Google Drive:", e);
    return null;
  }
}

export async function getRecipesByCategoria(categoriaId: string): Promise<SheetRecipe[]> {
  const { data, error } = await supabase
    .from("receitas")
    .select("codigo, nome, slug, preco, imagem_url, categoria, ativo, disparar_push")
    .eq("categoria", categoriaId)
    .eq("ativo", true);

  if (error) {
    console.warn("Erro ao buscar receitas por categoria no Supabase:", error);
    return [];
  }

  const mapped = (data || []).map((row) => ({
    id: row.codigo,
    nome: row.nome || "",
    slug: row.slug || "",
    preco: Number(row.preco) || 0,
    imagem_url: row.imagem_url || "",
    categoria: row.categoria || "",
    ativo: !!row.ativo,
    disparar_push: !!row.disparar_push
  }));

  return resolveImagensReceitas(mapped);
}

export async function getRecipesByIds(ids: string[]): Promise<SheetRecipe[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("receitas")
    .select("codigo, nome, slug, preco, imagem_url, categoria, ativo, disparar_push")
    .in("codigo", ids);

  if (error) {
    console.warn("Erro ao buscar receitas por IDs no Supabase:", error);
    return [];
  }

  const mapped = (data || []).map((row) => ({
    id: row.codigo,
    nome: row.nome || "",
    slug: row.slug || "",
    preco: Number(row.preco) || 0,
    imagem_url: row.imagem_url || "",
    categoria: row.categoria || "",
    ativo: !!row.ativo,
    disparar_push: !!row.disparar_push
  }));

  return resolveImagensReceitas(mapped);
}

export async function getPacksByIds(ids: string[]): Promise<SheetPack[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("packs")
    .select("codigo, nome, slug, preco, imagem_url, descricao, ativo, disparar_push")
    .in("codigo", ids);

  if (error) {
    console.warn("Erro ao buscar packs por IDs no Supabase:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.codigo,
    nome: row.nome || "",
    slug: row.slug || "",
    preco: Number(row.preco) || 0,
    imagem_url: row.imagem_url || "",
    descricao: row.descricao || "",
    ativo: !!row.ativo,
    disparar_push: !!row.disparar_push
  }));
}

export async function getInfoprodutosByIds(ids: string[]): Promise<SheetInfoproduto[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("infoprodutos")
    .select("codigo, nome, slug, preco, imagem_url, descricao, ativo, disparar_push")
    .in("codigo", ids);

  if (error) {
    console.warn("Erro ao buscar infoprodutos por IDs no Supabase:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.codigo,
    nome: row.nome || "",
    slug: row.slug || "",
    preco: Number(row.preco) || 0,
    imagem_url: row.imagem_url || "",
    descricao: row.descricao || "",
    ativo: !!row.ativo,
    disparar_push: !!row.disparar_push
  }));
}

export async function getPushEnabledItems(): Promise<Array<{ id: string; nome: string; descricao: string; tipo: "receita" | "pack" | "infoproduto" }>> {
  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("receitas")
        .select("codigo, nome, ativo, disparar_push")
        .eq("disparar_push", true)
        .eq("ativo", true);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.codigo,
        nome: row.nome || "",
        descricao: "",
        tipo: "receita" as const
      }));
    } catch (e) {
      console.warn("Erro ao buscar receitas com push habilitado:", e);
      return [];
    }
  };

  const fetchPacks = async () => {
    try {
      const { data, error } = await supabase
        .from("packs")
        .select("codigo, nome, descricao, ativo, disparar_push")
        .eq("disparar_push", true)
        .eq("ativo", true);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.codigo,
        nome: row.nome || "",
        descricao: row.descricao || "",
        tipo: "pack" as const
      }));
    } catch (e) {
      console.warn("Erro ao buscar packs com push habilitado:", e);
      return [];
    }
  };

  const fetchInfoprodutos = async () => {
    try {
      const { data, error } = await supabase
        .from("infoprodutos")
        .select("codigo, nome, descricao, ativo, disparar_push")
        .eq("disparar_push", true)
        .eq("ativo", true);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.codigo,
        nome: row.nome || "",
        descricao: row.descricao || "",
        tipo: "infoproduto" as const
      }));
    } catch (e) {
      console.warn("Erro ao buscar infoprodutos com push habilitado:", e);
      return [];
    }
  };

  const [recipes, packs, infoprodutos] = await Promise.all([
    fetchRecipes(),
    fetchPacks(),
    fetchInfoprodutos()
  ]);

  return [...recipes, ...packs, ...infoprodutos];
}

export async function searchRecipes(termo: string): Promise<SheetRecipe[]> {
  const query = termo.trim();
  if (query.length === 0) return [];

  const { data, error } = await supabase.rpc("buscar_receitas", { termo: query });

  if (error) {
    console.warn("Erro ao buscar receitas:", error);
    return [];
  }

  const mapped = (data || []).map((row: any) => ({
    id: row.codigo,
    nome: row.nome || "",
    slug: row.slug || "",
    preco: Number(row.preco) || 0,
    imagem_url: row.imagem_url || "",
    categoria: row.categoria || "",
    ativo: !!row.ativo,
    disparar_push: !!row.disparar_push,
  }));

  return resolveImagensReceitas(mapped);
}