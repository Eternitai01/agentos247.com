# AgentOS247 Checkout Implementation

**Status:** Backend Complete ✅ | Frontend Pending 🚧  
**Date:** 2026-05-16

---

## Backend API

### Checkout Endpoint

**POST /api/agentos247/checkout**

**Request:**
```json
{
  "email": "customer@example.com",
  "plan": "plus",
  "type": "instant",
  "duration": 12,
  "channel": "telegram",
  "agent_name": "MyBot",
  "dante": false
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### Plans & Pricing

**Instant Plans:**
- Basic: €90/€65/€49 (1mo/12mo/24mo)
- Plus: €110/€79/€59
- Elite: €276/€199/€149

**BYOK Plans:**
- Starter: €54/€39/€29
- Pro: €91/€65/€49
- Business: €184/€132/€99

**Add-on:**
- Dante Guardian: €19/mo

All prices are **recurring monthly subscriptions** in Stripe.

---

## Stripe Integration

### Products Created

19 Stripe price objects exist with nicknames:
- `agentos_instant_{plan}_{duration}mo`
- `agentos_byok_{plan}_{duration}mo`
- `agentos_dante_addon`

See `WHATSAPP-TWILIO-SETUP.md` for full price ID list.

### Webhook Handling

Stripe webhook at `/api/stripe/webhook` handles:
- `checkout.session.completed` → Provision agent
- `customer.subscription.deleted` → Cancel agent
- `invoice.payment_failed` → Send alert

AgentOS247 customers identified by metadata: `source: "agentos247"`

---

## Email System

### Welcome Email
- **From:** AgentOS247 <team@clawolution.com>
- **Reply-To:** team@eternitaigroup.com
- **Subject:** Welcome to AgentOS247 — Meet Charlie, Your AI Agent Guide
- **Content:** Branded welcome with Telegram/WhatsApp links

### Admin Notification
- **To:** team@eternitaigroup.com
- **Subject:** 🎯 New AgentOS247 Lead
- **Content:** Lead details table

Powered by Resend API (same account as Clawolution).

---

## Agent Deployment

### Architecture

**Reuses Clawolution infrastructure:**
- Same Hetzner warm server pool
- Same provisioning scripts (configureWarmAgent)
- Same monitoring (Dante Guardian)

**Differentiation:**
- Metadata: `source: "agentos247"`
- Branding: All emails say "AgentOS247"
- Success URL: agentos247.com/success

### Deployment Flow

1. Customer pays → Stripe webhook
2. Create customer record (source: agentos247)
3. Allocate VPS from warm pool
4. Configure agent with AgentOS247 branding
5. Agent goes live (Telegram/WhatsApp)
6. Send welcome email
7. Redirect to success page

---

## Frontend Integration (TODO)

### Update Checkout Dialogs

**Files to modify:**
- `src/components/site/AgentCheckoutDialog.tsx`
- `src/components/site/BYOKCheckoutDialog.tsx`

**Change:**
```typescript
// Replace API endpoint
const response = await fetch('https://clawolution.com/api/agentos247/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    plan,
    type,
    duration,
    channel,
    agent_name,
    dante,
    api_key,
    bot_token
  })
});

const { url } = await response.json();
if (url) {
  window.location.href = url; // Redirect to Stripe
}
```

### Create Success Page

**Route:** `/success`

**Query params:** `?session_id={CHECKOUT_SESSION_ID}`

**Content:**
- Thank you message
- "Your agent is being set up..."
- Next steps (check email, add bot)
- Support link

---

## Testing

### Test Mode (Use Stripe Test Keys)

1. Update `.env` with test keys
2. Create test products in Stripe
3. Test checkout with card: `4242 4242 4242 4242`
4. Verify webhook delivery
5. Check agent provisioning

### Production Checklist

- [ ] Frontend checkout dialogs updated
- [ ] Success page created
- [ ] Tested with real Stripe test card
- [ ] Verified webhook handling
- [ ] Checked email delivery
- [ ] Confirmed agent deployment
- [ ] Monitored first 3 customers

---

## Backup & Recovery

**Server backup:**
- `/opt/clawolution-api/backups/agentos247-checkout-2026-05-16.tar.gz`

**GitHub:**
- This documentation in `docs/backend-integration/`

**Restoration:**
- See `RESTORE.md` in this directory

---

**Questions?** Check other docs or contact Dante K. (Technical Support)
