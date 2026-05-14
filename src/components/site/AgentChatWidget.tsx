import { useState } from "react";
import { MessageCircle, Phone, X, Loader2 } from "lucide-react";
import agentAvatar from "@/assets/charlie-agentos247.jpg";

const WHATSAPP_NUMBER = "17869339375";

function globalStyles() {
  return `
@keyframes agentPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
}
.agent-pulse { animation: agentPulse 2s ease-out infinite; }
  `;
}

export function AgentChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "channels">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function resetAndClose() {
    setStep("form");
    setName("");
    setEmail("");
    setError("");
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) {
      setError("Please enter your name and email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    setSubmitting(true);
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          source: "chat-widget",
          page: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
    setSubmitting(false);
    setStep("channels");
  }

  function openTelegram() {
    const param = encodeURIComponent(`${name}_${email}`);
    window.open(`https://t.me/agentos247_bot?start=${param}`, "_blank", "noopener,noreferrer");
    resetAndClose();
  }

  function openWhatsApp() {
    const text = encodeURIComponent(
      `Hi, I'm ${name} (${email}). I'd like to know more about AgentOS 24/7.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    resetAndClose();
  }

  if (!open) {
    return (
      <>
        <style>{globalStyles()}</style>
        <button
          onClick={() => setOpen(true)}
          className="agent-pulse fixed bottom-6 right-6 z-[99998] w-16 h-16 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          aria-label="Chat with AgentOS 24/7"
        >
          <img
            src={agentAvatar}
            alt="AgentOS 24/7"
            className="w-full h-full rounded-full object-cover object-center"
          />
        </button>
      </>
    );
  }

  return (
    <>
      <style>{globalStyles()}</style>
      <div
        className="fixed inset-0 bg-black/75 z-[99999] flex items-center justify-center p-4"
        onClick={() => setOpen(false)}
      >
        <div
          className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-10 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

          {/* STEP 1: Lead Form */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full mx-auto border-2 border-indigo-500 overflow-hidden mb-3"
                  style={{ boxShadow: "0 0 0 6px rgba(99,102,241,0.15), 0 0 0 12px rgba(99,102,241,0.08)" }}
                >
                  <img src={agentAvatar} alt="AgentOS 24/7" className="w-full h-full object-cover" />
                </div>
                <p className="text-white font-semibold text-lg">Chat with Charlie</p>
                <p className="text-slate-400 text-sm mt-1">
                  Enter your details and let's chat about AI agents
                </p>
              </div>
              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                  autoFocus
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> One moment...</>
                ) : "Start Chat"}
              </button>
              <p className="text-xs text-slate-600 text-center mt-3">
                We'll never share your info.{" "}
                <a href="https://agentos247.com/privacy/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Privacy Policy</a>.
              </p>
            </form>
          )}

          {/* STEP 2: Channel Selection */}
          {step === "channels" && (
            <div className="p-6">
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full mx-auto border-2 border-green-500 overflow-hidden mb-2"
                  style={{ boxShadow: "0 0 0 6px rgba(34,197,94,0.15)" }}
                >
                  <img src={agentAvatar} alt="AgentOS 24/7" className="w-full h-full object-cover" />
                </div>
                <p className="text-green-400 font-semibold text-sm">Thanks, {name.split(" ")[0]}!</p>
                <p className="text-slate-400 text-xs mt-1">How would you like to chat?</p>
              </div>
              <div className="space-y-3 mt-4">
                <button onClick={openTelegram} className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white rounded-xl px-4 py-3.5 transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#0088cc]/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#0088cc]" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-sm">Telegram</p>
                    <p className="text-xs text-slate-500 truncate">@agentos247_bot</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button onClick={openWhatsApp} className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white rounded-xl px-4 py-3.5 transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-sm">WhatsApp</p>
                    <p className="text-xs text-slate-500 truncate">+1 (786) 933-9375</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
