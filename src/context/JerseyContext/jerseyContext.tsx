import {
  type CustomOverlayLayer,
  type JerseyColorState,
  type JerseyFieldKey,
  type JerseyResponse,
  type Theme,
  DEFAULT_SOURCE,
  downloadSvg,
} from "@/types/types";
import type { JerseyTemplateKey } from "@/utils/config";
import { downloadJson } from "@/utils/utils";
import { toast } from "@heroui/react";
import React, { createContext, useReducer, useRef } from "react";
type JerseySport = NonNullable<JerseyColorState["sport"]>;
const createOverlayLayer = (
  id: string,
  svg?: string,
  viewBox?: string,
): CustomOverlayLayer => ({
  id,
  name: "Overlay",
  enabled: true,
  svg,
  viewBox,
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
});
type JerseyDraft = {
  id: string;
  name: string;
  sport: JerseySport;
  updatedAt: string;
  config: JerseyColorState;
};
type StoredJerseyDraft = JerseyDraft;
type LegacyOverlayPatch = Partial<
  Pick<
    JerseyResponse,
    | "customOverlayEnabled"
    | "customOverlaySvg"
    | "customOverlayViewBox"
    | "customOverlayX"
    | "customOverlayY"
    | "customOverlayScale"
    | "customOverlayRotation"
  >
>;
type InitialPatch = Partial<JerseyColorState> & LegacyOverlayPatch;

const IGNORED_KEYS: (keyof JerseyColorState)[] = [
  "name",
  "sr_jersey",
  "id",
  "sport",
];
const DRAFT_SAVE_DELAY_MS = 400;
const DRAFT_PREFIX = "jersey-draft:v1:";
const ACTIVE_DRAFT_PREFIX = "jersey-draft-active:v1:";

const slugifyDraft = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function getDraftStorageKey(id: string) {
  return `${DRAFT_PREFIX}${id}`;
}

function getActiveDraftKey(sport: JerseySport) {
  return `${ACTIVE_DRAFT_PREFIX}${sport}`;
}

function readStoredDraft(raw: string | null): StoredJerseyDraft | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredJerseyDraft & {
      state?: JerseyColorState;
    };
    const config = parsed.config ?? parsed.state;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.updatedAt !== "string" ||
      !config
    ) {
      return null;
    }
    return {
      id: parsed.id,
      name: parsed.name,
      sport: parsed.sport,
      updatedAt: parsed.updatedAt,
      config,
    };
  } catch {
    return null;
  }
}

function listDrafts(): JerseyDraft[] {
  if (typeof window === "undefined") return [];

  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith(DRAFT_PREFIX))
    .map((key) => readStoredDraft(window.localStorage.getItem(key)))
    .filter((draft): draft is StoredJerseyDraft => !!draft)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function getStoredDraft(id: string): StoredJerseyDraft | null {
  if (typeof window === "undefined") return null;
  return readStoredDraft(window.localStorage.getItem(getDraftStorageKey(id)));
}

function setActiveDraft(id: string, sport: JerseySport) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getActiveDraftKey(sport), id);
}

function clearActiveDraft(id: string, sport: JerseySport) {
  if (typeof window === "undefined") return;
  const activeId = window.localStorage.getItem(getActiveDraftKey(sport));
  if (activeId === id) {
    window.localStorage.removeItem(getActiveDraftKey(sport));
  }
}

function clearActiveDraftForSport(sport: JerseySport) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getActiveDraftKey(sport));
}

function saveDraft(state: JerseyColorState, sport: JerseySport): string | null {
  if (typeof window === "undefined") return null;
  const trimmedName = state.name.trim();
  if (!trimmedName) return null;

  const id = `${sport}:${slugifyDraft(trimmedName)}`;
  const draft: StoredJerseyDraft = {
    id,
    name: trimmedName,
    sport,
    updatedAt: new Date().toISOString(),
    config: {
      ...state,
      name: trimmedName,
      sport,
    },
  };
  window.localStorage.setItem(getDraftStorageKey(id), JSON.stringify(draft));
  setActiveDraft(id, sport);
  return id;
}

function deleteDraftStorage(id: string) {
  if (typeof window === "undefined") return;
  const draft = getStoredDraft(id);
  if (draft) {
    clearActiveDraft(id, draft.sport);
  }
  window.localStorage.removeItem(getDraftStorageKey(id));
}

function clearAllDraftStorage() {
  if (typeof window === "undefined") return;
  const draftIds = Object.keys(window.localStorage).filter((key) =>
    key.startsWith(DRAFT_PREFIX),
  );
  const activeKeys = Object.keys(window.localStorage).filter((key) =>
    key.startsWith(ACTIVE_DRAFT_PREFIX),
  );
  draftIds.forEach((key) => window.localStorage.removeItem(key));
  activeKeys.forEach((key) => window.localStorage.removeItem(key));
}

