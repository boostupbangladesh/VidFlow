import { useState, useEffect, useCallback } from "react";
import {
  VidFlowProject,
  AspectRatio,
  MotionElement,
  Clip,
  Track,
  ShapeType,
} from "../types/schema";
import { PREBUILT_TEMPLATES } from "../services/aiOrchestrator";

// Initial default project (VidFlow Bangla AI Explainer)
const initialProject: VidFlowProject = PREBUILT_TEMPLATES["bangla-ai-explainer"]("9:16");

export interface StudioState {
  project: VidFlowProject;
  currentFrame: number;
  isPlaying: boolean;
  selectedElementId: string | null;
  selectedClipId: string | null;
  zoom: number;
  showSafeGuides: boolean;
  showRulers: boolean;
  activeSidebarTab: "ai" | "text" | "shapes" | "theme" | "audio";
}

// Global store listeners
type Listener = () => void;
const listeners = new Set<Listener>();

let state: StudioState = {
  project: initialProject,
  currentFrame: 0,
  isPlaying: false,
  selectedElementId: "elem_h1",
  selectedClipId: "clip_h1",
  zoom: 0.85,
  showSafeGuides: true,
  showRulers: false,
  activeSidebarTab: "ai",
};

// Undo/Redo stacks
const undoStack: VidFlowProject[] = [];
const redoStack: VidFlowProject[] = [];

function notify() {
  listeners.forEach((l) => l());
}

function pushHistory() {
  undoStack.push(JSON.parse(JSON.stringify(state.project)));
  if (undoStack.length > 30) undoStack.shift();
  redoStack.length = 0; // Clear redo
}

