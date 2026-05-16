# OpenClaw WhatsApp Integration via Twilio Business API

**NO QR CODE PAIRING REQUIRED** - Uses Twilio Business API instead of WhatsApp Web

**Date:** 2026-05-16
**Author:** Dante K.
**Verified by:** Carlos Cuevas (@CarlosCuevasO)

---

## Overview

This integration allows OpenClaw agents to send/receive WhatsApp messages via Twilio's Business API without requiring QR code pairing or WhatsApp Web sessions.

**Key Difference from Standard OpenClaw:**
- Standard OpenClaw: WhatsApp plugin uses QR pairing (WhatsApp Web)
- This setup: Twilio Business API (no QR needed, production-grade)

---

## Architecture

```
User WhatsApp → Twilio → Webhook → Bridge Script → OpenClaw Agent → Response
```

1. User sends WhatsApp message to Twilio number
2. Twilio forwards to webhook: `POST /webhook/whatsapp/twilio`
3. Bridge script (`whatsapp-twilio-bridge.js`) routes by phone number
4. SSH to customer VPS → OpenClaw agent → get response
5. Bridge sends response back via Twilio API

---

## Configuration Files

### 1. Bridge Script
**Location:** `/opt/clawolution-api/whatsapp-twilio-bridge.js`

**Key Functions:**
- `registerTwilioWebhook(app, express, findCustomerByWhatsappNumber, findDefaultCustomer)`
- `sendTwilioWhatsApp(to, text, fromNumber)`
- `getAgentResponse(ip, senderPhone, messageText)` - SSH to customer VPS
- `getAgentosResponse(senderPhone, messageText)` - Direct Anthropic for AgentOS247

**Routing Logic:**
```javascript
// Special number routing (hardcoded)
if (to === "+17124848763") // Kira
if (to === "+14783216261") // Armando
if (to === "+14783216254") // Enzo FCB
if (to === "+13187064437") // Amaya FCB
if (to === "+14786063563") // AgentOS247 Charlie

// Customer routing (from customers.json)
customer = findCustomerByWhatsappNumber(to);
// SSH to customer.hetznerIp → docker exec → openclaw agent

// Fallback: Clawolution Charlie
getCharlyResponse(from, body);
```

### 2. Contact Context Database
**Location:** `/opt/clawolution-api/agentos247-contacts.json`

```json
{
  "contacts": [
    {
      "phone": "34673572343",
      "telegram_id": "490130544",
      "name": "Carlos Cuevas",
      "email": "cc@eternitaigroup.com",
      "source": "agentos247_website",
      "timestamp": "2026-05-16T08:00:00Z"
    }
  ]
}
```

**Purpose:** Pre-fill agent context so Charlie can greet users by name

### 3. Server Integration
**Location:** `/opt/clawolution-api/server.js`

```javascript
const { registerTwilioWebhook, sendTwilioWhatsApp } = require('./whatsapp-twilio-bridge');
const { sendWhatsApp } = require('./whatsapp-support');

// Twilio webhook endpoint
registerTwilioWebhook(app, express, findCustomerByWhatsappNumber, findDefaultCustomer);
```

---

## Twilio Credentials

**Account SID:** `TWILIO_ACCOUNT_SID_FROM_ENV`
**Auth Token:** `TWILIO_AUTH_TOKEN_FROM_ENV`

**Environment Variables:**
```bash
# In /opt/clawolution-api/.env
TWILIO_ACCOUNT_SID=TWILIO_ACCOUNT_SID_FROM_ENV
TWILIO_AUTH_TOKEN=TWILIO_AUTH_TOKEN_FROM_ENV
```

**Webhook URL:** `https://clawolution.com/webhook/whatsapp/twilio`

---

## Phone Number Routing

### AgentOS247 Charlie
- **Number:** +14786063563
- **Agent:** `agentos247` on main VPS (76.13.142.77)
- **Container:** `openclaw-4roq-openclaw-1`
- **Command:** `openclaw agent --agent agentos247 --message "$msg" --session-id "wa-$phone"`
- **Context lookup:** Checks `/opt/clawolution-api/agentos247-contacts.json` for name/email

### Customer Numbers
- Stored in `/opt/clawolution-api/customers.json`
- Field: `whatsappNumber` or matched by `ownerPhone`
- Routes to `customer.hetznerIp` VPS

