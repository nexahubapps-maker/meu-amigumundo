"use client";

export interface SheetRecipe {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  tamanho: string;
  url_foto: string;
  disparar_push: boolean;
}

export interface SheetInfoproduto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  url_foto: string;
  disparar_push: boolean;
}

export interface SheetPack {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  url_foto: string;
  disparar_push: boolean;
}

export interface SheetNotification {
  id: string;
  titulo: string;
  mensagem: string;
  data_hora: string; // ISO string or YYYY-MM-DD HH:mm:ss
  status: boolean;
}

export interface SheetReceitaGratuita {
  data: string; // DD/MM/AAAA
  codigo: string;
  pdf_url: string;
}

export interface SheetOrderBump {
  codigo: string;
  nome: string;
  preco: number;
  imagem_url: string;
  descricao: string;
  ativo: boolean;
}

const SPREADSHEET_ID = "1lV6mLey_Bvq01CdDztUxEUKOlmDHsH6YeiNOqQcRveQ";

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
  { id: "3872", nome: "Unicórnio Pastel", descricao: "Crina arco-íris e chifre dourado. Encanta crianças.", preco: 8.90, categoria: "Princesas", tamanho: "22cm", url_foto: "https://picsum.photos/seed/3872/400/400", disparar_push: false },
  { id: "1204", nome: "Coelhinho Apaixonado", descricao: "Perfeito para o Dia dos Namorados e festas.", preco: 6.90, categoria: "Personagens TV", tamanho: "18cm", url_foto: "https://picsum.photos/seed/1204/400/400", disparar_push: false },
  { id: "5531", nome: "Gatinho Soneca", descricao: "Gatinho com olhinhos fechados e bocejo fofo.", preco: 6.50, categoria: "Super-Herois", tamanho: "15cm", url_foto: "https://picsum.photos/seed/5531/400/400", disparar_push: false },
  { id: "7743", nome: "Dinossauro Baby", descricao: "Dino verde com barriguinha redonda e expressão simpática.", preco: 7.50, categoria: "Animais da Fazenda", tamanho: "20cm", url_foto: "https://picsum.photos/seed/7743/400/400", disparar_push: false },
  { id: "2290", nome: "Polvinho Reversível", descricao: "Polvo com duas faces: feliz e bravo. Sucesso garantido.", preco: 7.90, categoria: "Animais Selvagens", tamanho: "12cm", url_foto: "https://picsum.photos/seed/2290/400/400", disparar_push: false },
  { id: "4418", nome: "Mini Ursinho Pocket", descricao: "Ursinho pequenininho, cabe no bolso. Ultra fofo.", preco: 5.90, categoria: "Fundo do Mar", tamanho: "10cm", url_foto: "https://picsum.photos/seed/4418/400/400", disparar_push: false }
];

const fallbackInfoprodutos: SheetInfoproduto[] = [
  { id: "info1", nome: "Instagram Profissional para Artesãs", descricao: "O segredo prático para atrair seguidores qualificados e transformá-los em clientes que pagam o valor justo.", preco: 47.00, url_foto: "https://picsum.photos/seed/info1/600/375", disparar_push: false },
  { id: "info2", nome: "Guia de Precificação sem Erros", descricao: "Descubra de forma simples e exata o valor real da sua hora de trabalho. Pare de pagar para trabalhar.", preco: 27.00, url_foto: "https://picsum.photos/seed/info2/600/375", disparar_push: false },
  { id: "info3", nome: "Pacote de Moldes de Amigurumi Premium", descricao: "Tenha acesso a uma selection exclusiva de moldes altamente desejados no mercado.", preco: 19.00, url_foto: "https://picsum.photos/seed/info3/600/375", disparar_push: false }
];

const fallbackPacks: SheetPack[] = [
  { id: "pack1", nome: "Pack Safari Completo", descricao: "20 receitas de animais selvagens", preco: 19.90, url_foto: "https://picsum.photos/seed/pack1/400/400", disparar_push: false },
  { id: "pack2", nome: "Pack Princesas Encantadas", descricao: "20 receitas de princesas", preco: 19.90, url_foto: "https://picsum.photos/seed/pack2/400/400", disparar_push: false },
  { id: "pack3", nome: "Pack Super-Herois", descricao: "20 receitas de heroi e viloes", preco: 19.90, url_foto: "https://picsum.photos/seed/pack3/400/400", disparar_push: false }
];

const fallbackNotifications: SheetNotification[] = [
  { id: "notif1", titulo: "Nova Receita de Páscoa Liberada!", mensagem: "Corra para a categoria Páscoa e confira o novo coelhinho fofo.", data_hora: new Date().toISOString(), status: true },
  { id: "notif2", titulo: "Super Desconto no Pack Safari", mensagem: "Apenas hoje, garanta 20 receitas por apenas R$ 19,90.", data_hora: new Date(Date.now() - 3600000).toISOString(), status: true }
];

// Fetchers
export async function getRecipes(): Promise<SheetRecipe[]> {
  return fetchSheetData<SheetRecipe>(
    "receitas",
    (row) => ({
      id: row[0] || "",
      nome: row[1] || "",
      descricao: row[2] || "",
      preco: parseFloat(row[3]) || 0,
      categoria: row[4] || "",
      tamanho: row[5] || "",
      url_foto: row[6] || `https://picsum.photos/seed/${row[0]}/400/400`,
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
      descricao: row[2] || "",
      preco: parseFloat(row[3]) || 0,
      url_foto: row[4] || `https://picsum.photos/seed/${row[0]}/600/375`,
      disparar_push: row[5]?.toLowerCase() === "true"
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
      descricao: row[2] || "",
      preco: parseFloat(row[3]) || 0,
      url_foto: row[4] || `https://picsum.photos/seed/${row[0]}/400/400`,
      disparar_push: row[5]?.toLowerCase() === "true"
    }),
    fallbackPacks
  );
}

export async function getNotifications(): Promise<SheetNotification[]> {
  return fetchSheetData<SheetNotification>(
    "notificacoes_internas",
    (row) => ({
      id: row[0] || "",
      titulo: row[1] || "",
      mensagem: row[2] || "",
      data_hora: row[3] || new Date().toISOString(),
      status: row[4]?.toLowerCase() === "true"
    }),
    fallbackNotifications
  );
}

export async function getReceitaGratuita(): Promise<SheetReceitaGratuita[]> {
  return fetchSheetData<SheetReceitaGratuita>(
    "receita_gratuita",
    (row) => ({
      data: row[0] || "",
      codigo: row[1] || "",
      pdf_url: row[2] || ""
    }),
    []
  );
}

export async function getOrderBumps(): Promise<SheetOrderBump[]> {
  return fetchSheetData<SheetOrderBump>(
    "order_bumps",
    (row) => ({
      codigo: row[0] || "",
      nome: row[1] || "",
      preco: parseFloat((row[2] || "0").replace(",", ".")) || 0,
      imagem_url: row[3] || `https://picsum.photos/seed/${row[0]}/100/100`,
      descricao: row[4] || "",
      ativo: row[5]?.toLowerCase() === "true"
    }),
    []
  );
}