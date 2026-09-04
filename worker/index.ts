interface Env {
  ASSETS: Fetcher;
}

const SPREADSHEET_ID = "1RUrFeuyLIqxf7vK9Vypo7XzcigV6v4koHg1v0fmjR8k";
const DEFAULT_LOGO = "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png";
const GOOGLE_DRIVE_FOLDER_ID = "1yrrZX5yqhLC8pi4phyOt8fxNzMiG1BoV";
const GOOGLE_DRIVE_API_KEY = "AIzaSyBJiL8IdTPi25jPZM0P6kl3dDUO8YHvVu4";

const SUPABASE_URL = "https://qzdodsxawionneplpron.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_18prIuDAqyjqyPPnYISVDA_wGdjBg7y";
const FALLBACK_GRUPO_LINK = "https://chat.whatsapp.com/LGQhKR68mLP3hm0Xv3N1OG?s=cl&p=a&ilr=0";

let categoriaFolderCache: Record<string, string> | null = null;

async function getCategoriaFolderMap(): Promise<Record<string, string>> {
  if (categoriaFolderCache) return categoriaFolderCache;
  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${GOOGLE_DRIVE_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name)&key=${GOOGLE_DRIVE_API_KEY}&pageSize=100`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const data: any = await res.json();
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
    const data: any = await res.json();
    if (data.files && data.files.length > 0) {
      return `${origin}/capa/${data.files[0].id}`;
    }
    return null;
  } catch (e) {
    console.warn("Erro ao buscar capa fallback no Drive:", e);
    return null;
  }
}

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
    return parseCSV(csvText).slice(1);
  } catch {
    return [];
  }
}

async function handleMetadata(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  const isRecipe = path.startsWith("/receita/");
  const isPack = path.startsWith("/pack/");
  const isUpsell = path.startsWith("/infoproduto/") || path.startsWith("/upsell/");
  const isCategory = path.startsWith("/categoria/");

  const response = await env.ASSETS.fetch(request);
  let html = await response.text();

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
    console.error("Error in metadata injection:", e);
  }

  let imageType = "image/jpeg";
  try {
    const imgHeadRes = await fetch(image, { method: "HEAD" });
    const ct = imgHeadRes.headers.get("content-type");
    if (ct && ct.startsWith("image/")) imageType = ct;
  } catch (e) {
    console.warn("Não foi possível detectar o tipo real da imagem para og:image:type:", image, e);
  }

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

  html = html.replace("<head>", `<head>${metaTags}${structuredData}`);

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}

async function handlePremiumManifest(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  let html = await response.text();

  html = html.replace(
    '<link rel="manifest" href="/manifest.json" />',
    '<link rel="manifest" href="/manifest-premium.json" />'
  );
  html = html.replace(
    "<title>Amigu Mundo</title>",
    "<title>AmiguMundo Premium</title>"
  );
  html = html.replace(
    '<meta name="theme-color" content="#0E5E6F" />',
    '<meta name="theme-color" content="#5D0599" />'
  );

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}

async function handleEntrarGrupo(): Promise<Response> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/configuracoes_app?chave=eq.link_grupo_whatsapp&select=valor`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    const data: any = await res.json();
    const link = data?.[0]?.valor || FALLBACK_GRUPO_LINK;
    return Response.redirect(link, 302);
  } catch (e) {
    return Response.redirect(FALLBACK_GRUPO_LINK, 302);
  }
}

async function handleCapaImagem(request: Request, ctx: ExecutionContext): Promise<Response> {
  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const url = new URL(request.url);
  const fileId = url.pathname.split("/").pop();
  const supabaseFunctionUrl = `${SUPABASE_URL}/functions/v1/capa-imagem/${fileId}`;

  const response = await fetch(supabaseFunctionUrl, {
    headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  });

  const finalResponse = new Response(response.body, response);
  finalResponse.headers.set("Cache-Control", "public, max-age=31536000, immutable");

  ctx.waitUntil(cache.put(request, finalResponse.clone()));
  return finalResponse;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/entrar-grupo") {
      return handleEntrarGrupo();
    }
    if (path === "/premium") {
      return handlePremiumManifest(request, env);
    }
    if (path.startsWith("/capa/")) {
      return handleCapaImagem(request, ctx);
    }
    if (
      path.startsWith("/receita/") ||
      path.startsWith("/pack/") ||
      path.startsWith("/infoproduto/") ||
      path.startsWith("/categoria/")
    ) {
      return handleMetadata(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};
