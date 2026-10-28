import { VidFlowProject, AspectRatio } from "../types/schema";
import { generateMotionWithGemini } from "./gemini";
import { generateSmartDynamicProject } from "./projectSanitizer";

export const SYSTEM_PROMPT = `
You are the world's most elite Motion Graphics Art Director and Technical Director inside VidFlow (Developed by ZapyTeam).
Your job is to generate a complete, mathematically precise, visually stunning motion graphics project represented strictly in the VidFlowProject JSON schema.

KEY RULES FOR PROFESSIONAL MOTION GRAPHICS:
1. Visual Hierarchy: Every scene must have a cohesive color palette, background card/stage, primary kinetic headline, secondary badge or subtext, and decorative motion elements (glow pills, stars, ambient cards).
2. Typography:
   - For Bangla text, use "Hind Siliguri" or "Tiro Bangla". Ensure accurate spelling and natural phrasing.
   - For English text, use "Outfit", "Inter", or "JetBrains Mono".
   - Give headlines bold weights (700 or 800) and generous line heights.
3. Animation & Timing:
   - Typical video duration: 300 to 900 frames (10 to 30 seconds at 30 FPS).
   - In-animations should use "pop", "slide-up", or "elastic" with 15-25 frames duration.
   - Out-animations should gracefully fade or shrink 15 frames before the scene ends.
4. Color Aesthetics:
   - Avoid plain primary colors. Use tailored palettes: Deep Slate (#090B10), Electric Lavender (#8B5CF6), Cyber Cyan (#06B6D4), Neon Rose (#F43F5E), Emerald (#10B981), Amber Glow (#F59E0B).
   - Use glassmorphism cards with semi-transparent fills and subtle glowing borders.

JSON SCHEMA STRUCTURE:
{
  "id": "proj_uuid",
  "title": "string",
  "version": "1.0.0",
  "author": "ZapyTeam",
  "developerContact": "+8801911444546",
  "createdAt": "ISO date",
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "durationFrames": 450,
  "aspectRatio": "9:16",
  "theme": {
    "background": "#080a10",
    "gradient": "radial-gradient(circle at 50% 30%, #1e1b4b 0%, #080a10 70%)",
    "primaryColor": "#8b5cf6",
    "secondaryColor": "#06b6d4",
    "accentColor": "#f43f5e"
  },
  "tracks": [
    {
      "id": "track_1",
      "name": "Headlines & Text",
      "type": "text",
      "isLocked": false,
      "isVisible": true,
      "clips": [...]
    },
    {
      "id": "track_2",
      "name": "Cards & Badges",
      "type": "shape",
      "isLocked": false,
      "isVisible": true,
      "clips": [...]
    }
  ],
  "audioTracks": [
    {
      "id": "audio_1",
      "name": "Voiceover Track",
      "type": "voiceover",
      "src": "voiceover.mp3",
      "volume": 1.0,
      "startFrame": 0,
      "durationFrames": 450
    }
  ]
}
`;

