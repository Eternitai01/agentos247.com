import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// Forward lead capture to internal hooks endpoint
async function handleLeadCapture(request: Request): Promise<Response> {
  try {
    const lead = await request.json();
    console.log("[LEAD CAPTURE]", JSON.stringify(lead));

    try {
      await fetch("http://localhost:18789/hooks/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer …-…",
        },
        body: JSON.stringify({
          type: "lead_capture",
          payload: lead,
        }),
      }).catch(() => {});
    } catch {
      // silently fail
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid payload" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

// ── Checkout handler: direct Stripe integration ──────────────────────────

// Price table (EUR, in cents) — must match AgentCheckoutDialog.tsx PLANS
const PLAN_PRICES: Record<string, Record<number, number>> = {
  basic:  { 1: 9000,  12: 6500,  24: 4900  },
  plus:   { 1: 11000, 12: 7900,  24: 5900  },
  elite:  { 1: 27600, 12: 19900, 24: 14900 },
};

const BYOK_PRICES: Record<string, Record<number, number>> = {
  starter:  { 1: 5400, 12: 3900, 24: 2900 },
  pro:      { 1: 9100, 12: 6600, 24: 4900 },
  business: { 1: 18400, 12: 13300, 24: 10000 },
};

const DANTE_PRICE = 1900; // EUR cents

async function handleCheckout(request: Request, env: any): Promise<Response> {
  try {
    const rawBody = await request.json();
    console.log("[WORKER CHECKOUT]", JSON.stringify(rawBody));

    const url = new URL(request.url);
    const origin = url.origin;

    // Extract fields — supports both old and new body formats
    const plan = String(rawBody.plan || "plus");
    const isByok = rawBody.source === "byok" || rawBody.type === "byok";
    const duration = Number(rawBody.duration || rawBody.months || 1);
    const email = String(rawBody.email || "");
    const agentName = String(rawBody.agent_name || rawBody.agentName || "");
    const agentGender = String(rawBody.agent_gender || "female");
    const channel = String(rawBody.channel || "telegram");
    const dante = Boolean(rawBody.dante || rawBody.guardian || false);

    // Look up the MONTHLY price in cents
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

    // Multiply monthly price by duration to get total amount (cents)
    const totalCents = (monthlyCents * duration) + (dante ? DANTE_PRICE * duration : 0);
    const durationLabel = duration === 1 ? "monthly" : duration === 12 ? "annually" : "biennially";

    // Build product name for Stripe invoice
    const productName = `AgentOS247 ${isByok ? "BYOK" : ""} — ${plan} (${duration} month${duration > 1 ? "s" : ""})`;

    const stripeKey = env?.STRIPE_SECRET_KEY || (globalThis as any).STRIPE_SECRET_KEY;

    if (stripeKey) {
      const params = new URLSearchParams();
      params.set("mode", "payment");
      params.set(
        "success_url",
        `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      );
      // cancel_url goes back to the pricing section on agentos247.com
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
      params.set("line_items[0][price_data][product_data][metadata][billing]", durationLabel);
      params.set("line_items[0][price_data][unit_amount]", String(totalCents));
      // Top-level session metadata — readable from checkout.session.completed
      params.set("metadata[agent_gender]", agentGender);
      params.set("metadata[agent_name]", agentName);
      params.set("metadata[plan]", plan);
      params.set("metadata[duration]", String(duration));
      params.set("metadata[channel]", channel);
      if (email) params.set("metadata[email]", email);
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

    // ⚠️ FALLBACK: Send calculated price to clawolution.com Express backend.
    // The backend may use the `price` and `total` fields if it accepts them.
    const monthlyPrice = monthlyCents / 100;
    const totalPrice = totalCents / 100;
    const enrichedBody = {
      ...rawBody,
      price: String(monthlyPrice),
      total: String(totalPrice),
    };
    const FALLBACK = "https://clawolution.com/api/agentos247/checkout";
    console.log("[WORKER CHECKOUT] No Stripe key — proxying to", FALLBACK, "with total=", totalPrice);
    const response = await fetch(FALLBACK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enrichedBody),
    });

    const data = await response.json<any>();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("[WORKER CHECKOUT ERROR]", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

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

      // Handle API routes
      if (url.pathname === "/api/lead" && request.method === "POST") {
        return await handleLeadCapture(request);
      }

      if (url.pathname === "/api/agentos247/checkout" && request.method === "POST") {
        return await handleCheckout(request, env);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
