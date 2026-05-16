# AgentOS247 Backend Integration Documentation

**Last updated:** 2026-05-16
**Maintained by:** Dante K. (Technical Support)

## Overview

This directory contains production backend integration documentation for AgentOS247, including:

1. **WhatsApp Business API Integration** (no QR pairing)
2. **Lead Capture System** (widget → API → Telegram/WhatsApp)
3. **Pricing Structure** (official Stripe-verified pricing)
4. **Backup & Restoration Procedures**

## Quick Links

- [WhatsApp Twilio Setup](./WHATSAPP-TWILIO-SETUP.md) - Complete WhatsApp integration guide
- [Official Pricing](./agentos247-pricing.md) - All plans with Stripe product IDs
- [Backup Manifest](./BACKUP-MANIFEST.md) - What's backed up and where
- [Restore Guide](./RESTORE.md) - Recovery procedures

## Critical Files (Production)

**On Main VPS (76.13.142.77):**
- `/opt/clawolution-api/whatsapp-twilio-bridge.js` - WhatsApp routing
- `/opt/clawolution-api/widget-lead-capture.js` - Lead API
- `/opt/clawolution-api/agentos247-contacts.json` - Contact database
- `/opt/clawolution-api/agentos247-pricing.md` - Pricing reference
- `/opt/clawolution-api/leads.json` - Leads database

**OpenClaw Container:**
- `~/.openclaw/workspace-agentos247/` - Charlie agent workspace

## Backup Location

**Production backups:**
- `/opt/clawolution-api/backups/agentos247-complete-2026-05-16.tar.gz`

**GitHub:** This repository (docs/backend-integration/)

## Emergency Contacts

- **Carlos Cuevas (CEO):** Telegram @CarlosCuevasO (490130544)
- **Amaya (CoS):** Via Main VPS Telegram bot
- **Raj (CTO):** Via Main VPS Telegram bot
- **Dante (Support):** Hostinger VPS (technical issues only)

## Change Log

### 2026-05-16
- Initial documentation created
- WhatsApp integration documented
- Lead capture system documented
- Pricing corrected and verified against Stripe
- Complete backup created

