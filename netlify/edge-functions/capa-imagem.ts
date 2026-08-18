import { Context } from "https://edge.netlify.com";
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const DEFAULT_LOGO = "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png";
const GOOGLE_DRIVE_API_KEY = "AIzaSyBJiL8IdTPi25jPZM0P6kl3dDUO8YHvVu4";
const SUPABASE_URL = "https://qzdodsxawionneplpron.supabase.co";
const BUCKET = "capas-receitas";
const MAX_BYTES = 280 * 1024; // limite seguro para o WhatsApp exibir a prévia (recomendação: abaixo de 300KB)
const CACHE_PREFIX = "v2-"; // novo prefixo, para não reutilizar cache antigo (PNGs grandes)

async function comprimirParaJpeg(bytes: Uint8Array): Promise<Uint8Array> {
  const img = await Image.decode(bytes);
  const maxLado = 1200;
  if (Math.max(img.width, img.height) > maxLado) {
    if (img.width >= img.height) {
      img.resize(maxLado, Image.RESIZE_AUTO);
    } else {
      img.resize(Image.RESIZE_AUTO, maxLado);
    }
  }
  let qualidade = 85;
  let jpegBytes = await img.encodeJPEG(qualidade);
  while (jpegBytes.length > MAX_BYTES && qualidade > 35) {
    qualidade -= 15;
    jpegBytes = await img.encodeJPEG(qualidade);
  }
  return jpegBytes;
}

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const fileId = url.pathname.split("/").pop();
  const cacheUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${CACHE_PREFIX}${fileId}.jpg`;

  try {
    if (!fileId) throw new Error("Sem ID de arquivo");

    const cacheRes = await fetch(cacheUrl);
    if (cacheRes.ok) {
      const cachedBytes = await cacheRes.arrayBuffer();
      return new Response(cachedBytes, {
        headers: {
          "content-type": "image/jpeg",
          "cache-control": "public, max-age=86400"
        }
      });
    }

    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink&key=${GOOGLE_DRIVE_API_KEY}`;
    const metaRes = await fetch(metaUrl);
    if (!metaRes.ok) throw new Error("Falha ao buscar metadados no Drive");
    const metaData = await metaRes.json();
    if (!metaData.thumbnailLink) throw new Error("Sem thumbnail disponível no Drive para " + fileId);

    const bigThumbnail = metaData.thumbnailLink.replace(/=s\d+$/, "=s1200");
    const imgRes = await fetch(bigThumbnail);
    if (!imgRes.ok) throw new Error("Falha ao baixar a miniatura do Drive");
    const originalBytes = new Uint8Array(await imgRes.arrayBuffer());

    const jpegBytes = await comprimirParaJpeg(originalBytes);

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (serviceKey) {
      try {
        await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${CACHE_PREFIX}${fileId}.jpg`, {
          method: "POST",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "image/jpeg",
            "x-upsert": "true"
          },
          body: jpegBytes
        });
      } catch (cacheErr) {
        console.error("Falha ao salvar cache da capa no Supabase Storage:", fileId, cacheErr);
      }
    } else {
      console.error("SUPABASE_SERVICE_ROLE_KEY não encontrada na Edge Function - cache de capa não foi salvo para", fileId);
    }

    return new Response(jpegBytes, {
      headers: {
        "content-type": "image/jpeg",
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