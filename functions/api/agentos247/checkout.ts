// Cloudflare Pages Function — handles POST /api/agentos247/checkout
// Supports BOTH the old clawolution-proxy body format AND the new direct format.
// Deploy to Cloudflare Pages with STRIPE_SECRET_KEY env var set.

// Price table (EUR, in cents) — must match AgentCheckoutDialog.tsx PLANS
const PLAN_PRICES: Record<string, Record<number, number>> = {
  basic:  { 1: 9000,  12: 6500,  24: 4900  },
  plus:   { 1: 11000, 12: 7900,  24: 5900  },
  elite:  { 1: 27600, 12: 19900, 24: 14900 },
};

// BYOK price table (EUR, in cents)
const BYOK_PRICES: Record<string, Record<number, number>> = {
  starter:  { 1: 5400, 12: 3900, 24: 2900 },
  pro:      { 1: 9100, 12: 6600, 24: 4900 },
  business: { 1: 18400, 12: 13300, 24: 10000 },
};

// Optional Dante Guardian add-on (EUR, in cents)
const DANTE_PRICE = 1900;

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
    const rawBody = await request.json();
    console.log("[PAGES CHECKOUT]", JSON.stringify(rawBody));

    const url = new URL(request.url);
    const origin = url.origin;

    // Extract fields — support both old and new body formats
    const plan = String(rawBody.plan || "plus");
    const isByok = rawBody.source === "byok" || rawBody.type === "byok";
    const duration = Number(rawBody.duration || rawBody.months || 1);
    const email = String(rawBody.email || "");
    const agentName = String(rawBody.agent_name || rawBody.agentName || "");
    const channel = String(rawBody.channel || "telegram");
    const dante = Boolean(rawBody.dante || rawBody.guardian || false);

    // Look up the MONTHLY price in cents (not the total)
    const priceTable = isByok ? BYOK_PRICES : PLAN_PRICES;
    const planPrices = priceTable[plan];
    if (!planPrices) {
      return new Response(
        JSON.stringify({ error: `Unknown plan: ${plan}` }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const monthlyCents = planPrices[duration] || planPrices[1];
    if (!monthlyCents) {
      return new Response(
        JSON.stringify({ error: `No price for plan=${plan} duration=${duration}` }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    // ⚠️ CRITICAL FIX: multiply monthly price by duration to get total amount
    const totalCents = (monthlyCents * duration) + (dante ? DANTE_PRICE * duration : 0);

    // Build product name
    const productName = `AgentOS247 ${isByok ? "BYOK" : ""} — ${plan} (${duration} month${duration > 1 ? "s" : ""})`;
    const durationLabel = duration === 1 ? "monthly" : duration === 12 ? "annually" : "biennially";

    const stripeKey = env.STRIPE_SECRET_KEY || (globalThis as any).STRIPE_SECRET_KEY;

    if (stripeKey) {
      const params = new URLSearchParams();
      params.set("mode", "payment");
      params.set(
        "success_url",
        `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      );
      // ✅ FIXED: cancel_url points to valid page
      params.set(
        "cancel_url",
        `${origin}${isByok ? "/byok" : ""}#pricing`,
      );
      params.set("customer_email", email);
      params.set("line_items[0][price_data][currency]", "eur");
      params.set(
        "line_items[0][price_data][product_data][name]",
        productName,
      );
      params.set("line_items[0][price_data][product_data][metadata][plan]", plan);
      params.set(
        "line_items[0][price_data][product_data][metadata][billing]",
        durationLabel,
      );
      // ✅ FIXED: unit_amount = monthly price × duration (total amount in cents)
      params.set(
        "line_items[0][price_data][unit_amount]",
        String(totalCents),
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

      const session = (await stripeRes.json()) as {
        url?: string;
        error?: { message: string };
      };

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
        body: JSON.stringify(rawBody),
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
