import React, { useState } from "react";
import { ShieldAlert, Lock, X, ArrowRight, KeyRound } from "lucide-react";

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN is 7788 (or configurable via localStorage)
    const storedPin = localStorage.getItem("vidflow_admin_master_pin") || "7788";

    if (pin.trim() === storedPin) {
      setError(false);
      setPin("");
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm rounded-2xl bg-[#0f121d] border border-rose-500/30 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-base text-white">
                Admin Authentication
              </h3>
              <p className="text-[11px] text-slate-400">
                Restricted to ZapyTeam Authorized Admins
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

        {/* PIN Input Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound size={13} className="text-rose-400" />
              <span>Enter Master Admin PIN</span>
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className="w-full bg-[#161a29] border border-white/[0.1] rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-[0.5em] text-white placeholder-slate-600 outline-none focus:border-rose-500 transition-colors"
              />
              <Lock
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-400 font-medium text-center pt-1">
                ❌ Access Denied: Incorrect Admin PIN.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-rose-900/40 flex items-center justify-center gap-1.5"
            >
              <span>Unlock Admin</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
