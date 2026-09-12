interface Env {
  ASSETS: Fetcher;
  SUPABASE_SERVICE_ROLE_KEY: string;
  MERCADOPAGO_ACCESS_TOKEN: string;
  MERCADOPAGO_WEBHOOK_SECRET: string;
  RESEND_API_KEY?: string;
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

async function handleEntrarGrupo(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const wantsJson = url.searchParams.get("formato") === "json";

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
    if (wantsJson) {
      return new Response(JSON.stringify({ link }), {
        headers: { "content-type": "application/json" }
      });
    }
    return Response.redirect(link, 302);
  } catch (e) {
    if (wantsJson) {
      return new Response(JSON.stringify({ link: FALLBACK_GRUPO_LINK }), {
        headers: { "content-type": "application/json" }
      });
    }
    return Response.redirect(FALLBACK_GRUPO_LINK, 302);
  }
}

async function handlePremiumPdf(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const fileId = url.pathname.split("/").pop();
  if (!fileId) {
    return new Response("Arquivo não encontrado", { status: 400 });
  }

  try {
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const driveResponse = await fetch(driveUrl, { redirect: "follow" });

    if (!driveResponse.ok) {
      return new Response("Erro ao buscar arquivo no Drive", { status: 502 });
    }

    const contentType = driveResponse.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      console.error("Drive retornou HTML em vez do PDF (possível aviso de verificação) para fileId:", fileId);
      return new Response("Não foi possível carregar esse arquivo agora", { status: 502 });
    }

    return new Response(driveResponse.body, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "cache-control": "private, no-store",
        "access-control-allow-origin": "*"
      }
    });
  } catch (e) {
    console.error("Erro em handlePremiumPdf:", e);
    return new Response("Erro inesperado ao buscar o arquivo", { status: 500 });
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

function traduzirStatus(statusMercadoPago: string): string {
  const mapa: Record<string, string> = {
    approved: "aprovado",
    pending: "pendente",
    in_process: "pendente",
    authorized: "pendente",
    in_mediation: "pendente",
    rejected: "recusado",
    cancelled: "cancelado",
    refunded: "reembolsado",
    charged_back: "reembolsado"
  };
  return mapa[statusMercadoPago] || "pendente";
}

async function supabaseRest(path: string, serviceKey: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

interface CartItemPayload {
  id: string;
  nome: string;
  preco: number;
  tipo: string;
  imagem_url?: string;
}

async function handleCriarPagamento(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405 });
  }

  try {
    const body: any = await request.json();
    const {
      paymentMethod,
      paymentMethodId,
      cardToken,
      amount,
      email,
      nome,
      cpf,
      items,
      usuarioId,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content
    }: {
      paymentMethod: "pix" | "card";
      paymentMethodId?: string;
      cardToken?: string;
      amount: number;
      email: string;
      nome: string;
      cpf: string;
      items: CartItemPayload[];
      usuarioId?: string | null;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string;
    } = body;

    if (!email || !nome || !cpf || !amount || !items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Dados obrigatórios ausentes." }), { status: 400 });
    }
    if (paymentMethod === "card" && !cardToken) {
      return new Response(JSON.stringify({ error: "Token do cartão ausente." }), { status: 400 });
    }

    const cleanCpf = cpf.replace(/\D/g, "");
    const nameParts = nome.trim().split(" ");
    const firstName = nameParts[0] || nome;
    const lastName = nameParts.slice(1).join(" ") || nome;

    const mpBody: any = {
      transaction_amount: amount,
      description: "Compra AmiguMundo",
      payer: {
        email,
        first_name: firstName,
        last_name: lastName,
        identification: { type: "CPF", number: cleanCpf }
      }
    };

    if (paymentMethod === "pix") {
      mpBody.payment_method_id = "pix";
    } else {
      mpBody.token = cardToken;
      mpBody.payment_method_id = paymentMethodId || "visa";
      mpBody.installments = 1;
    }

    const idempotencyKey = crypto.randomUUID();

    const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
        "X-Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify(mpBody)
    });

    const mpData: any = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("Erro Mercado Pago:", mpData);
      return new Response(JSON.stringify({ error: mpData.message || "Erro ao processar pagamento." }), { status: 502 });
    }

    const pedidoRes = await supabaseRest("pedidos", env.SUPABASE_SERVICE_ROLE_KEY, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        mercadopago_transaction_id: String(mpData.id),
        usuario_id: usuarioId || null,
        email_comprador: email,
        nome_comprador: nome,
        cpf_comprador: cleanCpf,
        valor_total: amount,
        status: traduzirStatus(mpData.status),
        pix_gerado_em: paymentMethod === "pix" ? new Date().toISOString() : null,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null
      })
    });

    const pedidoArr: any = await pedidoRes.json();
    const pedido = Array.isArray(pedidoArr) ? pedidoArr[0] : null;

    if (!pedidoRes.ok || !pedido) {
      console.error("Erro ao gravar pedido:", pedidoArr);
      return new Response(JSON.stringify({ error: "Pagamento criado, mas houve erro ao registrar o pedido." }), { status: 500 });
    }

    const packItems = items.filter((item) => item.tipo === "pack");
    let itensExtras: any[] = [];

    if (packItems.length > 0) {
      const packCodigos = packItems.map((item) => item.id);
      const packsRes = await supabaseRest(
        `packs?select=codigo,receitas_incluidas&codigo=in.(${packCodigos.join(",")})`,
        env.SUPABASE_SERVICE_ROLE_KEY
      );
      const packsData: any = await packsRes.json();

      const codigosReceitasParaExpandir = new Set<string>();
      (packsData || []).forEach((pack: any) => {
        if (pack.receitas_incluidas && pack.receitas_incluidas.trim() !== "") {
          pack.receitas_incluidas
            .split(",")
            .map((c: string) => c.trim())
            .filter((c: string) => c.length > 0)
            .forEach((c: string) => codigosReceitasParaExpandir.add(c));
        }
      });

      if (codigosReceitasParaExpandir.size > 0) {
        const receitasRes = await supabaseRest(
          `receitas?select=codigo,nome,imagem_url,preco&codigo=in.(${Array.from(codigosReceitasParaExpandir).join(",")})`,
          env.SUPABASE_SERVICE_ROLE_KEY
        );
        const receitasData: any = await receitasRes.json();

        itensExtras = (receitasData || []).map((receita: any) => ({
          pedido_id: pedido.id,
          tipo_produto: "receita",
          codigo_produto: receita.codigo,
          nome_produto: receita.nome,
          imagem_url: receita.imagem_url || null,
          preco_unitario: receita.preco,
          quantidade: 1
        }));
      }
    }

    const itensParaInserir = [
      ...items.map((item) => ({
        pedido_id: pedido.id,
        tipo_produto: item.tipo,
        codigo_produto: item.id,
        nome_produto: item.nome,
        imagem_url: item.imagem_url || null,
        preco_unitario: item.preco,
        quantidade: 1
      })),
      ...itensExtras
    ];

    const itensRes = await supabaseRest("pedido_itens", env.SUPABASE_SERVICE_ROLE_KEY, {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(itensParaInserir)
    });

    if (!itensRes.ok) {
      console.error("Erro ao gravar itens do pedido:", await itensRes.text());
    }

    return new Response(
      JSON.stringify({
        pedidoId: pedido.id,
        status: mpData.status,
        qrCode: mpData.point_of_interaction?.transaction_data?.qr_code || null,
        qrCodeBase64: mpData.point_of_interaction?.transaction_data?.qr_code_base64 || null
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro inesperado em criar-pagamento:", error);
    return new Response(JSON.stringify({ error: "Erro inesperado ao processar pagamento." }), { status: 500 });
  }
}

async function validateMpSignature(
  xSignature: string | undefined,
  xRequestId: string | undefined,
  dataId: string,
  secret: string | undefined
): Promise<boolean> {
  console.log("[MP Webhook Debug] xSignature recebido:", xSignature);
  console.log("[MP Webhook Debug] xRequestId recebido:", xRequestId);
  console.log("[MP Webhook Debug] dataId recebido:", dataId);
  console.log("[MP Webhook Debug] secret configurado, tamanho:", secret ? secret.length : "UNDEFINED/VAZIO");

  if (!xSignature || !xRequestId || !secret) {
    console.log("[MP Webhook Debug] FALHOU cedo: falta xSignature, xRequestId ou secret");
    return false;
  }
  const parts = xSignature.split(",").reduce((acc: Record<string, string>, part) => {
    const [key, value] = part.split("=");
    if (key) acc[key.trim()] = (value || "").trim();
    return acc;
  }, {});
  const ts = parts["ts"];
  const hash = parts["v1"];
  console.log("[MP Webhook Debug] ts extraido:", ts, "| hash (v1) extraido:", hash);
  if (!ts || !hash) {
    console.log("[MP Webhook Debug] FALHOU: nao achou ts ou v1 dentro do x-signature");
    return false;
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  console.log("[MP Webhook Debug] manifest construido:", manifest);

  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(manifest));
  const computedHash = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  console.log("[MP Webhook Debug] hash calculado:", computedHash);
  console.log("[MP Webhook Debug] hash esperado (do Mercado Pago):", hash);
  console.log("[MP Webhook Debug] bateram?", computedHash === hash);

  return computedHash === hash;
}

async function enviarEmailBackup(
  pedido: { id: number; email_comprador: string; nome_comprador: string | null },
  origin: string,
  resendApiKey: string | undefined
): Promise<void> {
  if (!resendApiKey) return;
  try {
    const linkPedido = `${origin}/obrigado/${pedido.id}`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "AmiguMundo <onboarding@resend.dev>",
        to: pedido.email_comprador,
        subject: "Sua compra no AmiguMundo foi confirmada!",
        html: `
          <p>Oi${pedido.nome_comprador ? ", " + pedido.nome_comprador : ""}!</p>
          <p>Seu pagamento foi aprovado. Você já pode acessar tudo que comprou clicando no link abaixo:</p>
          <p><a href="${linkPedido}">Ver minhas receitas</a></p>
          <p>Guarde este e-mail — esse link não expira, você pode voltar nele sempre que quiser.</p>
        `
      })
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de backup:", error);
  }
}

