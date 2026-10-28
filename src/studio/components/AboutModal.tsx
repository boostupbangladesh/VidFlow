import React from "react";
import { X, MessageCircle, Heart, ShieldCheck, Sparkles, Cpu, Layers } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md rounded-2xl bg-[#0f121d] border border-white/[0.1] shadow-2xl p-6 space-y-5 text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Brand Icon & Name */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-2xl shadow-purple-500/40 mb-3">
            <span className="font-outfit font-black text-3xl text-white">V</span>
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-white tracking-tight">
            Vid<span className="text-purple-400">Flow</span>
          </h2>
          <span className="px-2.5 py-0.5 mt-1 text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
            Commercial SaaS Edition v1.0
          </span>
        </div>

        {/* Developer Credit */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-cyan-950/20 border border-white/[0.08] text-xs space-y-1">
          <div className="text-slate-400">Designed & Developed by</div>
          <div className="font-bold text-white text-base">ZapyTeam</div>
          <a
            href="https://wa.me/8801911444546"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:underline mt-1"
          >
            <MessageCircle size={14} />
            <span>WhatsApp: +8801911444546</span>
          </a>
        </div>

        {/* Core Architecture Highlights */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[#161a29] border border-white/[0.05]">
            <Cpu size={16} className="mx-auto text-cyan-400 mb-1" />
            <span className="text-[10px] text-slate-400 block">Engine</span>
            <span className="font-bold text-white">Tauri & Canvas</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#161a29] border border-white/[0.05]">
            <Sparkles size={16} className="mx-auto text-yellow-400 mb-1" />
            <span className="text-[10px] text-slate-400 block">AI Integration</span>
            <span className="font-bold text-white">Gemini & Claude</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#161a29] border border-white/[0.05]">
            <ShieldCheck size={16} className="mx-auto text-purple-400 mb-1" />
            <span className="text-[10px] text-slate-400 block">SaaS Protection</span>
            <span className="font-bold text-white">HWID Lock</span>
          </div>
        </div>

        {/* Direct WhatsApp Call to Action */}
        <a
          href="https://wa.me/8801911444546?text=Hi%20ZapyTeam,%20I%20am%20using%20VidFlow%20and%20want%20to%20connect."
          target="_blank"
          rel="noreferrer"
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <MessageCircle size={16} />
          <span>Chat with ZapyTeam on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
