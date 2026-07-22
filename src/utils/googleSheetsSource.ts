"use client";

const SPREADSHEET_ID = "1RUrFeuyLIqxf7vK9Vypo7XzcigV6v4koHg1v0fmjR8k";

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

async function fetchSheetRows(sheetName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch sheet ${sheetName}`);
  const csvText = await response.text();
  const rows = parseCSV(csvText);
  return rows.length > 1 ? rows.slice(1) : [];
}

export async function getRecipesFromSheet() {
  const rows = await fetchSheetRows("receitas");
  return rows.map((row) => ({
    id: row[0] || "",
    nome: row[1] || "",
    slug: row[2] || "",
    preco: parseFloat(row[3]) || 0,
    imagem_url: row[4] || "",
    categoria: row[5] || "",
    ativo: row[6]?.toLowerCase() === "true",
    disparar_push: row[7]?.toLowerCase() === "true"
  }));
}

export async function getInfoprodutosFromSheet() {
  const rows = await fetchSheetRows("infoprodutos");
  return rows.map((row) => ({
    id: row[0] || "",
    nome: row[1] || "",
    slug: row[2] || "",
    preco: parseFloat(row[3]) || 0,
    imagem_url: row[4] || "",
    descricao: row[5] || "",
    ativo: row[6]?.toLowerCase() === "true",
    disparar_push: row[7]?.toLowerCase() === "true",
    link_entrega: row[8] || ""
  }));
}

export async function getPacksFromSheet() {
  const rows = await fetchSheetRows("packs");
  return rows.map((row) => ({
    id: row[0] || "",
    nome: row[1] || "",
    slug: row[2] || "",
    preco: parseFloat(row[3]) || 0,
    imagem_url: row[4] || "",
    descricao: row[5] || "",
    ativo: row[6]?.toLowerCase() === "true",
    disparar_push: row[7]?.toLowerCase() === "true",
    link_entrega: row[8] || ""
  }));
}

export async function getNotificationsFromSheet() {
  const rows = await fetchSheetRows("notificacoes_internas");
  return rows.map((row) => ({
    id: row[0] || "",
    ativo: row[1]?.toLowerCase() === "true",
    data_hora: row[2] || new Date().toISOString(),
    titulo: row[3] || "",
    mensagem: row[4] || "",
    imagem_url: row[5] || "",
    link: row[6] || "",
    disparar_push: row[7]?.toLowerCase() === "true"
  }));
}

export async function getReceitaGratuitaFromSheet() {
  const rows = await fetchSheetRows("receitas_gratuitas");
  return rows.map((row) => ({
    codigo: row[0] || "",
    data: row[1] || "",
    nome: row[2] || "",
    imagem_url: row[3] || "",
    ativo: row[4]?.toLowerCase() === "true"
  }));
}

export async function getCategoriesFromSheet() {
  const rows = await fetchSheetRows("categorias");
  return rows.map((row) => ({
    id: row[0] || "",
    titulo: row[1] || "",
    imagem_url: row[2] || "",
    ativo: row[3]?.toLowerCase() === "true"
  }));
}