import { useState } from "react";
import agentAvatar from "@/assets/charlie-agentos247.jpg";

const WHATSAPP_NUMBER = "17869339375";

export function AgentChatWidget() {
  const [open, setOpen] = useState(false);
  // leadSource: null | "telegram" | "whatsapp" | "call"
  const [leadSource, setLeadSource] = useState<"telegram" | "whatsapp" | "call" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  // calling state
  const [calling, setCalling] = useState(false);
  const [connected, setConnected] = useState(false);

  function resetAll() {
    setOpen(false);
    setLeadSource(null);
    setName("");
    setEmail("");
    setError("");
    setCalling(false);
    setConnected(false);
  }

  function handleChannel(source: "telegram" | "whatsapp" | "call") {
    setLeadSource(source);
    setName("");
    setEmail("");
    setError("");
  }

  function handleBack() {
    setLeadSource(null);
    setName("");
    setEmail("");
    setError("");
    setCalling(false);
    setConnected(false);
  }

  function handleSubmit() {
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

    // Send lead
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        source: leadSource === "call" ? "voice-call" : `chat-widget-${leadSource}`,
        page: window.location.href,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});

    if (leadSource === "telegram") {
      const param = encodeURIComponent(`${trimmedName}_${trimmedEmail}`);
      window.open(`https://t.me/agentos247_bot?start=${param}`, "_blank", "noopener,noreferrer");
      resetAll();
    } else if (leadSource === "whatsapp") {
      const text = encodeURIComponent(
        `Hi, I'm ${trimmedName} (${trimmedEmail}). I'd like to know more about AgentOS 24/7.`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
      resetAll();
    } else if (leadSource === "call") {
      setCalling(true);
      // After ~7s, "connect" the call
      setTimeout(() => {
        setCalling(false);
        setConnected(true);
      }, 7000);
    }
  }

  return (
    <>
      <style>{`
@keyframes agentPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
}
.agent-pulse { animation: agentPulse 2s ease-out infinite; }
@keyframes charlieRing {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
}
.charlie-ring-anim { animation: charlieRing 0.5s ease-in-out infinite; }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[99998] w-16 h-16 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-105 transition-transform agent-pulse"
        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        aria-label="Chat with AgentOS 24/7"
      >
        <img
          src={agentAvatar}
          alt="AgentOS 24/7"
          className="w-full h-full rounded-full object-cover object-center"
        />
      </button>

      {/* Popup: 3 channel buttons */}
      {open && !leadSource && (
        <div className="fixed bottom-28 right-6 z-[99998] flex flex-col items-end gap-2.5 font-sans">
          {/* Telegram */}
          <button
            onClick={() => handleChannel("telegram")}
            className="flex items-center gap-2.5 bg-slate-900 border border-slate-700 rounded-full px-4 py-2.5 text-slate-200 text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg whitespace-nowrap"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#60a5fa">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.84 14.25l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.981.336z" />
            </svg>
            Chat on Telegram
          </button>
          {/* WhatsApp */}
          <button
            onClick={() => handleChannel("whatsapp")}
            className="flex items-center gap-2.5 bg-slate-900 border border-slate-700 rounded-full px-4 py-2.5 text-slate-200 text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg whitespace-nowrap"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4ade80">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </button>
          {/* Call Charlie */}
          <button
            onClick={() => { handleChannel("call"); setOpen(false); }}
            className="flex items-center gap-2.5 bg-slate-900 border border-slate-700 rounded-full px-4 py-2.5 text-slate-200 text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg whitespace-nowrap"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#a78bfa">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            Call Charlie
          </button>
        </div>
      )}

      {/* Lead form overlay (for Telegram, WhatsApp, or Call Charlie) */}
      {leadSource && (
        <div
          className="fixed inset-0 bg-black/75 z-[99999] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !calling) handleBack(); }}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 w-full max-w-sm">
            {/* Lead form (before calling) */}
            {!calling && !connected && (
              <>
                <p className="text-slate-500 text-sm mb-5">
                  {leadSource === "call"
                    ? "Enter your details and Charlie will join the call instantly."
                    : "Enter your details and Charlie will greet you by name."}
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm mb-2.5 outline-none focus:border-blue-500"
                  autoFocus
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm mb-2.5 outline-none focus:border-blue-500"
                />
                {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-xl text-white font-semibold text-base cursor-pointer border-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  {leadSource === "call" ? "Start Call" : leadSource === "telegram" ? "Open Telegram" : "Open WhatsApp"}
                </button>
                <button
                  onClick={handleBack}
                  className="w-full py-2.5 bg-transparent border-0 text-slate-500 text-sm cursor-pointer mt-1"
                >
                  Cancel
                </button>
              </>
            )}

            {/* Calling animation */}
            {calling && (
              <div className="text-center py-4">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">
                  Calling AgentOS 24/7 · Powered by AI2me
                </p>
                <div className="relative inline-block">
                  <img
                    src={agentAvatar}
                    alt="AgentOS 24/7"
                    className="w-24 h-24 rounded-full object-cover object-center mx-auto border-2 border-blue-500"
                    style={{
                      boxShadow: "0 0 0 6px rgba(59,130,246,0.15), 0 0 0 12px rgba(59,130,246,0.08)",
                    }}
                  />
                  <span
                    className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-7 h-7 flex items-center justify-center text-base charlie-ring-anim"
                    style={{ animation: "charlieRing 0.5s ease-in-out infinite" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                    </svg>
                  </span>
                </div>
                <p className="text-white font-semibold text-lg mt-3">
                  {name.split(" ")[0] || "Charlie"}
                </p>
                <p className="text-blue-400 text-sm">Calling...</p>
              </div>
            )}

            {/* Connected */}
            {connected && (
              <div className="text-center py-2">
                <div className="flex flex-col items-center">
                  <img
                    src={agentAvatar}
                    alt="AgentOS 24/7"
                    className="w-16 h-16 rounded-full object-cover object-center mx-auto border-2 border-green-500 mb-2"
                  />
                  <p className="text-green-400 font-semibold">{name.split(" ")[0]}! Charlie is on the line.</p>
                  <p className="text-slate-400 text-sm mt-2">Speak now — Charlie can hear you.</p>
                </div>
                <button
                  onClick={resetAll}
                  className="mt-4 w-full py-3 rounded-xl text-white font-semibold text-base cursor-pointer border-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
