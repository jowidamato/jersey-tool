import Base from "@/components/Jersey/base";
import type { JerseyColorState } from "@/types/types";
import { toBaseProps } from "@/utils/utils";

export function Preview({
  config,
  setSvgRef,
  size,
  variant = "football",
}: {
  config: JerseyColorState;
  setSvgRef?: React.Ref<SVGSVGElement>;
  size?: "small" | "xsmall" | "medium" | "large";
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
  const baseProps = toBaseProps(config, variant);
  const previewProps =
    variant === "american-football"
      ? {
          baseColor: config.theme.primary ?? "#274FD1",
          neckCircleColor: config.theme.secondary ?? "#9D7D2D",
          customOverlays: config.customOverlays,
        }
      : variant === "formula-1"
        ? {
            baseColor: config.theme.primary ?? "#274FD1",
            neckCircleColor: config.neckCircleColor.enabled
              ? config.neckCircleColor.value
              : undefined,
            customOverlays: config.customOverlays,
          }
        : baseProps;

  return (
    <div className="flex flex-col items-center gap-4 ">
      <Base
        {...previewProps}
        stripesPreset={config.stripesPreset}
        horizontalStripesPreset={config.horizontalStripesPreset}
        customShapePreset={config.customShapePreset}
        sideStripePreset={config.sideStripePreset}
        svgRef={setSvgRef}
        size={size}
        variant={variant}
      />
    </div>
  );
}
