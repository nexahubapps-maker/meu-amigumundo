import { Context } from "https://edge.netlify.com";

const DEFAULT_LOGO = "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png";
const GOOGLE_DRIVE_API_KEY = "AIzaSyBJiL8IdTPi25jPZM0P6kl3dDUO8YHvVu4";

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const fileId = url.pathname.split("/").pop();

  try {
    if (!fileId) throw new Error("Sem ID de arquivo");

    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink&key=${GOOGLE_DRIVE_API_KEY}`;
    const metaRes = await fetch(metaUrl);
    if (!metaRes.ok) throw new Error("Falha ao buscar metadados no Drive");
    const metaData = await metaRes.json();
    if (!metaData.thumbnailLink) throw new Error("Sem thumbnail disponível");

    const bigThumbnail = metaData.thumbnailLink.replace(/=s\d+$/, "=s800");
    const imgRes = await fetch(bigThumbnail);
    if (!imgRes.ok) throw new Error("Falha ao baixar a miniatura");
    const imageBytes = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";

    return new Response(imageBytes, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=86400"
      }
    });
  } catch (e) {
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