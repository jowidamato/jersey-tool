import { KEYS } from "./config";
import {
  type JerseyFieldKey,
  type Theme,
  DEFAULT_SOURCE,
  type JerseyColorState,
  type CustomShapePreset,
  type StripeColors,
  type SideStripeColors,
  type HorizontalStripePreset,
  type SideStripePreset,
  type StripePreset,
  type SportsRadarJersey,
} from "@/types/types";
import { PathIf } from "@/components/PathIf";
import { RectIf } from "@/components/RectIf";
import { darken } from "@/utils/colorFunctions";
import { toast } from "@heroui/react";
import type { JerseyConfig } from "./jerseyConfig";
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function deriveDefault(
  field: JerseyFieldKey,
  theme: Theme,
): string | undefined {
  const which = DEFAULT_SOURCE[field];
  return theme[which];
}

export function toBaseProps(
  state: JerseyColorState,
  variant:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball" = "football",
) {
  const eff = (k: JerseyFieldKey) =>
    state[k].enabled
      ? (state[k].value ?? deriveDefault(k, state.theme))
      : undefined;
  const baseColor = eff("baseColor");
  const footballBackAutoTextSeedColor =
    state.theme.secondary ?? baseColor ?? state.theme.primary;
  const hockeySleeveDefault =
    variant === "hockey"
      ? darken(baseColor ?? state.theme.primary ?? "#FFFFFF", 0.2)
      : undefined;
  return {
    baseColor,
    rightSleeveColor:
      variant === "hockey" && state.rightSleeveColor.enabled
        ? (state.rightSleeveColor.value ?? hockeySleeveDefault)
        : eff("rightSleeveColor"),
    leftSleeveDetailColor: eff("leftSleeveDetailColor"),
    leftSleeveColor:
      variant === "hockey" && state.leftSleeveColor.enabled
        ? (state.leftSleeveColor.value ?? hockeySleeveDefault)
        : eff("leftSleeveColor"),
    rightSleeveDetailColor: eff("rightSleeveDetailColor"),
    neckCircleColor:
      variant === "formula-1" && state.neckCircleColor.enabled
        ? (state.neckCircleColor.value ??
          darken(baseColor ?? state.theme.primary ?? "#FFFFFF", 0.2))
        : eff("neckCircleColor"),
    leftNeckCircleColor: eff("leftNeckCircleColor"),
    shoulderPanelColor: eff("shoulderPanelColor"),
    stripePrimaryColor: eff("stripePrimaryColor"),
    stripeSecondaryColor: eff("stripeSecondaryColor"),
    stripeTertiaryColor:
      variant === "hockey" && state.stripeTertiaryColor.enabled
        ? (state.stripeTertiaryColor.value ??
          (eff("stripePrimaryColor")
            ? darken(eff("stripePrimaryColor")!, 0.2)
            : undefined))
        : eff("stripeTertiaryColor"),
    sleeveStripePrimaryColor: eff("sleeveStripePrimaryColor"),
    sleeveStripeSecondaryColor: eff("sleeveStripeSecondaryColor"),
    sideStripePrimaryColor: eff("sideStripePrimaryColor"),
    sideStripeSecondaryColor: eff("sideStripeSecondaryColor"),
    customOverlayEnabled: state.customOverlayEnabled,
    customOverlaySvg: state.customOverlaySvg,
    customOverlayViewBox: state.customOverlayViewBox,
    customOverlayX: state.customOverlayX,
    customOverlayY: state.customOverlayY,
    customOverlayScale: state.customOverlayScale,
    customOverlayRotation: state.customOverlayRotation,
    footballBackEnabled: state.footballBackEnabled,
    footballBackName: state.footballBackName,
    footballBackNumber: state.footballBackNumber,
    footballBackFontFamily: state.footballBackFontFamily,
    footballBackFontWeight: state.footballBackFontWeight,
    footballBackTextColor: state.footballBackTextColor,
    footballBackTextOutlineEnabled: state.footballBackTextOutlineEnabled,
    footballBackTextOutlineColor: state.footballBackTextOutlineColor,
    footballBackTextOutlineWidth: state.footballBackTextOutlineWidth,
    footballBackNameCurveAmount: state.footballBackNameCurveAmount,
    footballBackAutoTextSeedColor,
    footballBackNameSize: state.footballBackNameSize,
    footballBackNumberSize: state.footballBackNumberSize,
    footballBackNameY: state.footballBackNameY,
    footballBackNumberY: state.footballBackNumberY,
  } as const;
}

