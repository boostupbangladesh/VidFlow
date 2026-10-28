import { VidFlowProject, AspectRatio, Track, Clip, MotionElement, Transform } from "../types/schema";

/**
 * Robust JSON extraction and repair from LLM output.
 * Handles markdown fences, intro/outro text, trailing commas, and unclosed brackets.
 */
export function extractAndParseJSON(rawText: string): any {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response received from AI model.");
  }

  // 1. If text has ```json ... ``` blocks, extract inside
  const jsonBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  let cleaned = jsonBlockMatch ? jsonBlockMatch[1].trim() : rawText.trim();

  // 2. Locate outermost JSON object { ... }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1) {
    if (lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    } else {
      // JSON was cut off by token limit! Auto-repair by closing open structures
      cleaned = cleaned.substring(firstBrace);
      cleaned = repairTruncatedJSON(cleaned);
    }
  }

  // 3. Clean common LLM JSON syntax errors (trailing commas before } or ])
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    // Attempt secondary repair on unescaped control characters
    try {
      const fixed = cleaned
        .replace(/[\u0000-\u001F]+/g, " ")
        .replace(/,\s*([}\]])/g, "$1");
      return JSON.parse(fixed);
    } catch (err2) {
      throw new Error(`AI generated invalid JSON structure: ${(err1 as Error).message}`);
    }
  }
}

/**
 * Auto-close unclosed brackets in truncated JSON
 */
function repairTruncatedJSON(jsonStr: string): string {
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === "\\") {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === "{") openBraces++;
      else if (char === "}") openBraces = Math.max(0, openBraces - 1);
      else if (char === "[") openBrackets++;
      else if (char === "]") openBrackets = Math.max(0, openBrackets - 1);
    }
  }

  let repaired = jsonStr.trim();
  if (inString) repaired += '"';
  // Strip trailing comma or colon if cut off
  repaired = repaired.replace(/[,:\s]+$/, "");

  while (openBrackets > 0) {
    repaired += "]";
    openBrackets--;
  }
  while (openBraces > 0) {
    repaired += "}";
    openBraces--;
  }

  return repaired;
}

/**
 * Deeply validates and normalizes a project object so Canvas & Timeline NEVER crash.
 */
