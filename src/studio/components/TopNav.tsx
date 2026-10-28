import React, { useState } from "react";
import {
  Sparkles,
  Download,
  Undo2,
  Redo2,
  Monitor,
  Smartphone,
  Square,
  MessageCircle,
  FileCode,
  FolderOpen,
  Info,
  Settings,
} from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";

interface TopNavProps {
  onOpenAIModal: () => void;
  onOpenFirstProjectModal?: () => void;
  onOpenExportModal: () => void;
  onOpenAboutModal: () => void;
  onOpenSettings: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenAIModal,
  onOpenFirstProjectModal,
  onOpenExportModal,
  onOpenAboutModal,
  onOpenSettings,
}) => {
  const { project, actions } = useProjectStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(project.title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    actions.setProject({ ...project, title: title || "Untitled Project" });
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${project.title.toLowerCase().replace(/\s+/g, "_")}.vidflow.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        actions.setProject(imported);
      } catch {
        alert("Invalid VidFlow JSON project file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#0c0f18]/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Developer Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-outfit font-black text-white text-lg tracking-tighter">V</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-outfit font-extrabold text-lg text-white tracking-tight">
                Vid<span className="text-purple-400">Flow</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded">
                v1.0 Pro
              </span>
            </div>
            <a
              href="https://wa.me/8801911444546"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
              title="Click to WhatsApp ZapyTeam"
            >
              <span>Dev: <strong className="text-slate-300">ZapyTeam</strong></span>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <MessageCircle size={10} /> +8801911444546
              </span>
            </a>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-white/[0.1] mx-1" />

        {/* Project Title */}
        <div className="flex items-center">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              autoFocus
              className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-purple-500/50 outline-none w-52 font-medium"
            />
          ) : (
            <button
              onClick={() => {
                setTitle(project.title);
                setIsEditingTitle(true);
              }}
              className="text-xs font-semibold text-slate-200 hover:text-white px-2 py-1 rounded hover:bg-white/[0.05] transition-colors truncate max-w-[200px]"
              title="Click to rename project"
            >
              {project.title}
            </button>
          )}
        </div>
      </div>

      {/* Center: Aspect Ratio & Undo/Redo */}
      <div className="flex items-center gap-3">
        {/* Aspect Ratio Switcher */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.08]">
          <button
            onClick={() => actions.changeAspectRatio("16:9")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              project.aspectRatio === "16:9"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="16:9 Landscape (YouTube / Desktop)"
          >
            <Monitor size={13} />
            <span>16:9</span>
          </button>
          <button
            onClick={() => actions.changeAspectRatio("9:16")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              project.aspectRatio === "9:16"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="9:16 Vertical (Reels / TikTok / Shorts)"
          >
            <Smartphone size={13} />
            <span>9:16 Reel</span>
          </button>
          <button
            onClick={() => actions.changeAspectRatio("1:1")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              project.aspectRatio === "1:1"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="1:1 Square (Feed / Instagram Post)"
          >
            <Square size={13} />
            <span>1:1</span>
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-slate-900/60 p-0.5 rounded-lg border border-white/[0.08]">
          <button
            onClick={actions.undo}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded hover:bg-white/[0.06] transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={actions.redo}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded hover:bg-white/[0.06] transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* Right: Actions (AI Gen, Export, Save/Load) */}
      <div className="flex items-center gap-2">
        {/* Save / Load Project JSON */}
        <div className="flex items-center gap-1 mr-1">
          <label
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded cursor-pointer transition-colors"
            title="Load .vidflow.json file"
          >
            <FolderOpen size={15} />
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExportJSON}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
            title="Save Project (.vidflow.json)"
          >
            <FileCode size={15} />
          </button>
          <button
            onClick={onOpenAboutModal}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
            title="About VidFlow & Developer Info"
          >
            <Info size={15} />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded transition-colors"
            title="Studio Settings (AI API Keys & Preferences)"
          >
            <Settings size={15} />
          </button>
        </div>

        {/* Motion Guidelines & Generator Wizard */}
        {onOpenFirstProjectModal && (
          <button
            onClick={onOpenFirstProjectModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all hover:scale-[1.02]"
            title="Open Professional Motion Guidelines & Project Wizard"
          >
            <Sparkles size={13} className="text-purple-400" />
            <span>Motion Guide</span>
          </button>
        )}

        {/* AI Generator Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles size={14} className="text-yellow-300" />
          <span>AI Generate</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white text-xs font-semibold shadow-md shadow-cyan-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={14} />
          <span>Export MP4</span>
        </button>
      </div>
    </header>
  );
};
