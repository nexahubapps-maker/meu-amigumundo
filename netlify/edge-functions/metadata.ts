import { Context } from "https://edge.netlify.com";

// Nova Planilha Mestre Oficial "AMIGUMUNDO APP"
const SPREADSHEET_ID = "1RUrFeuyLIqxf7vK9Vypo7XzcigV6v4koHg1v0fmjR8k";
const DEFAULT_LOGO = "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png";

const GOOGLE_DRIVE_FOLDER_ID = "1yrrZX5yqhLC8pi4phyOt8fxNzMiG1BoV";
const GOOGLE_DRIVE_API_KEY = "AIzaSyBJiL8IdTPi25jPZM0P6kl3dDUO8YHvVu4";

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

async function getRecipeCoverFallback(codigo: string, categoria: string, origin: string): Promise<string | null> {
  try {
    const folderMap = await getCategoriaFolderMap();
    const subfolderId = folderMap[(categoria || "").toLowerCase()];
    if (!subfolderId) return null;

    const url = `https://www.googleapis.com/drive/v3/files?q='${subfolderId}'+in+parents+and+name+contains+'${codigo}'+and+mimeType='application/pdf'+and+trashed=false&fields=files(id,name)&key=${GOOGLE_DRIVE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return `${origin}/capa/${data.files[0].id}`;
    }
    return null;
  } catch (e) {
    console.warn("Erro ao buscar capa fallback no Drive:", e);
    return null;
  }
}

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
        const rawImg = match[4];
        if (!rawImg || rawImg.trim() === "" || rawImg.trim() === "-") {
          const fallback = await getRecipeCoverFallback(id, match[5] || "", url.origin);
          image = fallback || DEFAULT_LOGO;
        } else {
          image = rawImg;
        }
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

  let imageType = "image/jpeg";
  try {
    const imgHeadRes = await fetch(image, { method: "HEAD" });
    const ct = imgHeadRes.headers.get("content-type");
    if (ct && ct.startsWith("image/")) imageType = ct;
  } catch (e) {
    console.warn("Não foi possível detectar o tipo real da imagem para og:image:type:", image, e);
  }

  // Build dynamic meta tags
  let metaTags = `
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:description" content="${description}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="og:image:type" content="${imageType}" />
  `;

  if (priceAmount) {
    metaTags += `
      <meta property="product:price:amount" content="${priceAmount}" />
      <meta property="product:price:currency" content="${priceCurrency}" />
    `;
  }

  let structuredData = "";
  if (priceAmount) {
    const productData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": title.split(" - R$")[0],
      "image": image,
      "description": description,
      "offers": {
        "@type": "Offer",
        "priceCurrency": priceCurrency,
        "price": priceAmount,
        "availability": "https://schema.org/InStock"
      }
    };
    structuredData = `<script type="application/ld+json">${JSON.stringify(productData)}</script>`;
  }

  // Inject meta tags into the head of index.html
  html = html.replace("<head>", `<head>${metaTags}${structuredData}`);

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}