import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Search } from "lucide-react";
import { theme } from "../theme";

interface SearchPillCTAProps {
  url?: string;
  headline?: string;
  credit?: string;
}

export const SearchPillCTA: React.FC<SearchPillCTAProps> = ({
  url = "pay.zapy.bd",
  headline = "বিস্তারিত জানতে আজই ভিজিট করুন",
  credit = "A product by Z-Pay",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 100 },
  });

  const floatY = Math.sin(frame / 20) * 4;

  // Typing effect for the URL
  const charsShown = Math.floor(
    interpolate(frame, [15, 45], [0, url.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const displayUrl = url.slice(0, charsShown);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${floatY}px) scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Bengali Invitation Headline */}
      <div
        style={{
          fontFamily: theme.fonts.bengali,
          fontSize: 38,
          fontWeight: 700,
          color: theme.colors.inkNavy,
          marginBottom: 24,
          letterSpacing: "-0.01em",
          textAlign: "center",
        }}
      >
        {headline}
      </div>

      {/* Iconic GetCommerce Search Capsule */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          border: `2px solid ${theme.colors.cardBorderSubtle}`,
          borderRadius: 9999,
          padding: "10px 36px 10px 14px",
          boxShadow: "0 18px 45px rgba(15, 40, 81, 0.12), 0 4px 12px rgba(15, 40, 81, 0.05)",
          gap: 20,
          minWidth: 540,
        }}
      >
        {/* Orange Search Icon Disc */}
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            backgroundColor: theme.colors.brandOrange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 18px ${theme.colors.brandOrangeGlow}`,
          }}
        >
          <Search size={28} color="#FFFFFF" strokeWidth={2.6} />
        </div>

        {/* Typed URL Text */}
        <div
          style={{
            fontFamily: theme.fonts.latin,
            fontSize: 36,
            fontWeight: 600,
            color: theme.colors.inkNavy,
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>{displayUrl}</span>
          {frame % 20 < 10 && (
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: 34,
                backgroundColor: theme.colors.brandOrange,
                marginLeft: 4,
              }}
            />
          )}
        </div>
      </div>

      {/* Brand Parent Credit */}
      <div
        style={{
          marginTop: 48,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: theme.fonts.latin,
          fontSize: 20,
          fontWeight: 500,
          color: theme.colors.inkMuted,
        }}
      >
        <span>{credit}</span>
      </div>
    </div>
  );
};
