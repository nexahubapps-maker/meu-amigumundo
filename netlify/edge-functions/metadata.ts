import { Context } from "https://edge.netlify.com";

// Nova Planilha Mestre Oficial "AMIGUMUNDO APP"
const SPREADSHEET_ID = "1sIoPIN054AGjiGWtWu6l6twvd7SwWPGg";
const DEFAULT_LOGO = "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png";

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

async function fetchSheetRows(sheetName: string): Promise<string[][]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const csvText = await response.text();
    return parseCSV(csvText).slice(1); // Skip header
  } catch {
    return [];
  }
}

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Only intercept dynamic routes
  const isRecipe = path.startsWith("/receita/");
  const isPack = path.startsWith("/pack/");
  const isUpsell = path.startsWith("/infoproduto/") || path.startsWith("/upsell/");
  const isCategory = path.startsWith("/categoria/");

  if (!isRecipe && !isPack && !isUpsell && !isCategory) {
    return; // Let Netlify serve the static index.html normally
  }

  // Fetch the original index.html
  const response = await context.next();
  let html = await response.text();

  // Default Fallback Meta Tags
  let title = "Amigu Mundo";
  let image = DEFAULT_LOGO;
  let description = "Uma comunidade apaixonada por Amigurumis.";
  let priceAmount = "";
  let priceCurrency = "BRL";

  try {
    if (isRecipe) {
      const parts = path.split("-");
      const id = parts[parts.length - 1];
      const rows = await fetchSheetRows("receitas");
      const match = rows.find(r => r[0] === id);
      if (match) {
        title = `${match[1]} - R$ ${parseFloat(match[3]).toFixed(2)}`;
        image = match[4] || DEFAULT_LOGO;
        priceAmount = parseFloat(match[3]).toFixed(2);
      }
    } else if (isPack) {
      const parts = path.split("-");
      const id = parts[parts.length - 1];
      const rows = await fetchSheetRows("packs");
      const match = rows.find(r => r[0] === id);
      if (match) {
        title = `${match[1]} - R$ ${parseFloat(match[3]).toFixed(2)}`;
        image = match[4] || DEFAULT_LOGO;
        priceAmount = parseFloat(match[3]).toFixed(2);
      }
    } else if (isUpsell) {
      const parts = path.split("-");
      const id = parts[parts.length - 1];
      const rows = await fetchSheetRows("infoprodutos");
      const match = rows.find(r => r[0] === id);
      if (match) {
        title = `${match[1]} - R$ ${parseFloat(match[3]).toFixed(2)}`;
        image = match[4] || DEFAULT_LOGO;
        priceAmount = parseFloat(match[3]).toFixed(2);
      }
    } else if (isCategory) {
      const slug = path.replace("/categoria/", "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const rows = await fetchSheetRows("categorias");
      const match = rows.find(r => r[1]?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === slug);
      if (match) {
        title = `Coleção ${match[1]} - Amigu Mundo`;
        image = match[2] || DEFAULT_LOGO;
      }
    }
  } catch (e) {
    console.error("Error in Edge Function metadata injection:", e);
  }

  // Build dynamic meta tags
  let metaTags = `
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:description" content="${description}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="og:image:type" content="image/jpeg" />
  `;

  if (priceAmount) {
    metaTags += `
      <meta property="product:price:amount" content="${priceAmount}" />
      <meta property="product:price:currency" content="${priceCurrency}" />
    `;
  }

  // Inject meta tags into the head of index.html
  html = html.replace("<head>", `<head>${metaTags}`);

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}