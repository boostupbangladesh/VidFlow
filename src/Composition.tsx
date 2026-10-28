import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AmbientStage } from "./components/AmbientStage";
import { SoundDesign } from "./components/SoundDesign";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2PainPoints } from "./scenes/Scene2PainPoints";
import { Scene3Reveal } from "./scenes/Scene3Reveal";
import { Scene4PaymentsRadar } from "./scenes/Scene4PaymentsRadar";
import { Scene5Integration } from "./scenes/Scene5Integration";
import { Scene6CTA } from "./scenes/Scene6CTA";

export const ZPayVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#E6ECF5" }}>
      {/* Dynamic Ambient Curved Silver-Blue Stage (GetCommerce Authentic) */}
      <AmbientStage />

      {/* Primary Voiceover Track */}
      <Audio src={staticFile("voiceover.mp3")} volume={1.15} />

      {/* Background Music (Elegantly ducked under voiceover) */}
      <Audio
        src={staticFile("bgm.mp3")}
        volume={(f) => {
          if (f < 20) return (f / 20) * 0.05;
          if (f > 1700) return ((1740 - f) / 40) * 0.05;
          return 0.05;
        }}
      />

      {/* Sound Design Cues */}
      <SoundDesign />

      {/* Scene 1: Hook & Manual Checking Chaos (0 - 216 frames | 0.0s - 7.2s) */}
      <Sequence durationInFrames={216} name="Scene 1: Hook & Manual Checking">
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: Gateway Frustrations & High Fees (216 - 504 frames | 7.2s - 16.8s) */}
      <Sequence from={216} durationInFrames={288} name="Scene 2: Gateway Frustrations">
        <Scene2PainPoints />
      </Sequence>

      {/* Scene 3: Z-Pay Reveal & Smart Dashboard (504 - 768 frames | 16.8s - 25.6s) */}
      <Sequence from={504} durationInFrames={264} name="Scene 3: Smart Dashboard Reveal">
        <Scene3Reveal />
      </Sequence>

      {/* Scene 4: Payments & Live Radar 5s Matching (768 - 1164 frames | 25.6s - 38.8s) */}
      <Sequence from={768} durationInFrames={396} name="Scene 4: Payments & Live Radar">
        <Scene4PaymentsRadar />
      </Sequence>

      {/* Scene 5: Zero Paperwork & Integrations (1164 - 1554 frames | 38.8s - 51.8s) */}
      <Sequence from={1164} durationInFrames={390} name="Scene 5: Integrations & API">
        <Scene5Integration />
      </Sequence>

      {/* Scene 6: Automation Hero & Search Pill CTA (1554 - 1740 frames | 51.8s - 58.0s) */}
      <Sequence from={1554} durationInFrames={186} name="Scene 6: Automation & Search CTA">
        <Scene6CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