### Hardcoded Special Numbers
- **+17124848763:** Kira → 109.176.197.229 (Nelson's VPS)
- **+14783216261:** Armando → 91.98.73.73 (dedicated server)
- **+14783216254:** Enzo FCB → 178.104.172.161
- **+13187064437:** Amaya FCB → 178.104.172.161

---

## SSH Requirements

**Bridge uses SSH to reach customer VPS:**

```bash
ssh -i /root/.ssh/clawolution_provisioner root@<customer_ip> \
  "docker exec <container> openclaw agent --agent <agent_id> --message '$msg' --session-id 'wa-$phone'"
```

**Required:**
- SSH key: `/root/.ssh/clawolution_provisioner` (on main VPS)
- Must be authorized on all customer VPS instances
- Docker access on target VPS

---

## How to Add New WhatsApp Number

### Option 1: Customer VPS routing
1. Add entry to `/opt/clawolution-api/customers.json`:
   ```json
   {
     "whatsappNumber": "+1234567890",
     "hetznerIp": "1.2.3.4",
     "containerName": "openclaw-xyz-openclaw-1",
     "agentId": "default"
   }
   ```
2. Restart clawolution-api: `systemctl restart clawolution-api`

### Option 2: Hardcoded special routing
1. Edit `/opt/clawolution-api/whatsapp-twilio-bridge.js`
2. Add new `if (to === "+1234567890")` block before line 470
3. Follow pattern from existing special routes
4. Restart service

---

## Twilio Setup (for new numbers)

1. **Buy number in Twilio console:**
   - https://console.twilio.com/us1/develop/phone-numbers
   - Select country, search for available numbers
   - Enable "SMS" and "Voice" capabilities

2. **Configure webhook:**
   - Messaging → Webhook: `https://clawolution.com/webhook/whatsapp/twilio`
   - Method: HTTP POST
   - Content type: application/x-www-form-urlencoded

3. **Enable WhatsApp:**
   - Twilio → Messaging → WhatsApp senders
   - Request production access (requires business verification)
   - OR use Sandbox for testing

---

## Advantages Over QR Pairing

✅ **No QR code expiration** - Business API tokens don't expire
✅ **Production-grade** - Twilio SLA, deliverability monitoring
✅ **Multi-device** - Same number can serve multiple agents
✅ **Webhook reliability** - Instant delivery, no polling
✅ **Business features** - Message templates, verified sender
✅ **Scalable** - Handle thousands of conversations
✅ **No session maintenance** - No WhatsApp Web connection to babysit

---

## Monitoring & Logs

**Service logs:**
```bash
journalctl -u clawolution-api -f | grep "WA Twilio"
```

**Common log patterns:**
```
[WA Twilio] From +34673572343 → +14786063563: "Who are you?"
[WA Twilio] Routing to AgentOS247 agent on main VPS
[WA AgentOS] Response length: 425
[WA AgentOS] ✅ Sent response to +34673572343
```

**Health check:**
```bash
curl -X POST https://clawolution.com/webhook/whatsapp/twilio \
  -d "From=whatsapp:+1234567890" \
  -d "To=whatsapp:+14786063563" \
  -d "Body=test"
```

---

## Troubleshooting

### Issue: Messages not routing
- Check `journalctl -u clawolution-api` for errors
- Verify phone number format: must include country code, no spaces
- Check SSH key permissions: `/root/.ssh/clawolution_provisioner` mode 600

### Issue: Responses timeout
- SSH timeout is 180 seconds (3 minutes)
- Check customer VPS is reachable: `ssh -i ~/.ssh/clawolution_provisioner root@<ip>`
- Check OpenClaw container running: `docker ps`

### Issue: Contact context not working
- Verify `/opt/clawolution-api/agentos247-contacts.json` exists
- Phone number must match exactly (digits only, no + or spaces)
- Restart service after editing contacts

---

## Security Notes

- Twilio webhook endpoint is **public** (must be for Twilio to reach)
- No authentication on webhook (Twilio validates via signature - not implemented yet)
- SSH key gives root access to all customer VPS - **protect carefully**
- Consider adding Twilio signature validation for production

---

## Backup & Recovery

**Critical files to backup:**
1. `/opt/clawolution-api/whatsapp-twilio-bridge.js`
2. `/opt/clawolution-api/agentos247-contacts.json`
3. `/opt/clawolution-api/customers.json`
4. `/opt/clawolution-api/.env` (Twilio credentials)
5. `/root/.ssh/clawolution_provisioner` (SSH key)

**Restore procedure:**
1. Place files in same locations
2. Restart service: `systemctl restart clawolution-api`
3. Verify webhook: `curl -X POST https://clawolution.com/webhook/whatsapp/twilio ...`

---

## Future Improvements

- [ ] Add Twilio signature validation for webhook security
- [ ] Implement rate limiting per phone number
- [ ] Add message queue for handling bursts
- [ ] Store conversation history in database
- [ ] Add analytics dashboard
- [ ] Implement message templates for common responses
- [ ] Add automatic failover if customer VPS unreachable

---

## References

- Twilio WhatsApp API: https://www.twilio.com/docs/whatsapp
- OpenClaw WhatsApp plugin: Uses QR pairing (different approach)
- This setup: Bridge pattern for Business API integration

---

**Last updated:** 2026-05-16 by Dante K.
**Status:** Production (AgentOS247 Charlie live on +14786063563)

---

## Security Note

**Credentials have been sanitized in this public documentation.**

Actual values are stored in:
- `/opt/clawolution-api/.env` on production server
- `/etc/environment` on main VPS

Never commit real credentials to version control.

