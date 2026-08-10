import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || "https://qzdodsxawionneplpron.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

interface CartItemPayload {
  id: string;
  nome: string;
  preco: number;
  tipo: string;
  imagem_url?: string;
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
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Método não permitido" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
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
      utm_content,
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
      return { statusCode: 400, body: JSON.stringify({ error: "Dados obrigatórios ausentes." }) };
    }
    if (paymentMethod === "card" && !cardToken) {
      return { statusCode: 400, body: JSON.stringify({ error: "Token do cartão ausente." }) };
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
        identification: { type: "CPF", number: cleanCpf },
      },
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
        "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(mpBody),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("Erro Mercado Pago:", mpData);
      return { statusCode: 502, body: JSON.stringify({ error: mpData.message || "Erro ao processar pagamento." }) };
    }

    const { data: pedido, error: pedidoError } = await supabaseAdmin
      .from("pedidos")
      .insert({
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
        utm_content: utm_content || null,
      })
      .select()
      .single();

    if (pedidoError || !pedido) {
      console.error("Erro ao gravar pedido:", pedidoError);
      return { statusCode: 500, body: JSON.stringify({ error: "Pagamento criado, mas houve erro ao registrar o pedido." }) };
    }

    const packItems = items.filter((item) => item.tipo === "pack");
    let itensExtras: any[] = [];

    if (packItems.length > 0) {
      const packCodigos = packItems.map((item) => item.id);
      const { data: packsData } = await supabaseAdmin
        .from("packs")
        .select("codigo, receitas_incluidas")
        .in("codigo", packCodigos);

      const codigosReceitasParaExpandir = new Set<string>();
      (packsData || []).forEach((pack) => {
        if (pack.receitas_incluidas && pack.receitas_incluidas.trim() !== "") {
          pack.receitas_incluidas
            .split(",")
            .map((c: string) => c.trim())
            .filter((c: string) => c.length > 0)
            .forEach((c: string) => codigosReceitasParaExpandir.add(c));
        }
      });

      if (codigosReceitasParaExpandir.size > 0) {
        const { data: receitasData } = await supabaseAdmin
          .from("receitas")
          .select("codigo, nome, imagem_url, preco")
          .in("codigo", Array.from(codigosReceitasParaExpandir));

        itensExtras = (receitasData || []).map((receita) => ({
          pedido_id: pedido.id,
          tipo_produto: "receita",
          codigo_produto: receita.codigo,
          nome_produto: receita.nome,
          imagem_url: receita.imagem_url || null,
          preco_unitario: receita.preco,
          quantidade: 1,
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
        quantidade: 1,
      })),
      ...itensExtras,
    ];

    const { error: itensError } = await supabaseAdmin.from("pedido_itens").insert(itensParaInserir);

    if (itensError) {
      console.error("Erro ao gravar itens do pedido:", itensError);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        pedidoId: pedido.id,
        status: mpData.status,
        qrCode: mpData.point_of_interaction?.transaction_data?.qr_code || null,
        qrCodeBase64: mpData.point_of_interaction?.transaction_data?.qr_code_base64 || null,
      }),
    };
  } catch (error: any) {
    console.error("Erro inesperado em criar-pagamento:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Erro inesperado ao processar pagamento." }) };
  }
};