function getActiveDraftState(sport: JerseySport): StoredJerseyDraft | null {
  if (typeof window === "undefined") return null;
  const activeId = window.localStorage.getItem(getActiveDraftKey(sport));
  return activeId ? getStoredDraft(activeId) : null;
}

function getDraftByName(
  sport: JerseySport,
  name: string | undefined,
): StoredJerseyDraft | null {
  const trimmedName = name?.trim();
  if (!trimmedName || typeof window === "undefined") return null;
  const id = `${sport}:${slugifyDraft(trimmedName)}`;
  return getStoredDraft(id);
}

function hasInitialContent(initial?: InitialPatch | null) {
  if (!initial) return false;
  if (initial.name?.trim()) return true;
  if (
    initial.theme?.primary ||
    initial.theme?.secondary ||
    initial.theme?.tertiary
  )
    return true;
  if (
    initial.stripesPreset ||
    initial.horizontalStripesPreset ||
    initial.customShapePreset ||
    initial.sideStripePreset ||
    initial.footballBackEnabled ||
    !!initial.footballBackName?.trim() ||
    !!initial.footballBackNumber?.trim() ||
    !!initial.footballBackFontFamily?.trim() ||
    (initial.footballBackFontWeight ?? 700) !== 700 ||
    !!initial.footballBackTextColor?.trim() ||
    !!initial.footballBackTextOutlineEnabled ||
    !!initial.footballBackTextOutlineColor?.trim() ||
    (initial.footballBackTextOutlineWidth ?? 2) !== 2 ||
    (initial.footballBackNameCurveAmount ?? 0) !== 0 ||
    (initial.footballBackNameSize ?? 4) !== 4 ||
    (initial.footballBackNumberSize ?? 16) !== 16 ||
    (initial.footballBackNameY ?? 11) !== 11 ||
    (initial.footballBackNumberY ?? 21) !== 21 ||
    !!initial.customOverlays?.length ||
    initial.customOverlayEnabled ||
    initial.customOverlaySvg ||
    (initial.customOverlayX ?? 0) !== 0 ||
    (initial.customOverlayY ?? 0) !== 0 ||
    (initial.customOverlayScale ?? 1) !== 1 ||
    (initial.customOverlayRotation ?? 0) !== 0
  ) {
    return true;
  }
  return (
    !!initial.baseColor?.enabled ||
    !!initial.leftSleeveColor?.enabled ||
    !!initial.rightSleeveColor?.enabled ||
    !!initial.leftSleeveDetailColor?.enabled ||
    !!initial.rightSleeveDetailColor?.enabled ||
    !!initial.neckCircleColor?.enabled ||
    !!initial.leftNeckCircleColor?.enabled ||
    !!initial.shoulderPanelColor?.enabled ||
    !!initial.stripePrimaryColor?.enabled ||
    !!initial.stripeSecondaryColor?.enabled ||
    !!initial.stripeTertiaryColor?.enabled ||
    !!initial.stripeQuaternaryColor?.enabled ||
    !!initial.sleeveStripePrimaryColor?.enabled ||
    !!initial.sleeveStripeSecondaryColor?.enabled ||
    !!initial.sleeveStripeTertiaryColor?.enabled ||
    !!initial.sideStripePrimaryColor?.enabled ||
    !!initial.sideStripeSecondaryColor?.enabled
  );
}

function stripIgnored(s: JerseyColorState) {
  const clone = { ...s } as JerseyColorState;
  for (const k of IGNORED_KEYS) delete clone[k];
  return clone;
}
const initialState: JerseyColorState = {
  name: "",
  sport: undefined,
  sr_jersey: undefined,
  id: undefined,
  theme: { primary: "#C8102E", secondary: "#303030", tertiary: "#FFFFFF" },
  baseColor: { value: undefined, enabled: false, shouldToggle: true },
  leftSleeveColor: { value: undefined, enabled: false, shouldToggle: true },
  rightSleeveColor: { value: undefined, enabled: false, shouldToggle: true },
  leftSleeveDetailColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  rightSleeveDetailColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  neckCircleColor: { value: undefined, enabled: false, shouldToggle: true },
  leftNeckCircleColor: {
    value: undefined,
    enabled: false,
    shouldToggle: false,
  },
  shoulderPanelColor: { value: undefined, enabled: false, shouldToggle: true },
  stripePrimaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  stripeSecondaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  stripeTertiaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  stripeQuaternaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  sleeveStripePrimaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  sleeveStripeSecondaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  sleeveStripeTertiaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  sideStripePrimaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  sideStripeSecondaryColor: {
    value: undefined,
    enabled: false,
    shouldToggle: true,
  },
  stripesPreset: undefined,
  horizontalStripesPreset: undefined,
  customShapePreset: undefined,
  sideStripePreset: undefined,
  customOverlays: [],
  customOverlayActiveId: undefined,
  footballBackEnabled: false,
  footballBackName: "",
  footballBackNumber: "",
  footballBackFontFamily: "Barlow Condensed",
  footballBackFontWeight: 700,
  footballBackTextColor: "",
  footballBackTextOutlineEnabled: false,
  footballBackTextOutlineColor: "#000000",
  footballBackTextOutlineWidth: 2,
  footballBackNameCurveAmount: 0,
  footballBackNameSize: 4,
  footballBackNumberSize: 16,
  footballBackNameY: 11,
  footballBackNumberY: 21,
};

