import React, { useState } from "react";
import { Download, X, Film, CheckCircle2, AlertCircle, Terminal, Copy, Check } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";
import { renderProjectToVideo, RenderProgress } from "../../services/exporter";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { project } = useProjectStore();

  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [exportedMime, setExportedMime] = useState<string>("video/webm");
  const [copiedCli, setCopiedCli] = useState(false);

  if (!isOpen) return null;

  const handleStartRender = async () => {
    setIsRendering(true);
    setVideoBlobUrl(null);

    try {
      const { blob, mimeType } = await renderProjectToVideo(project, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(blob);
      setVideoBlobUrl(url);
      setExportedMime(mimeType);
    } catch (err) {
      console.error("Render failed", err);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownload = () => {
    if (!videoBlobUrl) return;
    const ext = exportedMime.includes("mp4") ? "mp4" : "webm";
    const a = document.createElement("a");
    a.href = videoBlobUrl;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, "_")}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const remotionCliCmd = `npx remotion render src/index.ts out/${project.title
    .toLowerCase()
    .replace(/\s+/g, "_")}.mp4 --props='${JSON.stringify({ projectId: project.id })}'`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(remotionCliCmd);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f121d] border border-white/[0.1] shadow-2xl p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Film size={20} />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">Export Video</h3>
              <p className="text-xs text-slate-400">
                High-Quality Video Rendering (Frame-Accurate Local Export)
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

        {/* Video Specs Card */}
        <div className="p-4 rounded-xl bg-[#161a29] border border-white/[0.06] grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Resolution</span>
            <span className="font-bold text-white">
              {project.width} × {project.height}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Framerate</span>
            <span className="font-bold text-white">{project.fps} FPS</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Duration</span>
            <span className="font-bold text-white">
              {(project.durationFrames / project.fps).toFixed(1)}s ({project.durationFrames}f)
            </span>
          </div>
        </div>

        {/* Progress Bar if Rendering */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">
                {progress.status === "rendering" &&
                  `Rendering Frame: ${progress.currentFrame} / ${progress.totalFrames}`}
                {progress.status === "encoding" && "Encoding video and muxing audio..."}
                {progress.status === "completed" && "✅ Video Rendering Complete!"}
                {progress.status === "error" && "❌ Rendering failed. Please retry."}
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {progress.progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-100"
                style={{ width: `${progress.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Download Button if Completed */}
        {videoBlobUrl ? (
          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Download size={16} />
            <span>Download Completed Video</span>
          </button>
        ) : (
          <button
            onClick={handleStartRender}
            disabled={isRendering}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isRendering ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Video Frames...</span>
              </>
            ) : (
              <>
                <Film size={16} />
                <span>Start Local Video Render</span>
              </>
            )}
          </button>
        )}

        {/* Remotion CLI Export Command */}
        <div className="pt-2 border-t border-white/[0.08] space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <Terminal size={12} className="text-purple-400" /> Remotion CLI Export (4K / Server)
            </span>
            <button
              onClick={handleCopyCli}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              {copiedCli ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              <span>{copiedCli ? "Copied!" : "Copy Command"}</span>
            </button>
          </div>
          <div className="bg-[#090b12] p-2.5 rounded-lg border border-white/[0.06] font-mono text-[11px] text-slate-300 truncate">
            {remotionCliCmd}
          </div>
        </div>
      </div>
    </div>
  );
};
