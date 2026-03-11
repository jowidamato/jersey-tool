import Base from "@/components/Jersey/base";
import { useJerseyColors } from "@/context/JerseyContext";
import Setting from "./Settings/Setting";
import { darken } from "@/utils/colorFunctions";
import { useEffect, useState } from "react";
import { ShirtText } from "./ShirtText";
import { CustomOverlay } from "./CustomOverlay";
import { Settings } from "./Settings";
import { NameColors } from "./NameColors";

export function Content({
  variant = "football",
}: {
  variant?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
}) {
  const { state, effective, setColor, setFootballBack, setCustomOverlay } =
    useJerseyColors();
  const [isOverlayOpen, setIsOverlayOpen] = useState(
    state.customOverlays.length > 0,
  );

  useEffect(() => {
    if (
      variant !== "formula-1" ||
      !state.neckCircleColor.enabled ||
      state.neckCircleColor.value
    ) {
      return;
    }

    setColor(
      "neckCircleColor",
      darken(effective("baseColor") ?? state.theme.primary ?? "#FFFFFF", 0.2),
    );
  }, [
    variant,
    state.neckCircleColor.enabled,
    state.neckCircleColor.value,
    state.theme.primary,
    effective,
    setColor,
  ]);

  useEffect(() => {
    if (state.customOverlays.length > 0) {
      setIsOverlayOpen(true);
    }
  }, [state.customOverlays.length]);

  const needsMainColors =
    variant === "formula-1"
      ? !state.theme.primary
      : !(state.theme.primary && state.theme.secondary && state.theme.tertiary);
  // True once both colors are entered — collapse to compact view

  return (
    <div className="flex flex-col gap-4">
      <NameColors variant={variant} />
      <Settings variant={variant} />
      {variant === "football" ||
      variant === "basketball" ||
      variant === "hockey" ||
      variant === "baseball" ||
      variant === "rugby" ||
      variant === "handball" ? (
        <Setting
          label="Name & Number"
          keys={[]}
          isSelected={state.footballBackEnabled}
          isDisabled={needsMainColors}
          onSelectedChange={(checked) => {
            if (checked) {
              setFootballBack(true);
              return;
            }
            setFootballBack(false);
          }}
          icon={
            <Base
              size="xsmall"
              variant={variant}
              footballBackEnabled
              footballBackName={
                variant === "basketball"
                  ? "JAMES"
                  : variant === "hockey"
                    ? "MATTHEWS"
                    : "PLAYER"
              }
              footballBackNumber={variant === "basketball" ? "23" : "10"}
              footballBackTextOutlineEnabled
              footballBackTextOutlineColor="#000000"
              footballBackTextOutlineWidth={2}
              footballBackNameCurveAmount={0}
              footballBackNameSize={4}
              footballBackNumberSize={16}
              footballBackNameY={variant === "basketball" ? 13.5 : 11}
              footballBackNumberY={variant === "basketball" ? 25.5 : 21}
              footballBackFontWeight={700}
              footballBackTextColor="#111111"
            />
          }
        >
          <ShirtText variant={variant} />
        </Setting>
      ) : null}

      <Setting
        label="Custom Overlay"
        keys={[]}
        isSelected={isOverlayOpen || state.customOverlays.length > 0}
        isDisabled={needsMainColors}
        onSelectedChange={(checked) => {
          if (needsMainColors) return;
          if (checked) {
            setIsOverlayOpen(true);
            return;
          }
          setIsOverlayOpen(false);
          setCustomOverlay(false, undefined, undefined);
        }}
        icon={
          <div className="relative grid place-items-center h-10 w-10">
            <Base size="xsmall" variant={variant} />
            <span className="absolute -bottom-1 -right-1 text-[8px] px-1 rounded bg-black text-white">
              SVG
            </span>
          </div>
        }
      >
        <CustomOverlay />
      </Setting>
    </div>
  );
}
