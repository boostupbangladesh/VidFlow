import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Link2, ShieldCheck } from "lucide-react";
import { theme } from "../theme";
import { NavigatorCursor } from "../components/NavigatorCursor";

export const Scene5Integration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous subtle drift to prevent freezing
  const sceneDrift = interpolate(frame, [0, 390], [0, -16], {
    extrapolateRight: "clamp",
  });
  const cameraScale = interpolate(frame, [0, 390], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  // Smooth exit transition into Scene 6
  const exitOpacity = interpolate(frame, [370, 390], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Layered Window Entrances (staggered diagonal rise like GetCommerce frame 018)
  const backWindowEnter = spring({ frame: frame - 10, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const frontWindowEnter = spring({ frame: frame - 28, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const badgesEnter = spring({ frame: frame - 45, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });

  // Navigator Avatar path: moves from left across the payment link toggle to the webhook button
  const avatarX = interpolate(
    frame,
    [30, 95, 170, 240],
    [520, 1060, 1060, 1380],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const avatarY = interpolate(
    frame,
    [30, 95, 170, 240],
    [800, 620, 620, 480],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isClicking =
    (frame >= 95 && frame <= 108) ||
    (frame >= 238 && frame <= 250);

  // Toggle switch animation triggered by Navigator click at frame 95
  const toggleActive = frame >= 95;

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
            color: theme.colors.brandPurple,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          সহজ ইন্টিগ্রেশন ও ইনস্ট্যান্ট লিংক
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: theme.colors.inkNavy,
          }}
        >
          কাগজপত্র ছাড়া ওয়ার্ডপ্রেস ও এপিআই দিয়ে চালু করুন ফুল অটোমেশন
        </div>
      </div>

      {/* Layered Windows Composition (Signature GetCommerce Staggered Windows) */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 100,
          right: 100,
          bottom: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Back Window: Real Z-Pay API Key & Webhook Configuration */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 80,
            width: 1080,
            height: 520,
            borderRadius: 22,
            backgroundColor: "#FFFFFF",
            border: `2px solid ${theme.colors.cardBorderSubtle}`,
            boxShadow: theme.colors.cardShadow,
            overflow: "hidden",
            transform: `translateY(${(1 - backWindowEnter) * 60}px) scale(${backWindowEnter})`,
            opacity: backWindowEnter * 0.88,
          }}
        >
          <div
            style={{
              height: 40,
              backgroundColor: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              gap: 8,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#CBD5E1" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#CBD5E1" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#CBD5E1" }} />
            <span style={{ marginLeft: 12, fontFamily: theme.fonts.latin, fontSize: 13, color: "#64748B" }}>
              Z-Pay Developer API & Webhook Settings
            </span>
          </div>
          <Img
            src={staticFile("assets/merchant/merchant_api_keys.png")}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Front Window: Real Z-Pay Payment Links & Quick Actions */}
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 80,
            width: 1120,
            height: 530,
            borderRadius: 24,
            backgroundColor: "#FFFFFF",
            border: `3px solid rgba(255, 255, 255, 0.98)`,
            boxShadow: theme.colors.cardShadowHeavy,
            overflow: "hidden",
            transform: `translateY(${(1 - frontWindowEnter) * 70}px) scale(${frontWindowEnter})`,
            opacity: frontWindowEnter,
            zIndex: 5,
          }}
        >
          <div
            style={{
              height: 44,
              backgroundColor: "#F1F5F9",
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
                marginLeft: 14,
                fontFamily: theme.fonts.latin,
                fontSize: 14,
                fontWeight: 600,
                color: theme.colors.inkNavy,
              }}
            >
              Payment Links & Social Selling
            </span>
          </div>
          <Img
            src={staticFile("assets/merchant/merchant_payment_links.png")}
            style={{ width: "100%", height: "auto", display: "block" }}
          />

          {/* Interactive Toggle Switch Overlay (clicked by Navigator) */}
          <div
            style={{
              position: "absolute",
              top: 245,
              right: 175,
              width: 52,
              height: 28,
              borderRadius: 9999,
              backgroundColor: toggleActive ? theme.colors.accentGreen : "#CBD5E1",
              padding: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: toggleActive ? "flex-end" : "flex-start",
              boxShadow: toggleActive ? `0 0 14px ${theme.colors.accentGreen}` : "none",
              transition: "all 0.25s ease-out",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>

        {/* Floating Feature Pills at Bottom-Left */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 40,
            display: "flex",
            gap: 16,
            zIndex: 20,
            transform: `scale(${badgesEnter})`,
            opacity: badgesEnter,
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${theme.colors.accentGreen}`,
              borderRadius: 9999,
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.2)",
            }}
          >
            <ShieldCheck size={22} color={theme.colors.accentGreen} />
            <span
              style={{
                fontFamily: theme.fonts.bengali,
                fontSize: 17,
                fontWeight: 700,
                color: theme.colors.inkNavy,
              }}
            >
              ট্রেড লাইসেন্স ছাড়াই চালু
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${theme.colors.brandOrange}`,
              borderRadius: 9999,
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 8px 24px rgba(250, 90, 0, 0.2)",
            }}
          >
            <Link2 size={22} color={theme.colors.brandOrange} />
            <span
              style={{
                fontFamily: theme.fonts.bengali,
                fontSize: 17,
                fontWeight: 700,
                color: theme.colors.inkNavy,
              }}
            >
              ইনস্ট্যান্ট সোশ্যাল পেমেন্ট লিংক
            </span>
          </div>
        </div>
      </div>

      {/* Realistic Navigator Avatar Cursor */}
      <NavigatorCursor
        x={avatarX}
        y={avatarY}
        isClicking={isClicking}
        label="১-ক্লিক অটোমেশন 🚀"
      />
    </div>
  );
};
