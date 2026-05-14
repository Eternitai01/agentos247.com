import { useState, useEffect, useRef } from "react";
import { MessageCircle, Phone, X, Check, Loader2 } from "lucide-react";
import agentAvatar from "@/assets/charlie-agentos247.jpg";

const TELEGRAM_LINK = "https://t.me/agentos247_bot";
const WHATSAPP_NUMBER = "17869339375";

function globalStyles() {
  return `
@keyframes agentPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
}
@keyframes agentRing {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(12deg); }
  20% { transform: rotate(-12deg); }
  30% { transform: rotate(12deg); }
  40% { transform: rotate(-12deg); }
  50% { transform: rotate(0deg); }
}
.agent-pulse {
  animation: agentPulse 2s ease-out infinite;
}
.agent-ring-anim {
  animation: agentRing 0.5s ease-in-out infinite;
  display: inline-block;
}
  `;
}

/** Generate a phone ringing tone using Web Audio API */
function playRingTone(audioCtx: AudioContext, destination: AudioNode) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);

  // Ring pattern: 0.5s on, 0.3s off, repeat
  const pattern = [0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3];
  let t = audioCtx.currentTime;
  for (let i = 0; i < pattern.length; i++) {
    if (i % 2 === 0) {
      gain.gain.setValueAtTime(0.3, t);
    } else {
      gain.gain.setValueAtTime(0, t);
    }
    t += pattern[i];
  }
  gain.gain.setValueAtTime(0, t);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(audioCtx.currentTime);
  osc.stop(t);

  return { stop: () => { try { osc.stop(); } catch {} } };
}

/** Generate "connected" beep sound */
function playConnectedBeep(audioCtx: AudioContext, destination: AudioNode) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.3);
}

export function AgentChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "channels" | "calling" | "connected" | "callback-requested">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ringtoneActive, setRingtoneActive] = useState(false);
  const ringtoneRef = useRef<{ stop: () => void } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ledBlinkRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup ringtone on unmount
  useEffect(() => {
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
        ringtoneRef.current = null;
      }
      if (ledBlinkRef.current) {
        clearInterval(ledBlinkRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  function resetAndClose() {
    stopRingtone();
    setStep("form");
    setName("");
    setEmail("");
    setPhone("");
    setError("");
    setOpen(false);
  }

  function stopRingtone() {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
      ringtoneRef.current = null;
    }
    if (ledBlinkRef.current) {
      clearInterval(ledBlinkRef.current);
      ledBlinkRef.current = null;
    }
    setRingtoneActive(false);
  }

  function startRingtone() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    ringtoneRef.current = playRingTone(ctx, ctx.destination);
    setRingtoneActive(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate
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

    // Save lead - fire and forget to an endpoint
    try {
      fetch("https://agentos247.com/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          source: "chat-widget",
          page: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {}); // silently fail - don't block the user
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

  function startCallFlow() {
    setStep("calling");
    startRingtone();

    // Ring for 5 seconds then "connect"
    setTimeout(() => {
      stopRingtone();
      if (audioCtxRef.current) {
        playConnectedBeep(audioCtxRef.current, audioCtxRef.current.destination);
      }
      setStep("connected");
    }, 5000);
  }

  function requestCallback() {
    setStep("callback-requested");
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
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/75 z-[99999] flex items-center justify-center p-4"
        onClick={() => step !== "calling" && setOpen(false)}
      >
        {/* Modal */}
        <div
          className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {step !== "calling" && (
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* STEP 1: Lead Collection Form */}
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
                  Enter your details and I'll greet you by name.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                    autoFocus
                  />
                </div>
                <div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    type="email"
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    One moment...
                  </>
                ) : (
                  "Start Chat"
                )}
              </button>

              <p className="text-xs text-slate-600 text-center mt-3">
                We'll never share your info. Read our{" "}
                <a href="https://agentos247.com/privacy/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                  Privacy Policy
                </a>.
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
                {/* Telegram */}
                <button
                  onClick={openTelegram}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white rounded-xl px-4 py-3.5 transition-all"
                >
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

                {/* WhatsApp */}
                <button
                  onClick={openWhatsApp}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white rounded-xl px-4 py-3.5 transition-all"
                >
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

                {/* Call Charlie */}
                <button
                  onClick={startCallFlow}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white rounded-xl px-4 py-3.5 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-purple-400 agent-ring-anim" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-sm">Call Charlie</p>
                    <p className="text-xs text-slate-500 truncate">Voice call with AI assistant</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Calling Charlie (ringing) */}
          {step === "calling" && (
            <div className="text-center py-10 px-6">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-6">
                Calling AgentOS 24/7 · {name.split(" ")[0]}
              </p>
              <div className="relative inline-block">
                <img
                  src={agentAvatar}
                  alt="AgentOS 24/7"
                  className={`agent-pulse w-24 h-24 rounded-full object-cover object-center mx-auto border-2 border-indigo-500`}
                  style={{ boxShadow: "0 0 0 6px rgba(99,102,241,0.15), 0 0 0 12px rgba(99,102,241,0.08)" }}
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-7 h-7 flex items-center justify-center text-base animate-pulse">
                  <Phone className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-white font-semibold text-lg mt-3">Calling Charlie…</p>
              <p className="text-indigo-400 text-sm mt-1">Ring ring…</p>

              <button
                onClick={() => { stopRingtone(); setStep("channels"); }}
                className="mt-8 text-sm text-red-400 hover:text-red-300 transition-colors underline underline-offset-2"
              >
                Cancel call
              </button>
            </div>
          )}

          {/* STEP 4: Connected to Charlie */}
          {step === "connected" && (
            <div className="text-center py-10 px-6">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">
                Connected · AgentOS 24/7
              </p>
              <div className="relative inline-block">
                <img
                  src={agentAvatar}
                  alt="AgentOS 24/7"
                  className="w-24 h-24 rounded-full object-cover object-center mx-auto border-2 border-green-500"
                  style={{ boxShadow: "0 0 0 6px rgba(34,197,94,0.2), 0 0 0 12px rgba(34,197,94,0.08)" }}
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-7 h-7 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-white font-semibold text-lg mt-3">Charlie is here!</p>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed px-2">
                Hi {name.split(" ")[0]}! I see you want to talk. I'll call you back on WhatsApp shortly.
              </p>

              <button
                onClick={requestCallback}
                className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-3 text-sm font-semibold transition-all"
              >
                <Phone className="w-4 h-4" />
                Request Callback
              </button>

              <div className="mt-3">
                <button
                  onClick={() => { setStep("channels"); setName(name); setEmail(email); }}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Back to channels
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Callback Requested */}
          {step === "callback-requested" && (
            <div className="text-center py-10 px-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-semibold text-lg">Callback Requested</p>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                We'll call you on WhatsApp within the next few minutes. Charlie is looking forward to speaking with you, {name.split(" ")[0]}!
              </p>
              <button
                onClick={resetAndClose}
                className="mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
