// Cloudflare Pages Function — handles POST /api/agentos247/checkout
// This runs when deployed to Cloudflare Pages (not Workers).
// Falls back to the Workers entrypoint (src/server.ts) when deployed as Worker.

interface CheckoutBody {
  plan: string;
  billing: string;
  months: number;
  price: number;
  total: number;
  guardian?: boolean;
  agentName?: string;
  gender?: string;
  telegramId?: string;
  apiKey?: string;
  email: string;
  role?: string | null;
  source: string;
}

interface Env {
  STRIPE_SECRET_KEY?: string;
  CHECKOUT_API_URL?: string;
  CHECKOUT_API_KEY?: string;
}

export async function onRequest(context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
  waitUntil: (promise: Promise<unknown>) => void;
}): Promise<Response> {
  const { request, env } = context;

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as CheckoutBody;
    console.log("[PAGES CHECKOUT]", JSON.stringify(body));

    const url = new URL(request.url);
    const origin = url.origin;

    const stripeKey = env.STRIPE_SECRET_KEY || (globalThis as any).STRIPE_SECRET_KEY;

    if (stripeKey) {
      // Create Stripe Checkout Session
      const params = new URLSearchParams();
      params.set("mode", "payment");
      params.set(
        "success_url",
        `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      );
      params.set(
        "cancel_url",
        `${origin}${body.source === "byok" ? "/byok" : ""}#pricing`,
      );
      params.set("customer_email", body.email || "");
      params.set("line_items[0][price_data][currency]", "eur");
      params.set(
        "line_items[0][price_data][product_data][name]",
        `AgentOS247 ${body.source === "byok" ? "BYOK" : ""} - ${body.plan}`,
      );
      params.set("line_items[0][price_data][product_data][metadata][plan]", body.plan);
      params.set(
        "line_items[0][price_data][product_data][metadata][billing]",
        body.billing,
      );
      params.set(
        "line_items[0][price_data][unit_amount]",
        `${Math.round(Number(body.price) * 100)}`,
      );
      params.set("line_items[0][quantity]", "1");

      const stripeRes = await fetch(
        "https://api.stripe.com/v1/checkout/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      );

      const session = (await stripeRes.json()) as { url?: string; error?: { message: string } };

      if (!stripeRes.ok) {
        return new Response(
          JSON.stringify({ error: session.error?.message || "Stripe error" }),
          {
            status: stripeRes.status,
            headers: { "content-type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { "content-type": "application/json" },
      });
    }

    // If no Stripe key, try proxy to external checkout API
    if (env.CHECKOUT_API_URL) {
      const proxyRes = await fetch(env.CHECKOUT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env.CHECKOUT_API_KEY
            ? { Authorization: `Bearer ${env.CHECKOUT_API_KEY}` }
            : {}),
        },
        body: JSON.stringify(body),
      });

      const proxyData = await proxyRes.json();

      return new Response(JSON.stringify(proxyData), {
        status: proxyRes.status,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        error:
          "Checkout not configured. Set STRIPE_SECRET_KEY or CHECKOUT_API_URL in Cloudflare Pages environment variables.",
      }),
      { status: 501, headers: { "content-type": "application/json" } },
    );
  } catch (err) {
    console.error("[PAGES CHECKOUT ERROR]", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
