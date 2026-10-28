import React, { useState } from "react";
import {
  Sparkles,
  Smartphone,
  Monitor,
  Square,
  BookOpen,
  ArrowRight,
  Zap,
  Layers,
  Palette,
  CheckCircle2,
  Clock,
  Loader2,
  FileCode,
  X,
} from "lucide-react";
import { AspectRatio, VidFlowProject } from "../../types/schema";
import { orchestrateMotionGeneration, PREBUILT_TEMPLATES } from "../../services/aiOrchestrator";
import { audioEngine } from "../../services/audioEngine";
import { useProjectStore } from "../../store/useProjectStore";

interface FirstProjectCreatorModalProps {
  isOpen: boolean;
  onProjectCreated?: (project: VidFlowProject) => void;
  onOpenSettings: () => void;
  onClose?: () => void;
}

const MOTION_GUIDELINES = [
  {
    step: "01. Hook (0 — 3s)",
    description: "Start with a high-energy kinetic headline and bold shape badge to stop the viewer from scrolling.",
  },
  {
    step: "02. Core Value (3 — 15s)",
    description: "Present the core problem and your clean 3-step solution with glassmorphism cards and vibrant color contrast.",
  },
  {
    step: "03. Proof & Features (15 — 24s)",
    description: "Highlight key metrics, icons, or floating tech badges with smooth spring and bounce in-animations.",
  },
  {
    step: "04. Call to Action (24 — 30s)",
    description: "End with a glowing search pill or prominent CTA button directing viewers where to tap or buy.",
  },
];

const PROMPT_TEMPLATES = [
  {
    title: "SaaS Product Explainer",
    desc: "AI automation platform promo with floating dashboard cards and 3-step value proposition.",
    prompt:
      "Create an elite SaaS product explainer video showing automated AI workflows. Scene 1 hook: 'Tired of manual repetitive work?'. Scene 2: Introduce Smart AI Automation with floating glass cards and live matching radar. Scene 3: Zero setup API integration. Scene 4 CTA: 'Get 50% Off Early Access'. Deep obsidian background with electric lavender and cyber cyan glow.",
  },
  {
    title: "Agency Motion Reel (Reel / Shorts)",
    desc: "High-energy commercial reel for digital marketing agencies with bold kinetic text.",
    prompt:
      "High-energy kinetic motion graphics reel for a creative media agency. Hook: 'Transform Your Brand in 2026'. Showcase 3 core pillars: Viral Content, High-ROAS Ads, and 3D Motion. Bold typography with word-by-word bounce drop animations. Electric amber and cyber blue glow badges.",
  },
  {
    title: "Bangla Tech & Ecommerce Promo",
    desc: "Bengali kinetic typography for online shop launch and instant payment checkout.",
    prompt:
      "একটি প্রিমিয়াম বাংলা ই-কমার্স বিজ্ঞাপন ভিডিও তৈরি করো। হুক: 'ম্যানুয়াল অর্ডারের ঝামেলা শেষ!'. ফিচার: অটোমেটিক বিকাশ/নগদ পেমেন্ট রিসিভ এবং ১-ক্লিকে ইনভয়েস জেনারেট। ফন্ট: Hind Siliguri, বোল্ড টাইপোগ্রাফি, গ্লাস কার্ড এবং এনার্জেটিক নিয়ন সাইয়ান কালার থিম।",
  },
  {
    title: "Course / Workshop Launch",
    desc: "Educational program announcement with countdown timer badge and student stats.",
    prompt:
      "Motion graphics announcement for Masterclass 2026. Hook: 'Master AI Engineering in 30 Days'. Include student count badge '1,200+ Enrolled', curriculum highlights card, and limited-time offer pill CTA.",
  },
];

