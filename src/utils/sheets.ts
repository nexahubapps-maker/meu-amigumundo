"use client";

export interface SheetRecipe {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  url_foto: string;
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

const SPREADSHEET_ID = "1lV6mLey_Bvq01CdDztUxEUKOlmDHsH6YeiNOqQcRveQ";

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

// Fallback Mock Data matching the exact requested structure
const fallbackRecipes: SheetRecipe[] = [
  { id: "387", nome: "Unicórnio Pastel", slug: "unicornio-pastel", preco: 8.90, categoria: "Princesas", url_foto: "https://picsum.photos/seed/387/400/400", ativo: true, disparar_push: false },
  { id: "120", nome: "Coelhinho Apaixonado", slug: "coelhinho-apaixonado", preco: 6.90, categoria: "Animais", url_foto: "https://picsum.photos/seed/120/400/400", ativo: true, disparar_push: false },
  { id: "553", nome: "Gatinho Soneca", slug: "gatinho-soneca", preco: 6.50, categoria: "Gatos", url_foto: "https://picsum.photos/seed/553/400/400", ativo: true, disparar_push: false },
  { id: "774", nome: "Dinossauro Baby", slug: "dinossauro-baby", preco: 7.50, categoria: "Dinossauros", url_foto: "https://picsum.photos/seed/774/400/400", ativo: true, disparar_push: false },
  { id: "229", nome: "Polvinho Reversível", slug: "polvinho-reversivel", preco: 7.90, categoria: "Marinhos", url_foto: "https://picsum.photos/seed/229/400/400", ativo: true, disparar_push: false },
  { id: "441", nome: "Mini Ursinho Pocket", slug: "mini-ursinho-pocket", preco: 5.90, categoria: "Animais", url_foto: "https://picsum.photos/seed/441/400/400", ativo: true, disparar_push: false }
];

const fallbackInfoprodutos: SheetInfoproduto[] = [
  { id: "info1", nome: "Instagram Profissional para Artesãs", slug: "instagram-artesas", preco: 47.00, url_foto: "https://picsum.photos/seed/info1/600/375", descricao: "O segredo prático para atrair seguidores qualificados e transformá-los em clientes que pagam o valor justo.", ativo: true, disparar_push: false },
  { id: "info2", nome: "Guia de Precificação sem Erros", slug: "guia-precificacao", preco: 27.00, url_foto: "https://picsum.photos/seed/info2/600/375", descricao: "Descubra de forma simples e exata o valor real da sua hora de trabalho. Pare de pagar para trabalhar.", ativo: true, disparar_push: false },
  { id: "info3", nome: "Pacote de Moldes de Amigurumi Premium", slug: "moldes-premium", preco: 19.00, url_foto: "https://picsum.photos/seed/info3/600/375", descricao: "Tenha acesso a uma selection exclusiva de moldes altamente desejados no mercado.", ativo: true, disparar_push: false }
];

const fallbackPacks: SheetPack[] = [
  { id: "pack1", nome: "Pack Safari Completo", slug: "pack-safari", preco: 19.90, url_foto: "https://picsum.photos/seed/pack1/400/400", descricao: "20 receitas de animais selvagens", ativo: true, disparar_push: false },
  { id: "pack2", nome: "Pack Princesas Encantadas", slug: "pack-princesas", preco: 19.90, url_foto: "https://picsum.photos/seed/pack2/400/400", descricao: "20 receitas de princesas", ativo: true, disparar_push: false },
  { id: "pack3", nome: "Pack Super-Herois", slug: "pack-super-herois", preco: 19.90, url_foto: "https://picsum.photos/seed/pack3/400/400", descricao: "20 receitas de heroi e viloes", ativo: true, disparar_push: false }
];

const fallbackNotifications: SheetNotification[] = [
  { id: "notif1", status: true, data_hora: new Date().toISOString(), titulo: "Nova Receita de Páscoa Liberada!", mensagem: "Corra para a categoria Páscoa e confira o novo coelhinho fofo.", url_foto: "", link: "" },
  { id: "notif2", status: true, data_hora: new Date(Date.now() - 3600000).toISOString(), titulo: "Super Desconto no Pack Safari", mensagem: "Apenas hoje, garanta 20 receitas por apenas R$ 19,90.", url_foto: "", link: "" }
];

// Generate dynamic today date for fallback gift
const getTodayDateString = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

const fallbackReceitaGratuita: SheetReceitaGratuita[] = [
  { codigo: "387", data: getTodayDateString(), nome: "Unicórnio Pastel", url_foto: "https://picsum.photos/seed/387/400/400", ativo: true }
];

// Fetchers
export async function getRecipes(): Promise<SheetRecipe[]> {
  return fetchSheetData<SheetRecipe>(
    "receitas",
    (row) => ({
      id: row[0] || "",
      nome: row[1] || "",
      slug: row[2] || "",
      preco: parseFloat(row[3]) || 0,
      url_foto: row[4] || `https://picsum.photos/seed/${row[0]}/400/400`,
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
      url_foto: row[4] || `https://picsum.photos/seed/${row[0]}/600/375`,
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
      url_foto: row[4] || `https://picsum.photos/seed/${row[0]}/400/400`,
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
      url_foto: row[3] || `https://picsum.photos/seed/${row[0]}/400/400`,
      ativo: row[4]?.toLowerCase() === "true"
    }),
    fallbackReceitaGratuita
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