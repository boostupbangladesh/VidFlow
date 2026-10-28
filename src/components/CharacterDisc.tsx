import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";

export const CharacterDisc: React.FC<{
  imageName: "char_stressed.jpg" | "char_happy.jpg" | "char_tech.jpg";
  badgeText?: string;
  badgeVariant?: "danger" | "success" | "brand";
  size?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({
  imageName,
  badgeText,
  badgeVariant = "brand",
  size = 140,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 130 },
  });

  const scale = interpolate(entrance, [0, 1], [0.4, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const hoverY = Math.sin((frame + delay * 4) / 18) * 6;

  const borderColor =
    badgeVariant === "danger"
      ? "#EF4444"
      : badgeVariant === "success"
      ? "#10B981"
      : "#A855F7";

  const glowShadow =
    badgeVariant === "danger"
      ? "0 12px 35px rgba(239, 68, 68, 0.45)"
      : badgeVariant === "success"
      ? "0 12px 35px rgba(16, 185, 129, 0.45)"
      : "0 12px 35px rgba(168, 85, 247, 0.45)";

  const badgeBg =
    badgeVariant === "danger"
      ? "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)"
      : badgeVariant === "success"
      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
      : "linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `scale(${scale}) translateY(${hoverY}px)`,
        zIndex: 15,
        ...style,
      }}
    >
      {/* Circular Character Disc */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          border: `3px solid ${borderColor}`,
          boxShadow: `${glowShadow}, inset 0 0 20px rgba(0,0,0,0.4)`,
          background: "linear-gradient(135deg, #2D1452, #180A30)",
          position: "relative",
        }}
      >
        <Img
          src={staticFile(`assets/${imageName}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Floating Emotional Pill Badge */}
      {badgeText && (
        <div
          style={{
            marginTop: -14,
            padding: "6px 14px",
            borderRadius: 999,
            background: badgeBg,
            border: "1.5px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
            color: "#FFFFFF",
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 16,
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          {badgeText}
        </div>
      )}
    </div>
  );
};
