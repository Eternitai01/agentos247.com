import { useState, useEffect } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import agentAvatar from "@/assets/agentos247-logo.png";

const TELEGRAM_LINK = "https://t.me/agentos247_bot";
const WHATSAPP_LINK = "https://wa.me/17869339375";

function pulseKeyframes() {
  return `
@keyframes agentPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
}
@keyframes agentRing {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(15deg); }
  20% { transform: rotate(-15deg); }
  30% { transform: rotate(15deg); }
  40% { transform: rotate(-15deg); }
  50% { transform: rotate(0deg); }
}
.agent-pulse {
  animation: agentPulse 2s ease-out infinite;
}
.agent-ring-anim {
  animation: agentRing 0.6s ease-in-out infinite;
  display: inline-block;
}
  `;
}

export function AgentChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"initial" | "calling" | "channels">("initial");

  useEffect(() => {
    if (open) {
      setStep("initial");
      const t1 = setTimeout(() => setStep("calling"), 1200);
      const t2 = setTimeout(() => setStep("channels"), 2800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [open]);

  const handleChannel = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  if (!open) {
    return (
      <>
        <style>{pulseKeyframes()}</style>
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
      <style>{pulseKeyframes()}</style>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/75 z-[99999] flex items-center justify-center p-4"
        onClick={() => setOpen(false)}
      >
        {/* Modal */}
        <div
          className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {step === "initial" && (
            <div className="text-center py-10 px-6">
              <div className="w-24 h-24 rounded-full mx-auto border-2 border-indigo-500 overflow-hidden mb-4"
                style={{ boxShadow: "0 0 0 6px rgba(99,102,241,0.15), 0 0 0 12px rgba(99,102,241,0.08)" }}
              >
                <img
                  src={agentAvatar}
                  alt="AgentOS 24/7"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white font-semibold text-lg">AgentOS 24/7</p>
              <p className="text-indigo-400 text-sm mt-1">AI Expert</p>
              <p className="text-slate-400 text-sm mt-4">Let's find the perfect agent for you.</p>
            </div>
          )}

          {step === "calling" && (
            <div className="text-center py-10 px-6">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">
                Calling AgentOS 24/7 · Powered by OpenClaw
              </p>
              <div className="relative inline-block">
                <img
                  src={agentAvatar}
                  alt="AgentOS 24/7"
                  className="agent-pulse w-24 h-24 rounded-full object-cover object-center mx-auto border-2 border-indigo-500"
                  style={{ boxShadow: "0 0 0 6px rgba(99,102,241,0.15), 0 0 0 12px rgba(99,102,241,0.08)" }}
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-7 h-7 flex items-center justify-center text-base">
                  <Phone className="agent-ring-anim w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-white font-semibold text-lg mt-3">AgentOS 24/7</p>
              <p className="text-indigo-400 text-sm">Connecting...</p>
            </div>
          )}

          {step === "channels" && (
            <div className="py-6 px-6">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-4 text-center">
                Choose how to chat
              </p>
              <div className="text-center py-2">
                <img
                  src={agentAvatar}
                  alt="AgentOS 24/7"
                  className="agent-pulse w-16 h-16 rounded-full object-cover object-center mx-auto border-2 border-green-500 mb-2"
                />
                <p className="text-green-400 font-semibold text-sm">Online</p>
              </div>

              <div className="space-y-3 mt-4">
                <button
                  onClick={() => handleChannel(TELEGRAM_LINK)}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white rounded-xl px-4 py-3 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0088cc]/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#0088cc]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm">Telegram</p>
                    <p className="text-xs text-slate-400">@agentos247_bot</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => handleChannel(WHATSAPP_LINK)}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white rounded-xl px-4 py-3 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm">WhatsApp</p>
                    <p className="text-xs text-slate-400">+1 (786) 933-9375</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full mt-4 text-center text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