function playerTextDefaultsForSport(sport?: JerseySport) {
  const baseDefaults = {
    footballBackEnabled: false,
    footballBackName: "",
    footballBackNumber: "",
    footballBackFontFamily: "Barlow Condensed",
    footballBackFontWeight: 700,
    footballBackTextColor: "",
    footballBackTextOutlineEnabled: false,
    footballBackTextOutlineColor: "#000000",
    footballBackTextOutlineWidth: 2,
    footballBackNameCurveAmount: 0,
    footballBackNameSize: 4,
    footballBackNumberSize: 16,
  };
  if (sport === "basketball") {
    return {
      ...baseDefaults,
      footballBackNameY: 13.5,
      footballBackNumberY: 25.5,
    };
  }
  return {
    ...baseDefaults,
    footballBackNameY: 11,
    footballBackNumberY: 21,
  };
}

function resetPreservingIdentity(prev: JerseyColorState): JerseyColorState {
  const sportDefaults = playerTextDefaultsForSport(prev.sport);
  return {
    ...initialState,
    sport: prev.sport,
    sr_jersey: prev.sr_jersey,
    id: prev.id,
    ...sportDefaults,
  };
}
function deriveDefault(
  field: JerseyFieldKey,
  theme: Theme,
  baseEnabled = false,
): string | undefined {
  if (baseEnabled) {
    if (
      field === "stripePrimaryColor" ||
      field === "sleeveStripePrimaryColor" ||
      field === "sleeveStripeTertiaryColor" ||
      field === "sideStripePrimaryColor"
    ) {
      return theme.secondary ?? theme.primary;
    }
    if (
      field === "stripeSecondaryColor" ||
      field === "sleeveStripeSecondaryColor" ||
      field === "sideStripeSecondaryColor"
    ) {
      return theme.tertiary ?? theme.secondary ?? theme.primary;
    }
    if (DEFAULT_SOURCE[field] === "secondary") {
      return theme.tertiary ?? theme.secondary;
    }
  }
  const which = DEFAULT_SOURCE[field];
  return theme[which];
}

// 3) Actions + reducer

type Action =
  | { type: "setName"; value: string }
  | { type: "setEnabled"; key: JerseyFieldKey; enabled: boolean }
  | { type: "setColor"; key: JerseyFieldKey; value?: string }
  | { type: "setThemeColor"; which: keyof Theme; value?: string }
  | { type: "setStripeTemplate"; value: string }
  | { type: "setHorizontalStripeTemplate"; value: string }
  | { type: "setCustomShapeTemplate"; value: string }
  | { type: "setSideStripeTemplate"; value: string }
  | {
      type: "setCustomOverlay";
      enabled: boolean;
      svg?: string;
      viewBox?: string;
    }
  | {
      type: "addCustomOverlay";
      id: string;
      svg?: string;
      viewBox?: string;
    }
  | { type: "removeCustomOverlay"; id: string }
  | { type: "setActiveCustomOverlay"; id?: string }
  | { type: "setCustomOverlayOrder"; ids: string[] }
  | { type: "moveCustomOverlay"; id: string; direction: "up" | "down" }
  | { type: "setCustomOverlayEnabled"; id: string; enabled: boolean }
  | {
      type: "setCustomOverlayTransform";
      id?: string;
      x?: number;
      y?: number;
      scale?: number;
      rotation?: number;
    }
  | {
      type: "setFootballBack";
      enabled: boolean;
      name?: string;
      number?: string;
      fontFamily?: string;
      fontWeight?: number;
      textColor?: string;
      textOutlineEnabled?: boolean;
      textOutlineColor?: string;
      textOutlineWidth?: number;
      nameCurveAmount?: number;
      nameSize?: number;
      numberSize?: number;
      nameY?: number;
      numberY?: number;
    }
  | {
      type: "clearTemplate";
      template: "vertical" | "horizontal" | "custom" | "sidestripe";
    }
  | { type: "hydrate"; payload: InitialPatch | null }
  | { type: "reset" };

