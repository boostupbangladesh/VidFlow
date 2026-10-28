import React from "react";
import { useProjectStore } from "../../store/useProjectStore";
import {
  Sparkles,
  Type,
  Shapes,
  Volume2,
  ShieldCheck,
  Key,
} from "lucide-react";
import { audioEngine } from "../../services/audioEngine";

interface LeftSidebarProps {
  onOpenAIModal: () => void;
  onOpenAdmin: () => void;
  onOpenLicense: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onOpenAIModal,
  onOpenAdmin,
  onOpenLicense,
}) => {
  const { activeSidebarTab, actions } = useProjectStore();

  return (
    <div className="w-16 border-r border-white/[0.08] bg-[#0c0f18] flex flex-col justify-between py-3 z-30 select-none">
      {/* Top Main Tools */}
      <div className="flex flex-col items-center gap-2">
        {/* AI Generator Button */}
        <button
          onClick={onOpenAIModal}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 hover:scale-105 transition-transform flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group relative"
          title="AI Prompt Generator (Gemini 3.8 Flash & Argon 4)"
        >
          <Sparkles size={18} className="text-yellow-300 group-hover:rotate-12 transition-transform" />
          <span className="absolute left-14 bg-slate-900 border border-purple-500/30 text-white text-[11px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            AI Generator
          </span>
        </button>

        <div className="w-8 h-[1px] bg-white/[0.08] my-1" />

        {/* Text Tool */}
        <button
          onClick={() => {
            actions.setActiveSidebarTab("text");
            actions.addTextElement("New Motion Headline", false);
            audioEngine.playPop();
          }}
          className="w-10 h-10 rounded-xl hover:bg-white/[0.08] transition-colors flex items-center justify-center text-slate-400 hover:text-white group relative"
          title="Add Text Layer"
        >
          <Type size={18} />
          <span className="absolute left-14 bg-slate-900 border border-white/[0.1] text-white text-[11px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            Add Text
          </span>
        </button>

        {/* Shapes Tool */}
        <button
          onClick={() => {
            actions.setActiveSidebarTab("shapes");
            actions.addShapeElement("glass-card");
            audioEngine.playPop();
          }}
          className="w-10 h-10 rounded-xl hover:bg-white/[0.08] transition-colors flex items-center justify-center text-slate-400 hover:text-white group relative"
          title="Add Shape / Glass Card"
        >
          <Shapes size={18} />
          <span className="absolute left-14 bg-slate-900 border border-white/[0.1] text-white text-[11px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            Add Glass Card
          </span>
        </button>

        {/* Sound FX Preview */}
        <button
          onClick={() => {
            audioEngine.playWhoosh();
          }}
          className="w-10 h-10 rounded-xl hover:bg-white/[0.08] transition-colors flex items-center justify-center text-slate-400 hover:text-white group relative"
          title="Play Sound Design SFX (Whoosh)"
        >
          <Volume2 size={18} />
          <span className="absolute left-14 bg-slate-900 border border-white/[0.1] text-white text-[11px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            Sound FX (Whoosh)
          </span>
        </button>
      </div>

      {/* Bottom SaaS & Licensing Tools */}
      <div className="flex flex-col items-center gap-2">
        {/* License Manager Modal */}
        <button
          onClick={onOpenLicense}
          className="w-10 h-10 rounded-xl hover:bg-white/[0.08] text-amber-400 hover:text-amber-300 transition-colors flex items-center justify-center group relative"
          title="License & Subscription Status"
        >
          <Key size={18} />
          <span className="absolute left-14 bg-slate-900 border border-amber-500/30 text-amber-300 text-[11px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            License Key Status
          </span>
        </button>

        {/* SaaS Commander Admin Panel */}
        <button
          onClick={onOpenAdmin}
          className="w-10 h-10 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-purple-200 transition-all flex items-center justify-center group relative"
          title="Open SaaS Admin Commander"
        >
          <ShieldCheck size={18} />
          <span className="absolute left-14 bg-slate-900 border border-purple-500/40 text-purple-200 text-[11px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            SaaS Admin Panel
          </span>
        </button>
      </div>
    </div>
  );
};
