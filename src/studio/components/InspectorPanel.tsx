import React, { useState } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import {
  Type,
  Shapes,
  Trash2,
  Copy,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sliders,
  Layers,
  Key,
  MoveUp,
  MoveDown,
  ArrowUpToLine,
  ArrowDownToLine,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  Volume2,
  Palette,
  Clock,
  Wand2,
} from "lucide-react";
import { KineticEffect, EasingType, ShapeType } from "../../types/schema";
import { audioEngine } from "../../services/audioEngine";

const BENGALI_FONTS = [
  { name: "Hind Siliguri (Bengali Sans)", value: "Hind Siliguri" },
  { name: "Tiro Bangla (Bengali Serif)", value: "Tiro Bangla" },
  { name: "Outfit (Modern English)", value: "Outfit" },
  { name: "Inter (Clean UI Sans)", value: "Inter" },
  { name: "JetBrains Mono (Technical)", value: "JetBrains Mono" },
];

const PRESET_COLORS = [
  "#ffffff",
  "#a855f7",
  "#38bdf8",
  "#f43f5e",
  "#fbbf24",
  "#10b981",
  "#94a3b8",
  "#0f172a",
];

const CANVAS_BACKGROUNDS = [
  {
    name: "Deep Cosmic Violet",
    bg: "#090710",
    grad: "linear-gradient(135deg, #0f0c1b 0%, #1e1136 50%, #090710 100%)",
  },
  {
    name: "Electric Cyber Cyan",
    bg: "#070c14",
    grad: "linear-gradient(135deg, #070c14 0%, #0d1e33 50%, #060b13 100%)",
  },
  {
    name: "Sunset Crimson",
    bg: "#10060e",
    grad: "linear-gradient(135deg, #1a0818 0%, #2f0f2a 50%, #0f0410 100%)",
  },
  {
    name: "Emerald Matrix",
    bg: "#05100c",
    grad: "linear-gradient(135deg, #06140e 0%, #0f2d21 50%, #040d09 100%)",
  },
  {
    name: "Pure Dark Minimalist",
    bg: "#080a11",
    grad: "",
  },
];

