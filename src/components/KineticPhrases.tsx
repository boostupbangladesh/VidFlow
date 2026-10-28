import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, gradients } from "../theme";

export type PhraseChunk = {
  text: string;
  highlight?: boolean;
  highlightVariant?: "orange" | "brand" | "danger" | "success";
  startFrame: number;
  effect?: "pop" | "slide" | "zoom";
};

export const KineticPhrases: React.FC<{
  phrases: PhraseChunk[];
  fontSize?: number;
  lineHeight?: number;
  align?: "center" | "left" | "right";
  style?: React.CSSProperties;
}> = ({
  phrases,
  fontSize = 64,
  lineHeight = 1.35,
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        alignItems: "center",
        gap: `${Math.round(fontSize * 0.2)}px ${Math.round(fontSize * 0.32)}px`,
        textAlign: align,
        lineHeight,
        fontFamily: fonts.display,
        ...style,
      }}
    >
      {phrases.map((item, idx) => {
        const isEntered = frame >= item.startFrame;
        const spr = spring({
          frame: frame - item.startFrame,
          fps,
          config: { damping: 13, stiffness: 150, mass: 0.6 },
        });

        const opacity = isEntered ? interpolate(spr, [0, 1], [0, 1]) : 0;
        const translateY = isEntered ? interpolate(spr, [0, 1], [24, 0]) : 24;
        const scale = isEntered ? interpolate(spr, [0, 1], [0.85, 1]) : 0.85;
        const blur = isEntered ? interpolate(spr, [0, 1], [10, 0]) : 10;

        const isHighlight = item.highlight;
        const variant = item.highlightVariant || "orange";

        const bgGradient =
          variant === "danger"
            ? "linear-gradient(135deg, #EF4444, #F87171)"
            : variant === "success"
            ? "linear-gradient(135deg, #10B981, #34D399)"
            : variant === "brand"
            ? gradients.brandKeyword
            : gradients.keyword;

        const glowColor =
          variant === "danger"
            ? "rgba(239, 68, 68, 0.5)"
            : variant === "success"
            ? "rgba(16, 185, 129, 0.5)"
            : variant === "brand"
            ? "rgba(168, 85, 247, 0.5)"
            : "rgba(255, 107, 0, 0.5)";

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
              fontSize,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: isHighlight ? undefined : "#FFFFFF",
              backgroundImage: isHighlight ? bgGradient : undefined,
              WebkitBackgroundClip: isHighlight ? "text" : undefined,
              backgroundClip: isHighlight ? "text" : undefined,
              WebkitTextFillColor: isHighlight ? "transparent" : undefined,
              textShadow: isHighlight
                ? `0 0 30px ${glowColor}`
                : "0 4px 20px rgba(0, 0, 0, 0.5)",
              padding: "2px 6px",
            }}
          >
            {item.text}
          </span>
        );
      })}
    </div>
  );
};
