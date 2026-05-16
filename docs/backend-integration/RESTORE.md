# AgentOS247 Restoration Guide

## Prerequisites
- Main VPS running (76.13.142.77)
- OpenClaw container running
- clawolution-api service installed

## Step 1: Restore API Files

```bash
# Copy files to /opt/clawolution-api/
cp whatsapp-twilio-bridge.js /opt/clawolution-api/
cp widget-lead-capture.js /opt/clawolution-api/
cp agentos247-contacts.json /opt/clawolution-api/
cp agentos247-pricing.md /opt/clawolution-api/
cp leads.json /opt/clawolution-api/

# Restore SSH key
cp clawolution_provisioner /root/.ssh/
chmod 600 /root/.ssh/clawolution_provisioner

# Restart service
systemctl restart clawolution-api
```

## Step 2: Restore Agent Workspace

```bash
# Extract workspace
docker cp agentos247-workspace.tar.gz openclaw-4roq-openclaw-1:/tmp/
docker exec openclaw-4roq-openclaw-1 bash -c "
  mkdir -p ~/.openclaw/workspace-agentos247
  cd ~/.openclaw/workspace-agentos247
  tar xzf /tmp/agentos247-workspace.tar.gz
"
```

## Step 3: Restore OpenClaw Binding

```bash
# Add binding to openclaw.json
docker exec openclaw-4roq-openclaw-1 bash -c '
  jq ".bindings += $(cat /tmp/openclaw-config-snippet.json | jq .bindings)" \
    /data/.openclaw/openclaw.json > /tmp/openclaw_new.json
  mv /tmp/openclaw_new.json /data/.openclaw/openclaw.json
'

# Restart OpenClaw
docker restart openclaw-4roq-openclaw-1
```

## Step 4: Verify

```bash
# Test WhatsApp webhook
curl -X POST https://clawolution.com/webhook/whatsapp/twilio \
  -d "From=whatsapp:+34673572343" \
  -d "To=whatsapp:+14786063563" \
  -d "Body=test"

# Check logs
journalctl -u clawolution-api -f

# Test Telegram routing
docker exec openclaw-4roq-openclaw-1 openclaw agents | grep agentos247
```

## Step 5: Update server.js (if needed)

Ensure server.js has these lines:

```javascript
const widgetLeadCapture = require("./widget-lead-capture");
const { registerTwilioWebhook, sendTwilioWhatsApp } = require('./whatsapp-twilio-bridge');

// After express.json()
app.use("/api/agentos247", widgetLeadCapture);

// Register Twilio webhook
registerTwilioWebhook(app, express, findCustomerByWhatsappNumber, findDefaultCustomer);
```

## Verification Checklist

- [ ] WhatsApp responds to test message
- [ ] Telegram @agentos247_bot routes to correct agent
- [ ] Lead capture API works: `curl -X POST https://clawolution.com/api/agentos247/lead ...`
- [ ] Contact lookup works (Charlie greets by name)
- [ ] Pricing is correct in Charlie's responses