function reducer(state: JerseyColorState, action: Action): JerseyColorState {
  switch (action.type) {
    case "setName":
      return {
        ...state,
        name: action.value,
      };
    case "setEnabled": {
      const { key, enabled } = action;
      const prev = state[key] as {
        value?: string | undefined;
        enabled: boolean;
        shouldToggle?: boolean;
      };
      return {
        ...state,
        [key]: { ...prev, enabled },
      } as JerseyColorState;
    }
    case "setColor": {
      const { key, value } = action;
      const prev = state[key] as typeof state.baseColor;
      return {
        ...state,
        [key]: { ...prev, value, enabled: !!value },
      } as JerseyColorState;
    }
    case "setStripeTemplate": {
      const { value } = action;
      return {
        ...state,
        stripesPreset: value,
        horizontalStripesPreset: undefined,
        customShapePreset: undefined,
      } as JerseyColorState;
    }
    case "setHorizontalStripeTemplate": {
      const { value } = action;
      return {
        ...state,
        horizontalStripesPreset: value,
        stripesPreset: undefined,
        customShapePreset: undefined,
        sideStripePreset: undefined,
        stripeTertiaryColor: {
          ...state.stripeTertiaryColor,
          value: undefined,
          enabled: false,
        },
        stripeQuaternaryColor: {
          ...state.stripeQuaternaryColor,
          value: undefined,
          enabled: false,
        },
      } as JerseyColorState;
    }
    case "setCustomShapeTemplate": {
      const { value } = action;
      return {
        ...state,
        customShapePreset: value,
        stripesPreset: undefined,
        horizontalStripesPreset: undefined,
        sideStripePreset: undefined,
        stripeTertiaryColor:
          value === "hockeyThinArrowFill"
            ? {
                ...state.stripeTertiaryColor,
                value: undefined,
                enabled: false,
              }
            : state.stripeTertiaryColor,
      } as JerseyColorState;
    }
    case "setSideStripeTemplate": {
      const { value } = action;
      return {
        ...state,
        sideStripePreset: value,
        horizontalStripesPreset: undefined,
        customShapePreset: undefined,
      } as JerseyColorState;
    }
    case "setCustomOverlay": {
      const { enabled, svg, viewBox } = action;
      if (!enabled) {
        return {
          ...state,
          customOverlays: [],
          customOverlayActiveId: undefined,
        } as JerseyColorState;
      }
      const activeId =
        state.customOverlayActiveId ??
        state.customOverlays[0]?.id ??
        (svg ? "overlay-1" : undefined);
      const existingIndex = state.customOverlays.findIndex(
        (overlay) => overlay.id === activeId,
      );
      if (existingIndex >= 0 && activeId) {
        const next = [...state.customOverlays];
        next[existingIndex] = {
          ...next[existingIndex],
          enabled: true,
          svg: svg ?? next[existingIndex].svg,
          viewBox: viewBox ?? next[existingIndex].viewBox,
        };
        return {
          ...state,
          customOverlays: next,
          customOverlayActiveId: activeId,
        } as JerseyColorState;
      }
      return {
        ...state,
        customOverlays: activeId
          ? [createOverlayLayer(activeId, svg, viewBox)]
          : state.customOverlays,
        customOverlayActiveId: activeId,
      } as JerseyColorState;
    }
    case "addCustomOverlay": {
      return {
        ...state,
        customOverlays: [
          ...state.customOverlays,
          createOverlayLayer(action.id, action.svg, action.viewBox),
        ],
        customOverlayActiveId: action.id,
      } as JerseyColorState;
    }
    case "removeCustomOverlay": {
      const next = state.customOverlays.filter(
        (overlay) => overlay.id !== action.id,
      );
      return {
        ...state,
        customOverlays: next,
        customOverlayActiveId:
          state.customOverlayActiveId === action.id
            ? next[0]?.id
            : state.customOverlayActiveId,
      } as JerseyColorState;
    }
    case "setActiveCustomOverlay":
      return {
        ...state,
        customOverlayActiveId: action.id,
      } as JerseyColorState;
    case "setCustomOverlayOrder": {
      const overlayMap = new Map(
        state.customOverlays.map((overlay) => [overlay.id, overlay]),
      );
      const ordered = action.ids
        .map((id) => overlayMap.get(id))
        .filter((overlay): overlay is CustomOverlayLayer => !!overlay);
      const remaining = state.customOverlays.filter(
        (overlay) => !action.ids.includes(overlay.id),
      );
      return {
        ...state,
        customOverlays: [...ordered, ...remaining],
      } as JerseyColorState;
    }
    case "moveCustomOverlay": {
      const index = state.customOverlays.findIndex((o) => o.id === action.id);
      if (index < 0) return state;
      const target =
        action.direction === "up"
          ? Math.max(0, index - 1)
          : Math.min(state.customOverlays.length - 1, index + 1);
      if (target === index) return state;
      const next = [...state.customOverlays];
      const [overlay] = next.splice(index, 1);
      next.splice(target, 0, overlay);
      return {
        ...state,
        customOverlays: next,
      } as JerseyColorState;
    }
    case "setCustomOverlayEnabled":
      return {
        ...state,
        customOverlays: state.customOverlays.map((overlay) =>
          overlay.id === action.id
            ? { ...overlay, enabled: action.enabled }
            : overlay,
        ),
      } as JerseyColorState;
    case "setCustomOverlayTransform": {
      const activeId = action.id ?? state.customOverlayActiveId;
      if (!activeId) return state;
      return {
        ...state,
        customOverlays: state.customOverlays.map((overlay) =>
          overlay.id === activeId
            ? {
                ...overlay,
                x: action.x ?? overlay.x,
                y: action.y ?? overlay.y,
                scale: action.scale ?? overlay.scale,
                rotation: action.rotation ?? overlay.rotation,
              }
            : overlay,
        ),
      } as JerseyColorState;
    }
    case "setFootballBack": {
      if (!action.enabled) {
        return {
          ...state,
          ...playerTextDefaultsForSport(state.sport),
        } as JerseyColorState;
      }
      return {
        ...state,
        footballBackEnabled: true,
        footballBackName: action.name ?? state.footballBackName,
        footballBackNumber: action.number ?? state.footballBackNumber,
        footballBackFontFamily:
          action.fontFamily ?? state.footballBackFontFamily,
        footballBackFontWeight:
          action.fontWeight ?? state.footballBackFontWeight,
        footballBackTextColor: action.textColor ?? state.footballBackTextColor,
        footballBackTextOutlineEnabled:
          action.textOutlineEnabled ?? state.footballBackTextOutlineEnabled,
        footballBackTextOutlineColor:
          action.textOutlineColor ?? state.footballBackTextOutlineColor,
        footballBackTextOutlineWidth:
          action.textOutlineWidth ?? state.footballBackTextOutlineWidth,
        footballBackNameCurveAmount:
          action.nameCurveAmount ?? state.footballBackNameCurveAmount,
        footballBackNameSize: action.nameSize ?? state.footballBackNameSize,
        footballBackNumberSize:
          action.numberSize ?? state.footballBackNumberSize,
        footballBackNameY: action.nameY ?? state.footballBackNameY,
        footballBackNumberY: action.numberY ?? state.footballBackNumberY,
      } as JerseyColorState;
    }
    case "clearTemplate": {
      switch (action.template) {
        case "vertical":
          return {
            ...state,
            stripesPreset: undefined,
          } as JerseyColorState;
        case "horizontal":
          return {
            ...state,
            horizontalStripesPreset: undefined,
          } as JerseyColorState;
        case "custom":
          return {
            ...state,
            customShapePreset: undefined,
          } as JerseyColorState;
        case "sidestripe":
          return {
            ...state,
            sideStripePreset: undefined,
          } as JerseyColorState;
        default:
          return state;
      }
    }
    case "setThemeColor": {
      const { which, value } = action;
      const next = { ...state, theme: { ...state.theme, [which]: value } };

      return next;
    }

    case "reset":
      return resetPreservingIdentity(state);
    case "hydrate":
      return mergeInitial(initialState, action.payload);
    default:
      return state;
  }
}

