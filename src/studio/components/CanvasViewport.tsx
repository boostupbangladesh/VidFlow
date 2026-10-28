import React, { useRef, useState, useEffect } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import { computeElementStateAtFrame } from "../../engine/animationEngine";
import { ZoomIn, ZoomOut, Maximize2, Eye, EyeOff, Play, Pause } from "lucide-react";
import { audioEngine } from "../../services/audioEngine";

export const CanvasViewport: React.FC = () => {
  const {
    project,
    currentFrame,
    isPlaying,
    selectedElementId,
    zoom,
    showSafeGuides,
    actions,
  } = useProjectStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; elemX: number; elemY: number } | null>(null);

  // Playhead loop animation when isPlaying
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (isPlaying) {
        const delta = (time - lastTime) / 1000;
        const framesToAdd = delta * project.fps;

        if (framesToAdd >= 1) {
          actions.setCurrentFrame((currentFrame + Math.floor(framesToAdd)) % project.durationFrames);
          lastTime = time;
        }
      } else {
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, currentFrame, project.fps, project.durationFrames, actions]);

  // Handle Dragging an element on the canvas
  const handleMouseDown = (e: React.MouseEvent, elemId: string, currentX: number, currentY: number) => {
    e.stopPropagation();
    actions.selectElement(elemId, null);
    setIsDragging(true);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: currentX,
      elemY: currentY,
    });
    audioEngine.playPop();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !selectedElementId) return;

    const deltaX = (e.clientX - dragStart.mouseX) / zoom;
    const deltaY = (e.clientY - dragStart.mouseY) / zoom;

    actions.updateElement(selectedElementId, (el) => ({
      ...el,
      transform: {
        ...el.transform,
        x: Math.round(dragStart.elemX + deltaX),
        y: Math.round(dragStart.elemY + deltaY),
      },
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => actions.selectElement(null, null)}
      className="flex-1 h-full bg-[#07090e] canvas-grid-bg relative flex items-center justify-center overflow-hidden"
    >
      {/* Top Floating Viewport Toolbar */}
      <div className="absolute top-4 z-20 flex items-center gap-2 bg-[#0f121d]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.08] shadow-lg text-xs">
        <button
          onClick={() => actions.setZoom(zoom - 0.1)}
          className="p-1 hover:bg-white/[0.1] rounded text-slate-300"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <span className="font-mono text-[11px] text-purple-300 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => actions.setZoom(zoom + 0.1)}
          className="p-1 hover:bg-white/[0.1] rounded text-slate-300"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <div className="h-4 w-[1px] bg-white/[0.1] mx-1" />
        <button
          onClick={() => actions.setZoom(0.85)}
          className="p-1 hover:bg-white/[0.1] rounded text-slate-300"
          title="Fit Canvas"
        >
          <Maximize2 size={14} />
        </button>
        <button
          onClick={actions.toggleSafeGuides}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
            showSafeGuides
              ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="Toggle Reel Safe Areas & Margins"
        >
          {showSafeGuides ? <Eye size={12} /> : <EyeOff size={12} />}
          <span>Reel Margins</span>
        </button>
      </div>

      {/* The Master Canvas Stage */}
      <div
        style={{
          width: project.width,
          height: project.height,
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          background: project.theme.background,
        }}
        className="relative shadow-2xl transition-transform duration-75 select-none rounded-lg overflow-hidden border border-white/[0.08]"
      >
        {/* Dynamic Theme Gradient Background */}
        {project.theme.gradient && (
          <div
            style={{ background: project.theme.gradient }}
            className="absolute inset-0 pointer-events-none"
          />
        )}

        {/* Safe Margins Overlay (Especially for 9:16 Reels) */}
        {showSafeGuides && project.aspectRatio === "9:16" && (
          <div className="absolute inset-0 pointer-events-none z-40 border-[2px] border-dashed border-cyan-500/30 m-12 rounded-2xl flex flex-col justify-between p-4">
            <span className="text-[14px] font-mono text-cyan-400/60 uppercase">
              ↑ Top Navigation Safe Zone
            </span>
            <div className="text-center text-[12px] font-mono text-cyan-400/40">
              Center Safe Zone (1080 x 1920)
            </div>
            <span className="text-[14px] font-mono text-cyan-400/60 uppercase text-right">
              ↓ Bottom Caption & Audio Safe Zone
            </span>
          </div>
        )}

        {/* Render Clips & Elements Layer by Layer */}
        {(project?.tracks || [])
          .slice()
          .reverse()
          .map((track) => {
            if (!track?.isVisible || !Array.isArray(track?.clips)) return null;

            return track.clips.map((clip) => {
              if (!clip?.element) return null;

              const state = computeElementStateAtFrame(
                clip.element,
                clip.startFrame,
                clip.durationFrames,
                currentFrame
              );

              if (!state.isVisible || state.opacity <= 0.01) return null;

              const isSelected = selectedElementId === clip.element.id;
              const currentX = clip.element.transform?.x ?? state.transform.x;
              const currentY = clip.element.transform?.y ?? state.transform.y;

              return (
                <div
                  key={clip.id}
                  onMouseDown={(e) =>
                    handleMouseDown(e, clip.element.id, currentX, currentY)
                  }
                  style={{
                    position: "absolute",
                    left: `${state.transform.x}px`,
                    top: `${state.transform.y}px`,
                    width: `${state.transform.width}px`,
                    height: `${state.transform.height}px`,
                    transform: `translate(-50%, -50%) rotate(${state.transform.rotation}deg) scale(${state.transform.scale})`,
                    opacity: state.opacity,
                    cursor: isDragging && isSelected ? "grabbing" : "grab",
                    zIndex: isSelected ? 40 : 10,
                  }}
                  className={`group transition-shadow duration-100 flex items-center justify-center ${
                    isSelected ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-transparent" : ""
                  }`}
                >
                  {/* Shape Rendering */}
                  {clip.element.type === "shape" && clip.element.shape && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: clip.element.shape.fill,
                        border: `${clip.element.shape.strokeWidth}px solid ${clip.element.shape.stroke}`,
                        borderRadius: `${clip.element.shape.borderRadius}px`,
                        boxShadow: clip.element.shape.glow || "none",
                        backdropFilter: clip.element.shape.glassmorphism ? "blur(16px)" : "none",
                      }}
                      className="w-full h-full pointer-events-none"
                    />
                  )}

                  {/* Text Rendering */}
                  {clip.element.type === "text" && clip.element.text && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        fontFamily: `"${clip.element.text.fontFamily}", sans-serif`,
                        fontSize: `${clip.element.text.fontSize}px`,
                        fontWeight: clip.element.text.fontWeight,
                        color: clip.element.text.color,
                        textAlign: clip.element.text.textAlign,
                        lineHeight: clip.element.text.lineHeight || 1.3,
                        textShadow: clip.element.text.glow || "none",
                        whiteSpace: "pre-line",
                        letterSpacing: clip.element.text.letterSpacing
                          ? `${clip.element.text.letterSpacing}px`
                          : "normal",
                      }}
                      className="pointer-events-none flex items-center justify-center select-none"
                    >
                      {clip.element.text.text}
                    </div>
                  )}

                  {/* Selected Handles & Dimension Pill */}
                  {isSelected && (
                    <>
                      {/* 8 Transform Handles */}
                      <div className="transform-handle -top-1.5 -left-1.5" />
                      <div className="transform-handle -top-1.5 left-1/2 -translate-x-1/2" />
                      <div className="transform-handle -top-1.5 -right-1.5" />
                      <div className="transform-handle top-1/2 -right-1.5 -translate-y-1/2" />
                      <div className="transform-handle -bottom-1.5 -right-1.5" />
                      <div className="transform-handle -bottom-1.5 left-1/2 -translate-x-1/2" />
                      <div className="transform-handle -bottom-1.5 -left-1.5" />
                      <div className="transform-handle top-1/2 -left-1.5 -translate-y-1/2" />

                      {/* Dimension Badge */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-purple-600 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none">
                        {Math.round(state.transform.width)} × {Math.round(state.transform.height)}
                      </div>
                    </>
                  )}
                </div>
              );
            });
          })}
      </div>
    </div>
  );
};
