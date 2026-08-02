import { Context } from "https://edge.netlify.com";

const DEFAULT_LOGO = "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png";

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const fileId = url.pathname.split("/").pop();

  try {
    if (!fileId) throw new Error("Sem ID de arquivo");
    const driveUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    const res = await fetch(driveUrl);
    if (!res.ok) throw new Error("Falha ao buscar imagem no Drive");
    const imageBytes = await res.arrayBuffer();
    return new Response(imageBytes, {
      headers: {
        "content-type": "image/jpeg",
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