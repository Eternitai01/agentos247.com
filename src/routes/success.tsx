import { createFileRoute, Link } from "@tanstack/react-router";
import agentosLogo from "../assets/agentos247-logo.png";

export const Route = createFileRoute("/success")({
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full space-y-8">

        {/* Logo */}
        <div className="text-center">
          <img src={agentosLogo} alt="AgentOS247" className="h-9 w-auto mx-auto" />
        </div>

        {/* Main card */}
        <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Payment confirmed</p>
            <h1 className="text-2xl font-bold text-foreground leading-snug">Your agent is being set up</h1>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Configuration takes about 60 seconds. You will receive an email with your Telegram bot link the moment it's ready.
            </p>
          </div>

          <div className="border-t border-border pt-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-primary block" />
              </span>
              <span className="text-sm text-foreground">Payment received</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-muted-foreground block" />
              </span>
              <span className="text-sm text-muted-foreground">Agent being configured (~60 seconds)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-muted-foreground block" />
              </span>
              <span className="text-sm text-muted-foreground">Email with Telegram link on the way</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            Back to home
          </Link>
          <p className="text-xs text-muted-foreground">
            Questions?{" "}
            <a href="mailto:team@agentos247.com" className="text-primary hover:underline">team@agentos247.com</a>
          </p>
        </div>

      </div>
    </div>
  );
}
