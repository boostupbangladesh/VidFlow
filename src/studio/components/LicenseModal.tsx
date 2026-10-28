import React, { useState } from "react";
import { Key, CheckCircle2, MessageCircle, X, Laptop, Loader2 } from "lucide-react";
import { licenseService, LicenseKey } from "../../services/licenseService";

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  const [activeLic, setActiveLic] = useState<LicenseKey | null>(licenseService.getActiveClientLicense());
  const [inputKey, setInputKey] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  if (!isOpen) return null;

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim() || isActivating) return;

    setIsActivating(true);
    setStatusMsg(null);

    try {
      const res = await licenseService.activateClientLicense(inputKey);
      if (res.success) {
        setStatusMsg({ text: res.message, type: "success" });
        setActiveLic(res.license || null);
        setInputKey("");
      } else {
        setStatusMsg({ text: res.message, type: "error" });
      }
    } catch {
      setStatusMsg({ text: "Network error during activation.", type: "error" });
    } finally {
      setIsActivating(false);
    }
  };

  const machineId = licenseService.getMachineId();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f121d] border border-white/[0.1] shadow-2xl p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Key size={20} />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">VidFlow License & Subscription</h3>
              <p className="text-xs text-slate-400">
                Official Software by <strong className="text-slate-200">ZapyTeam</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Status Card */}
        {activeLic ? (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#121624] border border-purple-500/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Active License Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 size={11} /> {activeLic.tier.toUpperCase()} ACTIVATED
              </span>
            </div>
            <div className="font-mono text-sm text-purple-300 font-bold tracking-wider">
              {activeLic.key}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/[0.06]">
              <span>Customer: <strong className="text-slate-200">{activeLic.customerName}</strong></span>
              <span>
                {activeLic.expiresAt
                  ? `Valid till: ${new Date(activeLic.expiresAt).toLocaleDateString()}`
                  : "✨ Lifetime License"}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            ⚠️ No active commercial license detected. Enter your license key to unlock Pro features.
          </div>
        )}

        {/* Machine ID */}
        <div className="p-2.5 rounded-xl bg-[#161a29] border border-white/[0.05] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Laptop size={14} className="text-cyan-400" />
            <span>Machine HWID: <strong className="text-slate-200 font-mono">{machineId}</strong></span>
          </div>
          <span className="text-[10px] text-emerald-400">Hardware Verified</span>
        </div>

        {/* Activate Form */}
        <form onSubmit={handleActivate} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Enter New License Key
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="VIDFLOW-PRO-XXXX-XXXX-XXXX"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="flex-1 bg-[#161a29] border border-white/[0.1] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-purple-500 uppercase"
            />
            <button
              type="submit"
              disabled={isActivating}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              {isActivating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Activate Key</span>
              )}
            </button>
          </div>

          {statusMsg && (
            <div
              className={`p-2.5 rounded-xl text-xs font-medium ${
                statusMsg.type === "success"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
              }`}
            >
              {statusMsg.text}
            </div>
          )}
        </form>

        {/* Contact ZapyTeam to Buy License */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Don't have a license? Buy from ZapyTeam:
          </div>
          <a
            href="https://wa.me/8801911444546?text=Hi%20ZapyTeam,%20I%20want%20to%20purchase%20a%20VidFlow%20license."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 font-semibold transition-colors"
          >
            <MessageCircle size={13} />
            <span>WhatsApp ZapyTeam</span>
          </a>
        </div>
      </div>
    </div>
  );
};
