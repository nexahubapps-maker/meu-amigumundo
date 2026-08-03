import { Context } from "https://edge.netlify.com";

const SUPABASE_URL = "https://qzdodsxawionneplpron.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_18prIuDAqyjqyPPnYISVDA_wGdjBg7y";
const FALLBACK_LINK = "https://chat.whatsapp.com/LGQhKR68mLP3hm0Xv3N1OG?s=cl&p=a&ilr=0";

export default async function handler(request: Request, context: Context) {
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
    const data = await res.json();
    const link = data?.[0]?.valor || FALLBACK_LINK;
    return Response.redirect(link, 302);
  } catch (e) {
    return Response.redirect(FALLBACK_LINK, 302);
  }
}