import React from "react";
import { Img, staticFile } from "remotion";
import { theme } from "../theme";

interface NavigatorCursorProps {
  x: number;
  y: number;
  scale?: number;
  isClicking?: boolean;
  opacity?: number;
  label?: string;
}

export const NavigatorCursor: React.FC<NavigatorCursorProps> = ({
  x,
  y,
  scale = 1.0,
  isClicking = false,
  opacity = 1.0,
  label,
}) => {
  const clickScale = isClicking ? 0.9 : 1.0;
  const currentScale = scale * clickScale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -40%) scale(${currentScale})`,
        opacity,
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: "drop-shadow(0 14px 28px rgba(15, 40, 81, 0.22))",
        transition: "transform 0.05s ease-out",
      }}
    >
      {/* Orange Pointer Cursor Arrow (Signature GetCommerce Shape) */}
      <svg
        width="34"
        height="38"
        viewBox="0 0 34 38"
        fill="none"
        style={{
          marginBottom: -6,
          zIndex: 2,
          filter: "drop-shadow(0 3px 6px rgba(250, 90, 0, 0.4))",
        }}
      >
        <path
          d="M17 0 L 33 34 C 27 30, 21 28, 17 31 C 13 28, 7 30, 1 34 Z"
          fill={theme.colors.brandOrange}
        />
      </svg>

      {/* Circular Avatar Ring with Realistic Businessman Photo */}
      <div
        style={{
          width: 124,
          height: 124,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          border: `4px solid ${theme.colors.brandOrange}`,
          boxShadow: `0 0 0 2px rgba(255, 255, 255, 0.8), 0 10px 24px rgba(250, 90, 0, 0.25)`,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile("assets/navigator_headshot.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Optional Floating Status Badge */}
      {label && (
        <div
          style={{
            marginTop: 8,
            backgroundColor: "#FFFFFF",
            border: `1.5px solid ${theme.colors.cardBorderSubtle}`,
            padding: "4px 14px",
            borderRadius: 9999,
            fontSize: 14,
            fontWeight: 600,
            color: theme.colors.inkNavy,
            fontFamily: theme.fonts.bengali,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(15, 40, 81, 0.12)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
