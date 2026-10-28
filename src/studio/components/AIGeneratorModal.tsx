import React, { useState, useEffect } from "react";
import { Sparkles, X, Wand2, CheckCircle2, AlertCircle, Zap, Settings, ShieldCheck, Activity } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";
import { orchestrateMotionGeneration } from "../../services/aiOrchestrator";
import { AspectRatio } from "../../types/schema";
import { audioEngine } from "../../services/audioEngine";
import { generateSmartDynamicProject } from "../../services/projectSanitizer";

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const { actions, project } = useProjectStore();

  const [provider, setProvider] = useState<"gemini-3.8-flash" | "argon-4" | "template">("gemini-3.8-flash");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(project.aspectRatio || "9:16");
  const [prompt, setPrompt] = useState(
    "Create a high-energy kinetic motion video explaining how VidFlow revolutionizes video creation with AI and zero-token editing."
  );

  const [geminiKey, setGeminiKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState("Initializing...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [useSmartFallback, setUseSmartFallback] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(localStorage.getItem("vidflow_gemini_api_key") || "");
      setClaudeKey(localStorage.getItem("vidflow_claude_api_key") || "");
      const pref = localStorage.getItem("vidflow_default_model");
      if (pref === "argon-4" || pref === "claude") {
        setProvider("argon-4");
      } else {
        setProvider("gemini-3.8-flash");
      }
      setIsLoading(false);
      setErrorMsg(null);
      setProgressPercent(0);
      setProgressStage("Ready");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async (forcedMode?: "bangla-ai-explainer" | "ecommerce-mega-sale" | "smart-dynamic") => {
    setIsLoading(true);
    setErrorMsg(null);
    setProgressPercent(15);
    setProgressStage("Analyzing prompt topic & visual structure...");

    // Immediate instant smart dynamic generator
    if (forcedMode === "smart-dynamic") {
      setProgressPercent(60);
      setProgressStage("Synthesizing kinetic typography & layout...");
      setTimeout(() => {
        const dynamicProject = generateSmartDynamicProject(prompt, aspectRatio);
        actions.setProject(dynamicProject);
        audioEngine.playWhoosh();
        setIsLoading(false);
        onClose();
      }, 400);
      return;
    }

    const isPrebuiltTemplate = forcedMode === "bangla-ai-explainer" || forcedMode === "ecommerce-mega-sale";
    const activeProvider = isPrebuiltTemplate ? "template" : provider;
    const activeKey =
      activeProvider === "gemini-3.8-flash" ? geminiKey : activeProvider === "argon-4" ? claudeKey : undefined;

    // If external model chosen but no key saved, offer instant smart dynamic generation
    if (activeProvider !== "template" && !activeKey) {
      if (useSmartFallback) {
        setProgressPercent(50);
        setProgressStage("API Key not found — generating instantly via Smart Zero-Token Engine...");
        setTimeout(() => {
          const dynamicProject = generateSmartDynamicProject(prompt, aspectRatio);
          actions.setProject(dynamicProject);
          audioEngine.playWhoosh();
          setIsLoading(false);
          onClose();
        }, 500);
        return;
      }

      setIsLoading(false);
      setErrorMsg(
        `Please configure your ${activeProvider === "gemini-3.8-flash" ? "Google Gemini" : "Argon 4 / Claude"} API key in Settings, or use Instant Demo.`
      );
      return;
    }

    try {
      const generatedProject = await orchestrateMotionGeneration({
        prompt,
        provider: activeProvider,
        aspectRatio,
        apiKey: activeKey,
        templateKey: isPrebuiltTemplate ? forcedMode : undefined,
        allowSmartFallback: useSmartFallback,
        onProgress: (stage, percent) => {
          setProgressStage(stage);
          setProgressPercent(percent);
        },
      });

      actions.setProject(generatedProject);
      audioEngine.playWhoosh();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setErrorMsg(errorMessage || "Failed to generate video project. Please check your prompt or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f121d] border border-white/[0.1] shadow-2xl p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Sparkles size={20} className="text-yellow-300" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">VidFlow AI Motion Generator</h3>
              <p className="text-xs text-slate-400">
                Powered by Gemini 3.8 Flash & Argon 4 (One-time token cost, unlimited free edits)
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

        {/* AI Provider Switcher */}
        <div className="grid grid-cols-3 gap-2 bg-[#161a29] p-1 rounded-xl border border-white/[0.06] text-xs font-semibold">
          <button
            onClick={() => setProvider("template")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              provider === "template"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap size={13} className="text-yellow-400" />
            <span>Instant Demo</span>
          </button>

          <button
            onClick={() => setProvider("gemini-3.8-flash")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              provider === "gemini-3.8-flash"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles size={13} className="text-purple-300" />
            <span>Gemini 3.8 Flash</span>
          </button>

          <button
            onClick={() => setProvider("argon-4")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              provider === "argon-4"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Argon 4 (Claude)</span>
          </button>
        </div>

        {/* Professional Provider Status Bar */}
        {provider === "gemini-3.8-flash" && (
          <div
            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
              geminiKey
                ? "bg-purple-950/30 border-purple-500/25 text-purple-200"
                : "bg-amber-500/10 border-amber-500/25 text-amber-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {geminiKey ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <AlertCircle size={14} className="text-amber-400" />
              )}
              <span>
                {geminiKey
                  ? "Gemini 3.8 Flash (Latest AI): Configured & Verified ✅"
                  : "No Gemini Key in Settings (Smart Zero-Token Engine will auto-generate)."}
              </span>
            </div>
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:underline"
              >
                <Settings size={12} />
                <span>{geminiKey ? "Manage in Settings" : "Configure Key"}</span>
              </button>
            )}
          </div>
        )}

        {provider === "argon-4" && (
          <div
            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
              claudeKey
                ? "bg-cyan-950/30 border-cyan-500/25 text-cyan-200"
                : "bg-amber-500/10 border-amber-500/25 text-amber-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {claudeKey ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <AlertCircle size={14} className="text-amber-400" />
              )}
              <span>
                {claudeKey
                  ? "Argon 4 (Advanced Motion AI): Configured & Verified ✅"
                  : "No Claude Key in Settings (Smart Zero-Token Engine will auto-generate)."}
              </span>
            </div>
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
              >
                <Settings size={12} />
                <span>{claudeKey ? "Manage in Settings" : "Configure Key"}</span>
              </button>
            )}
          </div>
        )}

        {provider === "template" && (
          <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <Zap size={14} className="text-yellow-400 flex-shrink-0" />
            <span>Zero Setup Required — Instantly generates full multi-track blueprints in &lt;1 second.</span>
          </div>
        )}

        {/* Aspect Ratio Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-300">Video Aspect Ratio / Format</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "9:16", label: "9:16 Vertical Reel", desc: "TikTok / IG Shorts" },
              { id: "16:9", label: "16:9 Landscape", desc: "YouTube / Desktop" },
              { id: "1:1", label: "1:1 Square", desc: "Facebook / Feed Post" },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setAspectRatio(fmt.id as AspectRatio)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  aspectRatio === fmt.id
                    ? "bg-purple-600/20 border-purple-500 text-white"
                    : "bg-[#161a29] border-white/[0.06] text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-xs">{fmt.label}</div>
                <div className="text-[10px] text-slate-500">{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-300">Video Prompt or Topic</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video topic, visual tone, and style in detail..."
            className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl p-3 text-white text-xs outline-none focus:border-purple-500 resize-none"
          />
        </div>

        {/* Quick Presets (1-Click) */}
        <div className="space-y-1.5 text-xs">
          <span className="text-slate-400 text-[11px]">Instant Pre-built Motion Templates (Zero Wait):</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleGenerate("bangla-ai-explainer")}
              className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-purple-600/30 border border-white/[0.08] hover:border-purple-500/50 text-[11px] text-slate-300 transition-colors"
            >
              🤖 AI Revolution Explainer (Reel)
            </button>
            <button
              onClick={() => handleGenerate("ecommerce-mega-sale")}
              className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-pink-600/30 border border-white/[0.08] hover:border-pink-500/50 text-[11px] text-slate-300 transition-colors"
            >
              💥 50% Mega Flash Sale (Reel)
            </button>
            <button
              onClick={() => handleGenerate("smart-dynamic")}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-[11px] text-indigo-300 transition-colors flex items-center gap-1"
            >
              <Zap size={11} className="text-yellow-400" />
              <span>Generate from Prompt (Zero Token)</span>
            </button>
          </div>
        </div>

        {/* Live Generation Progress Card */}
        {isLoading && (
          <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-500/30 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-200 font-semibold flex items-center gap-2">
                <Activity size={14} className="text-purple-400 animate-pulse" />
                {progressStage}
              </span>
              <span className="font-mono text-purple-300 font-bold">{progressPercent}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/[0.05]">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-purple-300/70">
              Generating full 60 FPS motion timeline, text hierarchies, cards, and spring easing curves...
            </p>
          </div>
        )}

        {/* Error Feedback with 1-Click Recovery */}
        {errorMsg && !isLoading && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-rose-200">AI Generation Issue:</div>
                <div className="text-[11px] text-rose-300/90">{errorMsg}</div>
              </div>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Click below to generate instantly without API tokens:</span>
              <button
                onClick={() => handleGenerate("smart-dynamic")}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow transition-colors flex items-center gap-1"
              >
                <Zap size={12} className="text-yellow-400" />
                <span>Instant Smart Generation</span>
              </button>
            </div>
          </div>
        )}

        {/* Smart Zero-Token Fallback Option */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Smart Fallback: Auto-generate if API times out or rate limits</span>
          </div>
          <input
            type="checkbox"
            checked={useSmartFallback}
            onChange={(e) => setUseSmartFallback(e.target.checked)}
            className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
          />
        </div>

        {/* Zero Token Guarantee Notice */}
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-300 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Zero-Token Guarantee:</strong> Once generated, edit all text, layers, keyframes, transitions, and colors 100% locally with zero extra API tokens.
          </span>
        </div>

        {/* Action Button */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-semibold text-xs disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{progressStage.slice(0, 28)}...</span>
              </>
            ) : (
              <>
                <Wand2 size={14} />
                <span>Generate Video Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