const coerce = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;

export function configToState(
  cfg: JerseyConfig | null,
  sport:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball"
    | undefined,
  name: string | null,
  id: number | null,
  sr_jersey: SportsRadarJersey | null,
): Partial<JerseyColorState> {
  const themePrimary = cfg?.primary ?? undefined;
  const themeSecondary = cfg?.secondary ?? undefined;
  const stripesPreset =
    typeof cfg?.stripesPreset === "string"
      ? (cfg!.stripesPreset as StripePreset)
      : undefined;

  const horizontalStripesPreset =
    typeof cfg?.horizontalStripesPreset === "string"
      ? (cfg!.horizontalStripesPreset as HorizontalStripePreset)
      : undefined;

  const customShapePreset =
    typeof cfg?.customShapePreset === "string"
      ? (cfg!.customShapePreset as CustomShapePreset)
      : undefined;
  const sideStripePreset =
    typeof cfg?.sideStripePreset === "string"
      ? (cfg!.sideStripePreset as SideStripePreset)
      : undefined;

  const out: Partial<JerseyColorState> = {
    name: name ?? undefined,
    sport: sport ?? undefined,
    id: id ?? undefined,
    sr_jersey: sr_jersey ?? undefined,
    stripesPreset: stripesPreset,
    horizontalStripesPreset: horizontalStripesPreset,
    customShapePreset: customShapePreset,
    sideStripePreset: sideStripePreset,
    theme: {
      primary: coerce(themePrimary),
      secondary: coerce(themeSecondary),
    },
    customOverlayEnabled: cfg?.customOverlayEnabled ?? false,
    customOverlaySvg: coerce(cfg?.customOverlaySvg),
    customOverlayViewBox: coerce(cfg?.customOverlayViewBox),
    customOverlayX: cfg?.customOverlayX ?? 0,
    customOverlayY: cfg?.customOverlayY ?? 0,
    customOverlayScale: cfg?.customOverlayScale ?? 1,
    customOverlayRotation: cfg?.customOverlayRotation ?? 0,
    footballBackEnabled: cfg?.footballBackEnabled ?? false,
    footballBackName: cfg?.footballBackName ?? "",
    footballBackNumber: cfg?.footballBackNumber ?? "",
    footballBackFontFamily: cfg?.footballBackFontFamily ?? "Barlow Condensed",
    footballBackFontWeight: cfg?.footballBackFontWeight ?? 700,
    footballBackTextColor: cfg?.footballBackTextColor ?? "",
    footballBackTextOutlineEnabled:
      cfg?.footballBackTextOutlineEnabled ?? false,
    footballBackTextOutlineColor:
      cfg?.footballBackTextOutlineColor ?? "#000000",
    footballBackTextOutlineWidth: cfg?.footballBackTextOutlineWidth ?? 2,
    footballBackNameCurveAmount:
      cfg?.footballBackNameCurveAmount ??
      (cfg?.footballBackNameCurved ? (sport === "basketball" ? 8 : 3) : 0),
    footballBackNameSize: cfg?.footballBackNameSize ?? 4,
    footballBackNumberSize: cfg?.footballBackNumberSize ?? 16,
    footballBackNameY:
      cfg?.footballBackNameY ?? (sport === "basketball" ? 13.5 : 11),
    footballBackNumberY:
      cfg?.footballBackNumberY ?? (sport === "basketball" ? 25.5 : 21),
  };

  for (const k of KEYS) {
    const v = coerce(cfg?.[k]);
    if (v !== undefined) {
      out[k] = { value: v, enabled: true }; // only set if DB has a value
    }
  }
  return out;
}
export function renderStripePreset(
  preset: StripePreset,
  { stripePrimaryColor, stripeSecondaryColor }: StripeColors,
  variant:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "baseball"
    | "rugby"
    | "handball" = "football",
) {
  if (variant === "basketball") {
    switch (preset) {
      case "defaultVertical":
        return (
          <>
            <RectIf
              x="0"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="11"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="22"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "defaultVerticalCenterAlt":
        return (
          <>
            <RectIf
              x="0"
              y="2"
              width="6"
              height="37"
              fill={stripeSecondaryColor}
            />
            <RectIf
              x="11"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="22"
              y="2"
              width="6"
              height="37"
              fill={stripeSecondaryColor}
            />
          </>
        );
      case "verticalThinFull":
        return (
          <>
            <RectIf
              x="24.5"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="22"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="19.5"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="17"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="14.5"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="12"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="9.5"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="7"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="4.5"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="2"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "rightThinDouble_SP":
        return (
          <>
            <RectIf
              x="18.5"
              y="2"
              width="1.5"
              height="36"
              fill={stripeSecondaryColor}
            />
            <RectIf
              x="20"
              y="2"
              width="1.5"
              height="36"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "rightThinDouble_PS":
        return (
          <>
            <RectIf
              x="18.5"
              y="2"
              width="1.5"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="20"
              y="2"
              width="1.5"
              height="36"
              fill={stripeSecondaryColor}
            />
          </>
        );
      case "rightThinSingle_S":
        return (
          <RectIf
            x="19"
            y="2"
            width="2"
            height="36"
            fill={stripeSecondaryColor}
          />
        );

      case "verticalDoubleBand":
        return (
          <>
            <RectIf
              x="16.5"
              y="2"
              width="4"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="20.5"
              y="2"
              width="1"
              height="36"
              fill={stripeSecondaryColor}
            />
          </>
        );
      case "verticalTripleBand":
        return (
          <>
            <RectIf
              x="11.5"
              y="2"
              width="5"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="10.5"
              y="2"
              width="1"
              height="36"
              fill={stripeSecondaryColor}
            />
            <RectIf
              x="16.5"
              y="2"
              width="1"
              height="36"
              fill={stripeSecondaryColor}
            />
          </>
        );
      case "verticalDoubleCenterSplit":
        return (
          <>
            <RectIf
              x="11"
              y="2"
              width="3"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="14"
              y="2"
              width="3"
              height="36"
              fill={stripeSecondaryColor}
            />
          </>
        );
      default:
        return null;
    }
  }

  if (variant === "hockey") {
    switch (preset) {
      case "defaultVertical":
        return (
          <>
            <RectIf
              x="13.9964"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="4.99638"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="22.9964"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "defaultVerticalCenterAlt":
        return (
          <>
            <RectIf
              x="13.9964"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="4.99638"
              y="2"
              width="6"
              height="37"
              fill={stripeSecondaryColor}
            />
            <RectIf
              x="22.9964"
              y="2"
              width="6"
              height="37"
              fill={stripeSecondaryColor}
            />
          </>
        );
      case "verticalThinFull":
        return (
          <>
            <RectIf
              x="27.43"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="25.43"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="22.93"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="20.43"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="17.93"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="15.43"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="12.93"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="10.43"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="7.93"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="5.55"
              y="2"
              width="1"
              height="36"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "rightThinDouble_SP":
        return (
          <>
            <RectIf
              x="19.9987"
              y="2"
              width="2"
              height="36"
              fill={stripeSecondaryColor}
            />
            <RectIf
              x="21.9987"
              y="2"
              width="2"
              height="36"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "rightThinDouble_PS":
        return (
          <>
            <RectIf
              x="19.9987"
              y="2"
              width="2"
              height="36"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="21.9987"
              y="2"
              width="2"
              height="36"
              fill={stripeSecondaryColor}
            />
          </>
        );

      case "rightThinSingle_S":
        return (
          <>
            <RectIf
              x="21.5987"
              y="2"
              width="2"
              height="36"
              fill={stripeSecondaryColor}
            />
          </>
        );

      case "verticalDoubleBand":
        return (
          <>
            <RectIf
              x="19.9986"
              y="2"
              width="5"
              height="37"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="23.9987"
              y="2"
              width="1"
              height="36"
              fill={stripeSecondaryColor}
            />
          </>
        );

      case "verticalTripleBand":
        return (
          <>
            <RectIf
              x="13.9987"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="12.9986"
              y="2"
              width="1"
              height="37"
              fill={stripeSecondaryColor}
            />
            <RectIf
              x="19.9986"
              y="2"
              width="1"
              height="37"
              fill={stripeSecondaryColor}
            />
          </>
        );

      case "verticalDoubleCenterSplit":
        return (
          <>
            <RectIf
              x="12.9987"
              y="0"
              width="4"
              height="40"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="16.9987"
              y="0"
              width="4"
              height="40"
              fill={stripeSecondaryColor}
            />
          </>
        );

      default:
        return null;
    }
  }

  switch (preset) {
    case "defaultVertical":
      return (
        <>
          <RectIf
            x="14.9964"
            y="2"
            width="6"
            height="37"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="4.99638"
            y="2"
            width="6"
            height="37"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="24.9964"
            y="2"
            width="6"
            height="37"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "defaultVerticalCenterAlt":
      return (
        <>
          <RectIf
            x="14.9964"
            y="2"
            width="6"
            height="37"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="4.99638"
            y="2"
            width="6"
            height="37"
            fill={stripeSecondaryColor}
          />
          <RectIf
            x="24.9964"
            y="2"
            width="6"
            height="37"
            fill={stripeSecondaryColor}
          />
        </>
      );
    case "verticalThinFull":
      return (
        <>
          <RectIf
            x="28"
            y="2"
            width="2"
            height="36"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="25"
            y="2"
            width="1"
            height="36"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="22"
            y="2"
            width="1"
            height="36"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="19"
            y="2"
            width="1"
            height="36"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="16"
            y="2"
            width="1"
            height="36"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="13"
            y="2"
            width="1"
            height="36"
            fill={stripePrimaryColor}
          />{" "}
          <RectIf
            x="10"
            y="2"
            width="1"
            height="36"
            fill={stripePrimaryColor}
          />{" "}
          <RectIf x="6" y="2" width="2" height="36" fill={stripePrimaryColor} />
        </>
      );
    case "rightThinDouble_SP":
      return (
        <>
          <RectIf
            x="21.9987"
            y="2"
            width="2"
            height="36"
            fill={stripeSecondaryColor}
          />
          <RectIf
            x="23.9987"
            y="2"
            width="2"
            height="36"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "rightThinDouble_PS":
      return (
        <>
          <RectIf
            x="21.9987"
            y="2"
            width="2"
            height="36"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="23.9987"
            y="2"
            width="2"
            height="36"
            fill={stripeSecondaryColor}
          />
        </>
      );

    case "rightThinSingle_S":
      return (
        <>
          <RectIf
            x="21.9987"
            y="2"
            width="2"
            height="36"
            fill={stripeSecondaryColor}
          />
        </>
      );

    case "verticalDoubleBand":
      return (
        <>
          <RectIf
            x="19.9986"
            y="2"
            width="5"
            height="37"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="24.9987"
            y="2"
            width="1"
            height="36"
            fill={stripeSecondaryColor}
          />
        </>
      );

    case "verticalTripleBand":
      return (
        <>
          <RectIf
            x="14.9987"
            y="2"
            width="6"
            height="37"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="13.9986"
            y="2"
            width="1"
            height="37"
            fill={stripeSecondaryColor}
          />
          <RectIf
            x="20.9986"
            y="2"
            width="1"
            height="37"
            fill={stripeSecondaryColor}
          />
        </>
      );

    case "verticalDoubleCenterSplit":
      return (
        <>
          <RectIf
            x="13.9987"
            y="0"
            width="4"
            height="40"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="17.9987"
            y="0"
            width="4"
            height="40"
            fill={stripeSecondaryColor}
          />
        </>
      );

    default:
      return null;
  }
}

export function renderSideStripePreset(
  preset: SideStripePreset,
  { sideStripePrimaryColor, sideStripeSecondaryColor }: SideStripeColors,
  variant:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "baseball"
    | "rugby"
    | "handball" = "football",
) {
  if (
    variant !== "basketball" ||
    (!sideStripePrimaryColor && !sideStripeSecondaryColor)
  ) {
    return null;
  }

  return (
    <>
      {sideStripePrimaryColor ? (
        <path
          d="M4.29982 3.89746L5.60918 14.2256L2.04059 17.0715"
          stroke={sideStripePrimaryColor}
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      ) : null}
      {sideStripeSecondaryColor ? (
        <path
          d="M23.6994 3.9L22.39 14.2282L25.9586 17.074"
          stroke={sideStripeSecondaryColor}
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      ) : null}
      {preset === "basketSideStripeFull" ? (
        <>
          {sideStripePrimaryColor ? (
            <path
              d="M2 17.2709L3.02403 35.4285"
              stroke={sideStripePrimaryColor}
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="round"
            />
          ) : null}
          {sideStripeSecondaryColor ? (
            <path
              d="M24.975 35.4285L25.999 17.2709"
              stroke={sideStripeSecondaryColor}
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="round"
            />
          ) : null}
        </>
      ) : null}
    </>
  );
}

export function renderCustomShapePreset(
  preset: CustomShapePreset,
  { baseColor, stripePrimaryColor, stripeTertiaryColor }: StripeColors,
  variant:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "baseball"
    | "rugby"
    | "handball" = "football",
) {
  if (variant === "basketball") {
    switch (preset) {
      case "diagonalLeft":
        return <PathIf d="M22 2H26L8 38H4L22 2Z" fill={stripePrimaryColor} />;
      case "diagonalRight":
        return <PathIf d="M6 2H2L20 38H24L6 2Z" fill={stripePrimaryColor} />;
      case "arrow":
        return (
          <PathIf
            d="M2 22L14 13L26 22V28L14 19L2 28V22Z"
            fill={stripePrimaryColor}
          />
        );
      case "cross":
        return (
          <>
            <RectIf
              x="23"
              y="12"
              width="4"
              height="24"
              transform="rotate(90 22 16)"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="12"
              y="2"
              width="4"
              height="36"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "split":
        return (
          <RectIf
            x="14"
            y="2"
            width="12"
            height="36"
            fill={stripePrimaryColor}
          />
        );
      default:
        return null;
    }
  }

  if (variant === "hockey") {
    switch (preset) {
      case "diagonalLeft":
        return (
          <>
            <PathIf
              d="M26.9964 2H32.9964L8.99638 39H2.99638L26.9964 2Z"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "diagonalRight":
        return (
          <>
            <PathIf
              d="M8.99639 2H2.99639L26.9964 39H32.9964L8.99639 2Z"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "diagonalHalfHalf1":
        return (
          <>
            <PathIf
              d="M26.9987 37L5.99867 18L5.99867 38H26.9987V37Z"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "diagonalHalfHalf2":
        return (
          <>
            <PathIf
              d="M4.99843 12L28.9984 34V38H6.99843V12Z"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "arrow":
        return (
          <>
            <PathIf
              d="M4.99864 12L16.9986 14L28.9986 12V19L16.9986 21L4.99864 19V12Z"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "hockeyThinArrowFill":
        return (
          <>
            <PathIf
              d="M4.99948 35L16.9995 26L28.9995 35V38H16.9995H4.99948V35Z"
              fill={
                stripeTertiaryColor ??
                (baseColor ? darken(baseColor, 0.2) : undefined)
              }
            />
            <PathIf
              d="M4.99948 33L16.9995 24L28.9995 33V35L16.9995 26L4.99948 35V33Z"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "cross":
        return (
          <>
            <RectIf
              x="25.5987"
              y="18"
              width="6"
              height="24"
              transform="rotate(90 29.7987 18)"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="13.9986"
              y="2"
              width="6"
              height="37"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "split":
        return (
          <>
            <RectIf
              x="16.9984"
              y="2"
              width="12"
              height="36"
              fill={stripePrimaryColor}
            />
          </>
        );

      default:
        return null;
    }
  }

  switch (preset) {
    case "diagonalLeft":
      return (
        <>
          <PathIf
            d="M26.9964 2H32.9964L8.99638 39H2.99638L26.9964 2Z"
            fill={stripePrimaryColor}
          />
        </>
      );
    case "diagonalRight":
      return (
        <>
          <PathIf
            d="M8.99639 2H2.99639L26.9964 39H32.9964L8.99639 2Z"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "diagonalHalfHalf1":
      return (
        <>
          <PathIf
            d="M26.9987 37L7.99867 18L8.99867 38H26.9987V37Z"
            fill={stripePrimaryColor}
          />
        </>
      );
    case "diagonalHalfHalf2":
      return (
        <>
          <PathIf
            d="M6.99843 12L28.9984 34V38H6.99843V12Z"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "arrow":
      return (
        <>
          <PathIf
            d="M5.99864 12L17.9986 14L29.9986 12V19L17.9986 21L5.99864 19V12Z"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "cross":
      return (
        <>
          <RectIf
            x="29.9987"
            y="18"
            width="6"
            height="24"
            transform="rotate(90 29.9987 18)"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="14.9986"
            y="2"
            width="6"
            height="37"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "split":
      return (
        <>
          <RectIf
            x="17.9984"
            y="2"
            width="12"
            height="36"
            fill={stripePrimaryColor}
          />
        </>
      );

    default:
      return null;
  }
}
export function renderHorizontalStripePreset(
  preset: HorizontalStripePreset,
  {
    stripePrimaryColor,
    stripeSecondaryColor,
    stripeTertiaryColor,
  }: StripeColors,
  variant:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "baseball"
    | "rugby"
    | "handball" = "football",
) {
  if (variant === "hockey") {
    switch (preset) {
      case "hockeyTripleBottomStripe":
        return (
          <>
            <RectIf
              x="7.99949"
              y="32"
              width="18"
              height="2"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="7.99949"
              y="30"
              width="18"
              height="2"
              fill={stripeSecondaryColor}
            />
            <RectIf
              x="7.99949"
              y="28"
              width="18"
              height="2"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "hockeyTripleBottomStripeShade":
        return (
          <>
            <RectIf
              x="7.99949"
              y="34"
              width="18"
              height="4"
              fill={
                stripeTertiaryColor ??
                (stripePrimaryColor
                  ? darken(stripePrimaryColor, 0.2)
                  : undefined)
              }
            />
            <RectIf
              x="7.99949"
              y="32"
              width="18"
              height="2"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="7.99949"
              y="30"
              width="18"
              height="2"
              fill={stripeSecondaryColor}
            />
            <RectIf
              x="7.99949"
              y="28"
              width="18"
              height="2"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "hockeyBottomStripeShade":
        return (
          <>
            <RectIf
              x="7.99949"
              y="34"
              width="18"
              height="4"
              fill={
                stripeTertiaryColor ??
                (stripePrimaryColor
                  ? darken(stripePrimaryColor, 0.2)
                  : undefined)
              }
            />
            <RectIf
              x="7.99949"
              y="32"
              width="18"
              height="2"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "regularQuadStripe":
        return (
          <>
            <RectIf
              x="7.99843"
              y="34"
              width="18"
              height="4"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="6.99843"
              y="26"
              width="20"
              height="4"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="6.99843"
              y="18"
              width="20"
              height="4"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="5.99855"
              y="10"
              width="22"
              height="4"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "regularTripleStripe":
        return (
          <>
            <RectIf
              x="6.99843"
              y="26"
              width="20"
              height="4"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="6.99843"
              y="18"
              width="20"
              height="4"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="5.99855"
              y="10"
              width="22"
              height="4"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "twoColorDoubleStripe":
        return (
          <>
            <RectIf
              x="5.99843"
              y="19"
              width="22"
              height="4"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="5.99843"
              y="13"
              width="22"
              height="4"
              fill={stripeSecondaryColor}
            />
          </>
        );

      case "singleBand":
        return (
          <>
            <RectIf
              x="5.99843"
              y="13"
              width="22"
              height="6"
              fill={stripePrimaryColor}
            />
          </>
        );

      case "threeColorBand":
        return (
          <>
            <RectIf
              x="5.99843"
              y="13"
              width="24"
              height="10"
              stroke={stripeSecondaryColor}
              fill={stripePrimaryColor}
            />
          </>
        );

      default:
        break;
    }
  }

  if (variant === "basketball") {
    switch (preset) {
      case "basketTopBand":
        return (
          <>
            <RectIf
              x="2"
              y="2"
              width="24"
              height="10"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="2"
              y="17"
              width="24"
              height="6"
              fill={stripeSecondaryColor}
            />
          </>
        );
      case "regularQuadStripe":
        return (
          <>
            <RectIf
              x="2"
              y="30"
              width="24"
              height="3"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="1"
              y="23"
              width="25"
              height="3"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="1"
              y="16"
              width="25"
              height="3"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="4"
              y="9"
              width="20"
              height="3"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "regularTripleStripe":
        return (
          <>
            <RectIf
              x="1"
              y="23"
              width="25"
              height="3"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="1"
              y="16"
              width="25"
              height="3"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="4"
              y="9"
              width="20"
              height="3"
              fill={stripePrimaryColor}
            />
          </>
        );
      case "twoColorDoubleStripe":
        return (
          <>
            <RectIf
              x="2"
              y="17"
              width="24"
              height="3"
              fill={stripePrimaryColor}
            />
            <RectIf
              x="4"
              y="12"
              width="20"
              height="3"
              fill={stripeSecondaryColor}
            />
          </>
        );
      case "singleBand":
        return (
          <RectIf
            x="2"
            y="13"
            width="24"
            height="5"
            fill={stripePrimaryColor}
          />
        );
      case "threeColorBand":
        return (
          <RectIf
            x="1"
            y="12"
            width="26"
            height="8"
            stroke={stripeSecondaryColor}
            fill={stripePrimaryColor}
          />
        );
      default:
        return null;
    }
  }

  switch (preset) {
    case "regularQuadStripe":
      return (
        <>
          <RectIf
            x="8.99843"
            y="34"
            width="18"
            height="4"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="7.99843"
            y="26"
            width="20"
            height="4"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="7.99843"
            y="18"
            width="20"
            height="4"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="6.99855"
            y="10"
            width="22"
            height="4"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "regularTripleStripe":
      return (
        <>
          <RectIf
            x="7.99843"
            y="26"
            width="20"
            height="4"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="7.99843"
            y="18"
            width="20"
            height="4"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="6.99855"
            y="10"
            width="22"
            height="4"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "twoColorDoubleStripe":
      return (
        <>
          <RectIf
            x="6.99843"
            y="19"
            width="22"
            height="4"
            fill={stripePrimaryColor}
          />
          <RectIf
            x="6.99843"
            y="13"
            width="22"
            height="4"
            fill={stripeSecondaryColor}
          />
        </>
      );

    case "singleBand":
      return (
        <>
          <RectIf
            x="6.99843"
            y="14"
            width="22"
            height="6"
            fill={stripePrimaryColor}
          />
        </>
      );

    case "threeColorBand":
      return (
        <>
          <RectIf
            x="5.99843"
            y="13"
            width="24"
            height="10"
            stroke={stripeSecondaryColor}
            fill={stripePrimaryColor}
          />
        </>
      );

    default:
      return null;
  }
}

export async function copyToClipboard(text: string | null) {
  if (!text) return;

  try {
    // Use writeText to preserve formatting and whitespace
    await navigator.clipboard.writeText(text);
    toast("Copied");
  } catch (err) {
    console.error("Clipboard copy failed:", err);
  }
}

const slugifyFilename = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function downloadJson(state: JerseyColorState) {
  const baseProps = toBaseProps(state, state.sport);
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    footballBackAutoTextSeedColor: _ignoredAutoSeed,
    ...exportableBaseProps
  } = baseProps;
  const stateExport = {
    ...exportableBaseProps,
    customOverlayEnabled: state.customOverlayEnabled,
    customOverlaySvg: state.customOverlaySvg || "",
    customOverlayViewBox: state.customOverlayViewBox || "",
    customOverlayX: state.customOverlayX,
    customOverlayY: state.customOverlayY,
    customOverlayScale: state.customOverlayScale,
    customOverlayRotation: state.customOverlayRotation,
    footballBackEnabled: state.footballBackEnabled,
    footballBackName: state.footballBackName,
    footballBackNumber: state.footballBackNumber,
    footballBackFontFamily: state.footballBackFontFamily,
    footballBackFontWeight: state.footballBackFontWeight,
    footballBackTextColor: state.footballBackTextColor,
    footballBackTextOutlineEnabled: state.footballBackTextOutlineEnabled,
    footballBackTextOutlineColor: state.footballBackTextOutlineColor,
    footballBackTextOutlineWidth: state.footballBackTextOutlineWidth,
    footballBackNameCurveAmount: state.footballBackNameCurveAmount,
    footballBackNameSize: state.footballBackNameSize,
    footballBackNumberSize: state.footballBackNumberSize,
    footballBackNameY: state.footballBackNameY,
    footballBackNumberY: state.footballBackNumberY,
  };
  const config = {
    name: state.name || "",
    sport: state.sport,
    primary: state.theme.primary || "",
    secondary: state.theme.secondary || "",
    stripesPreset: state.stripesPreset || "",
    horizontalStripesPreset: state.horizontalStripesPreset || "",
    customShapePreset: state.customShapePreset || "",
    sideStripePreset: state.sideStripePreset || "",
    ...stateExport,
    state: stateExport,
  };

  const json = JSON.stringify(config, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const filename = slugifyFilename(state.name || "");
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
