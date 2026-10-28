import React from "react";
import { colors, fonts } from "../theme";

export const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  active?: boolean;
  padding?: number | string;
  radius?: number;
  variant?: "dark" | "white";
}> = ({
  children,
  style,
  active = false,
  padding = 36,
  radius = 28,
  variant = "dark",
}) => {
  const isDark = variant === "dark";

  return (
    <div
      style={{
        position: "relative",
        background: isDark
          ? "rgba(24, 13, 46, 0.78)"
          : "rgba(255, 255, 255, 0.98)",
        borderRadius: radius,
        border: active
          ? "2px solid rgba(168, 85, 247, 0.8)"
          : isDark
          ? "1.5px solid rgba(255, 255, 255, 0.14)"
          : "1.5px solid rgba(255, 255, 255, 0.6)",
        boxShadow: active
          ? "0 24px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(124, 58, 237, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)"
          : isDark
          ? "0 24px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.16)"
          : "0 24px 60px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.12)",
        padding,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        color: isDark ? colors.inkWhite : colors.inkDark,
        ...style,
      }}
    >
      {/* Specular top highlight shimmer line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 30,
          right: 30,
          height: 1.5,
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};

export const GlassPill: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "brand" | "orange" | "danger" | "success" | "neutral";
  style?: React.CSSProperties;
}> = ({ children, icon, variant = "brand", style }) => {
  const isBrand = variant === "brand";
  const isOrange = variant === "orange";
  const isDanger = variant === "danger";
  const isSuccess = variant === "success";

  const bg = isBrand
    ? "linear-gradient(135deg, rgba(124, 58, 237, 0.85) 0%, rgba(168, 85, 247, 0.85) 100%)"
    : isOrange
    ? "linear-gradient(135deg, rgba(255, 107, 0, 0.85) 0%, rgba(249, 115, 22, 0.85) 100%)"
    : isDanger
    ? "rgba(239, 68, 68, 0.22)"
    : isSuccess
    ? "rgba(16, 185, 129, 0.22)"
    : "rgba(255, 255, 255, 0.12)";

  const textColor = isDanger
    ? "#FCA5A5"
    : isSuccess
    ? "#6EE7B7"
    : "#FFFFFF";

  const borderColor = isBrand
    ? "rgba(255, 255, 255, 0.35)"
    : isOrange
    ? "rgba(255, 255, 255, 0.35)"
    : isDanger
    ? "rgba(239, 68, 68, 0.4)"
    : isSuccess
    ? "rgba(16, 185, 129, 0.4)"
    : "rgba(255, 255, 255, 0.2)";

  const shadow = isBrand
    ? "0 8px 24px rgba(124, 58, 237, 0.45)"
    : isOrange
    ? "0 8px 24px rgba(255, 107, 0, 0.45)"
    : isDanger
    ? "0 8px 20px rgba(239, 68, 68, 0.3)"
    : isSuccess
    ? "0 8px 20px rgba(16, 185, 129, 0.3)"
    : "0 6px 18px rgba(0, 0, 0, 0.3)";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 24px",
        borderRadius: 9999,
        background: bg,
        border: `1.5px solid ${borderColor}`,
        boxShadow: shadow,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: 24,
        color: textColor,
        ...style,
      }}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
