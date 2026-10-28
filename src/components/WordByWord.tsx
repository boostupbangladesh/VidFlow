import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, gradients } from "../theme";

export type WordItem = {
  text: string;
  highlight?: boolean;
  startFrame: number;
};

export const WordByWord: React.FC<{
  words: WordItem[];
  fontSize?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
  color?: string;
  align?: "center" | "left" | "right";
}> = ({
  words,
  fontSize = 62,
  lineHeight = 1.35,
  style,
  color = colors.inkWhite,
  align = "center",
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
        gap: `${Math.round(fontSize * 0.16)}px ${Math.round(fontSize * 0.28)}px`,
        textAlign: align,
        lineHeight,
        fontFamily: fonts.display,
        ...style,
      }}
    >
      {words.map((item, idx) => {
        const isEntered = frame >= item.startFrame;
        const progress = spring({
          frame: frame - item.startFrame,
          fps,
          config: { damping: 14, stiffness: 140, mass: 0.6 },
        });

        const opacity = isEntered ? interpolate(progress, [0, 1], [0, 1]) : 0;
        const translateY = isEntered ? interpolate(progress, [0, 1], [22, 0]) : 22;
        const blur = isEntered ? interpolate(progress, [0, 1], [12, 0]) : 12;
        const scale = isEntered ? interpolate(progress, [0, 1], [0.88, 1]) : 0.88;

        const isHighlight = item.highlight;

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
              color: isHighlight ? undefined : color,
              backgroundImage: isHighlight ? gradients.keyword : undefined,
              WebkitBackgroundClip: isHighlight ? "text" : undefined,
              backgroundClip: isHighlight ? "text" : undefined,
              WebkitTextFillColor: isHighlight ? "transparent" : undefined,
              textShadow: isHighlight
                ? "0 0 25px rgba(255, 107, 0, 0.45)"
                : "0 4px 20px rgba(0, 0, 0, 0.5)",
              padding: "2px 4px",
            }}
          >
            {item.text}
          </span>
        );
      })}
    </div>
  );
};
