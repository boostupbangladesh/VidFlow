import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { colors } from "../theme";

export const AmbientBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Gentle breathing cycle
  const breathe1 = Math.sin(frame / 45) * 40;
  const breathe2 = Math.cos(frame / 40) * 35;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.baseDark,
        overflow: "hidden",
      }}
    >
      {/* Deep Royal Twilight Gradient Base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #1A0D38 0%, #12082A 50%, #0A0418 100%)",
        }}
      />

      {/* Blueprint Coordinate Grid Overlay (Kontentbook Signature) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.85,
          pointerEvents: "none",
        }}
      />

      {/* Bottom-Left Electric Royal Violet Spotlight */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -200 + breathe1,
          bottom: -200 + breathe2,
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, rgba(91, 33, 182, 0.25) 50%, transparent 75%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Top-Right Warm Sunset Rose Spotlight */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          right: -150 - breathe2,
          top: -150 - breathe1,
          background: "radial-gradient(circle, rgba(225, 29, 72, 0.35) 0%, rgba(190, 24, 93, 0.15) 50%, transparent 70%)",
          filter: "blur(110px)",
          pointerEvents: "none",
        }}
      />

      {/* Center Atmospheric Soft Glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Floating Stardust Particles */}
      <StardustParticles seed="royal-stardust" count={22} />
    </AbsoluteFill>
  );
};

export const StardustParticles: React.FC<{ seed: string; count?: number }> = ({
  seed,
  count = 22,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const size = 3 + r("s") * 5;
        const speed = 0.8 + r("v") * 1.2;
        const y = ((r("y") * 2400 - frame * speed) % 2400 + 2400) % 2400 - 200;
        const x = r("x") * 1080 + Math.sin(frame / (30 + r("p") * 30) + i) * 15;
        const isOrange = r("c") > 0.7;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: isOrange ? "#FF7A00" : "#FFFFFF",
              boxShadow: isOrange
                ? "0 0 10px rgba(255, 122, 0, 0.8)"
                : "0 0 8px rgba(255, 255, 255, 0.9)",
              opacity: 0.35 + r("o") * 0.55,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
