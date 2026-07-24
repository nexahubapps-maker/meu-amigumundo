import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || "https://qzdodsxawionneplpron.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

function validateSignature(xSignature: string | undefined, xRequestId: string | undefined, dataId: string): boolean {
  if (!xSignature || !xRequestId) return false;
  const parts = xSignature.split(",").reduce((acc: Record<string, string>, part) => {
    const [key, value] = part.split("=");
    if (key) acc[key.trim()] = (value || "").trim();
    return acc;
  }, {});
  const ts = parts["ts"];
  const hash = parts["v1"];
  if (!ts || !hash) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET as string;
  const computedHash = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  return computedHash === hash;
}

async function enviarEmailBackup(pedido: { id: number; email_comprador: string; nome_comprador: string | null }) {
  try {
    const siteUrl = process.env.URL || "https://amigumundoteste.netlify.app";
    const linkPedido = `${siteUrl}/obrigado/${pedido.id}`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
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
        `,
      }),
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de backup:", error);
  }
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
    charged_back: "reembolsado",
  };
  return mapa[statusMercadoPago] || "pendente";
}

export const handler: Handler = async (event) => {
  try {
    const bodyData = event.body ? JSON.parse(event.body) : {};
    const dataId = event.queryStringParameters?.["data.id"] || bodyData?.data?.id;

    if (!dataId) {
      return { statusCode: 400, body: "Missing data.id" };
    }

    const xSignature = event.headers["x-signature"];
    const xRequestId = event.headers["x-request-id"];

    if (!validateSignature(xSignature, xRequestId, String(dataId))) {
      console.warn("Assinatura inválida no webhook do Mercado Pago");
      return { statusCode: 401, body: "Invalid signature" };
    }

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
    });

    if (!mpResponse.ok) {
      return { statusCode: 502, body: "Erro ao consultar pagamento" };
    }

    const paymentData = await mpResponse.json();
    const novoStatus = paymentData.status;

    const { data: pedidoAtual } = await supabaseAdmin
      .from("pedidos")
      .select("id, status, email_comprador, nome_comprador")
      .eq("mercadopago_transaction_id", String(dataId))
      .single();

    if (!pedidoAtual) {
      return { statusCode: 404, body: "Pedido não encontrado" };
    }

    const jaEstavaAprovado = pedidoAtual.status === "aprovado";

    await supabaseAdmin
      .from("pedidos")
      .update({
        status: traduzirStatus(novoStatus),
        aprovado_em: traduzirStatus(novoStatus) === "aprovado" ? new Date().toISOString() : null,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", pedidoAtual.id);

    if (traduzirStatus(novoStatus) === "aprovado" && !jaEstavaAprovado) {
      await enviarEmailBackup(pedidoAtual as any);
    }

    return { statusCode: 200, body: "OK" };
  } catch (error: any) {
    console.error("Erro no webhook do Mercado Pago:", error);
    return { statusCode: 500, body: "Erro inesperado" };
  }
};