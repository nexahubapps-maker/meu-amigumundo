import { Context } from "https://edge.netlify.com";

export default async function handler(request: Request, context: Context) {
  const response = await context.next();
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