export const InspectorPanel: React.FC = () => {
  const { selectedElement, currentFrame, project, actions } = useProjectStore();
  const [activeTab, setActiveTab] = useState<"layer" | "scene">("layer");
  const [isAiRefining, setIsAiRefining] = useState(false);

  // Quick Sound Test
  const playSoundEffect = (type: "whoosh" | "pop") => {
    if (type === "whoosh") audioEngine.playWhoosh();
    else audioEngine.playPop();
  };

  // 1-Click AI Typography Magic
  const handleAiRefine = async (actionType: "punchy" | "bangla" | "glow") => {
    if (!selectedElement || selectedElement.type !== "text" || !selectedElement.text) return;
    setIsAiRefining(true);
    audioEngine.playPop();

    setTimeout(() => {
      if (actionType === "punchy") {
        const text = selectedElement.text!.text;
        actions.updateElement(selectedElement.id, (el) => ({
          ...el,
          text: el.text
            ? {
                ...el.text,
                text: text.toUpperCase().includes("🔥") ? text : `🔥 ${text}!`,
                fontWeight: 800,
                glow: "0 0 30px rgba(168, 85, 247, 0.7)",
              }
            : el.text,
        }));
      } else if (actionType === "bangla") {
        actions.updateElement(selectedElement.id, (el) => ({
          ...el,
          text: el.text
            ? {
                ...el.text,
                fontFamily: "Hind Siliguri",
                text: "স্মার্ট মোশন এডিটর দিয়ে ভিডিও বানান সহজে!",
              }
            : el.text,
        }));
      } else if (actionType === "glow") {
        actions.updateElement(selectedElement.id, (el) => ({
          ...el,
          text: el.text
            ? {
                ...el.text,
                glow: "0 0 35px rgba(56, 189, 248, 0.8)",
                color: "#ffffff",
              }
            : el.text,
        }));
      }
      setIsAiRefining(false);
    }, 300);
  };

  return (
    <div className="w-80 border-l border-white/[0.08] bg-[#0c0f18] flex flex-col h-full overflow-hidden select-none z-20">
      {/* Top Header Mode Tabs */}
      <div className="h-12 border-b border-white/[0.06] bg-[#101422] px-3 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#161a29] p-0.5 rounded-lg border border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab("layer")}
            className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "layer"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders size={13} />
            <span>Layer</span>
          </button>
          <button
            onClick={() => setActiveTab("scene")}
            className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "scene"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Palette size={13} />
            <span>Scene</span>
          </button>
        </div>

        {selectedElement && activeTab === "layer" && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                actions.duplicateSelected();
                audioEngine.playPop();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded transition-colors"
              title="Duplicate Selected Layer"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => {
                actions.deleteSelected();
                audioEngine.playWhoosh();
              }}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
              title="Delete Layer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
        {/* ==================== TAB 1: LAYER INSPECTOR ==================== */}
        {activeTab === "layer" && (
          <>
            {!selectedElement ? (
              <div className="py-16 flex flex-col items-center justify-center text-center text-slate-500">
                <Layers size={36} className="mb-3 text-slate-600" />
                <h4 className="text-sm font-semibold text-slate-300">No Layer Selected</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  Click any element on the canvas or timeline to inspect and edit its properties.
                </p>
                <button
                  onClick={() => setActiveTab("scene")}
                  className="mt-4 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-purple-300 text-xs font-semibold"
                >
                  Configure Canvas Scene →
                </button>
              </div>
            ) : (
              <>
                {/* 1. LAYER QUICK ALIGNMENT MATRIX */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    <span>Quick Alignment</span>
                    <span className="text-[10px] text-cyan-400 font-normal">Canvas Snapping</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1 bg-[#161a29] p-1 rounded-xl border border-white/[0.06]">
                    <button
                      onClick={() => actions.alignElement(selectedElement.id, "left")}
                      className="py-1.5 flex items-center justify-center rounded hover:bg-purple-600/30 text-slate-300 hover:text-white transition-colors"
                      title="Align Left (+60px margin)"
                    >
                      <AlignLeft size={13} />
                    </button>
                    <button
                      onClick={() => actions.alignElement(selectedElement.id, "center-x")}
                      className="py-1.5 flex items-center justify-center rounded hover:bg-purple-600/30 text-slate-300 hover:text-white transition-colors"
                      title="Center Horizontally (X Center)"
                    >
                      <AlignHorizontalJustifyCenter size={13} />
                    </button>
                    <button
                      onClick={() => actions.alignElement(selectedElement.id, "right")}
                      className="py-1.5 flex items-center justify-center rounded hover:bg-purple-600/30 text-slate-300 hover:text-white transition-colors"
                      title="Align Right"
                    >
                      <AlignRight size={13} />
                    </button>
                    <button
                      onClick={() => actions.alignElement(selectedElement.id, "top")}
                      className="py-1.5 flex items-center justify-center rounded hover:bg-purple-600/30 text-slate-300 hover:text-white transition-colors"
                      title="Align Top (+100px safe margin)"
                    >
                      <ArrowUpToLine size={13} />
                    </button>
                    <button
                      onClick={() => actions.alignElement(selectedElement.id, "center-y")}
                      className="py-1.5 flex items-center justify-center rounded hover:bg-purple-600/30 text-slate-300 hover:text-white transition-colors"
                      title="Center Vertically (Y Center)"
                    >
                      <AlignVerticalJustifyCenter size={13} />
                    </button>
                    <button
                      onClick={() => actions.alignElement(selectedElement.id, "bottom")}
                      className="py-1.5 flex items-center justify-center rounded hover:bg-purple-600/30 text-slate-300 hover:text-white transition-colors"
                      title="Align Bottom (-100px safe margin)"
                    >
                      <ArrowDownToLine size={13} />
                    </button>
                  </div>
                </div>

                {/* 2. LAYER HIERARCHY / Z-ORDER CONTROLS */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    <span>Layer Stacking (Z-Index)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 bg-[#161a29] p-1 rounded-xl border border-white/[0.06] text-[11px]">
                    <button
                      onClick={() => actions.bringToFront(selectedElement.id)}
                      className="py-1.5 px-1 rounded flex items-center justify-center gap-1 text-slate-300 hover:text-white hover:bg-white/[0.08]"
                      title="Bring to Front"
                    >
                      <ArrowUpToLine size={12} className="text-purple-400" />
                      <span>Front</span>
                    </button>
                    <button
                      onClick={() => actions.moveLayerUp(selectedElement.id)}
                      className="py-1.5 px-1 rounded flex items-center justify-center gap-1 text-slate-300 hover:text-white hover:bg-white/[0.08]"
                      title="Move Up 1 Layer"
                    >
                      <MoveUp size={12} className="text-cyan-400" />
                      <span>Up</span>
                    </button>
                    <button
                      onClick={() => actions.moveLayerDown(selectedElement.id)}
                      className="py-1.5 px-1 rounded flex items-center justify-center gap-1 text-slate-300 hover:text-white hover:bg-white/[0.08]"
                      title="Move Down 1 Layer"
                    >
                      <MoveDown size={12} className="text-cyan-400" />
                      <span>Down</span>
                    </button>
                    <button
                      onClick={() => actions.sendToBack(selectedElement.id)}
                      className="py-1.5 px-1 rounded flex items-center justify-center gap-1 text-slate-300 hover:text-white hover:bg-white/[0.08]"
                      title="Send to Back"
                    >
                      <ArrowDownToLine size={12} className="text-purple-400" />
                      <span>Back</span>
                    </button>
                  </div>
                </div>

                {/* 3. GEMINI AI MAGIC REFINER (FOR TEXT) */}
                {selectedElement.type === "text" && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-cyan-900/40 border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                      <span className="flex items-center gap-1.5">
                        <Wand2 size={13} className="text-yellow-400" />
                        Gemini AI Magic Refiner
                      </span>
                      <span className="text-[10px] text-purple-300/80 font-normal">0-Token Preset</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleAiRefine("punchy")}
                        disabled={isAiRefining}
                        className="px-2 py-1 rounded-lg bg-white/[0.08] hover:bg-purple-600/40 text-[10px] font-semibold text-purple-200 transition-colors"
                      >
                        ⚡ Make Punchy
                      </button>
                      <button
                        onClick={() => handleAiRefine("bangla")}
                        disabled={isAiRefining}
                        className="px-2 py-1 rounded-lg bg-white/[0.08] hover:bg-cyan-600/40 text-[10px] font-semibold text-cyan-200 transition-colors"
                      >
                        🇧🇩 Bengali Style
                      </button>
                      <button
                        onClick={() => handleAiRefine("glow")}
                        disabled={isAiRefining}
                        className="px-2 py-1 rounded-lg bg-white/[0.08] hover:bg-pink-600/40 text-[10px] font-semibold text-pink-200 transition-colors"
                      >
                        ✨ Add Glow
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. TEXT CONTENT CONTROLS */}
                {selectedElement.type === "text" && selectedElement.text && (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300 flex items-center justify-between">
                        <span>Live Typography</span>
                        <span className="text-[10px] text-emerald-400 font-normal">✨ 0-Token Edit</span>
                      </label>
                      <textarea
                        rows={3}
                        value={selectedElement.text.text}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            text: el.text ? { ...el.text, text: e.target.value } : el.text,
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl p-2.5 text-white font-bengali text-sm outline-none focus:border-purple-500 transition-colors resize-none"
                      />
                    </div>

                    {/* Font Family */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Font Family</label>
                      <select
                        value={selectedElement.text.fontFamily}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            text: el.text ? { ...el.text, fontFamily: e.target.value } : el.text,
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      >
                        {BENGALI_FONTS.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Font Size & Weight */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-300">
                          Size ({selectedElement.text.fontSize}px)
                        </label>
                        <input
                          type="range"
                          min="20"
                          max="140"
                          value={selectedElement.text.fontSize}
                          onChange={(e) =>
                            actions.updateElement(selectedElement.id, (el) => ({
                              ...el,
                              text: el.text
                                ? { ...el.text, fontSize: parseInt(e.target.value) }
                                : el.text,
                            }))
                          }
                          className="w-full accent-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-300">Weight</label>
                        <select
                          value={selectedElement.text.fontWeight}
                          onChange={(e) =>
                            actions.updateElement(selectedElement.id, (el) => ({
                              ...el,
                              text: el.text ? { ...el.text, fontWeight: e.target.value } : el.text,
                            }))
                          }
                          className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-2 py-1.5 text-white text-xs outline-none"
                        >
                          <option value="400">Regular (400)</option>
                          <option value="600">SemiBold (600)</option>
                          <option value="700">Bold (700)</option>
                          <option value="800">ExtraBold (800)</option>
                        </select>
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Text Color</label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() =>
                              actions.updateElement(selectedElement.id, (el) => ({
                                ...el,
                                text: el.text ? { ...el.text, color: c } : el.text,
                              }))
                            }
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border ${
                              selectedElement.text?.color === c
                                ? "ring-2 ring-purple-400 scale-110"
                                : "border-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Kinetic Typography Effect */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300 flex items-center gap-1">
                        <Sparkles size={12} className="text-yellow-400" />
                        <span>Kinetic Typography Animation</span>
                      </label>
                      <select
                        value={selectedElement.text.kineticEffect}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            text: el.text
                              ? { ...el.text, kineticEffect: e.target.value as KineticEffect }
                              : el.text,
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
                      >
                        <option value="pop-in">Pop-In Dynamic Bounce</option>
                        <option value="word-by-word">Word-By-Word Kinetic Reveal</option>
                        <option value="typewriter">High-Tech Typewriter</option>
                        <option value="glow-pulse">Glow Pulsing Neon</option>
                        <option value="slide-up">Smooth Kinetic Slide-Up</option>
                        <option value="bounce-drop">Elastic Gravity Drop</option>
                        <option value="none">Static Typography</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 5. SHAPE PROPERTIES */}
                {selectedElement.type === "shape" && selectedElement.shape && (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Shape Style</label>
                      <select
                        value={selectedElement.shape.shapeType}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            shape: el.shape
                              ? { ...el.shape, shapeType: e.target.value as ShapeType }
                              : el.shape,
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none"
                      >
                        <option value="glass-card">Glassmorphism Frosted Card</option>
                        <option value="pill">Pill Badge</option>
                        <option value="rectangle">Rounded Container</option>
                        <option value="circle">Circular Accent</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">Fill Color</label>
                      <input
                        type="text"
                        value={selectedElement.shape.fill}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            shape: el.shape ? { ...el.shape, fill: e.target.value } : el.shape,
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-300">
                        Corner Radius ({selectedElement.shape.borderRadius}px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        value={selectedElement.shape.borderRadius}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            shape: el.shape
                              ? { ...el.shape, borderRadius: parseInt(e.target.value) }
                              : el.shape,
                          }))
                        }
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* 6. IN/OUT ANIMATION & EASING */}
                <div className="pt-3 border-t border-white/[0.08] space-y-3">
                  <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block">
                    Motion Easing & Timing
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Entrance Animation</label>
                      <select
                        value={selectedElement.inAnimation?.type || "pop"}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            inAnimation: {
                              type: e.target.value as "pop" | "fade" | "slide-up" | "elastic" | "zoom",
                              durationFrames: el.inAnimation?.durationFrames || 20,
                              easing: el.inAnimation?.easing || "spring",
                            },
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-lg px-2 py-1.5 text-white text-xs outline-none"
                      >
                        <option value="pop">Spring Pop</option>
                        <option value="slide-up">Slide Up</option>
                        <option value="fade">Smooth Fade</option>
                        <option value="elastic">Elastic Bounce</option>
                        <option value="zoom">Dynamic Zoom</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Easing Curve</label>
                      <select
                        value={selectedElement.inAnimation?.easing || "spring"}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            inAnimation: {
                              type: el.inAnimation?.type || "pop",
                              durationFrames: el.inAnimation?.durationFrames || 20,
                              easing: e.target.value as EasingType,
                            },
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-lg px-2 py-1.5 text-white text-xs outline-none"
                      >
                        <option value="spring">Natural Spring</option>
                        <option value="bounce">Bouncy</option>
                        <option value="ease-in-out">Ease In-Out</option>
                        <option value="ease-out">Ease Out</option>
                        <option value="linear">Linear</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 7. TRANSFORM & GEOMETRY */}
                <div className="pt-3 border-t border-white/[0.08] space-y-3">
                  <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block">
                    Transform Coordinates
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">X Position</label>
                      <input
                        type="number"
                        value={selectedElement.transform.x}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            transform: { ...el.transform, x: parseInt(e.target.value) || 0 },
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Y Position</label>
                      <input
                        type="number"
                        value={selectedElement.transform.y}
                        onChange={(e) =>
                          actions.updateElement(selectedElement.id, (el) => ({
                            ...el,
                            transform: { ...el.transform, y: parseInt(e.target.value) || 0 },
                          }))
                        }
                        className="w-full bg-[#161a29] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">
                      Rotation ({selectedElement.transform.rotation}°)
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={selectedElement.transform.rotation}
                      onChange={(e) =>
                        actions.updateElement(selectedElement.id, (el) => ({
                          ...el,
                          transform: { ...el.transform, rotation: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">
                      Opacity ({Math.round(selectedElement.transform.opacity * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={selectedElement.transform.opacity}
                      onChange={(e) =>
                        actions.updateElement(selectedElement.id, (el) => ({
                          ...el,
                          transform: { ...el.transform, opacity: parseFloat(e.target.value) },
                        }))
                      }
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>

                {/* 8. KEYFRAMING */}
                <div className="pt-3 border-t border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
                      Keyframe Snap (Frame {currentFrame}f)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        actions.updateElement(selectedElement.id, (el) => {
                          const existing = el.keyframes.filter(
                            (k) => !(k.frame === currentFrame && k.property === "x")
                          );
                          return {
                            ...el,
                            keyframes: [
                              ...existing,
                              {
                                id: "kf_" + Date.now(),
                                frame: currentFrame,
                                property: "x",
                                value: el.transform.x,
                                easing: "spring",
                              },
                            ],
                          };
                        });
                        audioEngine.playPop();
                      }}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-[11px] flex items-center justify-center gap-1"
                    >
                      <Key size={11} /> + Keyframe X
                    </button>
                    <button
                      onClick={() => {
                        actions.updateElement(selectedElement.id, (el) => {
                          const existing = el.keyframes.filter(
                            (k) => !(k.frame === currentFrame && k.property === "y")
                          );
                          return {
                            ...el,
                            keyframes: [
                              ...existing,
                              {
                                id: "kf_" + Date.now(),
                                frame: currentFrame,
                                property: "y",
                                value: el.transform.y,
                                easing: "spring",
                              },
                            ],
                          };
                        });
                        audioEngine.playPop();
                      }}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-[11px] flex items-center justify-center gap-1"
                    >
                      <Key size={11} /> + Keyframe Y
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ==================== TAB 2: GLOBAL SCENE & THEME ==================== */}
        {activeTab === "scene" && (
          <div className="space-y-5">
            {/* Background Style Presets */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-300 text-xs block">
                Canvas Backdrop Preset
              </label>
              <div className="space-y-1.5">
                {CANVAS_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.name}
                    onClick={() => {
                      actions.updateProjectTheme({
                        background: bg.bg,
                        gradient: bg.grad,
                      });
                      audioEngine.playPop();
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      project.theme.gradient === bg.grad ||
                      (!project.theme.gradient && project.theme.background === bg.bg)
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "bg-[#161a29] border-white/[0.06] text-slate-300 hover:text-white"
                    }`}
                  >
                    <div
                      style={{ background: bg.grad || bg.bg }}
                      className="w-6 h-6 rounded-lg border border-white/20 flex-shrink-0"
                    />
                    <span className="font-medium text-xs truncate">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Rate & Smoothness */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock size={13} className="text-cyan-400" />
                <span>Motion FPS & Playback</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { fps: 30, label: "30 FPS (Standard)" },
                  { fps: 60, label: "60 FPS (Ultra Smooth)" },
                ].map((item) => (
                  <button
                    key={item.fps}
                    onClick={() => actions.updateProjectSettings({ fps: item.fps })}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      project.fps === item.fps
                        ? "bg-purple-600 text-white border-purple-400 font-bold"
                        : "bg-[#161a29] border-white/[0.06] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Effects Preview */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Volume2 size={13} className="text-yellow-400" />
                <span>Sound Design Cue Audition</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => playSoundEffect("whoosh")}
                  className="px-3 py-2 rounded-xl bg-[#161a29] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>💨 Whoosh Cue</span>
                </button>
                <button
                  onClick={() => playSoundEffect("pop")}
                  className="px-3 py-2 rounded-xl bg-[#161a29] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>✨ Pop / Ping</span>
                </button>
              </div>
            </div>

            {/* Canvas Dimensions Display */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Aspect Format:</span>
                <span className="text-white font-mono">{project.aspectRatio}</span>
              </div>
              <div className="flex justify-between">
                <span>Dimensions:</span>
                <span className="text-white font-mono">{project.width} × {project.height}px</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-white font-mono">
                  {project.durationFrames} frames ({Math.round(project.durationFrames / project.fps)}s)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
