import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface DeviceTablet3DProps {
  imageSrc: string;
  width?: number;
  height?: number;
  rotateY?: number;
  rotateX?: number;
  floatAmplitude?: number;
  delay?: number;
}

export const DeviceTablet3D: React.FC<DeviceTablet3DProps> = ({
  imageSrc,
  width = 1100,
  height = 680,
  rotateY = -18,
  rotateX = 8,
  floatAmplitude = 6,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 1.0, stiffness: 90 },
  });

  // Continuous subtle 3D floating so the viewport never freezes
  const continuousFloat = Math.sin((frame + delay * 2) / 28) * floatAmplitude;
  const continuousTilt = Math.cos((frame + delay * 2) / 35) * 1.2;

  // Staggered slide in from the right with spring
  const slideX = interpolate(entrance, [0, 1], [300, 0]);

  return (
    <div
      style={{
        perspective: 1500,
        transformStyle: "preserve-3d",
        display: "inline-block",
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius: 28,
          backgroundColor: "#FFFFFF",
          border: "2px solid rgba(255, 255, 255, 0.95)",
          boxShadow: theme.colors.cardShadowHeavy,
          overflow: "hidden",
          position: "relative",
          transform: `translateX(${slideX}px) translateY(${continuousFloat}px) rotateY(${rotateY + continuousTilt}deg) rotateX(${rotateX}deg) scale(${entrance})`,
          transformOrigin: "center center",
          opacity: entrance,
        }}
      >
        {/* Real Screenshot */}
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Specular Glare Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Subtle Outer Inner Bezel Border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 26,
            border: "1px solid rgba(15, 40, 81, 0.08)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
