"use client";

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
  url_foto: string;
  descricao: string;
  ativo: boolean;
  disparar_push: boolean;
}

export interface SheetPack {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  url_foto: string;
  descricao: string;
  ativo: boolean;
  disparar_push: boolean;
}

export interface SheetNotification {
  id: string;
  status: boolean;
  data_hora: string;
  titulo: string;
  mensagem: string;
  url_foto: string;
  link: string;
}

export interface SheetReceitaGratuita {
  codigo: string;
  data: string;
  nome: string;
  url_foto: string;
  ativo: boolean;
}

export interface SheetCategoria {
  id: string;
  titulo: string;
  imagem: string;
  status: boolean;
}

// Nova Planilha Mestre Oficial "AMIGUMUNDO APP"
const SPREADSHEET_ID = "1RUrFeuyLIqxf7vK9Vypo7XzcigV6v4koHg1v0fmjR8k";

// Configurações do Google Drive para busca dinâmica de PDFs por código
export const GOOGLE_DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID";
export const GOOGLE_DRIVE_API_KEY = "YOUR_GOOGLE_DRIVE_API_KEY"; // Opcional

// Helper to parse CSV rows safely
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let current = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(current.trim());
      lines.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    lines.push(row);
  }
  return lines;
}

export async function fetchSheetData<T>(sheetName: string, mapper: (row: string[]) => T, fallbackData: T[]): Promise<T[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch sheet ${sheetName}`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    if (rows.length <= 1) return fallbackData; // Only header or empty
    
    // Skip header row
    return rows.slice(1).map(mapper).filter(Boolean) as T[];
  } catch (error) {
    console.warn(`Error fetching sheet ${sheetName}, using fallback data:`, error);
    return fallbackData;
  }
}

// Fallback Mock Data matching the exact requested structure (empty arrays as requested)
const fallbackRecipes: SheetRecipe[] = [];
const fallbackInfoprodutos: SheetInfoproduto[] = [];
const fallbackPacks: SheetPack[] = [];
const fallbackNotifications: SheetNotification[] = [];
const fallbackReceitaGratuita: SheetReceitaGratuita[] = [];
const fallbackCategorias: SheetCategoria[] = [];

// Fetchers
export async function getRecipes(): Promise<SheetRecipe[]> {
  return fetchSheetData<SheetRecipe>(
    "receitas",
    (row) => ({
      id: row[0] || "",
      nome: row[1] || "",
      slug: row[2] || "",
      preco: parseFloat(row[3]) || 0,
      imagem_url: row[4] || "",
      categoria: row[5] || "",
      ativo: row[6]?.toLowerCase() === "true",
      disparar_push: row[7]?.toLowerCase() === "true"
    }),
    fallbackRecipes
  );
}

export async function getInfoprodutos(): Promise<SheetInfoproduto[]> {
  return fetchSheetData<SheetInfoproduto>(
    "infoprodutos",
    (row) => ({
      id: row[0] || "",
      nome: row[1] || "",
      slug: row[2] || "",
      preco: parseFloat(row[3]) || 0,
      url_foto: row[4] || "",
      descricao: row[5] || "",
      ativo: row[6]?.toLowerCase() === "true",
      disparar_push: row[7]?.toLowerCase() === "true"
    }),
    fallbackInfoprodutos
  );
}

export async function getPacks(): Promise<SheetPack[]> {
  return fetchSheetData<SheetPack>(
    "packs",
    (row) => ({
      id: row[0] || "",
      nome: row[1] || "",
      slug: row[2] || "",
      preco: parseFloat(row[3]) || 0,
      url_foto: row[4] || "",
      descricao: row[5] || "",
      ativo: row[6]?.toLowerCase() === "true",
      disparar_push: row[7]?.toLowerCase() === "true"
    }),
    fallbackPacks
  );
}

export async function getNotifications(): Promise<SheetNotification[]> {
  return fetchSheetData<SheetNotification>(
    "notificacoes_internas",
    (row) => ({
      id: row[0] || "",
      status: row[1]?.toLowerCase() === "true",
      data_hora: row[2] || new Date().toISOString(),
      titulo: row[3] || "",
      mensagem: row[4] || "",
      url_foto: row[5] || "",
      link: row[6] || ""
    }),
    fallbackNotifications
  );
}

export async function getReceitaGratuita(): Promise<SheetReceitaGratuita[]> {
  return fetchSheetData<SheetReceitaGratuita>(
    "receitas_gratuitas",
    (row) => ({
      codigo: row[0] || "",
      data: row[1] || "",
      nome: row[2] || "",
      url_foto: row[3] || "",
      ativo: row[4]?.toLowerCase() === "true"
    }),
    fallbackReceitaGratuita
  );
}

export async function getCategories(): Promise<SheetCategoria[]> {
  return fetchSheetData<SheetCategoria>(
    "categorias",
    (row) => ({
      id: row[0] || "",
      titulo: row[1] || "",
      imagem: row[2] || "",
      status: row[3]?.toLowerCase() === "ativo"
    }),
    fallbackCategorias
  );
}

/**
 * Busca dinamicamente o arquivo PDF correspondente ao código no Google Drive.
 * Se o GOOGLE_DRIVE_FOLDER_ID estiver configurado, consulta a API do Google Drive.
 * Caso contrário, retorna um link de download direto estruturado.
 */
export async function getDriveFileUrl(codigo: string): Promise<string> {
  try {
    if (GOOGLE_DRIVE_FOLDER_ID && GOOGLE_DRIVE_FOLDER_ID !== "YOUR_GOOGLE_DRIVE_FOLDER_ID") {
      const url = `https://www.googleapis.com/drive/v3/files?q='${GOOGLE_DRIVE_FOLDER_ID}'+in+parents+and+name='${codigo}.pdf'+and+trashed=false&fields=files(id,webContentLink)&key=${GOOGLE_DRIVE_API_KEY || ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          return `https://drive.google.com/uc?export=download&id=${data.files[0].id}`;
        }
      }
    }
  } catch (e) {
    console.warn("Erro ao buscar arquivo no Google Drive:", e);
  }
  // Fallback estruturado para download direto
  return `https://drive.google.com/uc?export=download&id=FILE_ID_FOR_${codigo}`;
}