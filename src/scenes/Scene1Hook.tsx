import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AlertCircle, FileCheck, Smartphone } from "lucide-react";
import { theme } from "../theme";
import { NavigatorCursor } from "../components/NavigatorCursor";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous camera drift so the scene never feels frozen
  const sceneDrift = interpolate(frame, [0, 216], [0, -18], {
    extrapolateRight: "clamp",
  });
  const cameraScale = interpolate(frame, [0, 216], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  // Smooth exit transition into Scene 2
  const exitOpacity = interpolate(frame, [195, 216], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Springs for 3 cards
  const enterLeft = spring({ frame: frame - 6, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const enterCenter = spring({ frame: frame - 16, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });
  const enterRight = spring({ frame: frame - 26, fps, config: { damping: 18, mass: 0.8, stiffness: 100 } });

  // Navigator Avatar path: glides from bottom-center to below the center card
  const avatarX = interpolate(frame, [25, 75], [960, 960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const avatarY = interpolate(frame, [25, 75], [1150, 785], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const avatarEnter = spring({ frame: frame - 20, fps, config: { damping: 16, mass: 0.7, stiffness: 110 } });

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
            color: theme.colors.brandOrange,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          ই-কমার্স পেমেন্ট চ্যালেঞ্জ
        </div>
        <div
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: theme.colors.inkNavy,
            lineHeight: 1.25,
          }}
        >
          প্রতিটি অর্ডারে বিকাশ বা নগদের ট্রানজেকশন মেলানো?
        </div>
      </div>

      {/* 3 Frosted Glass Cards (GetCommerce frame 004 style) */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          perspective: 1400,
        }}
      >
        {/* Left Card: Payment Issues */}
        <div
          style={{
            width: 360,
            height: 480,
            borderRadius: 24,
            backgroundColor: theme.colors.cardBg,
            border: `2px solid ${theme.colors.cardBorder}`,
            boxShadow: theme.colors.cardShadow,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `rotateY(16deg) scale(${enterLeft})`,
            opacity: enterLeft,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
              fontFamily: theme.fonts.bengali,
              fontSize: 18,
              fontWeight: 700,
              color: theme.colors.alertRed,
              marginBottom: 36,
            }}
          >
            <AlertCircle size={22} color={theme.colors.alertRed} />
            <span>পেমেন্ট সংক্রান্ত সমস্যা</span>
          </div>

          <div
            style={{
              width: 140,
              height: 180,
              borderRadius: 16,
              backgroundColor: "#FFF5F0",
              border: `2px dashed ${theme.colors.brandOrangeLight}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <Smartphone size={56} color={theme.colors.brandOrange} />
            <span
              style={{
                fontFamily: theme.fonts.latin,
                fontSize: 13,
                fontWeight: 700,
                color: theme.colors.inkNavy,
              }}
            >
              bKash / Nagad
            </span>
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
            কাস্টমারের পাঠানো TrxID ইনবক্সে খুঁজে বের করা
          </div>
        </div>

        {/* Center Hero Card: Payment Management (Target of Navigator Cursor) */}
        <div
          style={{
            width: 440,
            height: 540,
            borderRadius: 28,
            backgroundColor: "#FFFFFF",
            border: `3px solid rgba(255, 255, 255, 0.98)`,
            boxShadow: theme.colors.cardShadowHeavy,
            padding: "32px 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${enterCenter})`,
            opacity: enterCenter,
            position: "relative",
            zIndex: 5,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              alignSelf: "flex-start",
              fontFamily: theme.fonts.bengali,
              fontSize: 22,
              fontWeight: 700,
              color: theme.colors.alertRed,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: theme.colors.alertRed,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              !
            </div>
            <span>পেমেন্ট ম্যানেজমেন্ট</span>
          </div>

          {/* Smartphone Mockup with Real bKash SMS */}
          <div
            style={{
              width: 320,
              height: 330,
              borderRadius: 20,
              backgroundColor: "#F8FAFC",
              border: `2px solid #E2E8F0`,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 10px 25px rgba(15, 40, 81, 0.08)",
            }}
          >
            <div
              style={{
                height: 38,
                backgroundColor: "#0F172A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94A3B8",
                fontSize: 12,
                fontFamily: theme.fonts.latin,
              }}
            >
              Incoming SMS Verification
            </div>
            <Img
              src={staticFile("assets/bkash_sms.png")}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 18,
              fontFamily: theme.fonts.bengali,
              fontSize: 18,
              fontWeight: 600,
              color: theme.colors.inkNavy,
              textAlign: "center",
            }}
          >
            প্রতিটি এসএমএস ম্যানুয়ালি যাচাইয়ের বাড়তি ঝামেলা
          </div>
        </div>

        {/* Right Card: Delayed Orders */}
        <div
          style={{
            width: 360,
            height: 480,
            borderRadius: 24,
            backgroundColor: theme.colors.cardBg,
            border: `2px solid ${theme.colors.cardBorder}`,
            boxShadow: theme.colors.cardShadow,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `rotateY(-16deg) scale(${enterRight})`,
            opacity: enterRight,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
              fontFamily: theme.fonts.bengali,
              fontSize: 18,
              fontWeight: 700,
              color: theme.colors.alertRed,
              marginBottom: 36,
            }}
          >
            <AlertCircle size={22} color={theme.colors.alertRed} />
            <span>অর্ডারে বিলম্ব ও মিসম্যাচ</span>
          </div>

          <div
            style={{
              width: 140,
              height: 180,
              borderRadius: 16,
              backgroundColor: "#FFF5F0",
              border: `2px dashed ${theme.colors.brandOrangeLight}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <FileCheck size={56} color={theme.colors.brandOrange} />
            <span
              style={{
                fontFamily: theme.fonts.latin,
                fontSize: 13,
                fontWeight: 700,
                color: theme.colors.inkNavy,
              }}
            >
              Order Status
            </span>
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
            দেরিতে কনফার্মেশন ও কাস্টমার অসন্তোষের ঝুঁকি
          </div>
        </div>
      </div>

      {/* Realistic Navigator Avatar Cursor (Gliding into the scene) */}
      <NavigatorCursor
        x={avatarX}
        y={avatarY}
        opacity={avatarEnter}
        label="ম্যানুয়াল ভোগান্তি ⚠️"
      />
    </div>
  );
};