export function sanitizeAndValidateProject(
  raw: any,
  fallbackAspect: AspectRatio = "9:16",
  promptText: string = "AI Motion Video"
): VidFlowProject {
  const isVertical = (raw?.aspectRatio || fallbackAspect) === "9:16";
  const defaultWidth = isVertical ? 1080 : fallbackAspect === "1:1" ? 1080 : 1920;
  const defaultHeight = isVertical ? 1920 : 1080;

  const width = typeof raw?.width === "number" && raw.width > 0 ? raw.width : defaultWidth;
  const height = typeof raw?.height === "number" && raw.height > 0 ? raw.height : defaultHeight;

  const sanitized: VidFlowProject = {
    id: raw?.id || `proj_${Date.now()}`,
    title: raw?.title || promptText.slice(0, 40) || "VidFlow Motion Project",
    version: "1.0.0",
    author: "ZapyTeam",
    developerContact: "+8801911444546",
    createdAt: raw?.createdAt || new Date().toISOString(),
    fps: typeof raw?.fps === "number" && raw.fps > 0 ? raw.fps : 30,
    width,
    height,
    durationFrames: typeof raw?.durationFrames === "number" && raw.durationFrames >= 60 ? raw.durationFrames : 450,
    aspectRatio: raw?.aspectRatio === "16:9" || raw?.aspectRatio === "1:1" ? raw.aspectRatio : fallbackAspect,
    theme: {
      background: raw?.theme?.background || "#080a10",
      gradient: raw?.theme?.gradient || "radial-gradient(circle at 50% 30%, #1e1b4b 0%, #080a10 80%)",
      primaryColor: raw?.theme?.primaryColor || "#8b5cf6",
      secondaryColor: raw?.theme?.secondaryColor || "#06b6d4",
      accentColor: raw?.theme?.accentColor || "#f43f5e",
    },
    tracks: [],
    audioTracks: Array.isArray(raw?.audioTracks) ? raw.audioTracks : [],
    aiPromptMetadata: {
      prompt: promptText,
      model: raw?.aiPromptMetadata?.model || "gemini-3.8-flash",
      timestamp: new Date().toISOString(),
    },
  };

  // Process and sanitize tracks
  if (Array.isArray(raw?.tracks) && raw.tracks.length > 0) {
    sanitized.tracks = raw.tracks.map((track: any, trackIdx: number) => {
      const sanitizedTrack: Track = {
        id: track?.id || `track_${trackIdx + 1}`,
        name: track?.name || `Track ${trackIdx + 1}`,
        type: track?.type === "shape" ? "shape" : track?.type === "media" ? "media" : "text",
        isLocked: !!track?.isLocked,
        isVisible: track?.isVisible !== false,
        clips: [],
      };

      if (Array.isArray(track?.clips)) {
        sanitizedTrack.clips = track.clips.map((clip: any, clipIdx: number) => {
          const rawElem = clip?.element || {};
          const defaultTransform: Transform = {
            x: width / 2,
            y: isVertical ? height * 0.45 : height * 0.4,
            width: width * 0.8,
            height: 120,
            scale: 1,
            rotation: 0,
            opacity: 1,
          };

          const sanitizedElem: MotionElement = {
            id: rawElem?.id || `elem_${trackIdx}_${clipIdx}`,
            type: rawElem?.type === "shape" ? "shape" : rawElem?.type === "media" ? "media" : "text",
            transform: {
              x: typeof rawElem?.transform?.x === "number" ? rawElem.transform.x : defaultTransform.x,
              y: typeof rawElem?.transform?.y === "number" ? rawElem.transform.y : defaultTransform.y,
              width: typeof rawElem?.transform?.width === "number" && rawElem.transform.width > 0 ? rawElem.transform.width : defaultTransform.width,
              height: typeof rawElem?.transform?.height === "number" && rawElem.transform.height > 0 ? rawElem.transform.height : defaultTransform.height,
              scale: typeof rawElem?.transform?.scale === "number" ? rawElem.transform.scale : 1,
              rotation: typeof rawElem?.transform?.rotation === "number" ? rawElem.transform.rotation : 0,
              opacity: typeof rawElem?.transform?.opacity === "number" ? rawElem.transform.opacity : 1,
            },
            keyframes: Array.isArray(rawElem?.keyframes) ? rawElem.keyframes : [],
          };

          if (sanitizedElem.type === "text") {
            const isBangla = /[\u0980-\u09FF]/.test(rawElem?.text?.text || promptText);
            sanitizedElem.text = {
              text: rawElem?.text?.text || "Kinetic Headline",
              fontFamily: rawElem?.text?.fontFamily || (isBangla ? "Hind Siliguri" : "Outfit"),
              fontSize: typeof rawElem?.text?.fontSize === "number" ? rawElem.text.fontSize : (isVertical ? 64 : 52),
              fontWeight: rawElem?.text?.fontWeight || 800,
              color: rawElem?.text?.color || "#ffffff",
              textAlign: rawElem?.text?.textAlign || "center",
              lineHeight: rawElem?.text?.lineHeight || 1.25,
              kineticEffect: rawElem?.text?.kineticEffect || "word-by-word",
              glow: rawElem?.text?.glow || "0 0 25px rgba(139, 92, 246, 0.6)",
            };
          } else if (sanitizedElem.type === "shape") {
            sanitizedElem.shape = {
              shapeType: rawElem?.shape?.shapeType || "glass-card",
              fill: rawElem?.shape?.fill || "rgba(255, 255, 255, 0.05)",
              stroke: rawElem?.shape?.stroke || "rgba(255, 255, 255, 0.15)",
              strokeWidth: typeof rawElem?.shape?.strokeWidth === "number" ? rawElem.shape.strokeWidth : 1.5,
              borderRadius: typeof rawElem?.shape?.borderRadius === "number" ? rawElem.shape.borderRadius : 24,
              glassmorphism: rawElem?.shape?.glassmorphism !== false,
              glow: rawElem?.shape?.glow || "0 0 40px rgba(139, 92, 246, 0.3)",
            };
          }

          if (rawElem?.inAnimation) {
            sanitizedElem.inAnimation = {
              type: rawElem.inAnimation.type || "pop",
              durationFrames: typeof rawElem.inAnimation.durationFrames === "number" ? rawElem.inAnimation.durationFrames : 20,
              easing: rawElem.inAnimation.easing || "spring",
            };
          }

          if (rawElem?.outAnimation) {
            sanitizedElem.outAnimation = {
              type: rawElem.outAnimation.type || "fade",
              durationFrames: typeof rawElem.outAnimation.durationFrames === "number" ? rawElem.outAnimation.durationFrames : 15,
              easing: rawElem.outAnimation.easing || "ease-out",
            };
          }

          const sanitizedClip: Clip = {
            id: clip?.id || `clip_${trackIdx}_${clipIdx}`,
            name: clip?.name || `Clip ${clipIdx + 1}`,
            startFrame: typeof clip?.startFrame === "number" ? Math.max(0, clip.startFrame) : 0,
            durationFrames: typeof clip?.durationFrames === "number" && clip.durationFrames > 0 ? clip.durationFrames : 150,
            element: sanitizedElem,
          };

          return sanitizedClip;
        });
      }

      return sanitizedTrack;
    });
  }

  // If tracks were empty or invalid, generate safe default tracks
  if (sanitized.tracks.length === 0) {
    return generateSmartDynamicProject(promptText, sanitized.aspectRatio);
  }

  return sanitized;
}

