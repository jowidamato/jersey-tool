const SPORTS = [
  "football",
  "basketball",
  "hockey",
  "american-football",
  "formula-1",
  "baseball",
  "rugby",
  "handball",
];
const FOOTBALL_LIKE_SPORTS = ["football", "baseball", "rugby", "handball"];

const COLOR_KEYS = [
  "baseColor",
  "leftSleeveColor",
  "rightSleeveColor",
  "leftSleeveDetailColor",
  "rightSleeveDetailColor",
  "neckCircleColor",
  "leftNeckCircleColor",
  "shoulderPanelColor",
  "stripePrimaryColor",
  "stripeSecondaryColor",
  "stripeTertiaryColor",
  "sleeveStripePrimaryColor",
  "sleeveStripeSecondaryColor",
  "sideStripePrimaryColor",
  "sideStripeSecondaryColor",
];

const PLAYER_TEXT_KEYS = [
  "footballBackEnabled",
  "footballBackName",
  "footballBackNumber",
  "footballBackFontFamily",
  "footballBackFontWeight",
  "footballBackTextColor",
  "footballBackTextOutlineEnabled",
  "footballBackTextOutlineColor",
  "footballBackTextOutlineWidth",
  "footballBackNameCurveAmount",
  "footballBackNameSize",
  "footballBackNumberSize",
  "footballBackNameY",
  "footballBackNumberY",
];

const REQUIRED_TOP_LEVEL_KEYS = [
  "name",
  "sport",
  "primary",
  "secondary",
  "stripesPreset",
  "horizontalStripesPreset",
  "customShapePreset",
  "sideStripePreset",
  ...COLOR_KEYS,
  ...PLAYER_TEXT_KEYS,
  "state",
];

const REQUIRED_STATE_KEYS = [...COLOR_KEYS, ...PLAYER_TEXT_KEYS];