type JerseyColorsContextValue = {
  state: JerseyColorState;
  setName: (value: string) => void;
  setNameEditing: (editing: boolean) => void;
  setEnabled: (key: JerseyFieldKey, enabled: boolean) => void;
  setColor: (key: JerseyFieldKey, value?: string) => void;
  setStripeTemplate: (preset: string) => void;
  setHorizontalStripeTemplate: (preset: string) => void;
  setCustomShapeTemplate: (preset: string) => void;
  setSideStripeTemplate: (preset: string) => void;
  setCustomOverlay: (enabled: boolean, svg?: string, viewBox?: string) => void;
  addCustomOverlay: (svg?: string, viewBox?: string) => void;
  removeCustomOverlay: (id: string) => void;
  setActiveCustomOverlay: (id?: string) => void;
  setCustomOverlayOrder: (ids: string[]) => void;
  moveCustomOverlay: (id: string, direction: "up" | "down") => void;
  setCustomOverlayEnabled: (id: string, enabled: boolean) => void;
  setCustomOverlayTransform: (
    patch: Partial<{
      x: number;
      y: number;
      scale: number;
      rotation: number;
    }>,
  ) => void;
  setFootballBack: (
    enabled: boolean,
    patch?: Partial<{
      name: string;
      number: string;
      fontFamily: string;
      fontWeight: number;
      textColor: string;
      textOutlineEnabled: boolean;
      textOutlineColor: string;
      textOutlineWidth: number;
      nameCurveAmount: number;
      nameSize: number;
      numberSize: number;
      nameY: number;
      numberY: number;
    }>,
  ) => void;
  clearTemplate: (
    template: "vertical" | "horizontal" | "custom" | "sidestripe",
  ) => void;
  openTemplateSection?: JerseyTemplateKey;
  setOpenTemplateSection: (template?: JerseyTemplateKey) => void;
  setThemeColor: (which: keyof Theme, value?: string) => void;
  reset: () => void;
  effective: (key: JerseyFieldKey) => string | undefined;
  setSvgRef: (el: SVGSVGElement | null) => void;
  downloadSvg: () => void;
  downloadJson: () => void;
  hydrateFromConfig: (partial: InitialPatch) => void;
  flushDraftSave: () => void;
  drafts: JerseyDraft[];
  loadDraft: (id: string) => JerseyDraft | undefined;
  deleteDraft: (id: string) => void;
  clearAllDrafts: () => void;
  isConfigured: boolean;
};

