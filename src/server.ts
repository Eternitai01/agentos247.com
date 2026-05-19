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

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
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

    // Forward to hooks endpoint for processing
    try {
      await fetch("http://localhost:18789/hooks/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer hooks-o3zWBFPMhc4mGD06yK37EDpuVKmzarlA",
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

// Handle BYOK checkout — creates Stripe Checkout Session or proxies to backend
async function handleCheckout(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    console.log("[CHECKOUT]", JSON.stringify(body));

    // Determine the origin for success/cancel URLs
    const url = new URL(request.url);
    const origin = url.origin;

    const STRIPE_KEY = (typeof process !== "undefined" && (process as any).env?.STRIPE_SECRET_KEY) 
      || (globalThis as any).STRIPE_SECRET_KEY;

    if (STRIPE_KEY) {
      // Create Stripe Checkout Session directly via API
      const params = new URLSearchParams();
      params.set("mode", "payment");
      params.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
      params.set("cancel_url", `${origin}${body.source === "byok" ? "/byok" : ""}#pricing`);
      params.set("customer_email", (body.email || "") as string);
      params.set("line_items[0][price_data][currency]", "eur");
      params.set(
        "line_items[0][price_data][product_data][name]",
        `AgentOS247 ${body.source === "byok" ? "BYOK" : ""} - ${body.plan}` as string,
      );
      params.set("line_items[0][price_data][product_data][metadata][plan]", body.plan as string);
      params.set("line_items[0][price_data][product_data][metadata][billing]", body.billing as string);
      params.set("line_items[0][price_data][unit_amount]", `${Math.round(Number(body.price) * 100)}`);
      params.set("line_items[0][quantity]", "1");

      const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const session = await stripeRes.json<any>();

      if (!stripeRes.ok) {
        return new Response(
          JSON.stringify({ error: session.error?.message || "Stripe error" }),
          { status: stripeRes.status, headers: { "content-type": "application/json" } },
        );
      }

      // Forward order details to hooks endpoint
      try {
        await fetch("http://localhost:18789/hooks/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer hooks-o3zWBFPMhc4mGD06yK37EDpuVKmzarlA",
          },
          body: JSON.stringify({
            type: "order_created",
            payload: { ...body, stripeSessionId: session.id },
          }),
        }).catch(() => {});
      } catch {
        // silently fail
      }

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Checkout not configured (missing STRIPE_SECRET_KEY)." }),
      { status: 501, headers: { "content-type": "application/json" } },
    );
  } catch (err) {
    console.error("[CHECKOUT]", err);
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
        return await handleCheckout(request);
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