const STRIPE_PRESETS = [
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

const HORIZONTAL_PRESETS_FOOTBALL = [
  "regularQuadStripe",
  "regularTripleStripe",
  "twoColorDoubleStripe",
  "singleBand",
  "threeColorBand",
];

const HORIZONTAL_PRESETS_BASKETBALL = [
  ...HORIZONTAL_PRESETS_FOOTBALL,
  "basketTopBand",
];

const HORIZONTAL_PRESETS_HOCKEY = [
  ...HORIZONTAL_PRESETS_FOOTBALL,
  "hockeyTripleBottomStripe",
  "hockeyTripleBottomStripeShade",
  "hockeyBottomStripeShade",
];

const CUSTOM_PRESETS_FOOTBALL = [
  "diagonalLeft",
  "diagonalRight",
  "diagonalHalfHalf1",
  "diagonalHalfHalf2",
  "arrow",
  "cross",
  "split",
];

const CUSTOM_PRESETS_BASKETBALL = [
  "diagonalLeft",
  "diagonalRight",
  "arrow",
  "cross",
  "split",
];

const CUSTOM_PRESETS_HOCKEY = [
  "diagonalLeft",
  "diagonalRight",
  "diagonalHalfHalf1",
  "arrow",
  "cross",
  "split",
  "hockeyThinArrowFill",
];

const SIDE_STRIPE_PRESETS_BASKETBALL = [
  "basketSideStripeToSleeve",
  "basketSideStripeFull",
];

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function stripCodeFence(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```[a-zA-Z0-9_-]*\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
}

function asSet(values) {
  return new Set(values);
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function isUpperHexColor(value) {
  return /^#[0-9A-F]{6}$/.test(value);
}

function getFootballLikeStripeDefaults(config) {
  const primary = isUpperHexColor(config.primary) ? config.primary : "";
  const secondary = isUpperHexColor(config.secondary) ? config.secondary : "";
  const baseColor = isUpperHexColor(config.baseColor)
    ? config.baseColor
    : primary || secondary || "";

  if (baseColor && secondary && baseColor === primary) {
    return {
      stripePrimaryColor: secondary,
      stripeSecondaryColor: primary || secondary,
    };
  }

  return {
    stripePrimaryColor: primary || secondary || baseColor || "#000000",
    stripeSecondaryColor: secondary || primary || baseColor || "#000000",
  };
}

function getMainTeamColors(config) {
  return [
    ...new Set(
      [config.primary, config.secondary].filter((value) =>
        isUpperHexColor(value),
      ),
    ),
  ];
}

function pickOppositeMainTeamColor(config, avoidColor, currentColor = "") {
  const mainColors = getMainTeamColors(config);

  if (
    isUpperHexColor(currentColor) &&
    currentColor !== avoidColor &&
    mainColors.includes(currentColor)
  ) {
    return currentColor;
  }

  return (
    mainColors.find((color) => color !== avoidColor) ||
    currentColor ||
    mainColors[0] ||
    config.baseColor ||
    "#000000"
  );
}

function validateBaseShape(config) {
  expect(
    config && typeof config === "object" && !Array.isArray(config),
    "AI did not return a JSON object",
  );

  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    expect(key in config, `Missing key: ${key}`);
  }
  for (const key of Object.keys(config)) {
    expect(REQUIRED_TOP_LEVEL_KEYS.includes(key), `Unexpected key: ${key}`);
  }

  expect(
    config.state &&
      typeof config.state === "object" &&
      !Array.isArray(config.state),
    "Missing or invalid state object",
  );

  for (const key of REQUIRED_STATE_KEYS) {
    expect(key in config.state, `Missing state key: ${key}`);
  }
  for (const key of Object.keys(config.state)) {
    expect(REQUIRED_STATE_KEYS.includes(key), `Unexpected state key: ${key}`);
  }

  for (const key of [...COLOR_KEYS, "name", "sport", "primary", "secondary"]) {
    expect(typeof config[key] === "string", `Key must be string: ${key}`);
  }
  for (const key of [
    "footballBackName",
    "footballBackNumber",
    "footballBackFontFamily",
    "footballBackTextColor",
    "footballBackTextOutlineColor",
  ]) {
    expect(typeof config[key] === "string", `Key must be string: ${key}`);
  }
  for (const key of ["footballBackEnabled", "footballBackTextOutlineEnabled"]) {
    expect(typeof config[key] === "boolean", `Key must be boolean: ${key}`);
  }
  for (const key of [
    "footballBackFontWeight",
    "footballBackTextOutlineWidth",
    "footballBackNameCurveAmount",
    "footballBackNameSize",
    "footballBackNumberSize",
    "footballBackNameY",
    "footballBackNumberY",
  ]) {
    expect(
      typeof config[key] === "number" && Number.isFinite(config[key]),
      `Key must be number: ${key}`,
    );
  }

  for (const key of [
    "stripesPreset",
    "horizontalStripesPreset",
    "customShapePreset",
    "sideStripePreset",
  ]) {
    expect(
      typeof config[key] === "string",
      `Preset key must be string: ${key}`,
    );
  }

  for (const key of COLOR_KEYS) {
    expect(
      typeof config.state[key] === "string",
      `State key must be string: ${key}`,
    );
    expect(
      config[key] === config.state[key],
      `Top-level/state mismatch for ${key}`,
    );
    if (config[key] !== "") {
      expect(isUpperHexColor(config[key]), `Invalid color format for ${key}`);
    }
  }
  for (const key of [
    "footballBackName",
    "footballBackNumber",
    "footballBackFontFamily",
    "footballBackTextColor",
    "footballBackTextOutlineColor",
  ]) {
    expect(
      typeof config.state[key] === "string",
      `State key must be string: ${key}`,
    );
    expect(
      config[key] === config.state[key],
      `Top-level/state mismatch for ${key}`,
    );
  }
  for (const key of ["footballBackEnabled", "footballBackTextOutlineEnabled"]) {
    expect(
      typeof config.state[key] === "boolean",
      `State key must be boolean: ${key}`,
    );
    expect(
      config[key] === config.state[key],
      `Top-level/state mismatch for ${key}`,
    );
  }
  for (const key of [
    "footballBackFontWeight",
    "footballBackTextOutlineWidth",
    "footballBackNameCurveAmount",
    "footballBackNameSize",
    "footballBackNumberSize",
    "footballBackNameY",
    "footballBackNumberY",
  ]) {
    expect(
      typeof config.state[key] === "number" &&
        Number.isFinite(config.state[key]),
      `State key must be number: ${key}`,
    );
    expect(
      config[key] === config.state[key],
      `Top-level/state mismatch for ${key}`,
    );
  }

  if (config.primary !== "")
    expect(isUpperHexColor(config.primary), "Invalid primary color");
  if (config.secondary !== "")
    expect(isUpperHexColor(config.secondary), "Invalid secondary color");
}

function validateFootball(config, sportName = "football") {
  expect(config.sport === sportName, `Sport must be ${sportName}`);
  expect(
    asSet(["", ...STRIPE_PRESETS]).has(config.stripesPreset),
    `Invalid ${sportName} stripesPreset`,
  );
  expect(
    asSet(["", ...HORIZONTAL_PRESETS_FOOTBALL]).has(
      config.horizontalStripesPreset,
    ),
    `Invalid ${sportName} horizontalStripesPreset`,
  );
  expect(
    asSet(["", ...CUSTOM_PRESETS_FOOTBALL]).has(config.customShapePreset),
    `Invalid ${sportName} customShapePreset`,
  );
  expect(
    config.sideStripePreset === "",
    `${sportName} sideStripePreset must be empty`,
  );
  expect(
    config.sideStripePrimaryColor === "",
    `${sportName} sideStripePrimaryColor must be empty`,
  );
  expect(
    config.sideStripeSecondaryColor === "",
    `${sportName} sideStripeSecondaryColor must be empty`,
  );
  expect(
    config.sleeveStripePrimaryColor === "",
    `${sportName} sleeveStripePrimaryColor must be empty`,
  );
  expect(
    config.sleeveStripeSecondaryColor === "",
    `${sportName} sleeveStripeSecondaryColor must be empty`,
  );
}

function validateBasketball(config) {
  expect(config.sport === "basketball", "Sport must be basketball");
  expect(
    asSet(["", ...STRIPE_PRESETS]).has(config.stripesPreset),
    "Invalid basketball stripesPreset",
  );
  expect(
    asSet(["", ...HORIZONTAL_PRESETS_BASKETBALL]).has(
      config.horizontalStripesPreset,
    ),
    "Invalid basketball horizontalStripesPreset",
  );
  expect(
    asSet(["", ...CUSTOM_PRESETS_BASKETBALL]).has(config.customShapePreset),
    "Invalid basketball customShapePreset",
  );
  expect(
    asSet(["", ...SIDE_STRIPE_PRESETS_BASKETBALL]).has(config.sideStripePreset),
    "Invalid basketball sideStripePreset",
  );
  expect(
    config.leftSleeveColor === "",
    "basketball leftSleeveColor must be empty",
  );
  expect(
    config.rightSleeveColor === "",
    "basketball rightSleeveColor must be empty",
  );
  expect(
    config.leftSleeveDetailColor === "",
    "basketball leftSleeveDetailColor must be empty",
  );
  expect(
    config.rightSleeveDetailColor === "",
    "basketball rightSleeveDetailColor must be empty",
  );
  expect(
    config.sleeveStripePrimaryColor === "",
    "basketball sleeveStripePrimaryColor must be empty",
  );
  expect(
    config.sleeveStripeSecondaryColor === "",
    "basketball sleeveStripeSecondaryColor must be empty",
  );
  expect(
    config.shoulderPanelColor === "",
    "basketball shoulderPanelColor must be empty",
  );
}

function validateHockey(config) {
  expect(config.sport === "hockey", "Sport must be hockey");
  expect(
    asSet(["", ...STRIPE_PRESETS]).has(config.stripesPreset),
    "Invalid hockey stripesPreset",
  );
  expect(
    asSet(["", ...HORIZONTAL_PRESETS_HOCKEY]).has(
      config.horizontalStripesPreset,
    ),
    "Invalid hockey horizontalStripesPreset",
  );
  expect(
    asSet(["", ...CUSTOM_PRESETS_HOCKEY]).has(config.customShapePreset),
    "Invalid hockey customShapePreset",
  );
  expect(
    config.sideStripePreset === "",
    "hockey sideStripePreset must be empty",
  );
  expect(
    config.sideStripePrimaryColor === "",
    "hockey sideStripePrimaryColor must be empty",
  );
  expect(
    config.sideStripeSecondaryColor === "",
    "hockey sideStripeSecondaryColor must be empty",
  );
  expect(
    config.leftSleeveDetailColor === "",
    "hockey leftSleeveDetailColor must be empty",
  );
  expect(
    config.rightSleeveDetailColor === "",
    "hockey rightSleeveDetailColor must be empty",
  );
  expect(
    config.shoulderPanelColor === "",
    "hockey shoulderPanelColor must be empty",
  );
  expect(
    config.leftNeckCircleColor === "",
    "hockey leftNeckCircleColor must be empty",
  );
}

function validateAmericanFootball(config) {
  expect(
    config.sport === "american-football",
    "Sport must be american-football",
  );
  expect(
    config.stripesPreset === "",
    "american-football stripesPreset must be empty",
  );
  expect(
    config.horizontalStripesPreset === "",
    "american-football horizontalStripesPreset must be empty",
  );
  expect(
    config.customShapePreset === "",
    "american-football customShapePreset must be empty",
  );
  expect(
    config.sideStripePreset === "",
    "american-football sideStripePreset must be empty",
  );
  expect(
    config.leftNeckCircleColor === "",
    "american-football leftNeckCircleColor must be empty",
  );
  for (const key of [
    "leftSleeveColor",
    "rightSleeveColor",
    "leftSleeveDetailColor",
    "rightSleeveDetailColor",
    "shoulderPanelColor",
    "stripePrimaryColor",
    "stripeSecondaryColor",
    "stripeTertiaryColor",
    "sleeveStripePrimaryColor",
    "sleeveStripeSecondaryColor",
    "sideStripePrimaryColor",
    "sideStripeSecondaryColor",
  ]) {
    expect(config[key] === "", `american-football ${key} must be empty`);
  }
}

function validateFormulaOne(config) {
  expect(config.sport === "formula-1", "Sport must be formula-1");
  expect(config.stripesPreset === "", "formula-1 stripesPreset must be empty");
  expect(
    config.horizontalStripesPreset === "",
    "formula-1 horizontalStripesPreset must be empty",
  );
  expect(
    config.customShapePreset === "",
    "formula-1 customShapePreset must be empty",
  );
  expect(
    config.sideStripePreset === "",
    "formula-1 sideStripePreset must be empty",
  );
  expect(
    config.leftNeckCircleColor === "",
    "formula-1 leftNeckCircleColor must be empty",
  );
  for (const key of [
    "leftSleeveColor",
    "rightSleeveColor",
    "leftSleeveDetailColor",
    "rightSleeveDetailColor",
    "shoulderPanelColor",
    "stripePrimaryColor",
    "stripeSecondaryColor",
    "stripeTertiaryColor",
    "sleeveStripePrimaryColor",
    "sleeveStripeSecondaryColor",
    "sideStripePrimaryColor",
    "sideStripeSecondaryColor",
  ]) {
    expect(config[key] === "", `formula-1 ${key} must be empty`);
  }
}

function wantsAsymmetricSideStripes(designBrief) {
  const text = String(designBrief || "").toLowerCase();
  return (
    text.includes("asymmetric") ||
    text.includes("asymmetrical") ||
    text.includes("different side stripe") ||
    text.includes("left and right different") ||
    text.includes("left/right different")
  );
}

function darkenHex(hex, amount = 0.2) {
  const value = String(hex || "")
    .trim()
    .toUpperCase();
  if (!isUpperHexColor(value)) return "";
  const r = parseInt(value.slice(1, 3), 16);
  const g = parseInt(value.slice(3, 5), 16);
  const b = parseInt(value.slice(5, 7), 16);
  const factor = Math.max(0, Math.min(1, 1 - amount));
  const toHex = (n) =>
    Math.round(n * factor)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function briefAllowsNeutralBlackWhite(designBrief) {
  const text = String(designBrief || "").toLowerCase();
  return (
    text.includes("black") ||
    text.includes("white") ||
    text.includes("monochrome") ||
    text.includes("grayscale")
  );
}

function wantsDetailedFootballLikeDesign(designBrief) {
  const text = String(designBrief || "").toLowerCase();
  return (
    text.includes("custom") ||
    text.includes("diagonal") ||
    text.includes("split") ||
    text.includes("cross") ||
    text.includes("arrow") ||
    text.includes("horizontal") ||
    text.includes("band") ||
    text.includes("collar accent") ||
    text.includes("left neck") ||
    text.includes("asymmetric collar") ||
    text.includes("contrast sleeve") ||
    text.includes("sleeve detail") ||
    text.includes("shoulder panel")
  );
}

function wantsFootballLikeCollarAccent(designBrief) {
  const text = String(designBrief || "").toLowerCase();
  return (
    text.includes("asymmetric collar") ||
    text.includes("contrast collar") ||
    text.includes("left neck") ||
    text.includes("split collar")
  );
}

function syncStateColors(config) {
  for (const key of [...COLOR_KEYS, ...PLAYER_TEXT_KEYS]) {
    config.state[key] = config[key];
  }
}

function normalizePlayerText(config, sport, includePlayerText) {
  const supported =
    FOOTBALL_LIKE_SPORTS.includes(sport) ||
    sport === "basketball" ||
    sport === "hockey";
  const enabled = !!includePlayerText && supported;

  config.footballBackEnabled = enabled;
  config.footballBackName = enabled ? config.footballBackName || "PLAYER" : "";
  config.footballBackNumber = enabled
    ? String(config.footballBackNumber || "10")
        .replace(/[^0-9]/g, "")
        .slice(0, 3) || "10"
    : "";
  config.footballBackFontFamily =
    config.footballBackFontFamily || "Barlow Condensed";
  config.footballBackFontWeight = Number.isFinite(config.footballBackFontWeight)
    ? config.footballBackFontWeight
    : 700;
  config.footballBackTextColor = config.footballBackTextColor || "";
  config.footballBackTextOutlineEnabled =
    !!config.footballBackTextOutlineEnabled;
  config.footballBackTextOutlineColor =
    config.footballBackTextOutlineColor || "#000000";
  config.footballBackTextOutlineWidth = Number.isFinite(
    config.footballBackTextOutlineWidth,
  )
    ? config.footballBackTextOutlineWidth
    : 2;

  const isBasket = sport === "basketball";
  config.footballBackNameCurveAmount = Number.isFinite(
    config.footballBackNameCurveAmount,
  )
    ? config.footballBackNameCurveAmount
    : 0;
  config.footballBackNameSize = Number.isFinite(config.footballBackNameSize)
    ? config.footballBackNameSize
    : 4;
  config.footballBackNumberSize = Number.isFinite(config.footballBackNumberSize)
    ? config.footballBackNumberSize
    : 16;
  config.footballBackNameY = Number.isFinite(config.footballBackNameY)
    ? config.footballBackNameY
    : isBasket
      ? 13.5
      : 11;
  config.footballBackNumberY = Number.isFinite(config.footballBackNumberY)
    ? config.footballBackNumberY
    : isBasket
      ? 25.5
      : 21;

  if (!enabled) {
    config.footballBackName = "";
    config.footballBackNumber = "";
  }

  syncStateColors(config);
}

function normalizeHockeyConfig(config, designBrief) {
  if (config.sport !== "hockey") return;

  const shadePreset = new Set([
    "hockeyTripleBottomStripeShade",
    "hockeyBottomStripeShade",
    "hockeyThinArrowFill",
  ]);
  const palette = new Set([
    config.primary,
    config.secondary,
    config.baseColor,
    config.leftSleeveColor,
    config.rightSleeveColor,
    config.stripePrimaryColor,
    config.stripeSecondaryColor,
  ]);
  const allowsNeutral = briefAllowsNeutralBlackWhite(designBrief);
  const sleeveBase = config.leftSleeveColor || config.baseColor;

  if (
    shadePreset.has(config.horizontalStripesPreset) &&
    (!isUpperHexColor(config.stripeTertiaryColor) ||
      (!palette.has(config.stripeTertiaryColor) &&
        ["#000000", "#FFFFFF"].includes(config.stripeTertiaryColor) &&
        !allowsNeutral))
  ) {
    config.stripeTertiaryColor = darkenHex(
      config.baseColor || config.primary,
      0.2,
    );
  }

  if (
    config.sleeveStripePrimaryColor !== "" &&
    (config.sleeveStripeSecondaryColor === "" ||
      ((!palette.has(config.sleeveStripeSecondaryColor) ||
        config.sleeveStripeSecondaryColor !== sleeveBase) &&
        ["#000000", "#FFFFFF"].includes(config.sleeveStripeSecondaryColor) &&
        !allowsNeutral))
  ) {
    config.sleeveStripeSecondaryColor = sleeveBase;
  }

  syncStateColors(config);
}

function normalizeBasketballConfig(config, designBrief) {
  if (config.sport !== "basketball") return;
  if (!config.sideStripePreset) return;

  const palette = [config.primary, config.secondary, config.baseColor].filter(
    (c) => isUpperHexColor(c),
  );
  const fallback = palette[0] || "#000000";

  if (!config.sideStripePrimaryColor && config.sideStripeSecondaryColor) {
    config.sideStripePrimaryColor = config.sideStripeSecondaryColor;
  }
  if (!config.sideStripeSecondaryColor && config.sideStripePrimaryColor) {
    config.sideStripeSecondaryColor = config.sideStripePrimaryColor;
  }
  if (!config.sideStripePrimaryColor && !config.sideStripeSecondaryColor) {
    config.sideStripePrimaryColor = fallback;
    config.sideStripeSecondaryColor = fallback;
  }

  if (
    config.sideStripePrimaryColor &&
    !palette.includes(config.sideStripePrimaryColor)
  ) {
    config.sideStripePrimaryColor = fallback;
  }
  if (
    config.sideStripeSecondaryColor &&
    !palette.includes(config.sideStripeSecondaryColor)
  ) {
    config.sideStripeSecondaryColor = fallback;
  }

  if (!wantsAsymmetricSideStripes(designBrief)) {
    config.sideStripeSecondaryColor = config.sideStripePrimaryColor || fallback;
  }

  syncStateColors(config);
}

function normalizeFootballLikeConfig(config, designBrief) {
  if (!FOOTBALL_LIKE_SPORTS.includes(config.sport)) return;

  const detailed = wantsDetailedFootballLikeDesign(designBrief);
  const allowAccent = wantsFootballLikeCollarAccent(designBrief);
  const simpleVerticalPresets = new Set([
    "defaultVertical",
    "defaultVerticalCenterAlt",
    "verticalThinFull",
  ]);
  const stripeDefaults = getFootballLikeStripeDefaults(config);

  if (!allowAccent) {
    config.leftNeckCircleColor = "";
  }

  if (!detailed) {
    config.horizontalStripesPreset = "";
    config.customShapePreset = "";
    config.sideStripePreset = "";
    config.stripesPreset =
      config.stripesPreset && simpleVerticalPresets.has(config.stripesPreset)
        ? config.stripesPreset
        : config.secondary
          ? "defaultVerticalCenterAlt"
          : "defaultVertical";

    config.baseColor =
      (isUpperHexColor(config.primary) && config.primary) ||
      (isUpperHexColor(config.baseColor) && config.baseColor) ||
      config.secondary ||
      "#000000";
    config.leftSleeveColor = config.baseColor;
    config.rightSleeveColor = config.baseColor;

    config.leftSleeveDetailColor = "";
    config.rightSleeveDetailColor = "";
    config.shoulderPanelColor = "";
    config.stripePrimaryColor = stripeDefaults.stripePrimaryColor;
    config.stripeSecondaryColor = stripeDefaults.stripeSecondaryColor;
  }

  if (!isUpperHexColor(config.stripePrimaryColor)) {
    config.stripePrimaryColor = stripeDefaults.stripePrimaryColor;
  }
  if (!isUpperHexColor(config.stripeSecondaryColor)) {
    config.stripeSecondaryColor = stripeDefaults.stripeSecondaryColor;
  }

  syncStateColors(config);
}

function normalizeOverlayContrast(config, designBrief) {
  if (config.sport === "american-football" || config.sport === "formula-1") {
    return;
  }

  const hasBodyOverlay =
    config.stripesPreset !== "" ||
    config.horizontalStripesPreset !== "" ||
    config.customShapePreset !== "";

  if (isUpperHexColor(config.baseColor) && hasBodyOverlay) {
    config.stripePrimaryColor = pickOppositeMainTeamColor(
      config,
      config.baseColor,
      config.stripePrimaryColor,
    );

    if (
      config.stripeSecondaryColor === "" ||
      config.stripeSecondaryColor === config.baseColor
    ) {
      config.stripeSecondaryColor = pickOppositeMainTeamColor(
        config,
        config.baseColor,
        config.stripeSecondaryColor,
      );
    }
  }

  if (config.sport === "basketball" && config.sideStripePreset !== "") {
    config.sideStripePrimaryColor = pickOppositeMainTeamColor(
      config,
      config.baseColor,
      config.sideStripePrimaryColor,
    );

    if (!wantsAsymmetricSideStripes(designBrief)) {
      config.sideStripeSecondaryColor = config.sideStripePrimaryColor;
    } else if (
      config.sideStripeSecondaryColor === "" ||
      config.sideStripeSecondaryColor === config.baseColor
    ) {
      config.sideStripeSecondaryColor = pickOppositeMainTeamColor(
        config,
        config.baseColor,
        config.sideStripeSecondaryColor,
      );
    }
  }

  if (config.sport === "hockey" && config.sleeveStripePrimaryColor !== "") {
    const sleeveBase = config.leftSleeveColor || config.baseColor;
    if (isUpperHexColor(sleeveBase)) {
      config.sleeveStripePrimaryColor = pickOppositeMainTeamColor(
        config,
        sleeveBase,
        config.sleeveStripePrimaryColor,
      );
    }
  }

  syncStateColors(config);
}

function validateGeneratedConfig(
  config,
  sport,
  designBrief,
  includePlayerText,
) {
  validateBaseShape(config);
  expect(
    config.sport === sport,
    `AI returned sport '${config.sport}' but expected '${sport}'`,
  );

  if (FOOTBALL_LIKE_SPORTS.includes(sport)) validateFootball(config, sport);
  if (sport === "basketball") {
    validateBasketball(config);
    if (config.sideStripePreset !== "") {
      const allowedPalette = new Set([
        config.primary,
        config.secondary,
        config.baseColor,
      ]);

      if (config.sideStripePrimaryColor !== "") {
        expect(
          allowedPalette.has(config.sideStripePrimaryColor),
          "basketball sideStripePrimaryColor must come from team palette",
        );
      }
      if (config.sideStripeSecondaryColor !== "") {
        expect(
          allowedPalette.has(config.sideStripeSecondaryColor),
          "basketball sideStripeSecondaryColor must come from team palette",
        );
      }

      if (!wantsAsymmetricSideStripes(designBrief)) {
        expect(
          config.sideStripePrimaryColor === config.sideStripeSecondaryColor,
          "basketball side stripes must be symmetric unless asymmetry is requested",
        );
      }
    }
  }
  if (sport === "hockey") validateHockey(config);
  if (sport === "american-football") validateAmericanFootball(config);
  if (sport === "formula-1") validateFormulaOne(config);

  if (
    !(
      FOOTBALL_LIKE_SPORTS.includes(sport) ||
      sport === "basketball" ||
      sport === "hockey"
    )
  ) {
    expect(
      config.footballBackEnabled === false,
      "player text must be disabled for this sport",
    );
  }
  if (
    includePlayerText &&
    (FOOTBALL_LIKE_SPORTS.includes(sport) ||
      sport === "basketball" ||
      sport === "hockey")
  ) {
    expect(
      config.footballBackEnabled === true,
      "player text must be enabled when requested",
    );
  }
}

function commonPromptHeader(
  teamName,
  leagueOrCountry,
  designBrief,
  includePlayerText,
) {
  return `You are generating a jersey config JSON for my app.
Return valid JSON only. No markdown, no comments, no prose.

Input:
- team_name: "${teamName}"
- context: "${leagueOrCountry}"
- design_brief: "${designBrief || ""}"
- include_player_text: ${includePlayerText ? "true" : "false"}

Global output rules:
- Output exactly one JSON object.
- Use uppercase #RRGGBB for every non-empty color field.
- Any intentionally unused field must be "".
- primary and secondary must represent the two main club or shirt colors. Do not replace one of them with an accent color just to make shapes visible.
- Accent or trim colors belong in detail fields like neckCircleColor or stripeTertiaryColor, not in primary/secondary unless they are truly one of the two main kit colors.
- Include ALL required top-level keys exactly:
name, sport, primary, secondary, stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset, baseColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, neckCircleColor, leftNeckCircleColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sideStripePrimaryColor, sideStripeSecondaryColor, footballBackEnabled, footballBackName, footballBackNumber, footballBackFontFamily, footballBackFontWeight, footballBackTextColor, footballBackTextOutlineEnabled, footballBackTextOutlineColor, footballBackTextOutlineWidth, footballBackNameCurveAmount, footballBackNameSize, footballBackNumberSize, footballBackNameY, footballBackNumberY, state
- Include state with exactly these keys:
baseColor, leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, neckCircleColor, leftNeckCircleColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sideStripePrimaryColor, sideStripeSecondaryColor, footballBackEnabled, footballBackName, footballBackNumber, footballBackFontFamily, footballBackFontWeight, footballBackTextColor, footballBackTextOutlineEnabled, footballBackTextOutlineColor, footballBackTextOutlineWidth, footballBackNameCurveAmount, footballBackNameSize, footballBackNumberSize, footballBackNameY, footballBackNumberY
- Top-level color fields and state color fields must match exactly.`;
}

function buildSportPrompt(
  sport,
  teamName,
  leagueOrCountry,
  designBrief,
  includePlayerText,
) {
  const common = commonPromptHeader(
    teamName,
    leagueOrCountry,
    designBrief,
    includePlayerText,
  );

  if (FOOTBALL_LIKE_SPORTS.includes(sport)) {
    return `${common}

Sport target: ${sport}
Rules:
- sport must be "${sport}".
- Default preference: keep designs simple and common. Use vertical stripes first for classic clubs unless the design_brief explicitly asks for a different pattern.
- Allowed vertical presets: ${STRIPE_PRESETS.join(", ")}
- Allowed horizontal presets: ${HORIZONTAL_PRESETS_FOOTBALL.join(", ")}
- Allowed custom presets: ${CUSTOM_PRESETS_FOOTBALL.join(", ")}
- sideStripePreset must be "".
- sideStripePrimaryColor, sideStripeSecondaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor must be "".
- Exactly one of vertical/horizontal/custom OR none should be active.
- Collar defaults: use only neckCircleColor and keep leftNeckCircleColor="".
- Only set leftNeckCircleColor when design_brief explicitly requests a split/asymmetric collar.
- For vertical presets, default both sleeves to baseColor unless design_brief explicitly asks for contrast sleeves.
- If customShapePreset is "split": stripePrimaryColor is right split panel, baseColor is left/background torso.
- Prefer "defaultVertical" or "defaultVerticalCenterAlt" before more complex vertical presets unless explicitly requested.
- Keep stripes visible by swapping layer assignment, not by changing the club palette: baseColor should usually default to primary, and stripePrimaryColor should usually use the opposite of base between primary and secondary.
- Player text (backside):
  - if include_player_text=true: footballBackEnabled=true and set footballBackName/footballBackNumber.
  - defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - if include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="".
`;
  }

  if (sport === "basketball") {
    return `${common}

Sport target: basketball
Rules:
- sport must be "basketball".
- Allowed vertical presets: ${STRIPE_PRESETS.join(", ")}
- Allowed horizontal presets: ${HORIZONTAL_PRESETS_BASKETBALL.join(", ")}
- Allowed custom presets: ${CUSTOM_PRESETS_BASKETBALL.join(", ")}
- Allowed sideStripePreset: ${SIDE_STRIPE_PRESETS_BASKETBALL.join(", ")} or "".
- Non-applicable fields must be "":
  leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, shoulderPanelColor
- Side stripe can be used alone or with vertical; avoid combining side stripe with horizontal/custom.
- Side stripe default is symmetric: use the same color on left and right.
- Side stripe colors must come from team palette (primary, secondary, or baseColor); avoid random black/white split unless design_brief explicitly requests asymmetry.
- Keep visible contrast by swapping layer assignment, not by changing the club palette: primary and secondary must stay the two main team colors, and stripe/sideStripe colors should use the opposite of base between primary and secondary.
- Collar supports both full ring (neckCircleColor) and left-half accent (leftNeckCircleColor).
- If customShapePreset is "split": stripePrimaryColor is right split panel, baseColor is left/background torso.
- Player text (basketball is front):
  - if include_player_text=true: footballBackEnabled=true and set footballBackName/footballBackNumber.
  - defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=13.5, footballBackNumberY=25.5.
  - if include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="".
`;
  }

  if (sport === "hockey") {
    return `${common}

Sport target: hockey
Rules:
- sport must be "hockey".
- Allowed vertical presets: ${STRIPE_PRESETS.join(", ")}
- Allowed horizontal presets: ${HORIZONTAL_PRESETS_HOCKEY.join(", ")}
- Allowed custom presets: ${CUSTOM_PRESETS_HOCKEY.join(", ")}
- sideStripePreset must be "".
- leftNeckCircleColor must be "" (hockey only uses full collar color).
- Non-applicable fields must be "": leftSleeveDetailColor, rightSleeveDetailColor, shoulderPanelColor, sideStripePrimaryColor, sideStripeSecondaryColor.
- In most cases, prefer hockey-specific horizontal bottom stripe presets over generic horizontal presets.
- Default preference order for horizontal stripes: hockeyTripleBottomStripeShade, hockeyTripleBottomStripe, hockeyBottomStripeShade.
- Keep visible contrast by swapping layer assignment, not by changing the club palette: primary and secondary must stay the two main team colors, and stripe colors should use the opposite of base between primary and secondary.
- Sleeve stripe guidance:
  - sleeveStripePrimaryColor should be the accent stripe color (usually primary or secondary team color).
  - sleeveStripeSecondaryColor should usually match sleeve body color (leftSleeveColor/rightSleeveColor, often baseColor), not random black/white.
  - Only use black/white sleeve secondary when black/white is explicitly part of the real team palette or explicitly requested.
- For hockey shaded presets (hockeyTripleBottomStripeShade, hockeyBottomStripeShade, hockeyThinArrowFill), stripeTertiaryColor is a shade color and should usually be a darker shade of baseColor (not random black/white).
- If customShapePreset is "split": stripePrimaryColor is right split panel, baseColor is left/background torso.
- Player text (hockey is backside):
  - if include_player_text=true: footballBackEnabled=true and set footballBackName/footballBackNumber.
  - defaults: footballBackFontFamily="Barlow Condensed", footballBackFontWeight=700, footballBackTextColor="", footballBackTextOutlineEnabled=false, footballBackTextOutlineColor="#000000", footballBackTextOutlineWidth=2, footballBackNameCurveAmount=0, footballBackNameSize=4, footballBackNumberSize=16, footballBackNameY=11, footballBackNumberY=21.
  - if include_player_text=false: footballBackEnabled=false and footballBackName/footballBackNumber="".
`;
  }

  if (sport === "american-football") {
    return `${common}

Sport target: american-football
Rules:
- sport must be "american-football".
- American football renderer only uses: baseColor and neckCircleColor.
- All preset fields must be "":
  stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset
- leftNeckCircleColor must be "".
- All non-used color fields must be "":
  leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sideStripePrimaryColor, sideStripeSecondaryColor
- Keep design team-appropriate by selecting strong baseColor and complementary neckCircleColor.
- footballBackEnabled must be false and all footballBack* fields must stay valid defaults.
`;
  }

  return `${common}

Sport target: formula-1
Rules:
- sport must be "formula-1".
- Formula 1 renderer only uses: baseColor and neckCircleColor (visor).
- All preset fields must be "":
  stripesPreset, horizontalStripesPreset, customShapePreset, sideStripePreset
- leftNeckCircleColor must be "".
- All non-used color fields must be "":
  leftSleeveColor, rightSleeveColor, leftSleeveDetailColor, rightSleeveDetailColor, shoulderPanelColor, stripePrimaryColor, stripeSecondaryColor, stripeTertiaryColor, sleeveStripePrimaryColor, sleeveStripeSecondaryColor, sideStripePrimaryColor, sideStripeSecondaryColor
- Keep design team-appropriate with racing-inspired contrast between body and visor.
- footballBackEnabled must be false and all footballBack* fields must stay valid defaults.
`;
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(204, {});
  if (event.httpMethod !== "POST")
    return json(405, { error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(500, { error: "Missing GEMINI_API_KEY" });

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const teamName = String(body.teamName || "").trim();
    const leagueOrCountry = String(body.leagueOrCountry || "").trim();
    const designBrief = String(
      body.styleNotes || body.designBrief || "",
    ).trim();
    const includePlayerText = Boolean(body.includePlayerText);
    const sport = String(body.sport || "").trim();

    if (!teamName || !leagueOrCountry || !sport) {
      return json(400, {
        error: "teamName, leagueOrCountry, and sport are required",
      });
    }
    if (!SPORTS.includes(sport)) {
      return json(400, { error: "Unsupported sport" });
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const prompt = buildSportPrompt(
      sport,
      teamName,
      leagueOrCountry,
      designBrief,
      includePlayerText,
    );

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const text = await geminiResponse.text();
      return json(502, { error: `Gemini request failed: ${text}` });
    }

    const data = await geminiResponse.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("\n")
        .trim() || "";

    if (!text) return json(502, { error: "Gemini returned empty response" });

    const config = JSON.parse(stripCodeFence(text));
    normalizeFootballLikeConfig(config, designBrief);
    normalizeBasketballConfig(config, designBrief);
    normalizeHockeyConfig(config, designBrief);
    normalizePlayerText(config, sport, includePlayerText);
    normalizeOverlayContrast(config, designBrief);
    validateGeneratedConfig(config, sport, designBrief, includePlayerText);

    return json(200, { config });
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};
