export type JerseyFieldKey =
  | "baseColor"
  | "leftSleeveColor"
  | "rightSleeveColor"
  | "leftSleeveDetailColor"
  | "rightSleeveDetailColor"
  | "neckCircleColor"
  | "leftNeckCircleColor"
  | "shoulderPanelColor"
  | "stripePrimaryColor"
  | "stripeSecondaryColor"
  | "stripeTertiaryColor"
  | "stripeQuaternaryColor"
  | "sleeveStripePrimaryColor"
  | "sleeveStripeSecondaryColor"
  | "sleeveStripeTertiaryColor"
  | "sideStripePrimaryColor"
  | "sideStripeSecondaryColor";

export type ColorToggle = {
  value?: string;
  enabled: boolean;
  shouldToggle?: boolean;
};
export type Theme = { primary?: string; secondary?: string; tertiary?: string };

export type CustomOverlayLayer = {
  id: string;
  name: string;
  enabled: boolean;
  svg?: string;
  viewBox?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export type JerseyColorState = {
  name: string;
  id?: number;
  sport?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
  sr_jersey?: SportsRadarJersey;
  theme: Theme;
  stripesPreset?: StripePreset;
  horizontalStripesPreset?: HorizontalStripePreset;
  customShapePreset?: CustomShapePreset;
  sideStripePreset?: SideStripePreset;
  customOverlays: CustomOverlayLayer[];
  customOverlayActiveId?: string;
  footballBackEnabled: boolean;
  footballBackName: string;
  footballBackNumber: string;
  footballBackFontFamily: string;
  footballBackFontWeight: number;
  footballBackTextColor: string;
  footballBackTextOutlineEnabled: boolean;
  footballBackTextOutlineColor: string;
  footballBackTextOutlineWidth: number;
  footballBackNameCurveAmount: number;
  footballBackNameSize: number;
  footballBackNumberSize: number;
  footballBackNameY: number;
  footballBackNumberY: number;
} & Record<JerseyFieldKey, ColorToggle>;

export const DEFAULT_SOURCE: Record<JerseyFieldKey, keyof Theme> = {
  baseColor: "primary",
  leftSleeveColor: "secondary",
  rightSleeveColor: "secondary",
  leftSleeveDetailColor: "secondary",
  rightSleeveDetailColor: "secondary",
  neckCircleColor: "secondary",
  leftNeckCircleColor: "secondary",
  shoulderPanelColor: "secondary",
  stripePrimaryColor: "primary",
  stripeSecondaryColor: "secondary",
  stripeTertiaryColor: "primary",
  stripeQuaternaryColor: "primary",
  sleeveStripePrimaryColor: "primary",
  sleeveStripeSecondaryColor: "secondary",
  sleeveStripeTertiaryColor: "primary",
  sideStripePrimaryColor: "primary",
  sideStripeSecondaryColor: "primary",
};

export const downloadSvg = async (
  filename = "jersey.svg",
  el: SVGSVGElement | null,
  options?: { requireServerExport?: boolean },
) => {
  if (!el) {
    throw new Error("No SVG element found for export.");
  }

  const clone = el.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute("xmlns"))
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  if (!clone.getAttribute("xmlns:xlink")) {
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  }
  if (!clone.getAttribute("width") && el.clientWidth)
    clone.setAttribute("width", String(el.clientWidth));
  if (!clone.getAttribute("height") && el.clientHeight)
    clone.setAttribute("height", String(el.clientHeight));
  const rawXml = new XMLSerializer().serializeToString(clone);
  let finalXml = rawXml;
  const hasSvgTextNodes = /<text\b|<textPath\b/i.test(rawXml);
  if (options?.requireServerExport || hasSvgTextNodes) {
    const response = await fetch("/.netlify/functions/export-svg", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        filename,
        svg: rawXml,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      throw new Error(
        `SVG export function failed (${response.status}). ${responseText}`.trim(),
      );
    }
    finalXml = await response.text();
    if (/<text\b/i.test(finalXml)) {
      throw new Error(
        "SVG export conversion failed: text elements remained after server conversion.",
      );
    }
  }

  const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n', finalXml], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

export type GenerateJerseyParams = {
  team: string;
  country?: string;
  league?: string;
  seasons?: number;
};
export type CustomShapePreset =
  | "diagonalLeft"
  | "diagonalRight"
  | "diagonalHalfHalf1"
  | "diagonalHalfHalf2"
  | "hockeyThinArrowFill"
  | "arrow"
  | "cross"
  | "split";

export type StripePreset =
  | "defaultVertical" // 3 equal bands (all primary)
  | "defaultVerticalCenterAlt" // center primary, sides secondary
  | "verticalThinFull" // thin full-width stripe set
  | "rightThinDouble_SP" // right thin: Secondary then Primary
  | "rightThinDouble_PS" // right thin: Primary then Secondary
  | "rightThinSingle_S" // right thin single (secondary)
  | "verticalDoubleBand" // 5px primary + 1px secondary to the right
  | "verticalTripleBand" // 6px primary with 1px secondary pinlines
  | "verticalDoubleCenterSplit"; // two 4px bars center (primary/secondary)
export type JerseyResponse = {
  primary: string;
  secondary: string;
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
  stripesPreset?: StripePreset;
  horizontalStripesPreset?: HorizontalStripePreset;
  customShapePreset?: CustomShapePreset;
  sideStripePreset?: SideStripePreset;
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
  footballBackNameCurveAmount?: number;
  footballBackNameSize?: number;
  footballBackNumberSize?: number;
  footballBackNameY?: number;
  footballBackNumberY?: number;
};

export type StripeColors = {
  baseColor?: string;
  stripePrimaryColor?: string;
  stripeSecondaryColor?: string;
  stripeTertiaryColor?: string;
  stripeQuaternaryColor?: string;
};

export type SideStripeColors = {
  sideStripePrimaryColor?: string;
  sideStripeSecondaryColor?: string;
};

export type HorizontalStripePreset =
  | "regularQuadStripe"
  | "regularTripleStripe"
  | "twoColorDoubleStripe"
  | "singleBand"
  | "threeColorBand"
  | "basketTopBand"
  | "hockeyTripleBottomStripe"
  | "hockeyTripleBottomStripeShade"
  | "hockeyBottomStripeShade";

export type SideStripePreset =
  | "basketSideStripeToSleeve"
  | "basketSideStripeFull";

export type SportsRadarJersey = {
  base: string;
  horizontal_stripes: boolean;
  horizontal_stripes_color: string;
  number: string;
  shirt_type: "short_sleeves" | "long_sleeves";
  sleeve: string;
  sleeve_detail: string;
  split: boolean;
  split_color: string;
  squares: boolean;
  squares_color: string;
  stripes: boolean;
  stripes_color: string;
  type: "home" | "away" | "third";
};

export type Preset = {
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
