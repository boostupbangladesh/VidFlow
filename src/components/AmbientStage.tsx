import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const AmbientStage: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle continuous wave drift to ensure the video never feels frozen or static
  const waveShift = interpolate(frame, [0, 1740], [0, 60], {
    extrapolateRight: "clamp",
  });
  const waveShift2 = interpolate(frame, [0, 1740], [0, -45], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 120% 95% at 70% 25%, #F2F6FC 0%, ${theme.colors.bgSilver} 45%, ${theme.colors.bgSilverDark} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Organic Curved Wave 1: Ambient White Translucent Sweep */}
      <svg
        style={{
          position: "absolute",
          top: -120 + waveShift * 0.3,
          left: -180 + waveShift,
          width: 2300,
          height: 1300,
          pointerEvents: "none",
          opacity: 0.65,
        }}
        viewBox="0 0 2300 1300"
        fill="none"
      >
        <path
          d="M0 0 C 650 350, 1100 80, 1850 480 C 2100 620, 2250 820, 2300 1200 L 2300 0 Z"
          fill="url(#waveGrad1)"
        />
        <defs>
          <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Organic Curved Wave 2: Left Curved Ambient Shade (Signature GetCommerce Shape) */}
      <svg
        style={{
          position: "absolute",
          bottom: -150 + waveShift2 * 0.4,
          left: -120 + waveShift2 * 0.6,
          width: 1600,
          height: 1200,
          pointerEvents: "none",
          opacity: 0.45,
        }}
        viewBox="0 0 1600 1200"
        fill="none"
      >
        <path
          d="M0 1200 C 420 1100, 780 750, 680 320 C 610 110, 480 30, 0 0 Z"
          fill="url(#waveGrad2)"
        />
        <defs>
          <linearGradient id="waveGrad2" x1="0" y1="0" x2="0.8" y2="0.8">
            <stop offset="0%" stopColor="#B8C8DD" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#D4DFEE" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient Top Glow Spot */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: 200,
          width: 900,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