const JerseyColorsContext = createContext<JerseyColorsContextValue | null>(
  null,
);

function mergeInitial(
  base: JerseyColorState,
  patch?: InitialPatch | null,
): JerseyColorState {
  if (!patch) return base;
  return {
    ...base,
    name: patch.name ?? base.name,
    sport: patch.sport ?? base.sport,
    id: patch.id ?? base.id,
    sr_jersey: patch.sr_jersey ?? base.sr_jersey,
    theme: { ...base.theme, ...(patch.theme ?? {}) },
    baseColor: { ...base.baseColor, ...(patch.baseColor ?? {}) },
    leftSleeveColor: {
      ...base.leftSleeveColor,
      ...(patch.leftSleeveColor ?? {}),
    },
    rightSleeveColor: {
      ...base.rightSleeveColor,
      ...(patch.rightSleeveColor ?? {}),
    },
    leftSleeveDetailColor: {
      ...base.leftSleeveDetailColor,
      ...(patch.leftSleeveDetailColor ?? {}),
    },
    rightSleeveDetailColor: {
      ...base.rightSleeveDetailColor,
      ...(patch.rightSleeveDetailColor ?? {}),
    },
    neckCircleColor: {
      ...base.neckCircleColor,
      ...(patch.neckCircleColor ?? {}),
    },
    leftNeckCircleColor: {
      ...base.leftNeckCircleColor,
      ...(patch.leftNeckCircleColor ?? {}),
    },
    shoulderPanelColor: {
      ...base.shoulderPanelColor,
      ...(patch.shoulderPanelColor ?? {}),
    },
    stripePrimaryColor: {
      ...base.stripePrimaryColor,
      ...(patch.stripePrimaryColor ?? {}),
    },
    stripeSecondaryColor: {
      ...base.stripeSecondaryColor,
      ...(patch.stripeSecondaryColor ?? {}),
    },
    stripeTertiaryColor: {
      ...base.stripeTertiaryColor,
      ...(patch.stripeTertiaryColor ?? {}),
    },
    stripeQuaternaryColor: {
      ...base.stripeQuaternaryColor,
      ...(patch.stripeQuaternaryColor ?? {}),
    },
    sleeveStripePrimaryColor: {
      ...base.sleeveStripePrimaryColor,
      ...(patch.sleeveStripePrimaryColor ?? {}),
    },
    sleeveStripeSecondaryColor: {
      ...base.sleeveStripeSecondaryColor,
      ...(patch.sleeveStripeSecondaryColor ?? {}),
    },
    sleeveStripeTertiaryColor: {
      ...base.sleeveStripeTertiaryColor,
      ...(patch.sleeveStripeTertiaryColor ?? {}),
    },
    sideStripePrimaryColor: {
      ...base.sideStripePrimaryColor,
      ...(patch.sideStripePrimaryColor ?? {}),
    },
    sideStripeSecondaryColor: {
      ...base.sideStripeSecondaryColor,
      ...(patch.sideStripeSecondaryColor ?? {}),
    },
    stripesPreset: patch.stripesPreset ?? base.stripesPreset,
    horizontalStripesPreset:
      patch.horizontalStripesPreset ?? base.horizontalStripesPreset,
    customShapePreset: patch.customShapePreset ?? base.customShapePreset,
    sideStripePreset: patch.sideStripePreset ?? base.sideStripePreset,
    customOverlays:
      patch.customOverlays ??
      (patch.customOverlaySvg
        ? [
            createOverlayLayer(
              "overlay-legacy",
              patch.customOverlaySvg,
              patch.customOverlayViewBox,
            ),
          ].map((overlay) => ({
            ...overlay,
            enabled: patch.customOverlayEnabled ?? true,
            x: patch.customOverlayX ?? 0,
            y: patch.customOverlayY ?? 0,
            scale: patch.customOverlayScale ?? 1,
            rotation: patch.customOverlayRotation ?? 0,
          }))
        : base.customOverlays),
    customOverlayActiveId:
      patch.customOverlayActiveId ??
      (patch.customOverlays?.[0]?.id ?? base.customOverlayActiveId),
    footballBackEnabled: patch.footballBackEnabled ?? base.footballBackEnabled,
    footballBackName: patch.footballBackName ?? base.footballBackName,
    footballBackNumber: patch.footballBackNumber ?? base.footballBackNumber,
    footballBackFontFamily:
      patch.footballBackFontFamily ?? base.footballBackFontFamily,
    footballBackFontWeight:
      patch.footballBackFontWeight ?? base.footballBackFontWeight,
    footballBackTextColor:
      patch.footballBackTextColor ?? base.footballBackTextColor,
    footballBackTextOutlineEnabled:
      patch.footballBackTextOutlineEnabled ??
      base.footballBackTextOutlineEnabled,
    footballBackTextOutlineColor:
      patch.footballBackTextOutlineColor ?? base.footballBackTextOutlineColor,
    footballBackTextOutlineWidth:
      patch.footballBackTextOutlineWidth ?? base.footballBackTextOutlineWidth,
    footballBackNameCurveAmount:
      patch.footballBackNameCurveAmount ?? base.footballBackNameCurveAmount,
    footballBackNameSize:
      patch.footballBackNameSize ?? base.footballBackNameSize,
    footballBackNumberSize:
      patch.footballBackNumberSize ?? base.footballBackNumberSize,
    footballBackNameY: patch.footballBackNameY ?? base.footballBackNameY,
    footballBackNumberY: patch.footballBackNumberY ?? base.footballBackNumberY,
  };
}

