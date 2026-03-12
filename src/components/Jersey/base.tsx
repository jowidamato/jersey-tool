import type {
  CustomOverlayLayer,
  HorizontalStripePreset,
  CustomShapePreset,
  SideStripePreset,
  StripePreset,
} from "@/types/types";
import { darken } from "@/utils/colorFunctions";
import { useId } from "react";
import {
  renderHorizontalStripePreset,
  renderCustomShapePreset,
  renderSideStripePreset,
  renderStripePreset,
} from "@/utils/utils";

type JerseyProps = React.SVGProps<SVGSVGElement> & {
  baseColor?: string;
  neckCircleColor?: string;
  leftNeckCircleColor?: string;
  leftSleeveColor?: string;
  leftSleeveDetailColor?: string;
  rightSleeveColor?: string;
  rightSleeveDetailColor?: string;
  shoulderPanelColor?: string;
  stripesPreset?: StripePreset;
  horizontalStripesPreset?: HorizontalStripePreset;
  customShapePreset?: CustomShapePreset;
  sideStripePreset?: SideStripePreset;
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
  footballBackEnabled?: boolean;
  footballBackName?: string;
  footballBackNumber?: string;
  footballBackFontFamily?: string;
  footballBackFontWeight?: number;
  footballBackTextColor?: string;
  footballBackAutoTextSeedColor?: string;
  footballBackTextOutlineEnabled?: boolean;
  footballBackTextOutlineColor?: string;
  footballBackTextOutlineWidth?: number;
  footballBackNameCurveAmount?: number;
  footballBackNameSize?: number;
  footballBackNumberSize?: number;
  footballBackNameY?: number;
  footballBackNumberY?: number;
  svgRef?: React.Ref<SVGSVGElement>;
  size?: "xsmall" | "small" | "medium" | "large";
  variant?:
    | "football"
    | "basketball"
    | "hockey"
    | "american-football"
    | "formula-1"
    | "baseball"
    | "rugby"
    | "handball";
};

