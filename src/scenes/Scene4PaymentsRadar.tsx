import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CheckCircle, Radio, ShieldCheck } from "lucide-react";
import { theme } from "../theme";
import { NavigatorCursor } from "../components/NavigatorCursor";

export const Scene4PaymentsRadar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous subtle drift to prevent freezing
  const sceneDrift = interpolate(frame, [0, 396], [0, -18], {
    extrapolateRight: "clamp",
  });
  const cameraScale = interpolate(frame, [0, 396], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  // Smooth exit transition into Scene 5
  const exitOpacity = interpolate(frame, [376, 396], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase transition (frame 198)
  const isPhase2 = frame >= 198;
  const phase1Fade = interpolate(frame, [185, 205], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phase2Fade = interpolate(frame, [198, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 1 Entrances
  const p1Left = spring({ frame: frame - 10, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const p1Right = spring({ frame: frame - 25, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });

  // Phase 2 Entrances
  const p2Left = spring({ frame: frame - 205, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const p2Right = spring({ frame: frame - 220, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });

  // 5-second countdown timer for Phase 2
  const countdownTime = Math.max(
    0,
    5.0 - ((frame - 200) / fps) * 1.5
  ).toFixed(2);

  // Auto Confirmed Stamp pop (frame 290)
  const stampSpring = spring({
    frame: frame - 280,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  // Navigator Avatar paths
  let avatarX = 960;
  let avatarY = 540;
  let isClicking = false;
  let avatarLabel = "সরাসরি সিম ডিপোজিট 📲";

  if (!isPhase2) {
    avatarX = interpolate(frame, [20, 80], [1200, 720], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    avatarY = interpolate(frame, [20, 80], [700, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    isClicking = frame >= 75 && frame <= 88;
    avatarLabel = "সরাসরি সিম ডিপোজিট 📲";
  } else {
    avatarX = interpolate(frame, [210, 275], [720, 1360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    avatarY = interpolate(frame, [210, 275], [520, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    isClicking = frame >= 275 && frame <= 290;
    avatarLabel = frame >= 280 ? "অটো কনফার্মড! 🎉" : "লাইভ রাডার ম্যাচিং ⚡";
  }

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
      {/* Top Persistent Headline in Hind Siliguri */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.fonts.bengali,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: theme.colors.brandOrange,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {isPhase2 ? "লাইভ রাডার ট্র্যাকিং" : "মাল্টি-চ্যানেল পেমেন্ট গেটওয়ে"}
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: theme.colors.inkNavy,
          }}
        >
          {isPhase2
            ? "মাত্র ৫ সেকেন্ডে লাইভ রাডারে ট্রানজেকশন ম্যাচ ও অর্ডার কনফার্ম"
            : "বিকাশ, নগদ, রকেট সহ সব মাধ্যমে টাকা সরাসরি আপনার সিমে"}
        </div>
      </div>

      {/* PHASE 1: Checkout Mockup + Direct SIM Deposit */}
      {frame < 210 && (
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 100,
            right: 100,
            bottom: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: phase1Fade,
          }}
        >
          {/* Left: 3D Checkout Viewport */}
          <div
            style={{
              width: 820,
              height: 560,
              borderRadius: 24,
              backgroundColor: "#FFFFFF",
              border: `2px solid ${theme.colors.cardBorder}`,
              boxShadow: theme.colors.cardShadowHeavy,
              overflow: "hidden",
              perspective: 1200,
              transform: `rotateY(10deg) scale(${p1Left})`,
              opacity: p1Left,
            }}
          >
            <div
              style={{
                height: 44,
                backgroundColor: "#F8FAFC",
                borderBottom: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                gap: 8,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
              <span
                style={{
                  marginLeft: 16,
                  fontFamily: theme.fonts.latin,
                  fontSize: 13,
                  color: "#64748B",
                }}
              >
                https://pay.zapy.bd/checkout
              </span>
            </div>
            <Img
              src={staticFile("assets/zpay_checkout_page.png")}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {/* Right: Direct SIM Deposit Feature Card */}
          <div
            style={{
              width: 680,
              borderRadius: 26,
              backgroundColor: "#FFFFFF",
              border: `2px solid ${theme.colors.cardBorderSubtle}`,
              boxShadow: theme.colors.cardShadow,
              padding: 40,
              transform: `scale(${p1Right})`,
              opacity: p1Right,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 9999,
                backgroundColor: "#ECFDF5",
                color: theme.colors.accentGreen,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: theme.fonts.bengali,
                marginBottom: 20,
              }}
            >
              <ShieldCheck size={20} color={theme.colors.accentGreen} />
              <span>জিরো মধ্যস্বত্বভোগী • ১০০% নিরাপদ</span>
            </div>

            <div
              style={{
                fontFamily: theme.fonts.bengali,
                fontSize: 32,
                fontWeight: 700,
                color: theme.colors.inkNavy,
                lineHeight: 1.3,
                marginBottom: 16,
              }}
            >
              সরাসরি আপনার নিজস্ব পার্সোনাল বা মার্চেন্ট সিমে টাকা জমা
            </div>

            <div
              style={{
                fontFamily: theme.fonts.bengali,
                fontSize: 18,
                color: theme.colors.inkMuted,
                lineHeight: 1.6,
                marginBottom: 28,
              }}
            >
              কোনো তৃতীয় পক্ষের ওয়ালেটে টাকা আটকে থাকবে না। কাস্টমার পে করার সাথে সাথেই তা জমা হবে আপনার সিমে।
            </div>

            {/* Supported MFS Badges */}
            <div style={{ display: "flex", gap: 14 }}>
              {["bKash", "Nagad", "Rocket", "Bangla QR"].map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    padding: "12px 10px",
                    borderRadius: 14,
                    backgroundColor: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    textAlign: "center",
                    fontFamily: theme.fonts.latin,
                    fontSize: 16,
                    fontWeight: 700,
                    color: theme.colors.inkNavy,
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Live Radar Mobile App + Transactions Table + 5s Auto Confirmed */}
      {frame >= 195 && (
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 100,
            right: 100,
            bottom: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: phase2Fade,
          }}
        >
          {/* Left: Live Radar Mobile App Mockup */}
          <div
            style={{
              width: 440,
              height: 580,
              borderRadius: 36,
              backgroundColor: "#0F172A",
              border: "6px solid #334155",
              boxShadow: theme.colors.cardShadowHeavy,
              overflow: "hidden",
              position: "relative",
              transform: `scale(${p2Left})`,
              opacity: p2Left,
            }}
          >
            {/* Top Phone Speaker Pill */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 90,
                height: 12,
                borderRadius: 9999,
                backgroundColor: "#1E293B",
                zIndex: 20,
              }}
            />

            {/* Mobile App Screen */}
            <Img
              src={staticFile("assets/zpay_mobile_app.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Digital Countdown Gauge Floating Tag */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 20,
                right: 20,
                backgroundColor: "rgba(15, 23, 42, 0.92)",
                backdropFilter: "blur(12px)",
                border: `1.5px solid ${theme.colors.brandOrange}`,
                borderRadius: 20,
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#FFFFFF",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Radio size={24} color={theme.colors.brandOrange} />
                <span style={{ fontFamily: theme.fonts.bengali, fontSize: 16, fontWeight: 600 }}>
                  লাইভ রাডার সক্রিয়
                </span>
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.latin,
                  fontSize: 22,
                  fontWeight: 800,
                  color: theme.colors.brandOrange,
                }}
              >
                {countdownTime}s
              </div>
            </div>
          </div>

          {/* Right: Live Merchant Transactions Table */}
          <div
            style={{
              width: 1040,
              height: 580,
              borderRadius: 24,
              backgroundColor: "#FFFFFF",
              border: `2px solid ${theme.colors.cardBorder}`,
              boxShadow: theme.colors.cardShadowHeavy,
              overflow: "hidden",
              position: "relative",
              transform: `scale(${p2Right})`,
              opacity: p2Right,
            }}
          >
            <Img
              src={staticFile("assets/merchant/merchant_transactions.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Pop-in "Auto Confirmed!" Stamp */}
            {frame >= 275 && (
              <div
                style={{
                  position: "absolute",
                  top: "22%",
                  left: "26%",
                  transform: `translate(-50%, -50%) scale(${stampSpring}) rotate(-4deg)`,
                  backgroundColor: "#FFFFFF",
                  border: `3px solid ${theme.colors.accentGreen}`,
                  borderRadius: 24,
                  padding: "18px 36px",
                  boxShadow: "0 20px 50px rgba(16, 185, 129, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  zIndex: 30,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: theme.colors.accentGreen,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle size={32} color="#FFFFFF" strokeWidth={2.5} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: theme.fonts.bengali,
                      fontSize: 26,
                      fontWeight: 800,
                      color: theme.colors.accentGreen,
                    }}
                  >
                    ম্যাচ পাওয়া গেছে • অটো কনফার্মড!
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.latin,
                      fontSize: 15,
                      fontWeight: 600,
                      color: theme.colors.inkMuted,
                    }}
                  >
                    TrxID Verified • Order Confirmed Instantly
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Realistic Navigator Avatar Cursor */}
      <NavigatorCursor
        x={avatarX}
        y={avatarY}
        isClicking={isClicking}
        label={avatarLabel}
      />
    </div>
  );
};