/**
 * Smart Fallback Engine: Dynamically crafts a beautiful 3-scene motion graphics project
 * matching the user's prompt (Bangla or English) instantly with 0 tokens.
 */
export function generateSmartDynamicProject(
  prompt: string,
  aspect: AspectRatio = "9:16"
): VidFlowProject {
  const isVertical = aspect === "9:16";
  const width = isVertical ? 1080 : aspect === "1:1" ? 1080 : 1920;
  const height = isVertical ? 1920 : 1080;

  const isBangla = /[\u0980-\u09FF]/.test(prompt);

  // Extract clean keywords for dynamic titles
  const cleanPrompt = prompt.replace(/[^\w\s\u0980-\u09FF]/gi, " ").trim();
  const words = cleanPrompt.split(/\s+/).filter(Boolean);

  let scene1Title = isBangla ? "স্মার্ট মোশন জেনারেশন" : "Next-Gen Motion Design";
  let scene2Title = isBangla ? "প্রফেশনাল কাইনেটিক এনিমেশন" : "Zero-Token AI Editing";
  let scene3Title = isBangla ? "VidFlow দিয়ে এখনই শুরু করুন" : "Created with VidFlow Studio";

  if (words.length >= 2) {
    scene1Title = words.slice(0, Math.min(4, words.length)).join(" ");
    if (words.length > 4) {
      scene2Title = words.slice(4, Math.min(8, words.length)).join(" ");
    }
  }

  return {
    id: `smart_dyn_${Date.now()}`,
    title: prompt.slice(0, 35) || "VidFlow Dynamic Motion",
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
            name: "Scene 1: Headline",
            startFrame: 0,
            durationFrames: 140,
            element: {
              id: "elem_h1",
              type: "text",
              transform: {
                x: width / 2,
                y: isVertical ? 680 : 400,
                width: width * 0.85,
                height: 150,
                scale: 1,
                rotation: 0,
                opacity: 1,
              },
              text: {
                text: scene1Title,
                fontFamily: isBangla ? "Hind Siliguri" : "Outfit",
                fontSize: isVertical ? 68 : 60,
                fontWeight: 800,
                color: "#ffffff",
                textAlign: "center",
                lineHeight: 1.25,
                kineticEffect: "word-by-word",
                glow: "0 0 25px rgba(139, 92, 246, 0.7)",
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
            name: "Scene 2: Core Message",
            startFrame: 150,
            durationFrames: 140,
            element: {
              id: "elem_h2",
              type: "text",
              transform: {
                x: width / 2,
                y: isVertical ? 680 : 400,
                width: width * 0.85,
                height: 150,
                scale: 1,
                rotation: 0,
                opacity: 1,
              },
              text: {
                text: scene2Title,
                fontFamily: isBangla ? "Hind Siliguri" : "Outfit",
                fontSize: isVertical ? 64 : 56,
                fontWeight: 800,
                color: "#06b6d4",
                textAlign: "center",
                lineHeight: 1.25,
                kineticEffect: "pop-in",
                glow: "0 0 25px rgba(6, 182, 212, 0.7)",
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
            startFrame: 300,
            durationFrames: 140,
            element: {
              id: "elem_h3",
              type: "text",
              transform: {
                x: width / 2,
                y: isVertical ? 680 : 400,
                width: width * 0.85,
                height: 150,
                scale: 1,
                rotation: 0,
                opacity: 1,
              },
              text: {
                text: scene3Title,
                fontFamily: isBangla ? "Hind Siliguri" : "Outfit",
                fontSize: isVertical ? 60 : 54,
                fontWeight: 800,
                color: "#f43f5e",
                textAlign: "center",
                lineHeight: 1.25,
                kineticEffect: "bounce-drop",
                glow: "0 0 30px rgba(244, 63, 94, 0.7)",
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
        id: "track_subtitles",
        name: "Supporting Badges",
        type: "text",
        isLocked: false,
        isVisible: true,
        clips: [
          {
            id: "clip_sub1",
            name: "Scene 1 Badge",
            startFrame: 0,
            durationFrames: 140,
            element: {
              id: "elem_sub1",
              type: "text",
              transform: {
                x: width / 2,
                y: isVertical ? 860 : 520,
                width: width * 0.7,
                height: 60,
                scale: 1,
                rotation: 0,
                opacity: 1,
              },
              text: {
                text: isBangla ? "⚡ এআই দিয়ে দ্রুত মোশন ভিডিও তৈরি করুন" : "⚡ Powered by VidFlow AI Engine",
                fontFamily: isBangla ? "Hind Siliguri" : "Inter",
                fontSize: isVertical ? 32 : 26,
                fontWeight: 600,
                color: "#94a3b8",
                textAlign: "center",
                kineticEffect: "fade",
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
            name: "CTA Badge",
            startFrame: 310,
            durationFrames: 130,
            element: {
              id: "elem_sub3",
              type: "text",
              transform: {
                x: width / 2,
                y: isVertical ? 860 : 520,
                width: width * 0.7,
                height: 60,
                scale: 1,
                rotation: 0,
                opacity: 1,
              },
              text: {
                text: "Developed by ZapyTeam (+8801911444546)",
                fontFamily: "JetBrains Mono",
                fontSize: isVertical ? 26 : 22,
                fontWeight: 700,
                color: "#cbd5e1",
                textAlign: "center",
                kineticEffect: "fade",
              },
              inAnimation: {
                type: "pop",
                durationFrames: 15,
                easing: "spring",
              },
              keyframes: [],
            },
          },
        ],
      },
      {
        id: "track_cards",
        name: "Glassmorphism Cards",
        type: "shape",
        isLocked: false,
        isVisible: true,
        clips: [
          {
            id: "clip_card1",
            name: "Hero Center Glass Card",
            startFrame: 0,
            durationFrames: 450,
            element: {
              id: "elem_card1",
              type: "shape",
              transform: {
                x: width / 2,
                y: isVertical ? 740 : 440,
                width: width * 0.88,
                height: isVertical ? 360 : 260,
                scale: 1,
                rotation: 0,
                opacity: 1,
              },
              shape: {
                shapeType: "glass-card",
                fill: "rgba(255, 255, 255, 0.04)",
                stroke: "rgba(139, 92, 246, 0.3)",
                strokeWidth: 2,
                borderRadius: 28,
                glassmorphism: true,
                glow: "0 0 50px rgba(139, 92, 246, 0.2)",
              },
              inAnimation: {
                type: "zoom",
                durationFrames: 25,
                easing: "spring",
              },
              keyframes: [],
            },
          },
          {
            id: "clip_tag1",
            name: "Live Status Pill",
            startFrame: 15,
            durationFrames: 430,
            element: {
              id: "elem_tag1",
              type: "shape",
              transform: {
                x: width / 2,
                y: isVertical ? 480 : 250,
                width: 240,
                height: 48,
                scale: 1,
                rotation: 0,
                opacity: 1,
              },
              shape: {
                shapeType: "pill",
                fill: "rgba(139, 92, 246, 0.25)",
                stroke: "#8b5cf6",
                strokeWidth: 1.5,
                borderRadius: 24,
                glassmorphism: true,
                glow: "0 0 25px rgba(139, 92, 246, 0.5)",
              },
              inAnimation: {
                type: "pop",
                durationFrames: 18,
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
      prompt,
      model: "gemini-3.8-flash",
      timestamp: new Date().toISOString(),
    },
  };
}
