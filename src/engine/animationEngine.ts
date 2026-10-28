import { MotionElement, Transform, Keyframe, EasingType } from "../types/schema";

// Standard Bézier and mathematical easing functions
export function applyEasing(t: number, easing: EasingType): number {
  const clampT = Math.max(0, Math.min(1, t));

  switch (easing) {
    case "linear":
      return clampT;
    case "ease-in":
      return clampT * clampT * clampT;
    case "ease-out":
      return 1 - Math.pow(1 - clampT, 3);
    case "ease-in-out":
      return clampT < 0.5
        ? 4 * clampT * clampT * clampT
        : 1 - Math.pow(-2 * clampT + 2, 3) / 2;
    case "spring": {
      const c4 = (2 * Math.PI) / 3;
      return clampT === 0
        ? 0
        : clampT === 1
        ? 1
        : Math.pow(2, -10 * clampT) * Math.sin((clampT * 10 - 0.75) * c4) + 1;
    }
    case "bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      let val = clampT;
      if (val < 1 / d1) {
        return n1 * val * val;
      } else if (val < 2 / d1) {
        return n1 * (val -= 1.5 / d1) * val + 0.75;
      } else if (val < 2.5 / d1) {
        return n1 * (val -= 2.25 / d1) * val + 0.9375;
      } else {
        return n1 * (val -= 2.625 / d1) * val + 0.984375;
      }
    }
    default:
      return clampT;
  }
}

// Calculate interpolated transform and opacity at a specific frame
export function computeElementStateAtFrame(
  element: MotionElement,
  startFrame: number,
  durationFrames: number,
  currentFrame: number
): {
  isVisible: boolean;
  transform: Transform;
  opacity: number;
  wordRevealProgress?: number;
} {
  const defaultTransform: Transform = {
    x: 540,
    y: 960,
    width: 600,
    height: 120,
    scale: 1,
    rotation: 0,
    opacity: 1,
  };

  if (!element || typeof element !== "object") {
    return {
      isVisible: false,
      transform: defaultTransform,
      opacity: 0,
    };
  }

  const base = element.transform || defaultTransform;
  const relFrame = currentFrame - (typeof startFrame === "number" ? startFrame : 0);
  const dur = typeof durationFrames === "number" && durationFrames > 0 ? durationFrames : 150;

  // Not in clip duration
  if (relFrame < 0 || relFrame > dur) {
    return {
      isVisible: false,
      transform: { ...base },
      opacity: 0,
    };
  }

  // Base transform with numeric fallbacks
  let x = typeof base.x === "number" ? base.x : 540;
  let y = typeof base.y === "number" ? base.y : 960;
  let width = typeof base.width === "number" ? base.width : 600;
  let height = typeof base.height === "number" ? base.height : 120;
  let scale = typeof base.scale === "number" ? base.scale : 1;
  let rotation = typeof base.rotation === "number" ? base.rotation : 0;
  let opacity = typeof base.opacity === "number" ? base.opacity : 1;

  // In-Animation calculation
  if (element.inAnimation && relFrame < element.inAnimation.durationFrames) {
    const inProgress = applyEasing(
      relFrame / element.inAnimation.durationFrames,
      element.inAnimation.easing
    );

    switch (element.inAnimation.type) {
      case "fade":
        opacity *= inProgress;
        break;
      case "pop":
      case "elastic":
        scale *= inProgress;
        opacity *= Math.min(1, inProgress * 1.5);
        break;
      case "slide-up":
        y += (1 - inProgress) * 80;
        opacity *= inProgress;
        break;
      case "zoom":
        scale *= 0.5 + inProgress * 0.5;
        opacity *= inProgress;
        break;
    }
  }

  // Out-Animation calculation
  const framesRemaining = durationFrames - relFrame;
  if (element.outAnimation && framesRemaining < element.outAnimation.durationFrames) {
    const outProgress = applyEasing(
      framesRemaining / element.outAnimation.durationFrames,
      element.outAnimation.easing
    );

    switch (element.outAnimation.type) {
      case "fade":
        opacity *= outProgress;
        break;
      case "shrink":
        scale *= outProgress;
        opacity *= outProgress;
        break;
      case "slide-down":
        y += (1 - outProgress) * 80;
        opacity *= outProgress;
        break;
    }
  }

  // Keyframes interpolation
  if (element.keyframes && element.keyframes.length > 0) {
    const props = ["x", "y", "scale", "rotation", "opacity", "width", "height"] as const;

    for (const prop of props) {
      const propKeyframes = element.keyframes
        .filter((kf) => kf.property === prop)
        .sort((a, b) => a.frame - b.frame);

      if (propKeyframes.length >= 2) {
        // Find segment
        for (let i = 0; i < propKeyframes.length - 1; i++) {
          const kfA = propKeyframes[i];
          const kfB = propKeyframes[i + 1];

          if (relFrame >= kfA.frame && relFrame <= kfB.frame) {
            const span = kfB.frame - kfA.frame;
            const progress = span > 0 ? (relFrame - kfA.frame) / span : 1;
            const easedProgress = applyEasing(progress, kfB.easing);
            const interpolated = kfA.value + (kfB.value - kfA.value) * easedProgress;

            if (prop === "x") x = interpolated;
            if (prop === "y") y = interpolated;
            if (prop === "scale") scale = interpolated;
            if (prop === "rotation") rotation = interpolated;
            if (prop === "opacity") opacity = interpolated;
            if (prop === "width") width = interpolated;
            if (prop === "height") height = interpolated;
            break;
          }
        }
      }
    }
  }

  // Kinetic typography progress (for word-by-word reveal)
  const wordRevealProgress = Math.min(1, Math.max(0, relFrame / Math.max(1, durationFrames * 0.7)));

  return {
    isVisible: true,
    transform: { x, y, width, height, scale, rotation, opacity },
    opacity,
    wordRevealProgress,
  };
}
