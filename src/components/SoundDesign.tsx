import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

export const SFX_ENABLED = true;

type Cue = {
  frame: number;
  sfx: "whoosh" | "switch" | "ding" | "mouse-click" | "whip";
  volume: number;
  name: string;
};

// Precisely placed cues based on scene transitions and visual pops
const CUES: Cue[] = [
  // Scene 1: Hook & Manual Check (0 - 216)
  { frame: 12, sfx: "whoosh", volume: 0.18, name: "Scene 1 Entrance" },
  { frame: 36, sfx: "ding", volume: 0.16, name: "bKash SMS Notification" },
  { frame: 110, sfx: "switch", volume: 0.22, name: "TrxID Magnifier Highlight" },

  // Scene 2: Gateway Frustrations (216 - 504)
  { frame: 220, sfx: "whoosh", volume: 0.2, name: "Scene 2 Entrance" },
  { frame: 255, sfx: "switch", volume: 0.22, name: "Fee Deduction Card" },
  { frame: 340, sfx: "switch", volume: 0.22, name: "Withdrawal Wait Card" },
  { frame: 425, sfx: "switch", volume: 0.22, name: "Trade License Card" },

  // Scene 3: Z-Pay Reveal (504 - 768)
  { frame: 510, sfx: "whoosh", volume: 0.24, name: "Pain Cleared Sweep" },
  { frame: 588, sfx: "ding", volume: 0.24, name: "Z-Pay Hero Reveal" },
  { frame: 592, sfx: "whoosh", volume: 0.2, name: "Hero Card Rise" },
  { frame: 650, sfx: "switch", volume: 0.2, name: "Feature Badges Pop" },

  // Scene 4: Payment Methods & SIM Deposit & Radar (768 - 1164)
  { frame: 772, sfx: "whoosh", volume: 0.2, name: "Scene 4 Entrance" },
  { frame: 800, sfx: "switch", volume: 0.2, name: "Checkout Mockup Entrance" },
  { frame: 880, sfx: "ding", volume: 0.24, name: "Direct SIM Deposit" },
  { frame: 970, sfx: "whoosh", volume: 0.22, name: "Live Radar Mobile App Entrance" },
  { frame: 1025, sfx: "switch", volume: 0.22, name: "Modal Details Verification" },
  { frame: 1075, sfx: "ding", volume: 0.26, name: "Auto Order Confirmed Stamp" },

  // Scene 5: Zero Paperwork & Integrations (1164 - 1554)
  { frame: 1168, sfx: "whoosh", volume: 0.2, name: "Scene 5 Entrance" },
  { frame: 1180, sfx: "switch", volume: 0.22, name: "Zero Paperwork Card" },
  { frame: 1265, sfx: "switch", volume: 0.22, name: "WordPress & API Integration" },
  { frame: 1360, sfx: "ding", volume: 0.24, name: "Instant Payment Link" },

  // Scene 6: CTA & Final (1554 - 1740)
  { frame: 1558, sfx: "whoosh", volume: 0.22, name: "Scene 6 Entrance" },
  { frame: 1570, sfx: "switch", volume: 0.22, name: "Shield Security Card" },
  { frame: 1625, sfx: "ding", volume: 0.25, name: "Grand Finale CTA Card" },
  { frame: 1675, sfx: "mouse-click", volume: 0.35, name: "Sign Up Button Click" },
];

export const SoundDesign: React.FC = () => {
  const { fps } = useVideoConfig();

  if (!SFX_ENABLED) return null;

  return (
    <>
      {CUES.map((cue, idx) => (
        <Sequence
          key={`${cue.name}-${cue.frame}-${idx}`}
          name={`SFX: ${cue.name}`}
          from={cue.frame}
          durationInFrames={45}
          premountFor={fps}
        >
          <Audio src={staticFile(`sfx/${cue.sfx}.wav`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
