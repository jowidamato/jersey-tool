import React, { useState } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  type ObjectTarget,
  MotionValue,
  type Easing,
} from "framer-motion";

import ShapeGlow from "./ShapeGlow";

type Preset = {
  baseColor: string;
  url: string;
  sport:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
};

const DEFAULT_PRESET: Preset[] = [
  {
    baseColor: "#A50044",
    url: "/jerseys/football/1.svg",
    sport: "football",
  },
  {
    baseColor: "#FDB927",
    url: "/jerseys/basket/2.svg",
    sport: "basketball",
  },
  {
    baseColor: "#1D2951",
    url: "/jerseys/football/4.svg",
    sport: "football",
  },
  {
    baseColor: "#FFD700",
    url: "/jerseys/hockey/1.svg",
    sport: "hockey",
  },
  {
    baseColor: "#F7B5D0",
    url: "/jerseys/football/5.svg",
    sport: "football",
  },
];

function norm360(v: number) {
  const n = v % 360;
  return n < 0 ? n + 360 : n;
}
function crossedForward(prev: number, curr: number, target: number) {
  const p = norm360(prev),
    c = norm360(curr);
  if (p <= c) return p < target && c >= target;
  return p < target || c >= target; // wrap case (e.g., 359->2)
}

const SNAP_EPSILON = 0.5;

export default function AnimatedSvgJersey({
  width = 160,
  height = 160,
  flipSec = 0.7, // time for 0→180 and 180→360
  dwellSec = 1.5, // pause at 0° and 180°
  zoomMin = 0.85, // jersey pinch at 90°/270°
  perspective = 900,
  autoPlay = true, // default autoplay; can be controlled by parent (e.g. hover)
  preset = DEFAULT_PRESET,
}: {
  width?: number;
  height?: number;
  flipSec?: number;
  dwellSec?: number;
  zoomMin?: number;
  perspective?: number;
  autoPlay?: boolean;
  preset?: Preset[];
}) {
  const [isInteracting, setIsInteracting] = useState(false);
  const shouldAnimate = autoPlay || isInteracting;

  // two faces with their own preset indices

  const [frontIdx, setFrontIdx] = React.useState(0);
  const [backIdx, setBackIdx] = React.useState(1);
  const frontRef = React.useRef(frontIdx);
  React.useEffect(() => {
    frontRef.current = frontIdx;
  }, [frontIdx]);
  const backRef = React.useRef(backIdx);
  React.useEffect(() => {
    backRef.current = backIdx;
  }, [backIdx]);

  const rotY = useMotionValue(0);

  // Jersey scale: subtle pinch mid-flip
  const jerseyScale = useTransform(
    rotY,
    [0, 90, 180, 270, 360],
    [1, zoomMin, 1, zoomMin, 1],
  );

  // --- Glow opacity mappings (gradual fade to 0 during flips)
  // Front glow: full at 0°→ fades to 0 by 90°; stays 0 near 180°; fades back in by 360°.
  const frontGlowOpacity = useTransform(
    rotY,
    [0, 60, 90, 150, 180, 240, 270, 300, 360],
    [0.55, 0.38, 0.0, 0.0, 0.0, 0.0, 0.0, 0.38, 0.55],
  );
  // Back glow: full at 180° → fades to 0 by 270°; 0 near 0°; fades in by 180°.
  const backGlowOpacity = useTransform(
    rotY,
    [0, 60, 90, 150, 180, 210, 240, 270, 300, 360],
    [0.0, 0.0, 0.0, 0.28, 0.55, 0.48, 0.28, 0.0, 0.0, 0.0],
  );

  // Flip + dwell keyframes; swap hidden face at edge-on
  React.useEffect(() => {
    const current = norm360(rotY.get());
    let prev = current;

    const handleUpdate = (v: number) => {
      if (crossedForward(prev, v, 90)) {
        // front is hidden; update it to next after back
        setFrontIdx((backRef.current + 1) % preset.length);
      }
      if (crossedForward(prev, v, 270)) {
        // back is hidden; update it to next after front
        setBackIdx((frontRef.current + 1) % preset.length);
      }
      prev = v;
    };

    if (shouldAnimate) {
      const start = current;
      const total = 2 * dwellSec + 2 * flipSec;
      const keyframes = [
        start,
        start,
        start + 180,
        start + 180,
        start + 360,
      ] as ObjectTarget<MotionValue<number>>;
      const times = [
        0,
        dwellSec / total,
        (dwellSec + flipSec) / total,
        (dwellSec + flipSec + dwellSec) / total,
        1,
      ];
      const ease = ["linear", "easeInOut", "linear", "easeInOut"] as Easing[];

      const controls = animate(rotY, keyframes, {
        duration: total,
        times,
        ease,
        repeat: Infinity,
        onUpdate: handleUpdate,
      });

      return () => controls.stop();
    }

    // When animation is disabled, complete the current flip so we don't stop edge-on.
    const atFront = current <= SNAP_EPSILON || current >= 360 - SNAP_EPSILON;
    const atBack = Math.abs(current - 180) <= SNAP_EPSILON;
    if (atFront || atBack) return;

    const target = current < 180 ? 180 : 360;
    const remaining = target - current;
    const duration = Math.max(0.01, flipSec * (remaining / 180));

    const settleControls = animate(rotY, target, {
      duration,
      ease: "easeInOut",
      onUpdate: handleUpdate,
      onComplete: () => {
        if (target >= 360 - SNAP_EPSILON) rotY.set(0);
      },
    });

    return () => settleControls.stop();
  }, [flipSec, dwellSec, rotY, shouldAnimate, preset]);

  // Colors for each face’s glow (pull from the *visible* face’s palette)
  const frontPreset = preset[frontIdx];
  const backPreset = preset[backIdx];
  const frontColors = {
    c1: frontPreset.baseColor,
    c2: frontPreset.baseColor,
    c3: frontPreset.baseColor,
  };
  const backColors = {
    c1: backPreset.baseColor,
    c2: backPreset.baseColor,
    c3: backPreset.baseColor,
  };

  // 3D container styles
  const outerStyle: React.CSSProperties = {
    width,
    height,
    perspective,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };
  const innerStyle: React.CSSProperties = {
    width,
    height,
    position: "relative",
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    willChange: "transform",
  };
  const faceStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: "translateZ(0)",
  };

  return (
    <div
      style={outerStyle}
      className="select-none"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
    >
      <motion.div style={{ ...innerStyle, rotateY: rotY, scale: jerseyScale }}>
        {/* FRONT FACE (visible at 0°/360°) */}
        <div style={faceStyle}>
          <div style={{ position: "relative", width, height }}>
            <ShapeGlow
              sport={frontPreset.sport}
              w={width}
              h={height}
              colors={frontColors}
              opacity={frontGlowOpacity}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={frontPreset.url}
                alt="Front Jersey"
                style={{ width: width, height: height }}
              />
            </div>
          </div>
        </div>

        {/* BACK FACE (visible at 180°) */}
        <div
          style={{ ...faceStyle, transform: "rotateY(180deg) translateZ(0)" }}
        >
          <div style={{ position: "relative", width, height }}>
            <ShapeGlow
              sport={backPreset.sport}
              w={width}
              h={height}
              colors={backColors}
              opacity={backGlowOpacity}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={backPreset.url}
                alt="Back Jersey"
                style={{ width: width, height: height }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
