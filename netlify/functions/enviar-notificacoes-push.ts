import type { Config } from "@netlify/functions";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qzdodsxawionneplpron.supabase.co";

export default async (req: Request) => {
  const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

  webpush.setVapidDetails(
    "mailto:contato@amigumundo.com",
    "BO__EiosHOgU5DrpBaS8Ox67qFSd8Vs49D9WW14BlZtwX8Y56ftpNeqQuFIGz_xOOXccDzqaovDC_icLOyBYAVw",
    process.env.VAPID_PRIVATE_KEY as string
  );

  const now = new Date().toISOString();

  const { data: pendentes } = await supabase
    .from("notificacoes_internas")
    .select("*")
    .eq("ativo", true)
    .eq("disparar_push", true)
    .is("push_enviado_em", null)
    .lte("data_hora", now);

  if (!pendentes || pendentes.length === 0) {
    return new Response("Nada pendente");
  }

  const { data: subs } = await supabase.from("push_subscriptions").select("*");

  for (const notif of pendentes) {
    for (const sub of subs || []) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      };
      try {
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify({
            title: notif.titulo,
            body: notif.mensagem,
            icon: notif.imagem_url,
            url: notif.link || "/"
          })
        );
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        }
      }
    }

    await supabase
      .from("notificacoes_internas")
      .update({ push_enviado_em: new Date().toISOString() })
      .eq("id", notif.id);
  }

  return new Response(`Enviado para ${pendentes.length} notificação(ões)`);
};

export const config: Config = {
  schedule: "*/5 * * * *"
};