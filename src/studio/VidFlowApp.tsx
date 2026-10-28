import React, { useState, useEffect } from "react";
import { TopNav } from "./components/TopNav";
import { LeftSidebar } from "./components/LeftSidebar";
import { CanvasViewport } from "./components/CanvasViewport";
import { InspectorPanel } from "./components/InspectorPanel";
import { TimelinePanel } from "./components/TimelinePanel";
import { AIGeneratorModal } from "./components/AIGeneratorModal";
import { FirstProjectCreatorModal } from "./components/FirstProjectCreatorModal";
import { OnboardingLicenseGate } from "./components/OnboardingLicenseGate";
import { ExportModal } from "./components/ExportModal";
import { AboutModal } from "./components/AboutModal";
import { LicenseModal } from "./components/LicenseModal";
import { SettingsModal } from "./components/SettingsModal";
import { AdminPinModal } from "./components/AdminPinModal";
import { VidFlowAdminApp } from "../admin/VidFlowAdminApp";
import { useProjectStore } from "../store/useProjectStore";
import { licenseService, LicenseKey } from "../services/licenseService";
import { Film, Sliders, Layers, Sparkles } from "lucide-react";

export const VidFlowApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<"studio" | "admin">("studio");
  const [activeLicense, setActiveLicense] = useState<LicenseKey | null>(() =>
    licenseService.getActiveClientLicense()
  );
  const [hasCreatedProject, setHasCreatedProject] = useState<boolean>(() => {
    return localStorage.getItem("vidflow_has_created_project") === "true";
  });

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isFirstProjectModalOpen, setIsFirstProjectModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);

  // Mobile / Android responsiveness
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [mobileTab, setMobileTab] = useState<"canvas" | "timeline" | "inspector">("canvas");

  const { actions } = useProjectStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        actions.togglePlay();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        actions.undo();
      }

      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        actions.redo();
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        actions.deleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);

  // If in Admin Mode, show the SaaS Commander
  if (viewMode === "admin") {
    return (
      <VidFlowAdminApp
        onBackToStudio={() => {
          setActiveLicense(licenseService.getActiveClientLicense());
          setViewMode("studio");
        }}
      />
    );
  }

  // 1. STEP 1: License Activation Gate (Free Community Pass currently available)
  if (!activeLicense) {
    return (
      <>
        <OnboardingLicenseGate
          onSuccess={(lic) => {
            setActiveLicense(lic);
          }}
          onOpenAdmin={() => setIsAdminPinModalOpen(true)}
        />
        <AdminPinModal
          isOpen={isAdminPinModalOpen}
          onClose={() => setIsAdminPinModalOpen(false)}
          onSuccess={() => {
            setIsAdminPinModalOpen(false);
            setViewMode("admin");
          }}
        />
      </>
    );
  }

  // 2. STEP 2: First-Time Project Creator with Professional Motion Guidelines
  if (!hasCreatedProject) {
    return (
      <div className="flex flex-col h-screen w-screen bg-[#080a10] text-slate-100 overflow-hidden font-sans select-none relative">
        <FirstProjectCreatorModal
          isOpen={true}
          onClose={() => {
            localStorage.setItem("vidflow_has_created_project", "true");
            setHasCreatedProject(true);
          }}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      </div>
    );
  }

  // 3. STEP 3: Full-Featured Interactive VidFlow Studio
  return (
    <div className="flex flex-col h-screen w-screen bg-[#080a10] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Top Navigation Bar */}
      <TopNav
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenFirstProjectModal={() => setIsFirstProjectModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* 2. Middle Body: Responsive for Desktop vs Android/Mobile */}
      {isMobile ? (
        // Mobile / Android View: Single Active Tab with Touch Controls
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 flex overflow-hidden">
            {mobileTab === "canvas" && (
              <>
                <LeftSidebar
                  onOpenAIModal={() => setIsAIModalOpen(true)}
                  onOpenAdmin={() => setIsAdminPinModalOpen(true)}
                  onOpenLicense={() => setIsLicenseModalOpen(true)}
                />
                <CanvasViewport />
              </>
            )}

            {mobileTab === "timeline" && (
              <div className="flex-1 h-full overflow-y-auto bg-[#0a0d14]">
                <TimelinePanel />
              </div>
            )}

            {mobileTab === "inspector" && (
              <div className="flex-1 h-full overflow-y-auto bg-[#0d101a] p-2">
                <InspectorPanel />
              </div>
            )}
          </div>

          {/* Android / Mobile Bottom Navigation Tab Bar */}
          <div className="h-14 bg-[#0d101a] border-t border-white/[0.1] flex items-center justify-around px-2 z-30">
            <button
              onClick={() => setMobileTab("canvas")}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-semibold transition-colors ${
                mobileTab === "canvas"
                  ? "text-purple-400 bg-purple-600/15 border border-purple-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Film size={17} />
              <span className="text-[10px]">Canvas</span>
            </button>

            <button
              onClick={() => setMobileTab("timeline")}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-semibold transition-colors ${
                mobileTab === "timeline"
                  ? "text-cyan-400 bg-cyan-600/15 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers size={17} />
              <span className="text-[10px]">Timeline</span>
            </button>

            <button
              onClick={() => setMobileTab("inspector")}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-semibold transition-colors ${
                mobileTab === "inspector"
                  ? "text-pink-400 bg-pink-600/15 border border-pink-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders size={17} />
              <span className="text-[10px]">Inspector</span>
            </button>

            <button
              onClick={() => setIsAIModalOpen(true)}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-semibold text-yellow-300 bg-amber-500/15 border border-amber-500/30"
            >
              <Sparkles size={17} />
              <span className="text-[10px]">AI Prompt</span>
            </button>
          </div>
        </div>
      ) : (
        // Desktop View: Multi-Column Side-by-Side Studio Layout
        <>
          <div className="flex-1 flex overflow-hidden">
            <LeftSidebar
              onOpenAIModal={() => setIsAIModalOpen(true)}
              onOpenAdmin={() => setIsAdminPinModalOpen(true)}
              onOpenLicense={() => setIsLicenseModalOpen(true)}
            />
            <CanvasViewport />
            <InspectorPanel />
          </div>
          <TimelinePanel />
        </>
      )}

      {/* Modals */}
      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
      <FirstProjectCreatorModal
        isOpen={isFirstProjectModalOpen}
        onClose={() => setIsFirstProjectModalOpen(false)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
      <LicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => {
          setActiveLicense(licenseService.getActiveClientLicense());
          setIsLicenseModalOpen(false);
        }}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccess={() => {
          setIsAdminPinModalOpen(false);
          setViewMode("admin");
        }}
      />
    </div>
  );
};
