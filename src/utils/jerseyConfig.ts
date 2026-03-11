import type {
  CustomOverlayLayer,
  CustomShapePreset,
  HorizontalStripePreset,
  SideStripePreset,
  StripePreset,
} from "@/types/types";

export type JerseyConfig = {
  name?: string;
  sport?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
  primary?: string;
  secondary?: string;
  tertiary?: string;
  stripesPreset?: StripePreset;
  horizontalStripesPreset?: HorizontalStripePreset;
  customShapePreset?: CustomShapePreset;
  sideStripePreset?: SideStripePreset;
  baseColor?: string;
  leftSleeveColor?: string;
  rightSleeveColor?: string;
  leftSleeveDetailColor?: string;
  rightSleeveDetailColor?: string;
  neckCircleColor?: string;
  leftNeckCircleColor?: string;
  shoulderPanelColor?: string;
  stripePrimaryColor?: string;
  stripeSecondaryColor?: string;
  stripeTertiaryColor?: string;
  stripeQuaternaryColor?: string;
  sleeveStripePrimaryColor?: string;
  sleeveStripeSecondaryColor?: string;
  sleeveStripeTertiaryColor?: string;
  sideStripePrimaryColor?: string;
  sideStripeSecondaryColor?: string;
  customOverlayEnabled?: boolean;
  customOverlaySvg?: string;
  customOverlayViewBox?: string;
  customOverlayX?: number;
  customOverlayY?: number;
  customOverlayScale?: number;
  customOverlayRotation?: number;
  customOverlays?: CustomOverlayLayer[];
  customOverlayActiveId?: string;
  footballBackEnabled?: boolean;
  footballBackName?: string;
  footballBackNumber?: string;
  footballBackFontFamily?: string;
  footballBackFontWeight?: number;
  footballBackTextColor?: string;
  footballBackTextOutlineEnabled?: boolean;
  footballBackTextOutlineColor?: string;
  footballBackTextOutlineWidth?: number;
  footballBackNameCurved?: boolean;
  footballBackNameCurveAmount?: number;
  footballBackNameSize?: number;
  footballBackNumberSize?: number;
  footballBackNameY?: number;
  footballBackNumberY?: number;
};

const coerceString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value : undefined;
const coerceNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const STRIPE_PRESETS: StripePreset[] = [
  "defaultVertical",
  "defaultVerticalCenterAlt",
  "verticalThinFull",
  "rightThinDouble_SP",
  "rightThinDouble_PS",
  "rightThinSingle_S",
  "verticalDoubleBand",
  "verticalTripleBand",
  "verticalDoubleCenterSplit",
];

const HORIZONTAL_STRIPE_PRESETS: HorizontalStripePreset[] = [
  "regularQuadStripe",
  "regularTripleStripe",
  "twoColorDoubleStripe",
  "singleBand",
  "threeColorBand",
  "basketTopBand",
  "hockeyTripleBottomStripe",
  "hockeyTripleBottomStripeShade",
  "hockeyBottomStripeShade",
];

const CUSTOM_SHAPE_PRESETS: CustomShapePreset[] = [
  "diagonalLeft",
  "diagonalRight",
  "diagonalHalfHalf1",
  "diagonalHalfHalf2",
  "hockeyThinArrowFill",
  "arrow",
  "cross",
  "split",
];

const SIDE_STRIPE_PRESETS: SideStripePreset[] = [
  "basketSideStripeToSleeve",
  "basketSideStripeFull",
];

const coercePreset = <T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | undefined => {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return allowed.includes(value as T) ? (value as T) : undefined;
};

