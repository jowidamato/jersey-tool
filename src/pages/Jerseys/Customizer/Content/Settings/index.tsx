import Base from "@/components/Jersey/base";
import { useJerseyColors } from "@/context/JerseyContext";
import Setting from "./Setting";
import { Preset } from "../Preset";
import { ColorSwitcher } from "@/components/ColorSwitcher";
import ColorPickerComponent from "@/components/ColorPicker";
import {
  basketballJerseyParts,
  footballJerseyParts,
  formulaOneParts,
  hockeyJerseyParts,
} from "@/utils/config";
import type { JerseyFieldKey } from "@/types/types";
import { darken } from "@/utils/colorFunctions";

export function Settings({
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
  const { state, effective, setColor } = useJerseyColors();

  const setColorCallback = (label: string, color: string | undefined) => {
    setColor(label as JerseyFieldKey, color);
  };
  const effectiveColor = (field: JerseyFieldKey) => {
    if (
      variant === "hockey" &&
      field === "stripeTertiaryColor" &&
      state[field].enabled
    ) {
      return (
        state[field].value ??
        (effective("stripePrimaryColor")
          ? darken(effective("stripePrimaryColor")!, 0.2)
          : undefined)
      );
    }

    if (
      variant === "hockey" &&
      (field === "leftSleeveColor" || field === "rightSleeveColor") &&
      state[field].enabled
    ) {
      return (
        state[field].value ??
        darken(effective("baseColor") ?? state.theme.primary ?? "#FFFFFF", 0.2)
      );
    }

    if (
      variant === "formula-1" &&
      field === "neckCircleColor" &&
      state[field].enabled
    ) {
      return (
        state[field].value ??
        darken(effective("baseColor") ?? state.theme.primary ?? "#FFFFFF", 0.2)
      );
    }

    return effective(field);
  };

  const parts =
    variant === "basketball"
      ? basketballJerseyParts
      : variant === "hockey"
        ? hockeyJerseyParts
        : variant === "american-football"
          ? []
          : variant === "formula-1"
            ? formulaOneParts
            : footballJerseyParts;

  const needsMainColors =
    variant === "formula-1"
      ? !state.theme.primary
      : !(state.theme.primary && state.theme.secondary);
  // True once both colors are entered — collapse to compact view

  return parts.map((part) => (
    <Setting
      key={part.label}
      label={part.label}
      keys={part.keys}
      isDisabled={needsMainColors}
      templateKey={part.templateKey}
      icon={<Base {...part.baseProps} size="xsmall" variant={variant} />}
    >
      {part.templateKey ? (
        <Preset type={part.templateKey} variant={variant} />
      ) : null}
      <div className="flex w-full">
        {part.primaryKey && (
          <div className="flex flex-col pb-2 w-full gap-2">
            <div className="flex flex-col sm:flex-row w-full gap-2">
              <ColorPickerComponent
                key={part.primaryKey.field}
                field={part.primaryKey.field}
                label={part.primaryKey.label}
                setColor={setColorCallback}
                value={effectiveColor(part.primaryKey.field)}
                defaultColors={{
                  primary: state.theme.primary,
                  secondary: state.theme.secondary,
                }}
              />

              {part.hasColorSwitcher &&
                part.primaryKey &&
                part.secondaryKey && (
                  <div className="self-center hidden sm:flex">
                    <ColorSwitcher
                      primaryColor={{
                        field: part.primaryKey.field,
                        color: effectiveColor(part.primaryKey.field),
                      }}
                      secondaryColor={{
                        field: part.secondaryKey.field,
                        color: effectiveColor(part.secondaryKey.field),
                      }}
                      setColor={setColorCallback}
                    />
                  </div>
                )}

              {part.secondaryKey && (
                <ColorPickerComponent
                  key={part.secondaryKey.field}
                  field={part.secondaryKey.field}
                  label={part.secondaryKey.label}
                  setColor={setColorCallback}
                  value={effectiveColor(part.secondaryKey.field)}
                  defaultColors={{
                    primary: state.theme.primary,
                    secondary: state.theme.secondary,
                  }}
                />
              )}
            </div>

            {"tertiaryKey" in part && part.tertiaryKey && (
              <div className="w-full items-center">
                <ColorPickerComponent
                  key={part.tertiaryKey.field}
                  field={part.tertiaryKey.field}
                  label={part.tertiaryKey.label}
                  setColor={setColorCallback}
                  value={effectiveColor(part.tertiaryKey.field)}
                  defaultColors={{
                    primary: state.theme.primary,
                    secondary: state.theme.secondary,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {part.hasColorSwitcher && part.primaryKey && part.secondaryKey && (
          <div className="self-center flex sm:hidden">
            <ColorSwitcher
              primaryColor={{
                field: part.primaryKey.field,
                color: effectiveColor(part.primaryKey.field),
              }}
              secondaryColor={{
                field: part.secondaryKey.field,
                color: effectiveColor(part.secondaryKey.field),
              }}
              setColor={setColorCallback}
            />
          </div>
        )}
      </div>
    </Setting>
  ));
}
