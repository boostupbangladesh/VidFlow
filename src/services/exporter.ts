import { VidFlowProject } from "../types/schema";
import { computeElementStateAtFrame } from "../engine/animationEngine";

export interface RenderProgress {
  currentFrame: number;
  totalFrames: number;
  progressPercent: number;
  status: "idle" | "rendering" | "encoding" | "completed" | "error";
  error?: string;
  format?: string;
}

export async function renderProjectToVideo(
  project: VidFlowProject,
  onProgress: (p: RenderProgress) => void
): Promise<{ blob: Blob; mimeType: string }> {
  // 1. Wait for web fonts (Hind Siliguri, Outfit, Tiro Bangla, etc.) to load for crisp Canvas typography
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn("Font loading wait ignored", e);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = project.width;
  canvas.height = project.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Could not acquire 2D rendering context.");
  }

  const fps = project.fps || 30;
  const totalFrames = project.durationFrames;
  const durationSeconds = totalFrames / fps;

  // 2. Set up Web Audio API Stream Destination for synchronized Audio + Video export
  let audioContext: AudioContext | null = null;
  let audioDest: MediaStreamAudioDestinationNode | null = null;
  const audioTracksToExport = project.audioTracks || [];

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioCtx();
    audioDest = audioContext.createMediaStreamDestination();

    // Decode and schedule each audio track
    for (const track of audioTracksToExport) {
      if (!track.src) continue;
      try {
        const res = await fetch(track.src);
        if (res.ok) {
          const ab = await res.arrayBuffer();
          const buffer = await audioContext.decodeAudioData(ab);
          const source = audioContext.createBufferSource();
          source.buffer = buffer;

          const gainNode = audioContext.createGain();
          gainNode.gain.setValueAtTime(track.volume ?? 1.0, audioContext.currentTime);

          source.connect(gainNode);
          gainNode.connect(audioDest);

          const startTime = audioContext.currentTime + (track.startFrame || 0) / fps;
          source.start(startTime);
        }
      } catch (audioErr) {
        console.warn(`Could not load audio track: ${track.name || track.id}`, audioErr);
      }
    }
  } catch (err) {
    console.warn("AudioContext setup failed or not supported in this environment", err);
  }

  // 3. Create combined MediaStream with Video + Audio
  const videoStream = canvas.captureStream(fps);
  const streamTracks: MediaStreamTrack[] = [...videoStream.getVideoTracks()];

  if (audioDest) {
    const audioStreamTracks = audioDest.stream.getAudioTracks();
    if (audioStreamTracks.length > 0) {
      streamTracks.push(...audioStreamTracks);
    }
  }

  const combinedStream = new MediaStream(streamTracks);
  const recordedChunks: Blob[] = [];

  // Determine best supported MIME type (prefer MP4 if supported, else WebM VP9/VP8)
  const candidateMimeTypes = [
    "video/mp4;codecs=avc1,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  let selectedMimeType = "video/webm";
  for (const candidate of candidateMimeTypes) {
    if (MediaRecorder.isTypeSupported(candidate)) {
      selectedMimeType = candidate;
      break;
    }
  }

  const recorder = new MediaRecorder(combinedStream, {
    mimeType: selectedMimeType,
    videoBitsPerSecond: 16000000, // 16 Mbps for pristine 1080p/4K motion
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  recorder.start();

  onProgress({
    currentFrame: 0,
    totalFrames,
    progressPercent: 0,
    status: "rendering",
    format: selectedMimeType.includes("mp4") ? "MP4" : "WebM",
  });

  // 4. Render Frame-by-Frame
  for (let f = 0; f < totalFrames; f++) {
    // 4.1 Draw Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = project.theme.background || "#080a10";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 4.2 Radial gradient lighting
    if (project.theme.gradient) {
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.35,
        50,
        canvas.width / 2,
        canvas.height * 0.35,
        canvas.width * 0.8
      );
      grad.addColorStop(0, (project.theme.primaryColor || "#8B5CF6") + "33");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 4.3 Render all tracks from bottom to top
    for (let t = project.tracks.length - 1; t >= 0; t--) {
      const track = project.tracks[t];
      if (!track.isVisible) continue;

      for (const clip of track.clips) {
        const state = computeElementStateAtFrame(
          clip.element,
          clip.startFrame,
          clip.durationFrames,
          f
        );

        if (!state.isVisible || state.opacity <= 0.01) continue;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, state.opacity));
        ctx.translate(state.transform.x, state.transform.y);
        ctx.rotate((state.transform.rotation * Math.PI) / 180);
        ctx.scale(state.transform.scale, state.transform.scale);

        // Render Shape
        if (clip.element.type === "shape" && clip.element.shape) {
          const s = clip.element.shape;
          const w = state.transform.width;
          const h = state.transform.height;

          // Subtle glow shadow if enabled
          if (s.glow) {
            ctx.shadowColor = s.glow;
            ctx.shadowBlur = 24;
          }

          ctx.fillStyle = s.fill;
          if (s.stroke && s.strokeWidth > 0) {
            ctx.strokeStyle = s.stroke;
            ctx.lineWidth = s.strokeWidth;
          }

          if (s.shapeType === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(1, w / 2), 0, Math.PI * 2);
            ctx.fill();
            if (s.stroke && s.strokeWidth > 0) ctx.stroke();
          } else {
            const r = s.borderRadius !== undefined ? s.borderRadius : 16;
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, r);
            ctx.fill();
            if (s.stroke && s.strokeWidth > 0) ctx.stroke();
          }
        }

        // Render Text (Bangla & English Typography)
        if (clip.element.type === "text" && clip.element.text) {
          const txt = clip.element.text;
          ctx.fillStyle = txt.color;

          // Glow effect
          if (txt.glow) {
            ctx.shadowColor = txt.glow;
            ctx.shadowBlur = 16;
          }

          const fontFamily = txt.fontFamily || "Hind Siliguri";
          ctx.font = `${txt.fontWeight || 700} ${txt.fontSize}px "${fontFamily}", "Tiro Bangla", sans-serif`;
          ctx.textAlign = txt.textAlign || "center";
          ctx.textBaseline = "middle";

          // Multiline Support
          const lines = txt.text.split("\n");
          const lineHeight = (txt.fontSize || 32) * (txt.lineHeight || 1.3);
          const startY = -((lines.length - 1) * lineHeight) / 2;

          lines.forEach((line, idx) => {
            ctx.fillText(line, 0, startY + idx * lineHeight);
          });
        }

        ctx.restore();
      }
    }

    // 4.4 Report progress
    const percent = Math.round(((f + 1) / totalFrames) * 100);
    onProgress({
      currentFrame: f + 1,
      totalFrames,
      progressPercent: percent,
      status: "rendering",
      format: selectedMimeType.includes("mp4") ? "MP4" : "WebM",
    });

    // Breath interval for UI responsiveness
    if (f % 6 === 0) {
      await new Promise((r) => setTimeout(r, 4));
    }
  }

  onProgress({
    currentFrame: totalFrames,
    totalFrames,
    progressPercent: 100,
    status: "encoding",
    format: selectedMimeType.includes("mp4") ? "MP4" : "WebM",
  });

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: selectedMimeType });
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close().catch(() => {});
      }
      onProgress({
        currentFrame: totalFrames,
        totalFrames,
        progressPercent: 100,
        status: "completed",
        format: selectedMimeType.includes("mp4") ? "MP4" : "WebM",
      });
      resolve({ blob, mimeType: selectedMimeType });
    };

    recorder.onerror = (err) => {
      onProgress({
        currentFrame: totalFrames,
        totalFrames,
        progressPercent: 100,
        status: "error",
        error: String(err),
      });
      reject(err);
    };

    recorder.stop();
  });
}