export function parseJerseyConfig(raw: unknown): JerseyConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Invalid JSON format");
  }

  const payload = raw as Record<string, unknown>;
  const nestedState =
    payload.state &&
    typeof payload.state === "object" &&
    !Array.isArray(payload.state)
      ? (payload.state as Record<string, unknown>)
      : null;

  return {
    name: coerceString(payload.name),
    sport:
      payload.sport === "football" ||
      payload.sport === "basketball" ||
      payload.sport === "hockey" ||
      payload.sport === "american-football" ||
      payload.sport === "formula-1" ||
      payload.sport === "baseball" ||
      payload.sport === "rugby" ||
      payload.sport === "handball"
        ? payload.sport
        : undefined,
    primary: coerceString(payload.primary),
    secondary: coerceString(payload.secondary),
    tertiary: coerceString(payload.tertiary),
    stripesPreset: coercePreset(payload.stripesPreset, STRIPE_PRESETS),
    horizontalStripesPreset: coercePreset(
      payload.horizontalStripesPreset,
      HORIZONTAL_STRIPE_PRESETS,
    ),
    customShapePreset: coercePreset(
      payload.customShapePreset,
      CUSTOM_SHAPE_PRESETS,
    ),
    sideStripePreset: coercePreset(
      payload.sideStripePreset,
      SIDE_STRIPE_PRESETS,
    ),
    baseColor: coerceString(payload.baseColor ?? nestedState?.baseColor),
    leftSleeveColor: coerceString(
      payload.leftSleeveColor ?? nestedState?.leftSleeveColor,
    ),
    rightSleeveColor: coerceString(
      payload.rightSleeveColor ?? nestedState?.rightSleeveColor,
    ),
    leftSleeveDetailColor: coerceString(
      payload.leftSleeveDetailColor ?? nestedState?.leftSleeveDetailColor,
    ),
    rightSleeveDetailColor: coerceString(
      payload.rightSleeveDetailColor ?? nestedState?.rightSleeveDetailColor,
    ),
    neckCircleColor: coerceString(
      payload.neckCircleColor ?? nestedState?.neckCircleColor,
    ),
    leftNeckCircleColor: coerceString(
      payload.leftNeckCircleColor ?? nestedState?.leftNeckCircleColor,
    ),
    shoulderPanelColor: coerceString(
      payload.shoulderPanelColor ?? nestedState?.shoulderPanelColor,
    ),
    stripePrimaryColor: coerceString(
      payload.stripePrimaryColor ?? nestedState?.stripePrimaryColor,
    ),
    stripeSecondaryColor: coerceString(
      payload.stripeSecondaryColor ?? nestedState?.stripeSecondaryColor,
    ),
    stripeTertiaryColor: coerceString(
      payload.stripeTertiaryColor ?? nestedState?.stripeTertiaryColor,
    ),
    stripeQuaternaryColor: coerceString(
      payload.stripeQuaternaryColor ?? nestedState?.stripeQuaternaryColor,
    ),
    sleeveStripePrimaryColor: coerceString(
      payload.sleeveStripePrimaryColor ?? nestedState?.sleeveStripePrimaryColor,
    ),
    sleeveStripeSecondaryColor: coerceString(
      payload.sleeveStripeSecondaryColor ??
        nestedState?.sleeveStripeSecondaryColor,
    ),
    sleeveStripeTertiaryColor: coerceString(
      payload.sleeveStripeTertiaryColor ??
        nestedState?.sleeveStripeTertiaryColor,
    ),
    sideStripePrimaryColor: coerceString(
      payload.sideStripePrimaryColor ?? nestedState?.sideStripePrimaryColor,
    ),
    sideStripeSecondaryColor: coerceString(
      payload.sideStripeSecondaryColor ?? nestedState?.sideStripeSecondaryColor,
    ),
    customOverlayEnabled:
      typeof payload.customOverlayEnabled === "boolean"
        ? payload.customOverlayEnabled
        : typeof nestedState?.customOverlayEnabled === "boolean"
          ? nestedState.customOverlayEnabled
          : false,
    customOverlaySvg: coerceString(
      payload.customOverlaySvg ?? nestedState?.customOverlaySvg,
    ),
    customOverlayViewBox: coerceString(
      payload.customOverlayViewBox ?? nestedState?.customOverlayViewBox,
    ),
    customOverlayX: coerceNumber(
      payload.customOverlayX ?? nestedState?.customOverlayX,
    ),
    customOverlayY: coerceNumber(
      payload.customOverlayY ?? nestedState?.customOverlayY,
    ),
    customOverlayScale: coerceNumber(
      payload.customOverlayScale ?? nestedState?.customOverlayScale,
    ),
    customOverlayRotation: coerceNumber(
      payload.customOverlayRotation ?? nestedState?.customOverlayRotation,
    ),
    customOverlays: Array.isArray(payload.customOverlays)
      ? (payload.customOverlays as CustomOverlayLayer[])
      : Array.isArray(nestedState?.customOverlays)
        ? (nestedState.customOverlays as CustomOverlayLayer[])
        : undefined,
    customOverlayActiveId: coerceString(
      payload.customOverlayActiveId ?? nestedState?.customOverlayActiveId,
    ),
    footballBackEnabled:
      typeof payload.footballBackEnabled === "boolean"
        ? payload.footballBackEnabled
        : typeof nestedState?.footballBackEnabled === "boolean"
          ? nestedState.footballBackEnabled
          : false,
    footballBackName: coerceString(
      payload.footballBackName ?? nestedState?.footballBackName,
    ),
    footballBackNumber: coerceString(
      payload.footballBackNumber ?? nestedState?.footballBackNumber,
    ),
    footballBackFontFamily: coerceString(
      payload.footballBackFontFamily ?? nestedState?.footballBackFontFamily,
    ),
    footballBackFontWeight: coerceNumber(
      payload.footballBackFontWeight ?? nestedState?.footballBackFontWeight,
    ),
    footballBackTextColor: coerceString(
      payload.footballBackTextColor ?? nestedState?.footballBackTextColor,
    ),
    footballBackTextOutlineEnabled:
      typeof payload.footballBackTextOutlineEnabled === "boolean"
        ? payload.footballBackTextOutlineEnabled
        : typeof nestedState?.footballBackTextOutlineEnabled === "boolean"
          ? nestedState.footballBackTextOutlineEnabled
          : undefined,
    footballBackTextOutlineColor: coerceString(
      payload.footballBackTextOutlineColor ??
        nestedState?.footballBackTextOutlineColor,
    ),
    footballBackTextOutlineWidth: coerceNumber(
      payload.footballBackTextOutlineWidth ??
        nestedState?.footballBackTextOutlineWidth,
    ),
    footballBackNameCurved:
      typeof payload.footballBackNameCurved === "boolean"
        ? payload.footballBackNameCurved
        : typeof nestedState?.footballBackNameCurved === "boolean"
          ? nestedState.footballBackNameCurved
          : undefined,
    footballBackNameCurveAmount: coerceNumber(
      payload.footballBackNameCurveAmount ??
        nestedState?.footballBackNameCurveAmount,
    ),
    footballBackNameSize: coerceNumber(
      payload.footballBackNameSize ?? nestedState?.footballBackNameSize,
    ),
    footballBackNumberSize: coerceNumber(
      payload.footballBackNumberSize ?? nestedState?.footballBackNumberSize,
    ),
    footballBackNameY: coerceNumber(
      payload.footballBackNameY ?? nestedState?.footballBackNameY,
    ),
    footballBackNumberY: coerceNumber(
      payload.footballBackNumberY ?? nestedState?.footballBackNumberY,
    ),
  };
}