// Pre-built Rich Templates (100% Offline, Zero Token Cost)
export const PREBUILT_TEMPLATES: Record<string, (aspect: AspectRatio) => VidFlowProject> = {
  "bangla-ai-explainer": (aspect: AspectRatio) => {
    const isVertical = aspect === "9:16";
    const width = isVertical ? 1080 : aspect === "1:1" ? 1080 : 1920;
    const height = isVertical ? 1920 : 1080;

    return {
      id: "template-ai-explainer-" + Date.now(),
      title: "AI Revolution Explainer (VidFlow Pro)",
      version: "1.0.0",
      author: "ZapyTeam",
      developerContact: "+8801911444546",
      createdAt: new Date().toISOString(),
      fps: 30,
      width,
      height,
      durationFrames: 450, // 15 seconds
      aspectRatio: aspect,
      theme: {
        background: "#080a10",
        gradient: "radial-gradient(circle at 50% 30%, #1e1b4b 0%, #080a10 80%)",
        primaryColor: "#8b5cf6",
        secondaryColor: "#06b6d4",
        accentColor: "#f43f5e",
      },
      tracks: [
        {
          id: "track_headlines",
          name: "Kinetic Headlines",
          type: "text",
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: "clip_h1",
              name: "Scene 1: Hook Title",
              startFrame: 0,
              durationFrames: 150,
              element: {
                id: "elem_h1",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 650 : 380,
                  width: width * 0.85,
                  height: 140,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "AI is Changing\nEverything!",
                  fontFamily: "Outfit",
                  fontSize: isVertical ? 72 : 64,
                  fontWeight: 800,
                  color: "#ffffff",
                  textAlign: "center",
                  lineHeight: 1.25,
                  kineticEffect: "word-by-word",
                  glow: "0 0 25px rgba(139, 92, 246, 0.6)",
                },
                inAnimation: {
                  type: "pop",
                  durationFrames: 20,
                  easing: "spring",
                },
                outAnimation: {
                  type: "fade",
                  durationFrames: 15,
                  easing: "ease-out",
                },
                keyframes: [],
              },
            },
            {
              id: "clip_h2",
              name: "Scene 2: Core Solution",
              startFrame: 150,
              durationFrames: 140,
              element: {
                id: "elem_h2",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 680 : 400,
                  width: width * 0.85,
                  height: 140,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "Work 10x Faster\nWith Zero Tokens",
                  fontFamily: "Outfit",
                  fontSize: isVertical ? 68 : 60,
                  fontWeight: 800,
                  color: "#38bdf8",
                  textAlign: "center",
                  lineHeight: 1.25,
                  kineticEffect: "pop-in",
                  glow: "0 0 30px rgba(56, 189, 248, 0.7)",
                },
                inAnimation: {
                  type: "slide-up",
                  durationFrames: 20,
                  easing: "spring",
                },
                outAnimation: {
                  type: "fade",
                  durationFrames: 15,
                  easing: "ease-out",
                },
                keyframes: [],
              },
            },
            {
              id: "clip_h3",
              name: "Scene 3: Call to Action",
              startFrame: 290,
              durationFrames: 160,
              element: {
                id: "elem_h3",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 720 : 420,
                  width: width * 0.85,
                  height: 140,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "Start Creating with\nVidFlow Today!",
                  fontFamily: "Outfit",
                  fontSize: isVertical ? 76 : 68,
                  fontWeight: 900,
                  color: "#a855f7",
                  textAlign: "center",
                  lineHeight: 1.25,
                  kineticEffect: "glow-pulse",
                  glow: "0 0 35px rgba(168, 85, 247, 0.8)",
                },
                inAnimation: {
                  type: "elastic",
                  durationFrames: 25,
                  easing: "spring",
                },
                keyframes: [],
              },
            },
          ],
        },
        {
          id: "track_subtitles",
          name: "Badges & Subtext",
          type: "text",
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: "clip_sub1",
              name: "Scene 1 Badge",
              startFrame: 25,
              durationFrames: 125,
              element: {
                id: "elem_sub1",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 860 : 540,
                  width: width * 0.7,
                  height: 60,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "Next-Generation Motion Graphics",
                  fontFamily: "Inter",
                  fontSize: isVertical ? 32 : 28,
                  fontWeight: 500,
                  color: "#cbd5e1",
                  textAlign: "center",
                  kineticEffect: "none",
                },
                inAnimation: {
                  type: "slide-up",
                  durationFrames: 18,
                  easing: "ease-out",
                },
                keyframes: [],
              },
            },
            {
              id: "clip_sub3",
              name: "CTA Developer Credit",
              startFrame: 310,
              durationFrames: 140,
              element: {
                id: "elem_sub3",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 960 : 600,
                  width: width * 0.8,
                  height: 60,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "Developed by ZapyTeam (WhatsApp: 8801911444546)",
                  fontFamily: "Outfit",
                  fontSize: isVertical ? 26 : 22,
                  fontWeight: 600,
                  color: "#38bdf8",
                  textAlign: "center",
                  kineticEffect: "none",
                  glow: "0 0 15px rgba(56, 189, 248, 0.4)",
                },
                inAnimation: {
                  type: "fade",
                  durationFrames: 15,
                  easing: "ease-out",
                },
                keyframes: [],
              },
            },
          ],
        },
        {
          id: "track_cards",
          name: "Glass Cards & Badges",
          type: "shape",
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: "clip_pill1",
              name: "Top Pill Badge",
              startFrame: 5,
              durationFrames: 445,
              element: {
                id: "elem_pill1",
                type: "shape",
                transform: {
                  x: width / 2,
                  y: isVertical ? 480 : 250,
                  width: 280,
                  height: 52,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                shape: {
                  shapeType: "pill",
                  fill: "rgba(139, 92, 246, 0.15)",
                  stroke: "rgba(139, 92, 246, 0.5)",
                  strokeWidth: 1.5,
                  borderRadius: 26,
                  glassmorphism: true,
                  glow: "0 0 20px rgba(139, 92, 246, 0.3)",
                },
                inAnimation: {
                  type: "pop",
                  durationFrames: 15,
                  easing: "spring",
                },
                keyframes: [],
              },
            },
            {
              id: "clip_top_txt",
              name: "Pill Inside Text",
              startFrame: 8,
              durationFrames: 442,
              element: {
                id: "elem_top_txt",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 480 : 250,
                  width: 260,
                  height: 40,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "✨ NEW GENERATION AI",
                  fontFamily: "Outfit",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#c084fc",
                  textAlign: "center",
                  letterSpacing: 2,
                  kineticEffect: "none",
                },
                inAnimation: {
                  type: "fade",
                  durationFrames: 15,
                  easing: "ease-out",
                },
                keyframes: [],
              },
            },
            {
              id: "clip_stage_card",
              name: "Glass Card Backdrop",
              startFrame: 10,
              durationFrames: 440,
              element: {
                id: "elem_stage_card",
                type: "shape",
                transform: {
                  x: width / 2,
                  y: isVertical ? 960 : 540,
                  width: isVertical ? width * 0.9 : width * 0.75,
                  height: isVertical ? 1100 : 600,
                  scale: 1,
                  rotation: 0,
                  opacity: 0.85,
                },
                shape: {
                  shapeType: "glass-card",
                  fill: "rgba(15, 18, 29, 0.7)",
                  stroke: "rgba(255, 255, 255, 0.08)",
                  strokeWidth: 1.5,
                  borderRadius: 32,
                  glassmorphism: true,
                  glow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                },
                inAnimation: {
                  type: "zoom",
                  durationFrames: 25,
                  easing: "spring",
                },
                keyframes: [],
              },
            },
          ],
        },
      ],
      audioTracks: [
        {
          id: "audio_voice",
          name: "Voiceover Track",
          type: "voiceover",
          src: "voiceover.mp3",
          volume: 1.0,
          startFrame: 0,
          durationFrames: 450,
          subtitles: [
            { startFrame: 15, endFrame: 150, text: "AI is changing everything!" },
            { startFrame: 150, endFrame: 290, text: "Work 10x faster with zero tokens." },
            { startFrame: 290, endFrame: 450, text: "Start creating with VidFlow today!" },
          ],
        },
      ],
      aiPromptMetadata: {
        prompt: "Create an inspiring tech explainer for VidFlow AI Motion Studio",
        model: "template-engine",
        timestamp: new Date().toISOString(),
      },
    };
  },
  "ecommerce-mega-sale": (aspect: AspectRatio) => {
    const isVertical = aspect === "9:16";
    const width = isVertical ? 1080 : aspect === "1:1" ? 1080 : 1920;
    const height = isVertical ? 1920 : 1080;

    return {
      id: "template-sale-" + Date.now(),
      title: "ধামাকা মেগা অফার (Mega Flash Sale)",
      version: "1.0.0",
      author: "ZapyTeam",
      developerContact: "+8801911444546",
      createdAt: new Date().toISOString(),
      fps: 30,
      width,
      height,
      durationFrames: 360, // 12 seconds
      aspectRatio: aspect,
      theme: {
        background: "#0a0612",
        gradient: "radial-gradient(circle at 50% 40%, #3b0764 0%, #0a0612 85%)",
        primaryColor: "#f43f5e",
        secondaryColor: "#fbbf24",
        accentColor: "#38bdf8",
      },
      tracks: [
        {
          id: "track_promo_text",
          name: "Offer Text",
          type: "text",
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: "clip_sale_badge",
              name: "Sale Badge",
              startFrame: 10,
              durationFrames: 350,
              element: {
                id: "elem_sale_badge",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 600 : 360,
                  width: width * 0.8,
                  height: 120,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "💥 ৫০% পর্যন্ত ছাড়!",
                  fontFamily: "Hind Siliguri",
                  fontSize: isVertical ? 78 : 70,
                  fontWeight: 800,
                  color: "#fbbf24",
                  textAlign: "center",
                  kineticEffect: "pop-in",
                  glow: "0 0 30px rgba(251, 191, 36, 0.7)",
                },
                inAnimation: {
                  type: "elastic",
                  durationFrames: 25,
                  easing: "spring",
                },
                keyframes: [],
              },
            },
            {
              id: "clip_sale_sub",
              name: "Stock Out Subtext",
              startFrame: 30,
              durationFrames: 330,
              element: {
                id: "elem_sale_sub",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 800 : 490,
                  width: width * 0.8,
                  height: 80,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "অফারটি চলবে আর মাত্র ৩ দিন\nস্টক সীমিত!",
                  fontFamily: "Hind Siliguri",
                  fontSize: isVertical ? 38 : 32,
                  fontWeight: 600,
                  color: "#f8fafc",
                  textAlign: "center",
                  lineHeight: 1.3,
                  kineticEffect: "none",
                },
                inAnimation: {
                  type: "slide-up",
                  durationFrames: 20,
                  easing: "ease-out",
                },
                keyframes: [],
              },
            },
            {
              id: "clip_order_now",
              name: "Order Button Text",
              startFrame: 50,
              durationFrames: 310,
              element: {
                id: "elem_order_now",
                type: "text",
                transform: {
                  x: width / 2,
                  y: isVertical ? 1040 : 660,
                  width: 320,
                  height: 50,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                text: {
                  text: "👉 এখনই অর্ডার করুন",
                  fontFamily: "Hind Siliguri",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#ffffff",
                  textAlign: "center",
                  kineticEffect: "glow-pulse",
                },
                inAnimation: {
                  type: "pop",
                  durationFrames: 20,
                  easing: "spring",
                },
                keyframes: [],
              },
            },
          ],
        },
        {
          id: "track_sale_shapes",
          name: "Offer Badges",
          type: "shape",
          isLocked: false,
          isVisible: true,
          clips: [
            {
              id: "clip_btn_shape",
              name: "Order CTA Button",
              startFrame: 45,
              durationFrames: 315,
              element: {
                id: "elem_btn_shape",
                type: "shape",
                transform: {
                  x: width / 2,
                  y: isVertical ? 1040 : 660,
                  width: 360,
                  height: 70,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                },
                shape: {
                  shapeType: "pill",
                  fill: "#f43f5e",
                  stroke: "#fb7185",
                  strokeWidth: 2,
                  borderRadius: 35,
                  glassmorphism: false,
                  glow: "0 0 35px rgba(244, 63, 94, 0.6)",
                },
                inAnimation: {
                  type: "pop",
                  durationFrames: 20,
                  easing: "spring",
                },
                keyframes: [],
              },
            },
          ],
        },
      ],
      audioTracks: [],
      aiPromptMetadata: {
        prompt: "Bangla E-Commerce 50% Mega Flash Sale promo",
        model: "template-engine",
        timestamp: new Date().toISOString(),
      },
    };
  },
};

