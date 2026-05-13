import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";

const PLANS: { id: PlanId; name: string; channel: string; monthly: number; discounted: number; monthly12: number; monthly24: number; highlight?: boolean }[] = [
  { id: "basic", name: "Basic", channel: "Telegram", monthly: 180, discounted: 90, monthly12: 65, monthly24: 49 },
  { id: "plus", name: "Plus", channel: "Telegram + WhatsApp", monthly: 219, discounted: 109, monthly12: 79, monthly24: 59, highlight: true },
  { id: "elite", name: "Elite", channel: "All channels", monthly: 552, discounted: 276, monthly12: 199, monthly24: 149 },
];

export const BILLING = [
  { id: "monthly", label: "Monthly", save: "Save 50%", priceKey: "discounted" as const, months: 1 },
  { id: "annual", label: "Annual", save: "Save 64%", priceKey: "monthly12" as const, months: 12 },
  { id: "2y", label: "2 Years", save: "Save 73%", priceKey: "monthly24" as const, months: 24 },
] as const;

export type BillingId = typeof BILLING[number]["id"];
export type PlanId = "basic" | "plus" | "elite";

type Props = {
  role: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan?: PlanId;
  initialBilling?: BillingId;
};

export function AgentCheckoutDialog({
  role,
  open,
  onOpenChange,
  initialPlan = "plus",
  initialBilling = "annual",
}: Props) {
  const { t } = useT();
  const [billing, setBilling] = useState<BillingId>(initialBilling);
  const [plan, setPlan] = useState<PlanId>(initialPlan);

  useEffect(() => {
    if (open) {
      setBilling(initialBilling);
      setPlan(initialPlan);
    }
  }, [open, initialBilling, initialPlan]);

  const [email, setEmail] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agreed, setAgreed] = useState(false);

  const billingInfo = BILLING.find((b) => b.id === billing);
  const priceKey = billingInfo?.priceKey ?? "discounted";
  const months = billingInfo?.months ?? 1;
  const selectedPlan = PLANS.find((p) => p.id === plan);
  const monthlyPrice = selectedPlan?.[priceKey] ?? 0;
  const totalDue = monthlyPrice * months;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto bg-background border-border p-5 sm:p-6">
        <DialogHeader className="space-y-2 text-left">
          {role && (
            <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              {t(role)}
            </span>
          )}
          <DialogTitle className="text-lg font-extrabold tracking-tight leading-tight">
            {t("Launch and configure your")} {role ? t(role) : ""} {t("AI agent")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1 grid grid-cols-3 rounded-lg border border-border p-1 bg-surface">
          {BILLING.map((b) => (
            <button
              key={b.id}
              onClick={() => setBilling(b.id)}
              className={`rounded-md px-2 py-1.5 text-xs font-semibold transition-colors leading-tight ${
                billing === b.id ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <div>{t(b.label)}</div>
              {b.save && <div className="text-[0.6rem] opacity-80 font-medium">{t(b.save)}</div>}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-1.5">
          {PLANS.map((p) => {
            const price = p[priceKey];
            const original = p.monthly;
            const selected = plan === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                className={`w-full flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                  selected ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
                }`}
              >
                <div>
                  <div className="font-bold text-sm">{t(p.name)}</div>
                  <div className="text-[11px] text-muted-foreground">{t(p.channel)}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold">€{price}</div>
                  <div className="text-[11px] text-muted-foreground line-through">€{original}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 space-y-2.5">
          <div>
            <label className="text-xs font-semibold">
              {t("Email")} <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-0.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">
              {t("Telegram ID")} <span className="text-destructive">*</span>
            </label>
            <input
              required
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value.replace(/\D/g, ""))}
              placeholder={t("Numbers only")}
              className="mt-0.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("Open")} <a className="text-accent-blue" href="https://t.me/chatid_echo_bot" target="_blank" rel="noreferrer">@chatid_echo_bot</a> {t("in Telegram to get your ID")}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold">
              {t("Agent name")} <span className="text-muted-foreground font-normal">{t("(optional)")}</span>
            </label>
            <input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. Alex, Sofia, Max..."
              className="mt-0.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <label className="flex items-start gap-2 text-xs">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              {t("I agree to the")}{" "}
              <a href="#" className="text-accent-blue">{t("Terms of Service")}</a> {t("and")}{" "}
              <a href="#" className="text-accent-blue">{t("Privacy Policy")}</a>
            </span>
          </label>
        </div>

        {months > 1 && (
          <div className="mt-3 rounded-lg border border-border bg-surface p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{t("Total due today")}:</span>
              <span className="text-lg font-extrabold text-foreground">€{totalDue}</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {monthlyPrice} × {months} {t("months")}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold hover:bg-muted"
          >
            {t("Cancel")}
          </button>
          <button
            disabled={!agreed || !email || !telegramId}
            className="flex-[2] rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("Continue to payment")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}