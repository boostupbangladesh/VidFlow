import React from "react";
import { useProjectStore } from "../../store/useProjectStore";
import {
  Type,
  Shapes,
  Trash2,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  RotateCw,
  Sliders,
  Layers,
  Key,
} from "lucide-react";
import { KineticEffect, EasingType, ShapeType } from "../../types/schema";

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

export const InspectorPanel: React.FC = () => {
  const { selectedElement, currentFrame, actions } = useProjectStore();

  if (!selectedElement) {
    return (
      <div className="w-72 border-l border-white/[0.08] bg-[#0c0f18] p-6 flex flex-col items-center justify-center text-center select-none text-slate-500">
        <Layers size={32} className="mb-3 text-slate-600" />
        <h4 className="text-sm font-semibold text-slate-400">No Layer Selected</h4>
        <p className="text-xs text-slate-500 mt-1">
          Select any text or shape layer from the canvas or timeline to edit properties live
        </p>
      </div>
    );
  }

  const { id, type, transform } = selectedElement;

  const handleTransformChange = (key: keyof typeof transform, val: number) => {
    actions.updateElement(id, (el) => ({
      ...el,
      transform: { ...el.transform, [key]: val },
    }));
  };

  const handleAddKeyframe = (prop: "x" | "y" | "scale" | "opacity") => {
    actions.updateElement(id, (el) => {
      const existing = el.keyframes.filter((k) => !(k.frame === currentFrame && k.property === prop));
      return {
        ...el,
        keyframes: [
          ...existing,
          {
            id: "kf_" + Date.now(),
            frame: currentFrame,
            property: prop,
            value: el.transform[prop],
            easing: "spring",
          },
        ],
      };
    });
  };

  return (
    <div className="w-80 border-l border-white/[0.08] bg-[#0c0f18] flex flex-col h-full overflow-y-auto select-none z-20">
      {/* Inspector Header */}
      <div className="h-12 border-b border-white/[0.06] bg-[#101422] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === "text" ? (
            <Type size={16} className="text-purple-400" />
          ) : (
            <Shapes size={16} className="text-cyan-400" />
          )}
          <span className="font-outfit font-bold text-xs uppercase text-slate-200">
            {type === "text" ? "Text Inspector (0-Token)" : "Shape Properties"}
          </span>
        </div>
        <button
          onClick={actions.deleteSelected}
          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
          title="Delete Layer"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-4 space-y-5 text-xs text-slate-300">
        {/* TEXT SPECIFIC CONTROLS */}
        {type === "text" && selectedElement.text && (
          <div className="space-y-4">
            {/* Live Text Content */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center justify-between">
                <span>Text Content (Live Typography)</span>
                <span className="text-[10px] text-emerald-400 font-normal">✨ 0-Token Edit</span>
              </label>
              <textarea
                rows={3}
                value={selectedElement.text.text}
                onChange={(e) =>
                  actions.updateElement(id, (el) => ({
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
                  actions.updateElement(id, (el) => ({
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
                    actions.updateElement(id, (el) => ({
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
                    actions.updateElement(id, (el) => ({
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
                      actions.updateElement(id, (el) => ({
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

            {/* Text Alignment */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Alignment</label>
              <div className="grid grid-cols-3 gap-1 bg-[#161a29] p-1 rounded-xl border border-white/[0.06]">
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() =>
                      actions.updateElement(id, (el) => ({
                        ...el,
                        text: el.text ? { ...el.text, textAlign: align } : el.text,
                      }))
                    }
                    className={`py-1 rounded text-center transition-colors ${
                      selectedElement.text?.textAlign === align
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {align === "left" && <AlignLeft size={13} className="mx-auto" />}
                    {align === "center" && <AlignCenter size={13} className="mx-auto" />}
                    {align === "right" && <AlignRight size={13} className="mx-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Kinetic Typography Effect */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Sparkles size={12} className="text-yellow-400" />
                <span>Kinetic Motion Effect</span>
              </label>
              <select
                value={selectedElement.text.kineticEffect}
                onChange={(e) =>
                  actions.updateElement(id, (el) => ({
                    ...el,
                    text: el.text
                      ? { ...el.text, kineticEffect: e.target.value as KineticEffect }
                      : el.text,
                  }))
                }
                className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500 text-xs"
              >
                <option value="pop-in">Pop-In Bounce</option>
                <option value="word-by-word">Word-By-Word Reveal</option>
                <option value="glow-pulse">Glow Pulsing</option>
                <option value="slide-up">Smooth Slide-Up</option>
                <option value="none">Static (No Effect)</option>
              </select>
            </div>
          </div>
        )}

        {/* SHAPE SPECIFIC CONTROLS */}
        {type === "shape" && selectedElement.shape && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Shape Type</label>
              <select
                value={selectedElement.shape.shapeType}
                onChange={(e) =>
                  actions.updateElement(id, (el) => ({
                    ...el,
                    shape: el.shape
                      ? { ...el.shape, shapeType: e.target.value as ShapeType }
                      : el.shape,
                  }))
                }
                className="w-full bg-[#161a29] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none"
              >
                <option value="glass-card">Glassmorphism Card</option>
                <option value="pill">Pill Badge</option>
                <option value="rectangle">Rounded Rectangle</option>
                <option value="circle">Circle</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Fill Color</label>
              <input
                type="text"
                value={selectedElement.shape.fill}
                onChange={(e) =>
                  actions.updateElement(id, (el) => ({
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
                  actions.updateElement(id, (el) => ({
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

        {/* TRANSFORM CONTROLS (X, Y, Scale, Rotation, Opacity) */}
        <div className="pt-3 border-t border-white/[0.08] space-y-3">
          <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block">
            Transform & Layout
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Position X</label>
              <input
                type="number"
                value={transform.x}
                onChange={(e) => handleTransformChange("x", parseInt(e.target.value) || 0)}
                className="w-full bg-[#161a29] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Position Y</label>
              <input
                type="number"
                value={transform.y}
                onChange={(e) => handleTransformChange("y", parseInt(e.target.value) || 0)}
                className="w-full bg-[#161a29] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Width</label>
              <input
                type="number"
                value={transform.width}
                onChange={(e) => handleTransformChange("width", parseInt(e.target.value) || 10)}
                className="w-full bg-[#161a29] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Height</label>
              <input
                type="number"
                value={transform.height}
                onChange={(e) => handleTransformChange("height", parseInt(e.target.value) || 10)}
                className="w-full bg-[#161a29] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              Rotation ({transform.rotation}°)
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              value={transform.rotation}
              onChange={(e) => handleTransformChange("rotation", parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              Opacity ({Math.round(transform.opacity * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={transform.opacity}
              onChange={(e) => handleTransformChange("opacity", parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* KEYFRAME CONTROLS */}
        <div className="pt-3 border-t border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
              Keyframing (Frame: {currentFrame}f)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAddKeyframe("x")}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-[11px] flex items-center justify-center gap-1"
            >
              <Key size={11} /> + Keyframe X
            </button>
            <button
              onClick={() => handleAddKeyframe("y")}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-[11px] flex items-center justify-center gap-1"
            >
              <Key size={11} /> + Keyframe Y
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
