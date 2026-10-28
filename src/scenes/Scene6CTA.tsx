import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ShieldCheck } from "lucide-react";
import { theme } from "../theme";
import { NavigatorCursor } from "../components/NavigatorCursor";
import { SearchPillCTA } from "../components/SearchPillCTA";

export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous subtle camera drift
  const sceneDrift = interpolate(frame, [0, 186], [0, -10], {
    extrapolateRight: "clamp",
  });
  const cameraScale = interpolate(frame, [0, 186], [1.0, 1.025], {
    extrapolateRight: "clamp",
  });

  // Phase transition (frame 80)
  const isSearchPill = frame >= 80;
  const phase1Fade = interpolate(frame, [70, 85], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phase2Fade = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 1 Entrances
  const p1Enter = spring({ frame: frame - 6, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const laptopFloat = Math.sin(frame / 18) * 8;

  // Navigator Avatar path
  let avatarX = 960;
  let avatarY = 820;
  let isClicking = false;

  if (!isSearchPill) {
    avatarX = interpolate(frame, [10, 45], [1150, 1220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    avatarY = interpolate(frame, [10, 45], [750, 680], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else {
    // Glides to the Search Pill and clicks
    avatarX = interpolate(frame, [90, 135], [750, 1180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    avatarY = interpolate(frame, [90, 135], [720, 570], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    isClicking = frame >= 135 && frame <= 148;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        transform: `scale(${cameraScale}) translateY(${sceneDrift}px)`,
        transformOrigin: "center center",
      }}
    >
      {/* PHASE 1: Automation Hero Layout (GetCommerce frame 024) */}
      {frame < 90 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase1Fade,
            transform: `scale(${p1Enter})`,
          }}
        >
          {/* Main Automation Layout: 3D Laptop Icon + Bold Headline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              marginBottom: 40,
            }}
          >
            {/* 3D Rotating Automated Laptop Icon */}
            <div
              style={{
                width: 200,
                height: 180,
                transform: `translateY(${laptopFloat}px)`,
                filter: "drop-shadow(0 16px 36px rgba(250, 90, 0, 0.3))",
              }}
            >
              <Img
                src={staticFile("assets/laptop_auto_icon.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Bold Headline in Hind Siliguri */}
            <div style={{ fontFamily: theme.fonts.bengali }}>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: theme.colors.inkNavy,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                আপনার ব্যবসার পেমেন্ট
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: theme.colors.brandOrange,
                  lineHeight: 1.15,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span>হোক সম্পূর্ণ</span>
                <span
                  style={{
                    backgroundColor: theme.colors.brandOrange,
                    color: "#FFFFFF",
                    padding: "2px 20px",
                    borderRadius: 14,
                    boxShadow: `0 8px 24px ${theme.colors.brandOrangeGlow}`,
                  }}
                >
                  অটোমেটেড
                </span>
              </div>
            </div>
          </div>

          {/* Financial Safety Guarantee Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              backgroundColor: "#FFFFFF",
              border: `2px solid ${theme.colors.accentGreen}`,
              borderRadius: 9999,
              padding: "14px 36px",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)",
            }}
          >
            <ShieldCheck size={26} color={theme.colors.accentGreen} />
            <span
              style={{
                fontFamily: theme.fonts.bengali,
                fontSize: 22,
                fontWeight: 700,
                color: theme.colors.inkNavy,
              }}
            >
              ১০০% আর্থিক নিরাপত্তা ও রিয়েল-টাইম ডাটা এনক্রিপশন
            </span>
          </div>
        </div>
      )}

      {/* PHASE 2: Iconic GetCommerce Search Pill CTA (frame 027) */}
      {frame >= 75 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase2Fade,
          }}
        >
          <SearchPillCTA
            url="pay.zapy.bd"
            headline="বিস্তারিত জানতে আজই সাইন আপ করুন"
            credit="Powered by Z-Pay • Smart Payment Automation"
          />
        </div>
      )}

      {/* Realistic Navigator Avatar Cursor */}
      <NavigatorCursor
        x={avatarX}
        y={avatarY}
        isClicking={isClicking}
        label={isSearchPill ? "আজই যুক্ত হোন 🚀" : "১০০% নিরাপদ 🔒"}
      />
    </div>
  );
};
