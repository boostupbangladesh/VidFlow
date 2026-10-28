import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Clock, FileX, Percent } from "lucide-react";
import { theme } from "../theme";
import { NavigatorCursor } from "../components/NavigatorCursor";

export const Scene2PainPoints: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous subtle drift to prevent freezing
  const sceneDrift = interpolate(frame, [0, 288], [0, -16], {
    extrapolateRight: "clamp",
  });
  const cameraScale = interpolate(frame, [0, 288], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  // Smooth exit transition into Scene 3
  const exitOpacity = interpolate(frame, [268, 288], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card entrances
  const card1Enter = spring({ frame: frame - 10, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const card2Enter = spring({ frame: frame - 28, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const card3Enter = spring({ frame: frame - 46, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });

  // Navigator Avatar navigation path across the 3 pain points
  const avatarX = interpolate(
    frame,
    [10, 60, 110, 160, 210],
    [480, 560, 960, 1360, 1360],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const avatarY = interpolate(
    frame,
    [10, 60, 110, 160, 210],
    [800, 680, 650, 680, 680],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Click pulse trigger
  const isClicking =
    (frame >= 58 && frame <= 68) ||
    (frame >= 158 && frame <= 168) ||
    (frame >= 208 && frame <= 218);

  const activeLabel =
    frame < 110
      ? "উচ্চ ফি কর্তন 💸"
      : frame < 185
      ? "৭-১৫ দিন অপেক্ষা ⏳"
      : "ট্রেড লাইসেন্স জটিলতা 📄";

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
      {/* Top Headline in Hind Siliguri */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.fonts.bengali,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: theme.colors.alertRed,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          সাধারণ পেমেন্ট গেটওয়ের সমস্যা
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: theme.colors.inkNavy,
            lineHeight: 1.25,
          }}
        >
          উচ্চ ফি, দীর্ঘ অপেক্ষা আর লাইসেন্সের ঝামেলা
        </div>
      </div>

      {/* 3 Staggered Pain Point Cards */}
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 36,
          perspective: 1400,
        }}
      >
        {/* Card 1: 2.5% - 3.5% Fee Cut */}
        <div
          style={{
            width: 380,
            height: 480,
            borderRadius: 26,
            backgroundColor: "#FFFFFF",
            border: `2px solid ${theme.colors.cardBorderSubtle}`,
            boxShadow: theme.colors.cardShadow,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${(1 - card1Enter) * 50}px) scale(${card1Enter})`,
            opacity: card1Enter,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Percent size={36} color={theme.colors.alertRed} />
          </div>

          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 24,
              fontWeight: 700,
              color: theme.colors.inkNavy,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            উচ্চ ট্রানজেকশন ফি
          </div>

          <div
            style={{
              fontFamily: theme.fonts.latin,
              fontSize: 34,
              fontWeight: 800,
              color: theme.colors.alertRed,
              marginBottom: 16,
            }}
          >
            2.5% - 3.5%
          </div>

          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 17,
              color: theme.colors.inkMuted,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            প্রতিটি বিক্রয়ে কেটে নেওয়া হয় কষ্টের অর্জিত লাভের বড় অংশ
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "6px 16px",
              borderRadius: 9999,
              backgroundColor: "#FFF1F2",
              color: theme.colors.alertRed,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: theme.fonts.bengali,
            }}
          >
            ❌ বাড়তি খরচের বোঝা
          </div>
        </div>

        {/* Card 2: 7 - 15 Days Withdrawal Wait */}
        <div
          style={{
            width: 380,
            height: 480,
            borderRadius: 26,
            backgroundColor: "#FFFFFF",
            border: `2px solid ${theme.colors.cardBorderSubtle}`,
            boxShadow: theme.colors.cardShadow,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${(1 - card2Enter) * 50}px) scale(${card2Enter})`,
            opacity: card2Enter,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Clock size={36} color="#D97706" />
          </div>

          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 24,
              fontWeight: 700,
              color: theme.colors.inkNavy,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            টাকা তোলার দীর্ঘ অপেক্ষা
          </div>

          <div
            style={{
              fontFamily: theme.fonts.latin,
              fontSize: 34,
              fontWeight: 800,
              color: "#D97706",
              marginBottom: 16,
            }}
          >
            7 - 15 Days
          </div>

          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 17,
              color: theme.colors.inkMuted,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            ক্যাশ ফ্লো আটকে থাকায় নতুন স্টক ও ব্যবসায় টানাপোড়েন
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "6px 16px",
              borderRadius: 9999,
              backgroundColor: "#FFFBEB",
              color: "#B45309",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: theme.fonts.bengali,
            }}
          >
            ⏳ ক্যাশ ফ্লো সংকট
          </div>
        </div>

        {/* Card 3: Complex Trade License Requirement */}
        <div
          style={{
            width: 380,
            height: 480,
            borderRadius: 26,
            backgroundColor: "#FFFFFF",
            border: `2px solid ${theme.colors.cardBorderSubtle}`,
            boxShadow: theme.colors.cardShadow,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${(1 - card3Enter) * 50}px) scale(${card3Enter})`,
            opacity: card3Enter,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <FileX size={36} color="#475569" />
          </div>

          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 24,
              fontWeight: 700,
              color: theme.colors.inkNavy,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            জটিল ট্রেড লাইসেন্স
          </div>

          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 28,
              fontWeight: 700,
              color: "#475569",
              marginBottom: 16,
            }}
          >
            কাগজপত্রের ঝামেলা
          </div>

          <div
            style={{
              fontFamily: theme.fonts.bengali,
              fontSize: 17,
              color: theme.colors.inkMuted,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            অনলাইন ও সোশ্যাল মিডিয়া উদ্যোক্তাদের জন্য কঠিন শর্তাবলি
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "6px 16px",
              borderRadius: 9999,
              backgroundColor: "#F8FAFC",
              color: "#64748B",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: theme.fonts.bengali,
            }}
          >
            🚫 অনুমোদনের দীর্ঘসূত্রিতা
          </div>
        </div>
      </div>

      {/* Realistic Navigator Avatar Cursor */}
      <NavigatorCursor
        x={avatarX}
        y={avatarY}
        isClicking={isClicking}
        label={activeLabel}
      />
    </div>
  );
};