export async function orchestrateMotionGeneration(params: {
  prompt: string;
  provider: "gemini-3.8-flash" | "argon-4" | "template" | "gemini";
  aspectRatio: AspectRatio;
  apiKey?: string;
  templateKey?: string;
  onProgress?: (stage: string, percent: number) => void;
  allowSmartFallback?: boolean;
}): Promise<VidFlowProject> {
  const { prompt, provider, aspectRatio, apiKey, templateKey, onProgress, allowSmartFallback = true } = params;

  onProgress?.("Initializing AI orchestrator...", 10);

  // 1. Template / Demo mode
  if (provider === "template" || !apiKey) {
    onProgress?.("Loading instant blueprint...", 60);
    if (templateKey && PREBUILT_TEMPLATES[templateKey]) {
      const p = PREBUILT_TEMPLATES[templateKey](aspectRatio);
      onProgress?.("Ready!", 100);
      return p;
    }
    const p = PREBUILT_TEMPLATES["bangla-ai-explainer"](aspectRatio);
    onProgress?.("Ready!", 100);
    return p;
  }

  // 2. Google Gemini 3.8 Flash (Ultra-Fast Motion Generation)
  if (provider === "gemini-3.8-flash" || provider === "gemini") {
    try {
      onProgress?.("Connecting to Gemini 3.8 Flash...", 30);
      const res = await generateMotionWithGemini(prompt, aspectRatio, apiKey, SYSTEM_PROMPT, "gemini-3.8-flash");
      onProgress?.("Validating kinetic motion blueprint...", 90);
      onProgress?.("Ready!", 100);
      return res;
    } catch (err) {
      if (allowSmartFallback) {
        console.warn("Gemini Flash generation failed, activating Smart Zero-Token Dynamic Engine:", err);
        onProgress?.("Activating Smart Fallback Engine...", 80);
        const fallbackProject = generateSmartDynamicProject(prompt, aspectRatio);
        onProgress?.("Ready!", 100);
        return fallbackProject;
      }
      throw err;
    }
  }

  // 3. Google Gemini Argon 4 (Deep Kinetic & Mathematical Reasoning Engine)
  if (provider === "argon-4") {
    try {
      onProgress?.("Connecting to Gemini Argon 4...", 30);
      const res = await generateMotionWithGemini(prompt, aspectRatio, apiKey, SYSTEM_PROMPT, "argon-4");
      onProgress?.("Validating kinetic motion blueprint...", 90);
      onProgress?.("Ready!", 100);
      return res;
    } catch (err) {
      if (allowSmartFallback) {
        console.warn("Gemini Argon generation failed, activating Smart Zero-Token Dynamic Engine:", err);
        onProgress?.("Activating Smart Fallback Engine...", 80);
        const fallbackProject = generateSmartDynamicProject(prompt, aspectRatio);
        onProgress?.("Ready!", 100);
        return fallbackProject;
      }
      throw err;
    }
  }

  return generateSmartDynamicProject(prompt, aspectRatio);
}
