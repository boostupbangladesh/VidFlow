import React, { useState, useEffect } from "react";
import {
  Settings,
  X,
  Key,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Sliders,
  MessageCircle,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [geminiKey, setGeminiKey] = useState("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [defaultModel, setDefaultModel] = useState<"gemini-3.8-flash" | "argon-4">("gemini-3.8-flash");
  const [defaultFps, setDefaultFps] = useState<number>(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(localStorage.getItem("vidflow_gemini_api_key") || "");
      setDefaultModel(
        (localStorage.getItem("vidflow_default_model") as "gemini-3.8-flash" | "argon-4") ||
          "gemini-3.8-flash"
      );
      setDefaultFps(Number(localStorage.getItem("vidflow_default_fps")) || 30);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("vidflow_gemini_api_key", geminiKey.trim());
    localStorage.setItem("vidflow_default_model", defaultModel);
    localStorage.setItem("vidflow_default_fps", String(defaultFps));

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f121d] border border-white/[0.1] shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">VidFlow Studio Settings</h3>
              <p className="text-xs text-slate-400">
                Configure your Google Gemini AI API key and export preferences
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

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* AI Providers Section */}
          <div className="p-4 rounded-xl bg-[#141826] border border-white/[0.06] space-y-3.5">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles size={14} className="text-purple-400" />
              <span>Google Gemini AI Engine</span>
            </div>

            {/* Google Gemini API Key */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Key size={12} className="text-purple-400" />
                  <span>Google Gemini API Key</span>
                </label>
                {geminiKey && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 size={10} /> Saved Locally
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showGeminiKey ? "text" : "password"}
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-[#1c2236] border border-white/[0.08] rounded-xl px-3 py-2 pr-10 text-white font-mono outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showGeminiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Powers Gemini 3.8 Flash & Gemini Argon 4. Keys are stored locally on your machine.
              </p>
            </div>

            {/* Preferred Default Model */}
            <div className="space-y-1.5 pt-1">
              <label className="font-semibold text-slate-300">Default Gemini Model</label>
              <select
                value={defaultModel}
                onChange={(e) =>
                  setDefaultModel(e.target.value as "gemini-3.8-flash" | "argon-4")
                }
                className="w-full bg-[#1c2236] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
              >
                <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Ultra-Fast Motion)</option>
                <option value="argon-4">Google Gemini Argon 4 (Deep Kinetic Architecture)</option>
              </select>
            </div>
          </div>

          {/* Performance & Defaults */}
          <div className="p-4 rounded-xl bg-[#141826] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <Sliders size={14} className="text-cyan-400" />
              <span>Studio & Export Preferences</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Default Framerate</label>
                <select
                  value={defaultFps}
                  onChange={(e) => setDefaultFps(Number(e.target.value))}
                  className="w-full bg-[#1c2236] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value={30}>30 FPS (Standard Smooth)</option>
                  <option value={60}>60 FPS (Ultra-Fluid High FPS)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Hardware Render</label>
                <div className="bg-[#1c2236] border border-white/[0.08] rounded-xl px-3 py-2 text-slate-300 font-medium">
                  GPU Accelerated ✅
                </div>
              </div>
            </div>
          </div>

          {/* Save Status Notification */}
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              <span>Settings and API keys saved successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={14} />
              <span>Save Settings</span>
            </button>
          </div>
        </form>

        {/* Footer Credit */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span>Developed by <strong>ZapyTeam</strong></span>
          <a
            href="https://wa.me/8801911444546"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <MessageCircle size={12} /> WhatsApp: +8801911444546
          </a>
        </div>
      </div>
    </div>
  );
};