export const projectActions = {
  setProject: (newProject: VidFlowProject) => {
    pushHistory();
    // Default to frame 25 so in-animations are fully visible in viewport immediately
    const firstClip = newProject.tracks?.[0]?.clips?.[0];
    const previewFrame = Math.min(25, Math.max(1, Math.floor(newProject.durationFrames * 0.1)));

    state = {
      ...state,
      project: newProject,
      currentFrame: previewFrame,
      selectedElementId: firstClip?.element?.id || null,
      selectedClipId: firstClip?.id || null,
    };
    notify();
  },

  setCurrentFrame: (frame: number) => {
    const clamped = Math.max(0, Math.min(state.project.durationFrames, Math.round(frame)));
    state = { ...state, currentFrame: clamped };
    notify();
  },

  setIsPlaying: (isPlaying: boolean) => {
    state = { ...state, isPlaying };
    notify();
  },

  togglePlay: () => {
    state = { ...state, isPlaying: !state.isPlaying };
    notify();
  },

  selectElement: (elementId: string | null, clipId: string | null) => {
    state = {
      ...state,
      selectedElementId: elementId,
      selectedClipId: clipId,
    };
    notify();
  },

  setZoom: (zoom: number) => {
    state = { ...state, zoom: Math.max(0.2, Math.min(2.5, zoom)) };
    notify();
  },

  toggleSafeGuides: () => {
    state = { ...state, showSafeGuides: !state.showSafeGuides };
    notify();
  },

  setActiveSidebarTab: (tab: StudioState["activeSidebarTab"]) => {
    state = { ...state, activeSidebarTab: tab };
    notify();
  },

  updateElement: (elementId: string, updater: (el: MotionElement) => MotionElement) => {
    pushHistory();
    const updatedTracks = state.project.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((clip) => {
        if (clip.element.id === elementId) {
          return {
            ...clip,
            element: updater(clip.element),
          };
        }
        return clip;
      }),
    }));

    state = {
      ...state,
      project: {
        ...state.project,
        tracks: updatedTracks,
      },
    };
    notify();
  },

  updateClip: (clipId: string, updates: Partial<Clip>) => {
    pushHistory();
    const updatedTracks = state.project.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((clip) => {
        if (clip.id === clipId) {
          return { ...clip, ...updates };
        }
        return clip;
      }),
    }));

    state = {
      ...state,
      project: {
        ...state.project,
        tracks: updatedTracks,
      },
    };
    notify();
  },

  changeAspectRatio: (aspect: AspectRatio) => {
    pushHistory();
    const isVertical = aspect === "9:16";
    const width = isVertical ? 1080 : aspect === "1:1" ? 1080 : 1920;
    const height = isVertical ? 1920 : 1080;

    state = {
      ...state,
      project: {
        ...state.project,
        aspectRatio: aspect,
        width,
        height,
      },
    };
    notify();
  },

  addTextElement: (text: string = "New Motion Headline", isBangla: boolean = false) => {
    pushHistory();
    const newId = "elem_" + Date.now();
    const clipId = "clip_" + Date.now();
    const width = state.project.width;

    const newElement: MotionElement = {
      id: newId,
      type: "text",
      transform: {
        x: width / 2,
        y: state.project.height / 2,
        width: width * 0.75,
        height: 100,
        scale: 1,
        rotation: 0,
        opacity: 1,
      },
      text: {
        text,
        fontFamily: isBangla ? "Hind Siliguri" : "Outfit",
        fontSize: 54,
        fontWeight: 700,
        color: "#ffffff",
        textAlign: "center",
        kineticEffect: "pop-in",
        glow: "0 0 20px rgba(139, 92, 246, 0.5)",
      },
      inAnimation: {
        type: "pop",
        durationFrames: 20,
        easing: "spring",
      },
      keyframes: [],
    };

    const newClip: Clip = {
      id: clipId,
      name: text.substring(0, 16),
      startFrame: state.currentFrame,
      durationFrames: 120,
      element: newElement,
    };

    // Find first text track or create one
    let track = state.project.tracks.find((t) => t.type === "text");
    let tracks = [...state.project.tracks];

    if (!track) {
      track = {
        id: "track_text_" + Date.now(),
        name: "Text Track",
        type: "text",
        isLocked: false,
        isVisible: true,
        clips: [newClip],
      };
      tracks.unshift(track);
    } else {
      tracks = tracks.map((t) => (t.id === track!.id ? { ...t, clips: [...t.clips, newClip] } : t));
    }

    state = {
      ...state,
      project: { ...state.project, tracks },
      selectedElementId: newId,
      selectedClipId: clipId,
    };
    notify();
  },

  addShapeElement: (shapeType: ShapeType = "glass-card") => {
    pushHistory();
    const newId = "elem_" + Date.now();
    const clipId = "clip_" + Date.now();
    const width = state.project.width;

    const newElement: MotionElement = {
      id: newId,
      type: "shape",
      transform: {
        x: width / 2,
        y: state.project.height / 2,
        width: 320,
        height: 160,
        scale: 1,
        rotation: 0,
        opacity: 0.9,
      },
      shape: {
        shapeType,
        fill: shapeType === "glass-card" ? "rgba(21, 25, 40, 0.85)" : "#8b5cf6",
        stroke: "rgba(255, 255, 255, 0.12)",
        strokeWidth: 1.5,
        borderRadius: shapeType === "pill" ? 40 : 20,
        glassmorphism: shapeType === "glass-card",
        glow: "0 0 25px rgba(139, 92, 246, 0.4)",
      },
      inAnimation: {
        type: "pop",
        durationFrames: 18,
        easing: "spring",
      },
      keyframes: [],
    };

    const newClip: Clip = {
      id: clipId,
      name: `${shapeType} element`,
      startFrame: state.currentFrame,
      durationFrames: 150,
      element: newElement,
    };

    let track = state.project.tracks.find((t) => t.type === "shape");
    let tracks = [...state.project.tracks];

    if (!track) {
      track = {
        id: "track_shapes_" + Date.now(),
        name: "Graphics & Shapes",
        type: "shape",
        isLocked: false,
        isVisible: true,
        clips: [newClip],
      };
      tracks.push(track);
    } else {
      tracks = tracks.map((t) => (t.id === track!.id ? { ...t, clips: [...t.clips, newClip] } : t));
    }

    state = {
      ...state,
      project: { ...state.project, tracks },
      selectedElementId: newId,
      selectedClipId: clipId,
    };
    notify();
  },

  deleteSelected: () => {
    if (!state.selectedElementId) return;
    pushHistory();

    const updatedTracks = state.project.tracks.map((track) => ({
      ...track,
      clips: track.clips.filter((c) => c.element.id !== state.selectedElementId),
    }));

    state = {
      ...state,
      project: { ...state.project, tracks: updatedTracks },
      selectedElementId: null,
      selectedClipId: null,
    };
    notify();
  },

  duplicateSelected: () => {
    if (!state.selectedElementId) return;
    pushHistory();

    let newElementId = "";
    let newClipId = "";

    const updatedTracks = state.project.tracks.map((track) => {
      const clipIndex = track.clips.findIndex((c) => c.element.id === state.selectedElementId);
      if (clipIndex === -1) return track;

      const origClip = track.clips[clipIndex];
      newElementId = "elem_" + Date.now();
      newClipId = "clip_" + Date.now();

      const clonedElement: MotionElement = {
        ...JSON.parse(JSON.stringify(origClip.element)),
        id: newElementId,
        transform: {
          ...origClip.element.transform,
          x: origClip.element.transform.x + 30,
          y: origClip.element.transform.y + 30,
        },
      };

      const clonedClip: Clip = {
        ...JSON.parse(JSON.stringify(origClip)),
        id: newClipId,
        name: `${origClip.name} (Copy)`,
        element: clonedElement,
      };

      const newClips = [...track.clips];
      newClips.splice(clipIndex + 1, 0, clonedClip);
      return { ...track, clips: newClips };
    });

    state = {
      ...state,
      project: { ...state.project, tracks: updatedTracks },
      selectedElementId: newElementId || state.selectedElementId,
      selectedClipId: newClipId || state.selectedClipId,
    };
    notify();
  },

  bringToFront: (elementId: string) => {
    pushHistory();
    const tracks = state.project.tracks.map((track) => {
      const idx = track.clips.findIndex((c) => c.element.id === elementId);
      if (idx === -1) return track;
      const targetClip = track.clips[idx];
      const otherClips = track.clips.filter((_, i) => i !== idx);
      return { ...track, clips: [...otherClips, targetClip] };
    });
    state = { ...state, project: { ...state.project, tracks } };
    notify();
  },

  sendToBack: (elementId: string) => {
    pushHistory();
    const tracks = state.project.tracks.map((track) => {
      const idx = track.clips.findIndex((c) => c.element.id === elementId);
      if (idx === -1) return track;
      const targetClip = track.clips[idx];
      const otherClips = track.clips.filter((_, i) => i !== idx);
      return { ...track, clips: [targetClip, ...otherClips] };
    });
    state = { ...state, project: { ...state.project, tracks } };
    notify();
  },

  moveLayerUp: (elementId: string) => {
    pushHistory();
    const tracks = state.project.tracks.map((track) => {
      const idx = track.clips.findIndex((c) => c.element.id === elementId);
      if (idx === -1 || idx === track.clips.length - 1) return track;
      const newClips = [...track.clips];
      const temp = newClips[idx];
      newClips[idx] = newClips[idx + 1];
      newClips[idx + 1] = temp;
      return { ...track, clips: newClips };
    });
    state = { ...state, project: { ...state.project, tracks } };
    notify();
  },

  moveLayerDown: (elementId: string) => {
    pushHistory();
    const tracks = state.project.tracks.map((track) => {
      const idx = track.clips.findIndex((c) => c.element.id === elementId);
      if (idx <= 0) return track;
      const newClips = [...track.clips];
      const temp = newClips[idx];
      newClips[idx] = newClips[idx - 1];
      newClips[idx - 1] = temp;
      return { ...track, clips: newClips };
    });
    state = { ...state, project: { ...state.project, tracks } };
    notify();
  },

  alignElement: (
    elementId: string,
    alignment: "center-x" | "center-y" | "left" | "right" | "top" | "bottom"
  ) => {
    pushHistory();
    const canvasW = state.project.width;
    const canvasH = state.project.height;

    projectActions.updateElement(elementId, (el) => {
      const elW = el.transform.width;
      const elH = el.transform.height;
      let newX = el.transform.x;
      let newY = el.transform.y;

      switch (alignment) {
        case "center-x":
          newX = Math.round(canvasW / 2);
          break;
        case "center-y":
          newY = Math.round(canvasH / 2);
          break;
        case "left":
          newX = Math.round(elW / 2 + 60);
          break;
        case "right":
          newX = Math.round(canvasW - elW / 2 - 60);
          break;
        case "top":
          newY = Math.round(elH / 2 + 100);
          break;
        case "bottom":
          newY = Math.round(canvasH - elH / 2 - 100);
          break;
      }

      return {
        ...el,
        transform: { ...el.transform, x: newX, y: newY },
      };
    });
  },

  updateProjectTheme: (themeUpdates: Partial<VidFlowProject["theme"]>) => {
    pushHistory();
    state = {
      ...state,
      project: {
        ...state.project,
        theme: {
          ...state.project.theme,
          ...themeUpdates,
        },
      },
    };
    notify();
  },

  updateProjectSettings: (settings: {
    title?: string;
    fps?: number;
    durationFrames?: number;
    background?: string;
    gradient?: string;
  }) => {
    pushHistory();
    state = {
      ...state,
      project: {
        ...state.project,
        title: settings.title ?? state.project.title,
        fps: settings.fps ?? state.project.fps,
        durationFrames: settings.durationFrames ?? state.project.durationFrames,
        theme: {
          ...state.project.theme,
          background: settings.background ?? state.project.theme.background,
          gradient: settings.gradient ?? state.project.theme.gradient,
        },
      },
    };
    notify();
  },

  undo: () => {
    if (undoStack.length === 0) return;
    const prev = undoStack.pop()!;
    redoStack.push(JSON.parse(JSON.stringify(state.project)));
    state = { ...state, project: prev };
    notify();
  },

  redo: () => {
    if (redoStack.length === 0) return;
    const next = redoStack.pop()!;
    undoStack.push(JSON.parse(JSON.stringify(state.project)));
    state = { ...state, project: next };
    notify();
  },
};

// React Hook to consume studio store
export function useProjectStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Helper to find selected element and clip
  let selectedElement: MotionElement | null = null;
  let selectedClip: Clip | null = null;

  if (state.selectedElementId) {
    for (const track of state.project.tracks) {
      for (const clip of track.clips) {
        if (clip.element.id === state.selectedElementId) {
          selectedElement = clip.element;
          selectedClip = clip;
          break;
        }
      }
      if (selectedElement) break;
    }
  }

  return {
    ...state,
    selectedElement,
    selectedClip,
    actions: projectActions,
  };
}
