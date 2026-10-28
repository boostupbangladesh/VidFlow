import { loadFont } from "@remotion/google-fonts/HindSiliguri";

// Load Google Font Hind Siliguri for authentic Bengali typography
export const hindSiliguri = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
});

export const theme = {
  colors: {
    // Stage Silver-Blue (GetCommerce authentic)
    bgSilver: "#E6ECF5",
    bgSilverMid: "#DCE5F1",
    bgSilverDark: "#CAD6E4",
    bgWaveLight: "rgba(255, 255, 255, 0.55)",
    bgWaveDark: "rgba(180, 195, 215, 0.35)",

    // Typography (High-contrast Deep Corporate Navy)
    inkNavy: "#0F2851",
    inkNavyBody: "#1E3A5F",
    inkNavyLight: "#334E68",
    inkMuted: "#627D98",
    inkWhite: "#FFFFFF",
    inkDark: "#0F2851",

    // Brand Accents
    brandOrange: "#FA5A00",
    brandOrangeLight: "#FF7824",
    brandOrangeGlow: "rgba(250, 90, 0, 0.28)",
    brandPurple: "#7C3AED",
    brandPurpleGlow: "rgba(124, 58, 237, 0.24)",

    // Functional Accents
    accentGreen: "#10B981",
    accentGreenLight: "#D1FAE5",
    accentGreenBorder: "#34D399",
    alertRed: "#EF4444",
    alertRedLight: "#FEE2E2",
    alertRedBorder: "#F87171",

    // Legacy compatibility tokens
    baseDark: "#0B051A",

    // UI Glass & Borders
    cardBg: "rgba(255, 255, 255, 0.88)",
    cardBgGlass: "rgba(255, 255, 255, 0.72)",
    cardBorder: "rgba(255, 255, 255, 0.95)",
    cardBorderSubtle: "rgba(203, 213, 225, 0.6)",
    cardShadow: "0 24px 64px rgba(15, 40, 81, 0.12), 0 6px 20px rgba(15, 40, 81, 0.06)",
    cardShadowHeavy: "0 36px 90px rgba(15, 40, 81, 0.18), 0 12px 32px rgba(15, 40, 81, 0.08)",
  },

  fonts: {
    bengali: `${hindSiliguri.fontFamily}, 'Hind Siliguri', sans-serif`,
    latin: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: `${hindSiliguri.fontFamily}, 'Hind Siliguri', sans-serif`,
    body: `${hindSiliguri.fontFamily}, 'Hind Siliguri', sans-serif`,
  },
};

export const colors = theme.colors;
export const fonts = theme.fonts;
export const gradients = {
  royalTwilight: "linear-gradient(135deg, #160C2C 0%, #0B051A 100%)",
  violetSunset: "linear-gradient(135deg, #7C3AED 0%, #BE185D 100%)",
  solarOrange: "linear-gradient(135deg, #FF6B00 0%, #FFA500 100%)",
  goldShine: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  brandKeyword: "linear-gradient(135deg, #FF6B00 0%, #FFA500 100%)",
  keyword: "linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)",
};
