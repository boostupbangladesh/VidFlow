import React, { useRef, useState, useEffect, useCallback } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Plus,
  Eye,
  Unlock,
  Type,
  Shapes,
  Music,
} from "lucide-react";
import { audioEngine } from "../../services/audioEngine";

export const TimelinePanel: React.FC = () => {
  const { project, currentFrame, isPlaying, selectedClipId, actions } = useProjectStore();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [pixelsPerFrame, setPixelsPerFrame] = useState(2.2);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const totalFrames = project.durationFrames;
  const fps = project.fps;

  // Format frames to MM:SS.FF
  const formatTimecode = (frames: number) => {
    const totalSecs = frames / fps;
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    const fr = Math.floor(frames % fps);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}.${fr.toString().padStart(2, "0")}`;
  };

  // Compute frame from mouse clientX position
  const getFrameFromClientX = useCallback(
    (clientX: number) => {
      if (!timelineRef.current) return 0;
      const rect = timelineRef.current.getBoundingClientRect();
      const scrollLeft = timelineRef.current.scrollLeft;
      const offsetX = clientX - rect.left + scrollLeft;
      const frame = Math.round(offsetX / pixelsPerFrame);
      return Math.max(0, Math.min(totalFrames, frame));
    },
    [pixelsPerFrame, totalFrames]
  );

  // Start scrubbing on pointer down (either on playhead handle or ruler area)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to main mouse button
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    // Pause playback when user starts scrubbing
    if (isPlaying) {
      actions.setIsPlaying(false);
    }

    setIsScrubbing(true);
    const targetFrame = getFrameFromClientX(e.clientX);
    actions.setCurrentFrame(targetFrame);
  };

  // Global window pointermove and pointerup listeners while scrubbing
  useEffect(() => {
    if (!isScrubbing) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();
      const targetFrame = getFrameFromClientX(e.clientX);
      actions.setCurrentFrame(targetFrame);
    };

    const handlePointerUp = () => {
      setIsScrubbing(false);
      audioEngine.playClick();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    // Prevent text selection while dragging fast
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isScrubbing, getFrameFromClientX, actions]);

  const handlePlayToggle = () => {
    actions.togglePlay();
    audioEngine.playPop();
  };

  return (
    <div className="h-64 border-t border-white/[0.08] bg-[#0b0e17] flex flex-col z-20 select-none">
      {/* Transport & Control Bar */}
      <div className="h-11 border-b border-white/[0.06] bg-[#0f121d] px-4 flex items-center justify-between">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => actions.setCurrentFrame(0)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/[0.06]"
            title="Jump to Start"
          >
            <SkipBack size={15} />
          </button>
          <button
            onClick={handlePlayToggle}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-md shadow-purple-600/30 transition-transform active:scale-95"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
          <button
            onClick={() => actions.setCurrentFrame(totalFrames)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/[0.06]"
            title="Jump to End"
          >
            <SkipForward size={15} />
          </button>

          {/* Timecode & Frame Display */}
          <div className="flex items-center gap-2 bg-[#161a29] px-2.5 py-1 rounded-md border border-white/[0.06] ml-2">
            <span className="font-mono-time text-xs font-bold text-cyan-400">
              {formatTimecode(currentFrame)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">/</span>
            <span className="font-mono-time text-[11px] text-slate-400">
              {formatTimecode(totalFrames)}
            </span>
            <span className="text-[10px] bg-slate-800 text-purple-300 px-1.5 py-0.2 rounded font-mono ml-1">
              {currentFrame}f
            </span>
          </div>
        </div>

        {/* Add Layer Quick Actions & Zoom */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => actions.addTextElement("New Motion Headline", false)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-slate-200 transition-colors"
            >
              <Plus size={12} className="text-purple-400" />
              <span>Text</span>
            </button>
            <button
              onClick={() => actions.addShapeElement("glass-card")}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-slate-200 transition-colors"
            >
              <Plus size={12} className="text-cyan-400" />
              <span>Card</span>
            </button>
            <button
              onClick={() => actions.addShapeElement("pill")}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-slate-200 transition-colors"
            >
              <Plus size={12} className="text-pink-400" />
              <span>Badge</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-white/[0.1]" />

          {/* Timeline Zoom Slider */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-[10px]">Zoom</span>
            <input
              type="range"
              min="0.8"
              max="6.0"
              step="0.2"
              value={pixelsPerFrame}
              onChange={(e) => setPixelsPerFrame(parseFloat(e.target.value))}
              className="w-20 accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Tracks & Ruler Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Headers (Static Width) */}
        <div className="w-56 border-r border-white/[0.08] bg-[#0c0f18] flex flex-col flex-shrink-0">
          <div className="h-7 border-b border-white/[0.06] bg-[#111422] px-3 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Layers & Tracks
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
            {project.tracks.map((track) => (
              <div
                key={track.id}
                className="h-10 px-3 flex items-center justify-between text-xs text-slate-300 hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-2 truncate">
                  {track.type === "text" && <Type size={13} className="text-purple-400" />}
                  {track.type === "shape" && <Shapes size={13} className="text-cyan-400" />}
                  {track.type === "media" && <Music size={13} className="text-emerald-400" />}
                  <span className="truncate font-medium">{track.name}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <button className="p-1 hover:text-slate-300">
                    <Eye size={12} />
                  </button>
                  <button className="p-1 hover:text-slate-300">
                    <Unlock size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Lanes & Ruler */}
        <div
          ref={timelineRef}
          className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#090b12]"
        >
          {/* Time Ruler (Seconds & Frame Ticks) - Draggable Scrubber */}
          <div
            onPointerDown={handlePointerDown}
            style={{ width: `${totalFrames * pixelsPerFrame + 200}px` }}
            className="h-7 border-b border-white/[0.08] bg-[#111422] relative sticky top-0 z-10 flex items-end cursor-ew-resize hover:bg-[#151928] transition-colors"
          >
            {Array.from({ length: Math.ceil(totalFrames / fps) + 1 }).map((_, sec) => {
              const frame = sec * fps;
              const leftPos = frame * pixelsPerFrame;

              return (
                <div
                  key={sec}
                  style={{ left: `${leftPos}px` }}
                  className="absolute bottom-0 flex flex-col items-start pointer-events-none"
                >
                  <span className="text-[10px] font-mono text-slate-400 pl-1 pb-1">
                    {sec}s
                  </span>
                  <div className="w-[1px] h-2.5 bg-slate-600" />
                </div>
              );
            })}
          </div>

          {/* Interactive Playhead Needle & Handle */}
          <div
            style={{ left: `${currentFrame * pixelsPerFrame}px` }}
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 shadow-[0_0_10px_rgba(239,68,68,0.9)] pointer-events-none"
          >
            {/* Top Draggable Playhead Diamond Handle */}
            <div
              onPointerDown={handlePointerDown}
              className="w-5 h-5 bg-red-500 hover:bg-red-400 active:scale-110 rounded-sm -ml-[9px] -top-1 absolute rotate-45 cursor-ew-resize pointer-events-auto transition-transform flex items-center justify-center shadow-lg shadow-red-500/50"
              title="Drag to scrub timeline smoothly"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full pointer-events-none" />
            </div>
          </div>

          {/* Track Lanes */}
          <div
            onPointerDown={(e) => {
              // Allow clicking/dragging anywhere on empty track lane space to scrub
              if ((e.target as HTMLElement).closest(".timeline-clip")) return;
              handlePointerDown(e);
            }}
            style={{ width: `${totalFrames * pixelsPerFrame + 200}px` }}
            className="divide-y divide-white/[0.04]"
          >
            {project.tracks.map((track) => (
              <div key={track.id} className="h-10 relative flex items-center">
                {track.clips.map((clip) => {
                  const left = clip.startFrame * pixelsPerFrame;
                  const width = clip.durationFrames * pixelsPerFrame;
                  const isSelected = selectedClipId === clip.id;

                  return (
                    <div
                      key={clip.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.selectElement(clip.element.id, clip.id);
                        audioEngine.playPop();
                      }}
                      style={{
                        left: `${left}px`,
                        width: `${Math.max(20, width)}px`,
                      }}
                      className={`timeline-clip absolute h-7 rounded-md px-2 flex items-center justify-between text-xs font-semibold cursor-pointer shadow-md transition-all ${
                        isSelected
                          ? "bg-purple-600/90 text-white border-2 border-purple-300 ring-2 ring-purple-500/40"
                          : track.type === "text"
                          ? "bg-purple-900/50 text-purple-200 border border-purple-500/30 hover:bg-purple-800/60"
                          : "bg-cyan-900/50 text-cyan-200 border border-cyan-500/30 hover:bg-cyan-800/60"
                      }`}
                    >
                      <span className="truncate text-[11px] font-medium">{clip.name}</span>

                      {/* Keyframe Markers */}
                      {clip.element.keyframes && clip.element.keyframes.length > 0 && (
                        <div className="flex gap-1 pointer-events-none">
                          {clip.element.keyframes.map((kf) => (
                            <div key={kf.id} className="keyframe-marker" title={`Keyframe: ${kf.property}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
