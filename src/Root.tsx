import React from "react";
import { Composition } from "remotion";
import { ZPayVideo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ZPayPromo"
        component={ZPayVideo}
        durationInFrames={1740}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
