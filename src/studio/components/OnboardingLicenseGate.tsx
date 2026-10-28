import React, { useState } from "react";
import { Key, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Laptop, Gift, AlertCircle, Loader2 } from "lucide-react";
import { licenseService, LicenseKey } from "../../services/licenseService";

interface OnboardingLicenseGateProps {
  onSuccess: (license: LicenseKey) => void;
  onOpenAdmin?: () => void;
}

export const OnboardingLicenseGate: React.FC<OnboardingLicenseGateProps> = ({ onSuccess, onOpenAdmin }) => {
  const [keyInput, setKeyInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const isEnforced = licenseService.isLicenseEnforced();
  const machineId = licenseService.getMachineId();

  const handleActivateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim() || isActivating) return;

    setIsActivating(true);
    setStatusMsg(null);

    try {
      const res = await licenseService.activateClientLicense(keyInput);
      if (res.success && res.license) {
        setStatusMsg({ text: res.message, type: "success" });
        setTimeout(() => onSuccess(res.license!), 800);
      } else {
        setStatusMsg({ text: res.message, type: "error" });
      }
    } catch {
      setStatusMsg({ text: "Failed to connect to license validation server.", type: "error" });
    } finally {
      setIsActivating(false);
    }
  };

  const handleClaimFree = () => {
    const res = licenseService.claimFreeCommunityPass(userName || "Creator");
    if (res.success && res.license) {
      setStatusMsg({ text: res.message, type: "success" });
      setTimeout(() => onSuccess(res.license!), 600);
    } else {
      setStatusMsg({ text: res.message, type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080a10]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-[#0e121e] border border-white/[0.1] shadow-2xl p-7 md:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-xl shadow-purple-600/30 text-white font-black text-2xl mb-1">
            V
          </div>
          <h2 className="text-2xl font-outfit font-black text-white tracking-tight">
            Welcome to Vid<span className="text-purple-400">Flow</span> Studio
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Professional AI Motion Graphics Software. Powered by Google Gemini 3.8 Flash & Gemini Argon 4.
          </p>
        </div>

        {/* Machine HWID Badge */}
        <div className="px-3.5 py-2 rounded-xl bg-[#141826] border border-white/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Laptop size={14} className="text-cyan-400" />
            <span>Hardware Machine ID:</span>
            <strong className="text-slate-200 font-mono text-[11px]">{machineId}</strong>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Device Ready</span>
        </div>

        {/* Notification message */}
        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
            }`}
          >
            {statusMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Option 1: Enter Commercial License Key */}
        <div className="p-5 rounded-2xl bg-[#131726] border border-purple-500/20 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
              <Key size={14} className="text-purple-400" />
              <span>Commercial License Key</span>
            </div>
            <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full font-semibold">
              Pro / Agency / Lifetime
            </span>
          </div>

          <form onSubmit={handleActivateKey} className="space-y-2.5">
            <input
              type="text"
              placeholder="e.g. VIDFLOW-PRO-8801-9114-4454"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full bg-[#0a0d15] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 uppercase outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isActivating || !keyInput.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-1.5"
            >
              {isActivating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Validating Key...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span>Activate Commercial Key</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Option 2: Free Pass (or Enforced Notice) */}
        {!isEnforced ? (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/20 to-[#121624] border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <Gift size={15} className="text-emerald-400" />
                <span>Free Community Launch Pass</span>
              </div>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                100% Free Now
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Don&apos;t have a paid key yet? VidFlow is currently open for free public beta! You can claim instant free access right now.
            </p>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="flex-1 bg-[#0a0d15] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleClaimFree}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Claim Free Pass</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#141826] border border-white/[0.08] text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Commercial License Required</p>
            <p>
              Free beta has ended. Please purchase a license key or contact support via WhatsApp:{" "}
              <strong className="text-emerald-400">+8801911444546</strong>.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
          <span>
            Official Software by <strong>ZapyTeam</strong> • Desktop & Android
          </span>
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-slate-500 hover:text-purple-400 transition-colors"
            >
              Admin Portal 🔒
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
