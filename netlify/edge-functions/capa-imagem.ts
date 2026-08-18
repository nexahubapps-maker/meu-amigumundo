import { Context } from "https://edge.netlify.com";

const DEFAULT_LOGO = "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png";
const GOOGLE_DRIVE_API_KEY = "AIzaSyBJiL8IdTPi25jPZM0P6kl3dDUO8YHvVu4";
const SUPABASE_URL = "https://qzdodsxawionneplpron.supabase.co";
const BUCKET = "capas-receitas";

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const fileId = url.pathname.split("/").pop();
  const cacheUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileId}.jpg`;

  try {
    if (!fileId) throw new Error("Sem ID de arquivo");

    // 1. Já temos essa capa em cache? Serve direto, sem depender do Drive.
    const cacheRes = await fetch(cacheUrl);
    if (cacheRes.ok) {
      const cachedBytes = await cacheRes.arrayBuffer();
      return new Response(cachedBytes, {
        headers: {
          "content-type": cacheRes.headers.get("content-type") || "image/jpeg",
          "cache-control": "public, max-age=86400"
        }
      });
    }

    // 2. Sem cache: busca a miniatura no Google Drive (comportamento original)
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink&key=${GOOGLE_DRIVE_API_KEY}`;
    const metaRes = await fetch(metaUrl);
    if (!metaRes.ok) throw new Error("Falha ao buscar metadados no Drive");
    const metaData = await metaRes.json();
    if (!metaData.thumbnailLink) throw new Error("Sem thumbnail disponível no Drive para " + fileId);

    const bigThumbnail = metaData.thumbnailLink.replace(/=s\d+$/, "=s800");
    const imgRes = await fetch(bigThumbnail);
    if (!imgRes.ok) throw new Error("Falha ao baixar a miniatura do Drive");
    const imageBytes = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";

    // 3. Deu certo: salva uma cópia permanente no Supabase Storage, pra próxima vez não depender do Drive de novo
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (serviceKey) {
      try {
        await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileId}.jpg`, {
          method: "POST",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": contentType,
            "x-upsert": "true"
          },
          body: imageBytes
        });
      } catch (cacheErr) {
        console.error("Falha ao salvar cache da capa no Supabase Storage:", fileId, cacheErr);
      }
    } else {
      console.error("SUPABASE_SERVICE_ROLE_KEY não encontrada na Edge Function - cache de capa não foi salvo para", fileId);
    }

    return new Response(imageBytes, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=86400"
      }
    });
  } catch (e) {
    console.error("Falha ao gerar capa para fileId", fileId, "-", (e as Error).message || e);
    const fallbackRes = await fetch(DEFAULT_LOGO);
    const fallbackBytes = await fallbackRes.arrayBuffer();
    return new Response(fallbackBytes, {
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=3600"
      }
    });
  }
}