async function handleWebhookMercadopago(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    let bodyData: any = {};
    try {
      bodyData = await request.json();
    } catch {
      bodyData = {};
    }
    const dataId = url.searchParams.get("data.id") || bodyData?.data?.id;

    console.log("[MP Webhook Debug] URL completa recebida:", request.url);
    console.log("[MP Webhook Debug] Corpo recebido:", JSON.stringify(bodyData));
    console.log("[MP Webhook Debug] dataId resolvido:", dataId);

    if (!dataId) {
      return new Response("Missing data.id", { status: 400 });
    }

    const xSignature = request.headers.get("x-signature") || undefined;
    const xRequestId = request.headers.get("x-request-id") || undefined;

    const assinaturaValida = await validateMpSignature(xSignature, xRequestId, String(dataId), env.MERCADOPAGO_WEBHOOK_SECRET);
    if (!assinaturaValida) {
      console.warn("Assinatura inválida no webhook do Mercado Pago");
      return new Response("Invalid signature", { status: 401 });
    }

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}` }
    });

    if (!mpResponse.ok) {
      return new Response("Erro ao consultar pagamento", { status: 502 });
    }

    const paymentData: any = await mpResponse.json();
    const novoStatus = paymentData.status;

    const pedidoRes = await supabaseRest(
      `pedidos?mercadopago_transaction_id=eq.${dataId}&select=id,status,email_comprador,nome_comprador`,
      env.SUPABASE_SERVICE_ROLE_KEY
    );
    const pedidoArr: any = await pedidoRes.json();
    const pedidoAtual = Array.isArray(pedidoArr) ? pedidoArr[0] : null;

    if (!pedidoAtual) {
      return new Response("Pedido não encontrado", { status: 404 });
    }

    const jaEstavaAprovado = pedidoAtual.status === "aprovado";
    const statusTraduzido = traduzirStatus(novoStatus);

    await supabaseRest(`pedidos?id=eq.${pedidoAtual.id}`, env.SUPABASE_SERVICE_ROLE_KEY, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: statusTraduzido,
        aprovado_em: statusTraduzido === "aprovado" ? new Date().toISOString() : null,
        atualizado_em: new Date().toISOString()
      })
    });

    if (statusTraduzido === "aprovado" && !jaEstavaAprovado) {
      await enviarEmailBackup(pedidoAtual, url.origin, env.RESEND_API_KEY);
    }

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("Erro no webhook do Mercado Pago:", error);
    return new Response("Erro inesperado", { status: 500 });
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    console.log("=== REQUEST RECEIVED ===", JSON.stringify({
      method: request.method,
      url: request.url,
      userAgent: request.headers.get("user-agent"),
      cf: (request as any).cf || null,
      hasSignature: !!request.headers.get("x-signature"),
      hasRequestId: !!request.headers.get("x-request-id")
    }));

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/debug-mp") {
      return new Response("MP-DEBUG-OK", { status: 200 });
    }
    if (path === "/entrar-grupo") {
      return handleEntrarGrupo(request);
    }
    if (path === "/premium") {
      return handlePremiumManifest(request, env);
    }
    if (path.startsWith("/capa/")) {
      return handleCapaImagem(request, ctx);
    }
    if (path.startsWith("/premium-pdf/")) {
      return handlePremiumPdf(request);
    }
    if (path === "/.netlify/functions/criar-pagamento") {
      return handleCriarPagamento(request, env);
    }
    if (path === "/webhook-mercadopago") {
      return handleWebhookMercadopago(request, env);
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
