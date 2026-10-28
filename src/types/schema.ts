export type AspectRatio = "16:9" | "9:16" | "1:1";

export type EasingType =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "spring"
  | "bounce";

export interface Keyframe {
  id: string;
  frame: number;
  property: "x" | "y" | "scale" | "rotation" | "opacity" | "width" | "height";
  value: number;
  easing: EasingType;
}

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export type KineticEffect =
  | "none"
  | "word-by-word"
  | "pop-in"
  | "typewriter"
  | "glow-pulse"
  | "slide-up"
  | "bounce-drop";

export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color: string;
  textAlign: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  kineticEffect: KineticEffect;
  glow?: string;
}

export type ShapeType =
  | "rectangle"
  | "circle"
  | "pill"
  | "badge"
  | "star"
  | "glass-card";

export interface ShapeProperties {
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
  glassmorphism: boolean;
  glow?: string;
}

export interface MediaProperties {
  src: string;
  mediaType: "image" | "video";
  fit: "contain" | "cover";
}

export interface MotionElement {
  id: string;
  type: "text" | "shape" | "media";
  transform: Transform;
  text?: TextProperties;
  shape?: ShapeProperties;
  media?: MediaProperties;
  inAnimation?: {
    type: "fade" | "slide-up" | "pop" | "elastic" | "zoom";
    durationFrames: number;
    easing: EasingType;
  };
  outAnimation?: {
    type: "fade" | "slide-down" | "shrink";
    durationFrames: number;
    easing: EasingType;
  };
  keyframes: Keyframe[];
}

export interface Clip {
  id: string;
  name: string;
  startFrame: number;
  durationFrames: number;
  element: MotionElement;
}

export interface Track {
  id: string;
  name: string;
  type: "text" | "shape" | "media";
  isLocked: boolean;
  isVisible: boolean;
  clips: Clip[];
}

export interface AudioTrack {
  id: string;
  name: string;
  type: "voiceover" | "bgm" | "sfx";
  src: string;
  volume: number;
  startFrame: number;
  durationFrames: number;
  subtitles?: Array<{
    startFrame: number;
    endFrame: number;
    text: string;
  }>;
}

export interface ProjectTheme {
  background: string;
  gradient?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface VidFlowProject {
  id: string;
  title: string;
  version: "1.0.0";
  author: "ZapyTeam";
  developerContact: "+8801911444546";
  createdAt: string;
  fps: number;
  width: number;
  height: number;
  durationFrames: number;
  aspectRatio: AspectRatio;
  theme: ProjectTheme;
  tracks: Track[];
  audioTracks: AudioTrack[];
  aiPromptMetadata?: {
    prompt: string;
    model: "gemini-3.8-flash" | "argon-4" | "gemini-2.0-flash" | "template-engine";
    timestamp: string;
  };
}
