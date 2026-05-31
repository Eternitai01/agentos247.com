import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/checkout/success")({
  component: CheckoutSuccess,
  head: () => ({
    meta: [
      { title: "Order Confirmed — AgentOS 24/7" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function CheckoutSuccess() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-10 text-center shadow-sm">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="mb-3 text-2xl font-extrabold tracking-tight">You're in.</h1>
          <p className="mb-6 text-muted-foreground">
            Payment confirmed. Welcome to AgentOS 24/7.
          </p>
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
            <strong>We've sent you an email with your setup instructions.</strong>
            <br />
            Click the link in that email to connect your AI agent — it takes about 5 minutes.
          </div>
          <p className="mb-1 text-xs text-muted-foreground">
            Don't see it? Check your spam or junk folder.
          </p>
          <p className="mb-8 text-xs text-muted-foreground">
            Still nothing? Email us at{" "}
            <a href="mailto:team@agentos247.com" className="text-primary hover:underline">
              team@agentos247.com
            </a>
          </p>
          <a
            href="/"
            className="inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Back to AgentOS 24/7
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