const JerseyColorsProvider: React.FC<{
  children: React.ReactNode;
  initial?: Partial<JerseyColorState> | null;
  variant?: JerseySport;
  skipActiveDraftHydration?: boolean;
}> = ({ children, initial, variant, skipActiveDraftHydration = false }) => {
  const bootState = React.useMemo(() => {
    const sport = initial?.sport ?? variant ?? undefined;
    if (sport) {
      const matchingDraft = getDraftByName(sport, initial?.name);
      if (matchingDraft) {
        return mergeInitial(initialState, matchingDraft.config);
      }
      if (!skipActiveDraftHydration && !hasInitialContent(initial)) {
        const activeDraft = getActiveDraftState(sport);
        if (activeDraft) {
          return mergeInitial(initialState, activeDraft.config);
        }
      }
    }
    if (initial) {
      return mergeInitial(initialState, {
        ...initial,
        sport,
      });
    }
    if (sport) {
      return mergeInitial(initialState, {
        sport,
        ...playerTextDefaultsForSport(sport),
      });
    }
    return initialState;
  }, [initial, skipActiveDraftHydration, variant]);

  // Seed ONCE from initial; never re-seed on re-renders of this mount.
  const boot = useRef<JerseyColorState>(bootState);
  const [state, dispatch] = useReducer(reducer, boot.current);
  const [openTemplateSection, setOpenTemplateSection] = React.useState<
    JerseyTemplateKey | undefined
  >(undefined);
  const [drafts, setDrafts] = React.useState<JerseyDraft[]>(() => listDrafts());
  const [isNameEditing, setIsNameEditing] = React.useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const savedDraftIdRef = useRef<string | undefined>(
    state.name.trim() && state.sport
      ? `${state.sport}:${slugifyDraft(state.name)}`
      : undefined,
  );

  const refreshDrafts = React.useCallback(() => {
    setDrafts(listDrafts());
  }, []);

  const persistDraft = React.useCallback(() => {
    if (!state.sport) return;
    const trimmedName = state.name.trim();
    if (!trimmedName) {
      savedDraftIdRef.current = undefined;
      clearActiveDraftForSport(state.sport);
      refreshDrafts();
      return;
    }

    const nextId = saveDraft(state, state.sport);
    if (!nextId) return;
    savedDraftIdRef.current = nextId;
    refreshDrafts();
  }, [refreshDrafts, state]);

  const hydrateFromConfig = React.useCallback(
    (partial: InitialPatch) => dispatch({ type: "hydrate", payload: partial }),
    [],
  );

  React.useEffect(() => {
    if (isNameEditing) return;
    const timeoutId = window.setTimeout(() => {
      persistDraft();
    }, DRAFT_SAVE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isNameEditing, persistDraft]);

  React.useEffect(() => {
    if (!state.sport) return;
    if (state.name.trim()) return;
    savedDraftIdRef.current = undefined;
    clearActiveDraftForSport(state.sport);
    refreshDrafts();
  }, [refreshDrafts, state.name, state.sport]);

  const isConfigured = React.useMemo(() => {
    return (
      JSON.stringify(stripIgnored(state)) !==
      JSON.stringify(stripIgnored(initialState))
    );
  }, [state]);
  const value: JerseyColorsContextValue = {
    state,
    setName: (value) => dispatch({ type: "setName", value }),
    setNameEditing: (editing) => setIsNameEditing(editing),
    setEnabled: (key, enabled) =>
      dispatch({ type: "setEnabled", key, enabled }),
    setColor: (key, value) => dispatch({ type: "setColor", key, value }),
    setThemeColor: (which, value) =>
      dispatch({ type: "setThemeColor", which, value }),
    reset: () => {
      if (state.sport) {
        savedDraftIdRef.current = undefined;
        clearActiveDraftForSport(state.sport);
        refreshDrafts();
      }
      dispatch({ type: "reset" });
    },
    effective: (key) => {
      const { enabled, value } = state[key];
      if (!enabled) return undefined;
      return value ?? deriveDefault(key, state.theme, state.baseColor.enabled); // baseColor derives from theme.primary
    },
    setSvgRef: (el) => {
      svgRef.current = el;
    },
    downloadSvg: () => {
      if (!svgRef.current) return;
      const hasPlayerText = state.footballBackEnabled;
      void downloadSvg(`${state.name}.svg`, svgRef.current, {
        requireServerExport: hasPlayerText,
      }).catch((error) => {
        const message =
          error instanceof Error ? error.message : "SVG export failed.";
        toast.danger("SVG export failed", {
          description: message,
        });
      });
    },
    downloadJson: () => {
      if (svgRef.current) downloadJson(state);
    },
    drafts,
    loadDraft: (id) => {
      const draft = getStoredDraft(id);
      if (!draft) return undefined;
      setActiveDraft(draft.id, draft.sport);
      savedDraftIdRef.current = draft.id;
      refreshDrafts();
      if (draft.sport === variant) {
        dispatch({ type: "hydrate", payload: draft.config });
      }
      return draft;
    },
    deleteDraft: (id) => {
      if (savedDraftIdRef.current === id) {
        savedDraftIdRef.current = undefined;
      }
      deleteDraftStorage(id);
      refreshDrafts();
    },
    clearAllDrafts: () => {
      savedDraftIdRef.current = undefined;
      clearAllDraftStorage();
      refreshDrafts();
    },

    setStripeTemplate: (preset) => {
      dispatch({
        type: "setStripeTemplate",
        value: preset,
      });
    },
    setHorizontalStripeTemplate: (preset) => {
      dispatch({
        type: "setHorizontalStripeTemplate",
        value: preset,
      });
    },
    setCustomShapeTemplate: (preset) => {
      dispatch({
        type: "setCustomShapeTemplate",
        value: preset,
      });
    },
    setSideStripeTemplate: (preset) => {
      dispatch({
        type: "setSideStripeTemplate",
        value: preset,
      });
    },
    setCustomOverlay: (enabled, svg, viewBox) => {
      dispatch({
        type: "setCustomOverlay",
        enabled,
        svg,
        viewBox,
      });
    },
    addCustomOverlay: (svg, viewBox) => {
      const id = `overlay-${Date.now()}`;
      dispatch({ type: "addCustomOverlay", id, svg, viewBox });
    },
    removeCustomOverlay: (id) => {
      dispatch({ type: "removeCustomOverlay", id });
    },
    setActiveCustomOverlay: (id) => {
      dispatch({ type: "setActiveCustomOverlay", id });
    },
    setCustomOverlayOrder: (ids) => {
      dispatch({ type: "setCustomOverlayOrder", ids });
    },
    moveCustomOverlay: (id, direction) => {
      dispatch({ type: "moveCustomOverlay", id, direction });
    },
    setCustomOverlayEnabled: (id, enabled) => {
      dispatch({ type: "setCustomOverlayEnabled", id, enabled });
    },
    setCustomOverlayTransform: ({ x, y, scale, rotation }) => {
      dispatch({
        type: "setCustomOverlayTransform",
        x,
        y,
        scale,
        rotation,
      });
    },
    setFootballBack: (enabled, patch) => {
      dispatch({
        type: "setFootballBack",
        enabled,
        name: patch?.name,
        number: patch?.number,
        fontFamily: patch?.fontFamily,
        fontWeight: patch?.fontWeight,
        textColor: patch?.textColor,
        textOutlineEnabled: patch?.textOutlineEnabled,
        textOutlineColor: patch?.textOutlineColor,
        textOutlineWidth: patch?.textOutlineWidth,
        nameCurveAmount: patch?.nameCurveAmount,
        nameSize: patch?.nameSize,
        numberSize: patch?.numberSize,
        nameY: patch?.nameY,
        numberY: patch?.numberY,
      });
    },
    clearTemplate: (template) => {
      dispatch({
        type: "clearTemplate",
        template,
      });
    },
    openTemplateSection,
    setOpenTemplateSection,
    hydrateFromConfig,
    flushDraftSave: () => persistDraft(),
    isConfigured,
  };

  return (
    <JerseyColorsContext.Provider value={value}>
      {children}
    </JerseyColorsContext.Provider>
  );
};

export { JerseyColorsContext, JerseyColorsProvider };