const Base: React.FC<JerseyProps> = ({
  baseColor = "#fff",
  neckCircleColor,
  leftNeckCircleColor,
  leftSleeveColor,
  leftSleeveDetailColor,
  rightSleeveColor,
  rightSleeveDetailColor,
  shoulderPanelColor,
  stripesPreset,
  horizontalStripesPreset,
  customShapePreset,
  sideStripePreset,
  stripePrimaryColor,
  stripeSecondaryColor,
  stripeTertiaryColor,
  stripeQuaternaryColor,
  sleeveStripePrimaryColor,
  sleeveStripeSecondaryColor,
  sleeveStripeTertiaryColor,
  sideStripePrimaryColor,
  sideStripeSecondaryColor,
  customOverlayEnabled = false,
  customOverlaySvg,
  customOverlayViewBox,
  customOverlayX = 0,
  customOverlayY = 0,
  customOverlayScale = 1,
  customOverlayRotation = 0,
  customOverlays,
  footballBackEnabled = false,
  footballBackName = "",
  footballBackNumber = "",
  footballBackFontFamily = "Barlow Condensed",
  footballBackFontWeight = 700,
  footballBackTextColor = "",
  footballBackAutoTextSeedColor,
  footballBackTextOutlineEnabled = false,
  footballBackTextOutlineColor = "#000000",
  footballBackTextOutlineWidth = 2,
  footballBackNameCurveAmount = 0,
  footballBackNameSize = 4,
  footballBackNumberSize = 16,
  footballBackNameY = 11,
  footballBackNumberY = 21,
  size = "large",
  svgRef,
  variant = "football",
}) => {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const normalizeColor = (hex?: string) => {
    const raw = String(hex ?? "").trim();
    if (!raw) return "";
    const withHash = raw.startsWith("#") ? raw : `#${raw}`;
    const normalized = /^#[0-9A-Fa-f]{3}$/.test(withHash)
      ? `#${withHash[1]}${withHash[1]}${withHash[2]}${withHash[2]}${withHash[3]}${withHash[3]}`
      : /^#[0-9A-Fa-f]{8}$/.test(withHash)
        ? withHash.slice(0, 7)
        : withHash;
    return /^#[0-9A-Fa-f]{6}$/.test(normalized) ? normalized : "";
  };
  const darker = darken(baseColor, 0.15);
  const largeShoulderPanel = true;
  const isBasketball = variant === "basketball";
  const isHockey = variant === "hockey";
  const isBaseball = variant === "baseball";
  const isAmericanFootball = variant === "american-football";
  const isFormulaOne = variant === "formula-1";
  const isFootballLike =
    variant === "football" ||
    variant === "baseball" ||
    variant === "rugby" ||
    variant === "handball";
  const isFootballBack = isFootballLike && footballBackEnabled;
  const isBasketballFrontText = variant === "basketball" && footballBackEnabled;
  const isHockeyBackText = variant === "hockey" && footballBackEnabled;
  const isPlayerTextMode =
    isFootballBack || isBasketballFrontText || isHockeyBackText;
  const curveId = useId().replace(/[:]/g, "");
  const backName = footballBackName.trim().toUpperCase().slice(0, 14);
  const rawNumber = footballBackNumber.replace(/[^0-9]/g, "").slice(0, 3);
  const backNumber = rawNumber;
  const backTextColor =
    footballBackTextColor && footballBackTextColor.trim()
      ? footballBackTextColor
      : normalizeColor(footballBackAutoTextSeedColor ?? baseColor) || "#FFFFFF";
  const backOutlineColor =
    normalizeColor(footballBackTextOutlineColor) || "#000000";
  const outlineStrokeWidthName = clamp(
    (Number.isFinite(footballBackTextOutlineWidth)
      ? footballBackTextOutlineWidth
      : 2) * 0.275,
    0.2,
    3,
  );
  const outlineStrokeWidthNumber = clamp(
    (Number.isFinite(footballBackTextOutlineWidth)
      ? footballBackTextOutlineWidth
      : 2) * 0.375,
    0.3,
    4,
  );
  const safeBackFontWeight = clamp(
    Number.isFinite(footballBackFontWeight) ? footballBackFontWeight : 700,
    400,
    900,
  );
  const safeBackNameSize = clamp(
    Number.isFinite(footballBackNameSize) ? footballBackNameSize : 4,
    1.8,
    5.5,
  );
  const safeBackNumberSize = clamp(
    Number.isFinite(footballBackNumberSize) ? footballBackNumberSize : 16,
    6,
    24,
  );
  const safeBackNameY = clamp(
    Number.isFinite(footballBackNameY) ? footballBackNameY : 11,
    7,
    18,
  );
  const safeBackNumberY = clamp(
    Number.isFinite(footballBackNumberY) ? footballBackNumberY : 21,
    15,
    33,
  );
  const safeBackFontFamily = footballBackFontFamily || "Barlow Condensed";
  const safeCurveAmount = clamp(
    Number.isFinite(footballBackNameCurveAmount)
      ? footballBackNameCurveAmount
      : 0,
    0,
    8,
  );
  const curveBaselineOffset = safeCurveAmount / 2;
  const textCenterX = isBasketball ? 14 : isHockey ? 17 : 18;

  const overlayBox = isBasketball
    ? { x: 6, y: 8, width: 16, height: 24 }
    : isAmericanFootball
      ? { x: 10, y: 8, width: 16, height: 13 }
      : isFormulaOne
        ? { x: 11, y: 8, width: 15, height: 12 }
        : isHockey
          ? { x: 8, y: 8, width: 18, height: 24 }
          : { x: 8, y: 8, width: 20, height: 24 };

  const resolvedOverlays =
    customOverlays && customOverlays.length
      ? customOverlays.filter((overlay) => overlay.enabled && overlay.svg)
      : customOverlayEnabled && customOverlaySvg
        ? [
            {
              id: "overlay-legacy",
              name: "Overlay",
              enabled: true,
              svg: customOverlaySvg,
              viewBox: customOverlayViewBox,
              x: customOverlayX,
              y: customOverlayY,
              scale: customOverlayScale,
              rotation: customOverlayRotation,
            },
          ]
        : [];
  const renderOverlay = (overlay: {
    svg?: string;
    viewBox?: string;
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
    id: string;
  }) => {
    const overlayViewBoxParts =
      overlay.viewBox?.trim().split(/\s+/).map(Number) ?? [];
    const [vbX = 0, vbY = 0, vbWidth = 100, vbHeight = 100] =
      overlayViewBoxParts.length === 4 &&
      overlayViewBoxParts.every((value) => Number.isFinite(value))
        ? overlayViewBoxParts
        : [0, 0, 100, 100];
    const overlayScale = Math.min(
      overlayBox.width / vbWidth,
      overlayBox.height / vbHeight,
    );
    const fittedWidth = vbWidth * overlayScale;
    const fittedHeight = vbHeight * overlayScale;
    const overlayTranslateX =
      overlayBox.x + (overlayBox.width - fittedWidth) / 2;
    const overlayTranslateY =
      overlayBox.y + (overlayBox.height - fittedHeight) / 2;
    const safeUserScale =
      Number.isFinite(overlay.scale) && (overlay.scale ?? 0) > 0
        ? (overlay.scale as number)
        : 1;
    const safeUserX = Number.isFinite(overlay.x) ? (overlay.x as number) : 0;
    const safeUserY = Number.isFinite(overlay.y) ? (overlay.y as number) : 0;
    const safeUserRotation = Number.isFinite(overlay.rotation)
      ? (overlay.rotation as number)
      : 0;
    const overlayCenterX = overlayTranslateX + fittedWidth / 2 + safeUserX;
    const overlayCenterY = overlayTranslateY + fittedHeight / 2 + safeUserY;
    return (
      <g
        key={overlay.id}
        transform={`translate(${overlayCenterX} ${overlayCenterY}) rotate(${safeUserRotation}) scale(${safeUserScale}) translate(${-fittedWidth / 2} ${-fittedHeight / 2})`}
      >
        <g
          transform={`scale(${overlayScale}) translate(${-vbX} ${-vbY})`}
          dangerouslySetInnerHTML={{ __html: overlay.svg ?? "" }}
        />
      </g>
    );
  };

  if (isAmericanFootball) {
    return (
      <svg
        width="40"
        ref={svgRef}
        height="30"
        viewBox="0 0 40 30"
        fill="none"
        className={
          size == "xsmall"
            ? "size-12"
            : size == "small"
              ? "size-20"
              : size == "medium"
                ? "size-64"
                : "size-96"
        }
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.7715 1.03031C21.7099 0.705174 25.4263 3.10172 27.6357 5.62992C28.7299 6.88194 29.4445 8.15247 29.8857 9.10941C30.1068 9.58883 30.2612 9.9932 30.3613 10.2823C30.4114 10.4269 30.4478 10.5433 30.4727 10.626C30.4804 10.6517 30.4867 10.6743 30.4922 10.6934L30.5342 10.8311C30.7153 11.5185 30.4964 12.1661 30.3359 12.5293C30.2404 12.7456 30.1363 12.927 30.0566 13.0537C30.0163 13.1179 29.98 13.1707 29.9531 13.209C29.9398 13.228 29.9287 13.2438 29.9199 13.2559C29.9155 13.262 29.9114 13.2673 29.9082 13.2715C29.9067 13.2736 29.9055 13.2758 29.9043 13.2774L29.9014 13.2803V13.2813C29.7735 13.4495 29.5949 13.573 29.3926 13.6338C28.0454 14.0391 27.2251 14.6055 26.7207 15.1709C26.2177 15.7349 25.9796 16.3534 25.8838 16.9434C25.7866 17.5423 25.8372 18.1104 25.918 18.5381C25.9579 18.7495 26.0037 18.9202 26.0381 19.0332C26.0454 19.0572 26.0526 19.0783 26.0586 19.0967C26.065 19.1066 26.0722 19.1171 26.0791 19.128C26.1396 19.2237 26.2202 19.3586 26.3096 19.5274C26.4878 19.8638 26.7065 20.3447 26.8721 20.9327C27.2046 22.1134 27.3303 23.7593 26.457 25.501C25.5368 27.3362 23.7312 28.2228 22.1025 28.6368C20.4607 29.054 18.8035 29.0461 17.8555 28.9356L17.8506 28.9346C17.5155 28.8938 17.2007 28.8211 16.9268 28.753C16.9219 28.7517 16.917 28.7503 16.9121 28.7491C16.2831 28.5824 15.648 28.3596 15.0996 28.1592C14.5323 27.9519 13.982 27.7234 13.4473 27.4961C13.0508 27.3289 12.6642 27.1525 12.2734 26.9502L12.2695 26.9483C12.2344 26.93 12.181 26.9115 12.0723 26.9053C11.9457 26.8982 11.8064 26.9087 11.5713 26.9268L11.5703 26.9258C11.106 26.966 10.6599 27.0372 10.1543 27.1368C9.64256 27.2376 9.13191 27.355 8.61133 27.4805C8.20052 27.5847 7.80348 27.6861 7.4082 27.7969C7.18465 27.8621 7.10208 27.8807 6.92383 27.9346C6.48095 28.0684 6.00368 27.8811 5.77051 27.4815L4.35938 25.0606C2.59144 22.4415 1.754 19.7889 1.35742 17.794C1.15826 16.792 1.0685 15.9501 1.0293 15.3535C1.00968 15.0551 1.00313 14.817 1.00098 14.6504C0.999901 14.5672 0.999498 14.5016 1 14.4551C1.00025 14.4322 1.00068 14.4139 1.00098 14.4004C1.00113 14.3936 1.00183 14.3872 1.00195 14.3828V14.3711C1.00226 14.3572 1.00306 14.3389 1.00391 14.3164C1.00562 14.2709 1.00812 14.2076 1.01367 14.1289C1.02478 13.9717 1.04633 13.7508 1.08594 13.4766C1.1652 12.928 1.31918 12.1634 1.62012 11.2705C2.22297 9.48194 3.41525 7.17658 5.7627 5.06839L6.20312 4.68656C8.41483 2.83824 10.7225 1.92265 12.5137 1.47074C13.4692 1.22966 14.2824 1.11944 14.8623 1.06937C15.1521 1.04436 15.3846 1.03491 15.5488 1.03128C15.6309 1.02947 15.6965 1.02902 15.7432 1.02933C15.7535 1.0294 15.763 1.0302 15.7715 1.03031Z"
          fill={baseColor}
          stroke="#D8E2ED"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30.2557 10.365C30.5386 10.2382 30.8776 10.354 31.0077 10.6296C31.1434 10.9053 31.019 11.2362 30.7362 11.363L26.2333 13.4304L28.66 19.6384L36.1961 18.1111C36.4789 18.0561 36.7676 18.216 36.8524 18.4861L37.4803 20.4597C37.4816 20.4638 37.4811 20.4683 37.4823 20.4724C38.6748 23.5926 37.4458 27.2779 37.3895 27.4314C37.3103 27.6627 37.1406 27.8112 36.9032 27.8113H36.8573C36.8133 27.8113 36.7321 27.7956 36.7274 27.7947L30.7528 26.405C30.5833 26.3663 30.4474 26.2565 30.3739 26.1023L28.785 22.7986C25.581 23.293 23.9821 23.5413 23.8172 23.5417H23.7049C23.6088 23.5417 23.405 23.5411 19.5018 22.3503C19.3434 22.3007 19.2181 22.1906 19.1503 22.0417C19.0825 21.8929 19.0885 21.727 19.162 21.5837L21.8378 16.2253C21.8532 16.1915 21.8751 16.1612 21.8993 16.1326C21.9064 16.1234 21.9141 16.1148 21.9217 16.1062C21.9259 16.1019 21.9301 16.0967 21.9344 16.0925L25.0965 12.78C25.1475 12.7249 25.2095 12.6803 25.2831 12.6472L30.2557 10.365ZM29.9286 22.5896L31.2733 25.3913L36.4559 26.5925C36.714 25.6067 37.1758 23.3032 36.5585 21.2595L29.9286 22.5896ZM20.4745 21.4851H20.4686C21.8094 21.8931 23.3995 22.3617 23.7333 22.4333C24.0785 22.3943 26.475 22.0281 28.3202 21.7458L27.9305 20.8152H27.1327C26.9631 20.8152 26.8046 20.7436 26.6971 20.6169L22.5516 17.3171L20.4745 21.4851ZM29.0858 20.6667L29.4559 21.5515L36.2128 20.1951L35.9247 19.28L29.0858 20.6667ZM23.1688 16.4128L27.3924 19.7126H27.4852L25.3114 14.1638L23.1688 16.4128Z"
          fill={neckCircleColor ?? "#9D7D2D"}
        />
        {resolvedOverlays.map(renderOverlay)}
        <circle cx="14.2656" cy="20.7013" r="2.0498" fill="#D8E2ED" />
      </svg>
    );
  }

  if (isFormulaOne) {
    return (
      <svg
        width="38"
        ref={svgRef}
        height="29"
        viewBox="0 0 38 29"
        fill="none"
        className={
          size == "xsmall"
            ? "size-12"
            : size == "small"
              ? "size-20"
              : size == "medium"
                ? "size-64"
                : "size-96"
        }
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.7715 1.03031C21.7099 0.705178 25.4263 3.10173 27.6357 5.62992C28.7299 6.88194 29.4445 8.15247 29.8857 9.10941C30.1068 9.58883 30.2612 9.9932 30.3613 10.2823C30.4114 10.4269 30.4478 10.5433 30.4727 10.626C30.4791 10.6475 30.4844 10.6668 30.4893 10.6836C31.332 12.8791 31.836 14.3529 32.292 16.7452L32.4863 17.836L32.4922 17.876V17.878C32.4923 17.8789 32.493 17.8805 32.4932 17.8819C32.4935 17.8846 32.4936 17.8882 32.4941 17.8926C32.4953 17.9021 32.4971 17.9157 32.499 17.9327C32.5029 17.9664 32.5084 18.0147 32.5146 18.0762C32.5272 18.1996 32.5432 18.377 32.5596 18.5977C32.5922 19.0388 32.625 19.6581 32.625 20.375C32.625 21.7904 32.4984 23.666 31.9482 25.3164C31.8009 25.758 31.3687 26.0393 30.9053 25.9952C22.9953 25.2418 14.512 25.6396 6.92383 27.9346C6.48095 28.0684 6.00368 27.8811 5.77051 27.4815L4.36035 25.0625C2.59159 22.4429 1.75409 19.7894 1.35742 17.794C1.15826 16.792 1.0685 15.9501 1.0293 15.3536C1.00968 15.0551 1.00313 14.817 1.00098 14.6504C0.999901 14.5672 0.999498 14.5016 1 14.4551C1.00025 14.4322 1.00068 14.4139 1.00098 14.4004C1.00113 14.3936 1.00183 14.3872 1.00195 14.3829V14.3711C1.00226 14.3572 1.00306 14.3389 1.00391 14.3164C1.00562 14.2709 1.00812 14.2076 1.01367 14.1289C1.02478 13.9717 1.04633 13.7508 1.08594 13.4766C1.1652 12.928 1.31918 12.1634 1.62012 11.2705C2.22297 9.48195 3.41525 7.17658 5.7627 5.0684L6.20312 4.68656C8.41483 2.83824 10.7225 1.92265 12.5137 1.47074C13.4692 1.22966 14.2824 1.11945 14.8623 1.06937C15.1521 1.04436 15.3846 1.03492 15.5488 1.03129C15.6309 1.02948 15.6965 1.02903 15.7432 1.02934C15.7535 1.0294 15.763 1.0302 15.7715 1.03031Z"
          fill={baseColor}
          stroke="#D8E2ED"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          opacity={neckCircleColor ? undefined : "0.75"}
          d="M22.5002 18.4997C14.5002 17.4997 13.2927 9.71939 16.0002 10.4997C18.7077 11.28 27.7729 10.9271 29.3899 10.5387C29.4985 10.8446 29.5461 11.0221 29.5461 11.0221V11.0163C30.4839 13.4577 30.9812 14.9493 31.4729 17.8493C30.6121 18.3027 26.9913 19.061 22.5002 18.4997Z"
          fill={neckCircleColor ?? darker}
        />
        {resolvedOverlays.map(renderOverlay)}
      </svg>
    );
  }

  return (
    <svg
      width={isBasketball ? "28" : isHockey ? "34" : "36"}
      ref={svgRef}
      height={isBasketball ? "40" : isHockey ? "41" : "41"}
      viewBox={
        isBasketball ? "0 0 28 40" : isHockey ? "0 0 34 41" : "0 0 36 41"
      }
      fill="none"
      className={
        size == "xsmall"
          ? "size-12"
          : size == "small"
            ? "size-20"
            : size == "medium"
              ? "size-64"
              : "size-96"
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      {isBasketball ? (
        <path
          d="M20.3525 1L20.5127 1.0127C20.631 1.03191 20.7434 1.07512 20.8476 1.13477L20.8496 1.13281L24.1924 3.02734C24.5451 3.22738 24.7424 3.62109 24.6914 4.02344L23.4521 13.7939L26.581 16.2891C26.639 16.3353 26.6919 16.3884 26.7383 16.4463L26.7392 16.4473L26.7402 16.4492C26.741 16.4502 26.7423 16.451 26.7431 16.4521C26.7449 16.4544 26.7468 16.4571 26.749 16.46C26.7534 16.4656 26.7603 16.4735 26.7676 16.4834C26.7743 16.4926 26.7849 16.5089 26.7978 16.5283C26.8018 16.5342 26.8066 16.5399 26.8105 16.5459C26.8564 16.6159 26.899 16.6982 26.9326 16.793C26.9918 16.96 27.0115 17.14 26.9961 17.3252L26.997 17.3262V17.3389C26.9966 17.3474 26.995 17.3603 26.9941 17.377C26.9923 17.4106 26.9899 17.4605 26.9863 17.5254C26.9791 17.6556 26.9685 17.8466 26.9551 18.0898C26.9282 18.5765 26.89 19.2724 26.8437 20.1084C26.7511 21.7806 26.6263 24.015 26.501 26.2607C26.2522 30.7173 25.9938 35.3102 25.9677 35.541C25.943 35.7598 25.8846 36.1784 25.5605 36.5176C25.2448 36.8478 24.8358 36.9337 24.6269 36.9736C24.2381 37.048 14.4263 38.9368 14.1943 38.9814L14.1933 38.9805C14.1325 38.9921 14.0703 39 14.0068 39H13.997C13.9336 39 13.8699 38.9944 13.8076 38.9824C13.552 38.9332 3.77117 37.049 3.37693 36.9736H3.37595C3.16719 36.9337 2.75898 36.8476 2.44334 36.5186C2.11849 36.1796 2.05899 35.761 2.03416 35.541C2.00812 35.3102 1.75041 30.7164 1.50193 26.2598C1.37672 24.0141 1.25267 21.7805 1.16013 20.1084C1.11386 19.2724 1.07568 18.5765 1.0488 18.0898C1.03537 17.8466 1.02474 17.6556 1.01755 17.5254C1.01397 17.4605 1.01062 17.4106 1.00876 17.377C1.00785 17.3604 1.00728 17.3474 1.00681 17.3389C1.00659 17.3348 1.00693 17.3312 1.00681 17.3291L1.00584 17.3262C1.00583 17.3262 1.00616 17.3253 1.00779 17.3252C0.992307 17.1401 1.01112 16.9599 1.07029 16.793C1.1039 16.6982 1.1474 16.6159 1.19334 16.5459C1.20085 16.5344 1.21015 16.5244 1.21775 16.5137C1.226 16.5015 1.23015 16.4908 1.23337 16.4863C1.28666 16.4124 1.34964 16.3459 1.42087 16.2891L4.55076 13.793L3.31248 4.02344C3.26146 3.62107 3.45867 3.22737 3.8115 3.02734L7.1533 1.13281V1.13477C7.30492 1.04752 7.4762 1 7.65134 1H20.3525Z"
          fill={baseColor}
          stroke="#D8E2ED"
          strokeWidth="2"
        />
      ) : (
        <>
          <path
            d={
              isHockey
                ? "M21.3438 1L21.5771 1.00684C22.0431 1.03357 22.5016 1.13994 22.9316 1.32227L23.1445 1.41992L26.0166 2.83984C26.6691 3.16232 27.3089 3.4785 27.7852 3.71387C28.023 3.83145 28.2207 3.92901 28.3584 3.99707C28.4269 4.03092 28.4809 4.05705 28.5176 4.0752C28.536 4.08428 28.5501 4.09199 28.5596 4.09668C28.5642 4.09896 28.5679 4.10037 28.5703 4.10156C28.5715 4.10216 28.5726 4.10322 28.5732 4.10352H28.5742L28.6279 4.12988L28.6787 4.16309L28.6797 4.16406C28.6807 4.16473 28.6826 4.16568 28.6846 4.16699C28.6886 4.16961 28.6944 4.17364 28.7021 4.17871C28.7177 4.18889 28.7411 4.20344 28.7705 4.22266C28.8292 4.26108 28.9133 4.3172 29.0166 4.38477C29.2232 4.51994 29.5052 4.70377 29.8057 4.90039C30.4065 5.2936 31.0842 5.73705 31.3848 5.93457C31.7722 6.18924 32.0607 6.57045 32.1982 7.01367L32.248 7.20703L32.2715 7.40039C32.2748 7.44517 32.2783 7.50282 32.2822 7.56934C32.2902 7.7037 32.3009 7.89079 32.3125 8.12012C32.3357 8.5795 32.3656 9.22087 32.4004 9.98242C32.47 11.5062 32.5585 13.5182 32.6455 15.5381C32.8195 19.5775 32.9889 23.6521 33 23.9229C33.034 24.7533 32.566 25.9598 31.2891 26.1396C31.0192 26.1777 29.7875 26.3857 28.5957 26.5889C28.0301 26.6853 27.4809 26.7787 27.0625 26.8506C26.8442 29.1525 26.2037 35.9079 26.167 36.2949C26.0776 37.2358 25.3413 37.9769 24.4121 38.0918L17.124 38.9922L17.001 39.0078L16.8789 38.9922L9.59082 38.0918H9.58984C8.66109 37.9767 7.92533 37.2358 7.83594 36.2949C7.81378 36.0613 7.57136 33.5095 7.33496 31.0166C7.21677 29.7703 7.09996 28.5383 7.0127 27.6182C6.9852 27.3283 6.9602 27.0693 6.93945 26.8506C5.65105 26.6294 3.12486 26.1977 2.71289 26.1396C1.43643 25.9596 0.967992 24.7534 1.00195 23.9229C1.01302 23.6523 1.18343 19.5784 1.35742 15.5391C1.44443 13.519 1.53198 11.5064 1.60156 9.98242C1.63634 9.2207 1.6672 8.57959 1.69043 8.12012C1.70202 7.891 1.71173 7.70468 1.71973 7.57031C1.7237 7.50359 1.72712 7.44528 1.73047 7.40039C1.7312 7.38996 1.73701 7.2916 1.75391 7.20801L1.75488 7.20703C1.86162 6.68158 2.17558 6.22549 2.61816 5.93457C2.91885 5.73697 3.59563 5.29349 4.19629 4.90039C4.4967 4.70379 4.7787 4.51996 4.98535 4.38477C5.08872 4.31714 5.17368 4.26108 5.23242 4.22266C5.26151 4.20363 5.2843 4.18885 5.2998 4.17871C5.30742 4.17373 5.31338 4.16961 5.31738 4.16699C5.31937 4.1657 5.32125 4.16473 5.32227 4.16406L5.32324 4.16309L5.37402 4.12988L5.42773 4.10352H5.42871C5.42931 4.10322 5.43047 4.10214 5.43164 4.10156C5.43401 4.10039 5.43775 4.09897 5.44238 4.09668C5.45187 4.09199 5.46599 4.08428 5.48438 4.0752C5.52115 4.05702 5.57571 4.03109 5.64453 3.99707C5.78219 3.92903 5.97907 3.83136 6.2168 3.71387C6.6928 3.47861 7.33213 3.16221 7.98438 2.83984C9.28819 2.19543 10.645 1.52487 10.8574 1.41992C11.4173 1.14323 12.0345 1.00011 12.6582 1H21.3438Z" //"M21.3413 1C21.9651 1.00008 22.5821 1.14322 23.1421 1.41992L28.5718 4.10352L28.6255 4.12988L28.6762 4.16309L31.3803 5.93359L31.3823 5.93457C31.7697 6.18923 32.0582 6.57042 32.1958 7.01367L32.2456 7.20703L32.2612 7.28418L32.2641 7.3623L32.9975 23.9199V23.9229C33.0313 24.7475 32.5697 25.941 31.313 26.1338L31.3139 26.1357L27.0591 26.8535L26.1645 36.2949C26.0752 37.2358 25.3388 37.9769 24.4096 38.0918L17.1216 38.9922L16.9985 39.0078L16.8764 38.9922L9.59031 38.0918H9.58933C8.66062 37.9767 7.92482 37.2358 7.83542 36.2949L6.93992 26.8535L2.68601 26.1357V26.1338C1.50891 25.953 1.02947 24.8944 1.00144 24.083V23.9199L1.73484 7.3623L1.73874 7.28418L1.75437 7.20703C1.86111 6.68157 2.1751 6.22548 2.61765 5.93457L2.61863 5.93359L5.32273 4.16309L5.37351 4.12988L5.42722 4.10352L10.8569 1.41992L11.0698 1.32227C11.5715 1.1095 12.112 1.0001 12.6577 1H21.3413Z"
                : "M22.3417 1C22.9661 1 23.583 1.14346 24.1425 1.41992L29.5722 4.10352L29.6278 4.13086L29.6796 4.16504L32.3661 5.93555C32.8098 6.22791 33.1215 6.68472 33.2274 7.20801L34.9589 15.7646C35.1892 16.9029 34.403 17.9795 33.2694 18.1396L28.827 18.7666L27.1649 36.2949C27.0756 37.2366 26.3395 37.9769 25.411 38.0918L18.122 38.9922L17.9999 39.0078L17.8768 38.9922L10.5888 38.0918C9.66014 37.977 8.92321 37.2367 8.83388 36.2949L7.17079 18.7656L2.73036 18.1396C1.59668 17.9796 0.810574 16.9029 1.04091 15.7646L2.77235 7.20801C2.87822 6.68484 3.18922 6.22792 3.63271 5.93555L6.32021 4.16504L6.37099 4.13086L6.42665 4.10352L11.8563 1.41992C12.4159 1.14342 13.0327 1.00003 13.6571 1H22.3417Z"
            }
            fill={isHockey ? "#D8E2ED" : "#D8E2ED"}
            stroke="#D8E2ED"
            strokeWidth="2"
          />
          <mask
            id="mask0_399_81"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="1"
            y="5"
            width={isHockey ? "7" : "8"}
            height={isHockey ? "21" : "13"}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d={
                isHockey
                  ? "M5.86949 5L3.16619 6.77024C2.96435 6.90286 2.81814 7.10184 2.75264 7.3303C2.73831 7.38029 2.73294 7.43226 2.73064 7.48421L2.00044 23.9634C1.9805 24.5 2.27523 25.0683 2.85184 25.1495L7.88949 26L5.86949 5Z"
                  : "M6.86752 5L4.18085 6.77024C3.95757 6.91735 3.80257 7.1461 3.74994 7.40617L2.01831 15.9634C1.90439 16.5264 2.29235 17.0683 2.86736 17.1495L8.89111 18L6.86752 5Z"
              }
              fill="#243D7C"
            />
          </mask>
          <g mask="url(#mask0_399_81)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d={
                isHockey
                  ? "M5.86949 5L3.16619 6.77024C2.96435 6.90286 2.81814 7.10184 2.75264 7.3303C2.73831 7.38029 2.73294 7.43226 2.73064 7.48421L2.00044 23.9634C1.9805 24.5 2.27523 25.0683 2.85184 25.1495L7.88949 26L5.86949 5Z"
                  : "M6.86752 5L4.18085 6.77024C3.95757 6.91735 3.80257 7.1461 3.74994 7.40617L2.01831 15.9634C1.90439 16.5264 2.29235 17.0683 2.86736 17.1495L8.89111 18L6.86752 5Z"
              }
              fill={leftSleeveColor ? leftSleeveColor : baseColor}
            />

            {isHockey ? (
              <>
                {leftSleeveColor ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.99948 19L8.99948 20V27L1.99948 26V19Z"
                    fill={leftSleeveColor}
                  />
                ) : null}
                {sleeveStripePrimaryColor ? (
                  <>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.99948 17L8.99948 18V20L1.99948 19V17Z"
                      fill={sleeveStripePrimaryColor}
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.99948 13L8.99948 14V16L1.99948 15V13Z"
                      fill={
                        sleeveStripeTertiaryColor ?? sleeveStripePrimaryColor
                      }
                    />
                  </>
                ) : null}
                {sleeveStripeSecondaryColor ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.99948 15L8.99948 16V18L1.99948 17V15Z"
                    fill={sleeveStripeSecondaryColor}
                  />
                ) : null}
                {leftSleeveDetailColor ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.00174 19L9.00174 20V27L2.00174 26V19Z"
                    fill={leftSleeveDetailColor}
                  />
                ) : null}
              </>
            ) : leftSleeveDetailColor ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={
                  isHockey
                    ? "M1.29309 17.3008L8.70494 18.6484V22.6445L1.29309 21.2969V17.3008Z"
                    : "M1.80872 15L8.89128 16V20L1.80872 19V15Z"
                }
                fill={leftSleeveDetailColor}
              />
            ) : null}
          </g>
          <mask
            id="mask1_399_81"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x={isHockey ? "26" : "27"}
            y="5"
            width={isHockey ? "6" : "7"}
            height={isHockey ? "21" : "13"}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d={
                isHockey
                  ? "M28.1295 5L30.8326 6.77024C31.0345 6.90286 31.1807 7.10185 31.2462 7.3303C31.2605 7.38029 31.2659 7.43226 31.2682 7.48421L31.9983 23.9634C32.0205 24.5 31.7236 25.0683 31.147 25.1495L26.1095 26L28.1295 5Z"
                  : "M29.1272 5L31.8138 6.77024C32.0371 6.91735 32.1921 7.1461 32.2447 7.40617L33.9764 15.9634C34.0903 16.5264 33.7023 17.0683 33.1273 17.1495L27.1036 18L29.1272 5Z"
              }
              fill="#243D7C"
            />
          </mask>
          <g mask="url(#mask1_399_81)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d={
                isHockey
                  ? "M28.1295 5L30.8326 6.77024C31.0345 6.90286 31.1807 7.10185 31.2462 7.3303C31.2605 7.38029 31.2659 7.43226 31.2682 7.48421L31.9983 23.9634C32.0205 24.5 31.7236 25.0683 31.147 25.1495L26.1095 26L28.1295 5Z"
                  : "M29.1272 5L31.8138 6.77024C32.0371 6.91735 32.1921 7.1461 32.2447 7.40617L33.9764 15.9634C34.0903 16.5264 33.7023 17.0683 33.1273 17.1495L27.1036 18L29.1272 5Z"
              }
              fill={rightSleeveColor ? rightSleeveColor : baseColor}
            />

            {isHockey ? (
              <>
                {rightSleeveColor ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.9995 19L25.9995 20V27L32.9995 26V19Z"
                    fill={rightSleeveColor}
                  />
                ) : null}
                {sleeveStripePrimaryColor ? (
                  <>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M32.9995 17L25.9995 18V20L32.9995 19V17Z"
                      fill={sleeveStripePrimaryColor}
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M32.9995 13L25.9995 14V16L32.9995 15V13Z"
                      fill={
                        sleeveStripeTertiaryColor ?? sleeveStripePrimaryColor
                      }
                    />
                  </>
                ) : null}
                {sleeveStripeSecondaryColor ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.9995 15L25.9995 16V18L32.9995 17V15Z"
                    fill={sleeveStripeSecondaryColor}
                  />
                ) : null}
                {rightSleeveDetailColor ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M33.0017 19L26.0017 20V27L33.0017 26V19Z"
                    fill={rightSleeveDetailColor}
                  />
                ) : null}
              </>
            ) : rightSleeveDetailColor ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={
                  isHockey
                    ? "M34.7019 17.3008L27.29 18.6484V22.6445L34.7019 21.2969V17.3008Z"
                    : "M34.1863 15L27.1037 16V20L34.1863 19V15Z"
                }
                fill={rightSleeveDetailColor}
              />
            ) : null}
          </g>
        </>
      )}
      <path
        d={
          isBasketball
            ? "M7.64682 2L7.64215 2.00253L4.29982 3.89746L5.60918 14.2256L2.04059 17.0715L2.03244 17.0842L2 17.2709L3.02403 35.4285C2.99826 35.7613 3.20517 35.9911 3.55975 35.9911L13.9973 38L13.9995 38L14.0017 38L24.4392 35.9911C24.7938 35.9911 25.0008 35.7614 24.975 35.4285L25.999 17.2709C26.0067 17.208 25.9666 17.0842 25.9666 17.0842L25.9584 17.0715L22.3898 14.2256L23.6992 3.89746L20.3569 2.00253L20.3522 2H7.64682Z"
            : isHockey
              ? "M9.71018 37.0996L16.9985 38L24.2868 37.0996C24.7577 37.0414 25.1244 36.6676 25.1687 36.2006L28.1282 5L22.6984 2.31672C22.2769 2.10844 21.8121 2 21.3409 2H12.6561C12.1848 2 11.7201 2.10844 11.2986 2.31672L5.86875 5L8.82831 36.2006C8.8726 36.6676 9.2393 37.0414 9.71018 37.0996Z"
              : "M10.7091 37.0996L17.9974 38L25.2857 37.0996C25.7566 37.0414 26.1233 36.6676 26.1676 36.2006L29.1272 5L23.6973 2.31672C23.2758 2.10844 22.8111 2 22.3398 2H13.655C13.1838 2 12.719 2.10844 12.2975 2.31672L6.86769 5L9.82725 36.2006C9.87154 36.6676 10.2382 37.0414 10.7091 37.0996Z"
        }
        fill={baseColor}
      />
      <mask
        id="mask2_399_81"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x={isBasketball ? "2" : isHockey ? "5" : "6"}
        y={isBasketball ? "2" : "2"}
        width={isBasketball ? "24" : isHockey ? "24" : "24"}
        height={isBasketball ? "36" : "36"}
      >
        <path
          d={
            isBasketball
              ? "M7.64682 2L7.64215 2.00253L4.29982 3.89746L5.60918 14.2256L2.04059 17.0715L2.03244 17.0842L2 17.2709L3.02403 35.4285C2.99826 35.7613 3.20517 35.9911 3.55975 35.9911L13.9973 38L13.9995 38L14.0017 38L24.4392 35.9911C24.7938 35.9911 25.0008 35.7614 24.975 35.4285L25.999 17.2709C26.0067 17.208 25.9666 17.0842 25.9666 17.0842L25.9584 17.0715L22.3898 14.2256L23.6992 3.89746L20.3569 2.00253L20.3522 2H7.64682Z"
              : isHockey
                ? "M21.3404 2C21.8117 2 22.2773 2.10812 22.6988 2.31641L28.1285 5L25.1686 36.2002C25.1243 36.6672 24.7576 37.0414 24.2867 37.0996L16.9986 38L9.71054 37.0996C9.23966 37.0414 8.873 36.6672 8.82871 36.2002L5.86875 5L11.2984 2.31641C11.7199 2.10815 12.1847 2.00003 12.6559 2H21.3404Z"
                : "M22.3394 2C22.8106 2 23.2763 2.10812 23.6978 2.31641L29.1275 5L26.1675 36.2002C26.1232 36.6672 25.7565 37.0414 25.2857 37.0996L17.9976 38L10.7095 37.0996C10.2386 37.0414 9.87195 36.6672 9.82765 36.2002L6.86769 5L12.2974 2.31641C12.7188 2.10815 13.1836 2.00003 13.6548 2H22.3394Z"
          }
          fill="white"
        />
      </mask>
      <g mask="url(#mask2_399_81)">
        {stripesPreset &&
          renderStripePreset(
            stripesPreset,
            {
              stripePrimaryColor,
              stripeSecondaryColor,
            },
            variant,
          )}

        {horizontalStripesPreset &&
          renderHorizontalStripePreset(
            horizontalStripesPreset,
            {
              baseColor,
              stripePrimaryColor,
              stripeSecondaryColor,
              stripeTertiaryColor,
              stripeQuaternaryColor,
            },
            variant,
          )}

        {customShapePreset &&
          renderCustomShapePreset(
            customShapePreset,
            {
              baseColor,
              stripePrimaryColor,
              stripeSecondaryColor,
              stripeTertiaryColor,
            },
            variant,
          )}

        {sideStripePreset &&
          renderSideStripePreset(
            sideStripePreset,
            {
              sideStripePrimaryColor,
              sideStripeSecondaryColor,
            },
            variant,
          )}

        {resolvedOverlays.map(renderOverlay)}

        {isBasketball || isHockey ? null : shoulderPanelColor ? (
          <>
            <rect
              width={largeShoulderPanel ? "5.01781" : "3.00733"}
              height={largeShoulderPanel ? "10.3634" : "9.08443"}
              transform={
                largeShoulderPanel
                  ? "matrix(0.458229 0.888834 -0.893144 0.449771 13.6375 0.818329)"
                  : "matrix(0.458229 0.888834 -0.893144 0.449771 12.2038 1.39355)"
              }
              fill={shoulderPanelColor}
            />
            <rect
              width={largeShoulderPanel ? "5.01781" : "3.00733"}
              height={largeShoulderPanel ? "10.3634" : "9.08443"}
              transform={
                largeShoulderPanel
                  ? "matrix(-0.458229 0.888834 0.893144 0.449771 22.5377 0.817932)"
                  : "matrix(-0.458229 0.888834 0.893144 0.449771 23.6807 1.39355)"
              }
              fill={shoulderPanelColor}
            />
          </>
        ) : null}
        {isBasketball ? (
          <>
            {neckCircleColor ? (
              <circle cx="14" cy="2" r="6" fill={neckCircleColor} />
            ) : null}
            {leftNeckCircleColor ? (
              <path
                d="M8 2C8 5.31371 10.6863 8 14 8V-4C10.6863 -4 8 -1.31371 8 2Z"
                fill={leftNeckCircleColor}
              />
            ) : null}
            <circle cx="14" cy="2" r="4" fill={darker} />
          </>
        ) : isHockey ? (
          <>
            {neckCircleColor ? (
              <path
                d="M23.9995 1C23.9995 3.8 21.1994 6.6 16.9995 8C12.7994 6.6 9.99948 3.8 9.99948 1C9.99948 -2.86599 13.1335 -6 16.9995 -6C20.8655 -6 23.9995 -2.86599 23.9995 1Z"
                fill={neckCircleColor}
              />
            ) : null}
            <path
              d="M21.9995 1C21.9995 3 19.9995 5 16.9995 6C13.9995 5 11.9995 3 11.9995 1C11.9995 -1.76142 14.2381 -4 16.9995 -4C19.761 -4 21.9995 -1.76142 21.9995 1Z"
              fill={darker}
            />
          </>
        ) : isBaseball ? (
          <>
            {neckCircleColor ? (
              <path
                d="M24.9995 1C24.9995 3.8 22.1994 6.6 17.9995 8C13.7994 6.6 10.9995 3.8 10.9995 1C10.9995 -2.86599 14.1335 -6 17.9995 -6C21.8655 -6 24.9995 -2.86599 24.9995 1Z"
                fill={neckCircleColor}
              />
            ) : null}
            <path
              d="M22.9995 1C22.9995 3 20.9995 5 17.9995 6C14.9995 5 12.9995 3 12.9995 1C12.9995 -1.76142 15.2381 -4 17.9995 -4C20.761 -4 22.9995 -1.76142 22.9995 1Z"
              fill={darker}
            />
          </>
        ) : (
          <>
            {isFootballBack ? (
              <>
                <path
                  d="M13.4 2.00156C14.2 3.00156 15.8 4.10156 18 4.10156C20.2 4.10156 21.8 3.00156 22.6 2.00156V2L13.4 2.00156Z"
                  fill={neckCircleColor ?? darker}
                  opacity="0.9"
                />
              </>
            ) : (
              <>
                {neckCircleColor ? (
                  <circle cx="17.9985" cy="1" r="7" fill={neckCircleColor} />
                ) : null}
                {leftNeckCircleColor ? (
                  <path
                    d="M10.9984 1C10.9984 4.86599 14.1325 8 17.9984 8V-6C14.1325 -6 10.9984 -2.86599 10.9984 1Z"
                    fill={leftNeckCircleColor}
                  />
                ) : null}
                <circle cx="17.9986" cy="1" r="5" fill={darker} />
              </>
            )}
          </>
        )}

        {isPlayerTextMode ? (
          <g>
            {backName ? (
              safeCurveAmount > 0 ? (
                <>
                  <path
                    id={curveId}
                    d={`M ${textCenterX - (isBasketball ? 7.25 : 8)} ${safeBackNameY + curveBaselineOffset} Q ${textCenterX} ${safeBackNameY - curveBaselineOffset} ${textCenterX + (isBasketball ? 7.25 : 8)} ${safeBackNameY + curveBaselineOffset}`}
                    fill="none"
                    stroke="none"
                  />
                  <text
                    textAnchor="middle"
                    fill={backTextColor}
                    stroke={
                      footballBackTextOutlineEnabled ? backOutlineColor : "none"
                    }
                    strokeWidth={
                      footballBackTextOutlineEnabled
                        ? outlineStrokeWidthName
                        : 0
                    }
                    strokeLinejoin="round"
                    paintOrder="stroke fill"
                    fontSize={safeBackNameSize}
                    fontWeight={safeBackFontWeight}
                    letterSpacing="0.25"
                    fontFamily={`"${safeBackFontFamily}", sans-serif`}
                  >
                    <textPath
                      href={`#${curveId}`}
                      xlinkHref={`#${curveId}`}
                      startOffset="50%"
                    >
                      {backName}
                    </textPath>
                  </text>
                </>
              ) : (
                <text
                  x={textCenterX}
                  y={safeBackNameY}
                  textAnchor="middle"
                  fill={backTextColor}
                  stroke={
                    footballBackTextOutlineEnabled ? backOutlineColor : "none"
                  }
                  strokeWidth={
                    footballBackTextOutlineEnabled ? outlineStrokeWidthName : 0
                  }
                  strokeLinejoin="round"
                  paintOrder="stroke fill"
                  fontSize={safeBackNameSize}
                  fontWeight={safeBackFontWeight}
                  letterSpacing="0.25"
                  fontFamily={`"${safeBackFontFamily}", sans-serif`}
                >
                  {backName}
                </text>
              )
            ) : null}
            {backNumber ? (
              <text
                x={textCenterX}
                y={safeBackNumberY}
                textAnchor="middle"
                fill={backTextColor}
                stroke={
                  footballBackTextOutlineEnabled ? backOutlineColor : "none"
                }
                strokeWidth={
                  footballBackTextOutlineEnabled ? outlineStrokeWidthNumber : 0
                }
                strokeLinejoin="round"
                paintOrder="stroke fill"
                fontSize={
                  backNumber.length >= 3
                    ? clamp(safeBackNumberSize - 1.5, 6, 24)
                    : safeBackNumberSize
                }
                fontWeight={clamp(safeBackFontWeight + 100, 500, 900)}
                fontFamily={`"${safeBackFontFamily}", sans-serif`}
                dominantBaseline="middle"
              >
                {backNumber}
              </text>
            ) : null}
          </g>
        ) : null}
      </g>{" "}
      <path
        opacity="0.15"
        d={
          isBasketball
            ? "M13.9973 38L13.9995 38L14.0017 38L24.4392 35.9911C24.7938 35.9911 25.0008 35.7614 24.975 35.4285L25.999 17.2709C26.0067 17.208 25.9666 17.0842 25.9666 17.0842L25.9584 17.0715L22.3898 14.2256L23.6992 3.89746L20.3569 2.00253L20.3522 2H13.9995L13.9973 38Z"
            : isHockey
              ? "M21.3413 2C21.8124 2.00006 22.2773 2.10818 22.6987 2.31641L28.1284 5H28.1382L30.8325 6.77051C31.0564 6.91762 31.2123 7.1462 31.2651 7.40625L31.9985 23.9639C32.0204 24.5003 31.7234 25.0682 31.1469 25.1494L26.1362 25.9951L25.1684 36.2002C25.1241 36.6672 24.7575 37.0414 24.2866 37.0996L16.9985 38V2H21.3413Z"
              : "M25.2857 37.0996L17.9974 38V2H22.3398C22.8111 2 23.2758 2.10844 23.6973 2.31672L29.1272 5L31.8138 6.77024C32.0371 6.91735 32.1921 7.1461 32.2447 7.40617L33.9764 15.9634C34.0903 16.5264 33.7023 17.0683 33.1273 17.1495L27.9048 17.8869L26.1676 36.2006C26.1233 36.6676 25.7566 37.0414 25.2857 37.0996Z"
        }
        fill="black"
      />
    </svg>
  );
};

export default Base;
