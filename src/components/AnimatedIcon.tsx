import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const AnimatedIcon: React.FC<{
  icon: React.ReactNode;
  gradient?: string;
  size?: number;
  glowColor?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({
  icon,
  gradient = "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
  size = 72,
  glowColor = "rgba(124, 58, 237, 0.45)",
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy spring entrance
  const entranceSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });

  const scale = interpolate(entranceSpring, [0, 1], [0.3, 1]);
  const rotate = interpolate(entranceSpring, [0, 1], [-25, 0]);
  const opacity = interpolate(entranceSpring, [0, 1], [0, 1]);

  // Gentle continuous hover float
  const hoverY = Math.sin((frame + delay * 5) / 18) * 5;
  const hoverRotate = Math.sin((frame + delay * 3) / 24) * 3;

  // Expanding pulsing aura ring
  const pingScale = interpolate((frame - delay) % 45, [0, 45], [1, 1.8]);
  const pingOpacity = interpolate((frame - delay) % 45, [0, 45], [0.6, 0]);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale}) translateY(${hoverY}px) rotate(${rotate + hoverRotate}deg)`,
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Pulsing Sonar Halo */}
      {frame >= delay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${glowColor}`,
            transform: `scale(${pingScale})`,
            opacity: pingOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Main Gradient Disc */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: Math.round(size * 0.32),
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 12px 30px ${glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.45)`,
          border: "1.5px solid rgba(255, 255, 255, 0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Specular Glint */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, transparent 100%)",
            borderRadius: `${Math.round(size * 0.32)}px ${Math.round(size * 0.32)}px 0 0`,
            pointerEvents: "none",
          }}
        />
        {icon}
      </div>
    </div>
  );
};
