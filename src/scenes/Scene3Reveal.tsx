import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { theme } from "../theme";
import { DeviceTablet3D } from "../components/DeviceTablet3D";
import { NavigatorCursor } from "../components/NavigatorCursor";

export const Scene3Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous subtle drift to prevent freezing
  const sceneDrift = interpolate(frame, [0, 264], [0, -14], {
    extrapolateRight: "clamp",
  });
  const cameraScale = interpolate(frame, [0, 264], [1.0, 1.025], {
    extrapolateRight: "clamp",
  });

  // Smooth exit transition into Scene 4
  const exitOpacity = interpolate(frame, [244, 264], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Left copy entrance
  const textEnter = spring({ frame: frame - 10, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });

  // Navigator Avatar path: glides onto the tablet dashboard KPI card
  const avatarX = interpolate(
    frame,
    [25, 85, 140],
    [500, 1180, 1260],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const avatarY = interpolate(
    frame,
    [25, 85, 140],
    [850, 480, 490],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const isClicking = frame >= 85 && frame <= 98;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        opacity: exitOpacity,
        transform: `scale(${cameraScale}) translateY(${sceneDrift}px)`,
        transformOrigin: "center center",
      }}
    >
      {/* Two-Column GetCommerce Layout: Left Content + Right 3D Tablet */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 120,
          right: 80,
          bottom: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Column: Bold Typography & Feature Badges */}
        <div
          style={{
            maxWidth: 580,
            transform: `translateX(${(1 - textEnter) * -60}px) scale(${textEnter})`,
            opacity: textEnter,
          }}
        >
          {/* Accent Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 9999,
              backgroundColor: "#FFF5EB",
              border: `1.5px solid ${theme.colors.brandOrangeLight}`,
              color: theme.colors.brandOrange,
              fontFamily: theme.fonts.bengali,
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 20,
              boxShadow: `0 4px 14px ${theme.colors.brandOrangeGlow}`,
            }}
          >
            <Zap size={20} color={theme.colors.brandOrange} />
            <span>আধুনিক পেমেন্ট অটোমেশন</span>
          </div>

          {/* Section Headline (Authentic GetCommerce Navy Title) */}
          <div
            style={{
              fontFamily: theme.fonts.latin,
              fontSize: 60,
              fontWeight: 800,
              color: theme.colors.inkNavy,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Smart Dashboard
          </div>

          {/* Bengali Subheadline in Hind Siliguri */}
          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 34,
              fontWeight: 700,
              color: theme.colors.brandPurple,
              lineHeight: 1.3,
              marginBottom: 16,
            }}
          >
            সব সমস্যার সহজ ও আধুনিক সমাধান: Z-Pay
          </div>

          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 20,
              color: theme.colors.inkMuted,
              lineHeight: 1.55,
              marginBottom: 36,
            }}
          >
            কোনো জটিলতা ছাড়া অটোমেটেড পেমেন্ট ভেরিফিকেশন ও রিয়েল-টাইম কন্ট্রোল প্যানেল
          </div>

          {/* Feature Badges List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { text: "০% অতিরিক্ত ট্রানজেকশন ফি", icon: CheckCircle2, color: theme.colors.accentGreen },
              { text: "সরাসরি আপনার পার্সোনাল/মার্চেন্ট সিমে টাকা জমা", icon: ShieldCheck, color: theme.colors.brandOrange },
              { text: "৫ সেকেন্ডে লাইভ রাডারে ট্রানজেকশন ম্যাচিং", icon: Zap, color: theme.colors.brandPurple },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "#FFFFFF",
                  padding: "12px 20px",
                  borderRadius: 16,
                  border: `1.5px solid ${theme.colors.cardBorderSubtle}`,
                  boxShadow: "0 6px 18px rgba(15, 40, 81, 0.05)",
                }}
              >
                <item.icon size={24} color={item.color} />
                <span
                  style={{
                    fontFamily: theme.fonts.bengali,
                    fontSize: 18,
                    fontWeight: 600,
                    color: theme.colors.inkNavy,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Perspective Rotated Tablet showing Real Dashboard */}
        <div style={{ transform: "translateY(-10px)" }}>
          <DeviceTablet3D
            imageSrc="assets/merchant/merchant_dashboard.png"
            width={1060}
            height={660}
            rotateY={-17}
            rotateX={8}
            delay={8}
          />
        </div>
      </div>

      {/* Realistic Navigator Avatar Cursor */}
      <NavigatorCursor
        x={avatarX}
        y={avatarY}
        isClicking={isClicking}
        label="১০০% সিমে জমা 🎉"
      />
    </div>
  );
};