export const FirstProjectCreatorModal: React.FC<FirstProjectCreatorModalProps> = ({
  isOpen,
  onProjectCreated,
  onOpenSettings,
  onClose,
}) => {
  const { actions } = useProjectStore();
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [model, setModel] = useState<"gemini-3.8-flash" | "argon-4">("gemini-3.8-flash");
  const [prompt, setPrompt] = useState(PROMPT_TEMPLATES[0].prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  if (!isOpen) return null;

  const handleFinishWithProject = (p: VidFlowProject) => {
    actions.setProject(p);
    onProjectCreated?.(p);
    onClose?.();
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgressPercent(10);
    setProgressStage("Connecting to Google Gemini...");
    audioEngine.playWhoosh();

    const apiKey = localStorage.getItem("vidflow_gemini_api_key") || "";

    try {
      const generated = await orchestrateMotionGeneration({
        prompt,
        provider: model,
        aspectRatio,
        apiKey,
        allowSmartFallback: true,
        onProgress: (stage, percent) => {
          setProgressStage(stage);
          setProgressPercent(percent);
        },
      });

      audioEngine.playPop();
      handleFinishWithProject(generated);
    } catch (err) {
      console.error("AI Generation error:", err);
      // Fallback to high converting template
      const fallback = PREBUILT_TEMPLATES["bangla-ai-explainer"](aspectRatio);
      handleFinishWithProject(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTemplate = (key: string) => {
    const tmpl = PREBUILT_TEMPLATES[key] || PREBUILT_TEMPLATES["bangla-ai-explainer"];
    const p = tmpl(aspectRatio);
    audioEngine.playPop();
    handleFinishWithProject(p);
  };

  const geminiKey = localStorage.getItem("vidflow_gemini_api_key");

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 select-none overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl bg-[#0e121e] border border-white/[0.1] shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Sparkles size={24} className="text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-outfit font-black text-white tracking-tight">
                Create Your First Motion Graphics Video
              </h2>
              <p className="text-xs text-slate-400">
                Powered by Google Gemini 3.8 Flash & Gemini Argon 4
              </p>
            </div>
          </div>

          {/* Quick API Key status indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${
                geminiKey
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : "bg-purple-500/10 text-purple-300 border-purple-500/30"
              }`}
            >
              <CheckCircle2 size={13} />
              <span>{geminiKey ? "Gemini Key Connected" : "Smart Zero-Token AI Ready"}</span>
            </span>
            <button
              onClick={onOpenSettings}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.05]"
            >
              Configure API
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors ml-1"
                title="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Detailed Motion Guidelines Card */}
        <div className="p-4 md:p-5 rounded-2xl bg-[#131726] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
            <BookOpen size={15} className="text-cyan-400" />
            <span>Professional Motion Video Guidelines</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {MOTION_GUIDELINES.map((g) => (
              <div key={g.step} className="p-3 rounded-xl bg-[#0a0d15] border border-white/[0.05] space-y-1">
                <span className="font-bold text-purple-300 text-[11px] block">{g.step}</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">{g.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Row: Aspect Ratio & Gemini Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Layers size={13} className="text-purple-400" />
              <span>1. Choose Aspect Ratio</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio("9:16")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === "9:16"
                    ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40"
                    : "bg-[#141826] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone size={14} />
                <span>9:16 Reel</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio("16:9")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === "16:9"
                    ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40"
                    : "bg-[#141826] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <Monitor size={14} />
                <span>16:9 Video</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio("1:1")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === "1:1"
                    ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40"
                    : "bg-[#141826] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <Square size={14} />
                <span>1:1 Square</span>
              </button>
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Zap size={13} className="text-cyan-400" />
              <span>2. Select Google Gemini Model</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModel("gemini-3.8-flash")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  model === "gemini-3.8-flash"
                    ? "bg-cyan-600/20 border-cyan-400 text-white shadow-lg"
                    : "bg-[#141826] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <div className="font-bold text-xs text-cyan-300">Gemini 3.8 Flash</div>
                <div className="text-[10px] text-slate-400">Ultra-Fast Motion Speed</div>
              </button>

              <button
                type="button"
                onClick={() => setModel("argon-4")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  model === "argon-4"
                    ? "bg-purple-600/20 border-purple-400 text-white shadow-lg"
                    : "bg-[#141826] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <div className="font-bold text-xs text-purple-300">Gemini Argon 4</div>
                <div className="text-[10px] text-slate-400">Deep Kinetic Architecture</div>
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Palette size={13} className="text-pink-400" />
              <span>3. Describe Your Motion Video</span>
            </label>
            <span className="text-[11px] text-slate-400">Bangla or English text supported</span>
          </div>

          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your scene, headlines, color theme, and key selling points..."
            className="w-full bg-[#131726] border border-white/[0.1] rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
          />

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
              Prompt Starters:
            </span>
            {PROMPT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.title}
                type="button"
                onClick={() => setPrompt(tmpl.prompt)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white whitespace-nowrap transition-colors border border-white/[0.06]"
              >
                {tmpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar when Generating */}
        {isGenerating && (
          <div className="p-3.5 rounded-2xl bg-[#141826] border border-purple-500/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-purple-300 font-semibold flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-purple-400" />
                <span>{progressStage}</span>
              </span>
              <span className="font-mono text-slate-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => handleUseTemplate("bangla-ai-explainer")}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <FileCode size={14} />
              <span>Load Explainer Template</span>
            </button>
          </div>

          <button
            type="button"
            disabled={isGenerating || !prompt.trim()}
            onClick={handleGenerate}
            className="w-full md:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-purple-900/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating Motion Video...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-yellow-300" />
                <span>Generate Motion Graphics with Gemini</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
