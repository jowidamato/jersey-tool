import { MaterialIcon } from "@/components/MaterialIcon";
import { useJerseyColors } from "@/context/JerseyContext";
import { Button, Label, Slider, Switch, toast } from "@heroui/react";
import { Reorder, useDragControls } from "framer-motion";
import { useRef } from "react";

const toPercent = (value: number) => `${Math.round(value * 100)}%`;
const toSignedPercent = (value: number, maxAbs: number) => {
  const pct = Math.round((value / maxAbs) * 100);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
};
const toSignedValue = (value: number) => {
  if (Math.abs(value) < 0.001) return "0";
  const rounded = Math.round(value * 10) / 10;
  const rendered = Number.isInteger(rounded)
    ? `${rounded}`
    : rounded.toFixed(1);
  return rounded > 0 ? `+${rendered}` : rendered;
};

function extractSvgOverlay(svgText: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) {
    throw new Error("File does not contain a valid SVG root.");
  }

  doc
    .querySelectorAll("script, foreignObject")
    .forEach((node) => node.remove());

  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        return;
      }
      if (
        (name === "href" || name === "xlink:href") &&
        value.startsWith("javascript:")
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  const viewBoxRaw = svg.getAttribute("viewBox");
  if (viewBoxRaw) {
    const parts = viewBoxRaw.trim().split(/\s+/).map(Number);
    if (parts.length === 4 && parts.every((p) => Number.isFinite(p))) {
      return { content: svg.innerHTML, viewBox: parts.join(" ") };
    }
  }

  const width = Number.parseFloat(svg.getAttribute("width") || "");
  const height = Number.parseFloat(svg.getAttribute("height") || "");
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 100;
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 100;

  return {
    content: svg.innerHTML,
    viewBox: `0 0 ${safeWidth} ${safeHeight}`,
  };
}
export function CustomOverlay() {
  const {
    state,
    addCustomOverlay,
    removeCustomOverlay,
    setActiveCustomOverlay,
    setCustomOverlayOrder,
    setCustomOverlayEnabled,
    setCustomOverlayTransform,
  } = useJerseyColors();
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const selectedOverlay =
    state.customOverlays.find(
      (overlay) => overlay.id === state.customOverlayActiveId,
    ) ?? state.customOverlays[0];

  return (
    <div className="flex flex-col gap-4 px-1">
      <input
        ref={overlayInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          try {
            const text = await file.text();
            const extracted = extractSvgOverlay(text);
            addCustomOverlay(extracted.content, extracted.viewBox);
            toast("Custom overlay uploaded", {
              description: file.name,
            });
          } catch (error) {
            toast.danger(
              error instanceof Error ? error.message : "Invalid SVG file",
            );
          }
        }}
      />
      {state.customOverlays.length ? (
        <Reorder.Group
          axis="y"
          values={state.customOverlays.map((overlay) => overlay.id)}
          onReorder={setCustomOverlayOrder}
          className="flex flex-col gap-2"
        >
          {state.customOverlays.map((overlay, index) => (
            <OverlayListItem
              key={overlay.id}
              overlay={overlay}
              index={index}
              isSelected={overlay.id === selectedOverlay?.id}
              onSelect={() => setActiveCustomOverlay(overlay.id)}
              onToggle={(selected) =>
                setCustomOverlayEnabled(overlay.id, selected)
              }
              onRemove={() => removeCustomOverlay(overlay.id)}
            />
          ))}
        </Reorder.Group>
      ) : null}
      {selectedOverlay ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Slider
              minValue={-12}
              maxValue={12}
              step={0.5}
              value={selectedOverlay.x}
              onChange={(value) =>
                setCustomOverlayTransform({
                  x: Array.isArray(value) ? value[0] : value,
                })
              }
            >
              <Label>X Offset</Label>
              <Slider.Output>{toSignedValue(selectedOverlay.x)}</Slider.Output>
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
          <div className="flex flex-col gap-1">
            <Slider
              minValue={-12}
              maxValue={12}
              step={0.5}
              value={selectedOverlay.y}
              onChange={(value) =>
                setCustomOverlayTransform({
                  y: Array.isArray(value) ? value[0] : value,
                })
              }
            >
              <Label>Y Offset</Label>
              <Slider.Output>{toSignedValue(selectedOverlay.y)}</Slider.Output>
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
          <div className="flex flex-col gap-1">
            <Slider
              minValue={0.25}
              maxValue={2.5}
              step={0.01}
              value={selectedOverlay.scale}
              onChange={(value) =>
                setCustomOverlayTransform({
                  scale: Array.isArray(value) ? value[0] : value,
                })
              }
            >
              <Label>Scale</Label>
              <Slider.Output>{toPercent(selectedOverlay.scale)}</Slider.Output>
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
          <div className="flex flex-col gap-1">
            <Slider
              minValue={-180}
              maxValue={180}
              step={1}
              value={selectedOverlay.rotation}
              onChange={(value) =>
                setCustomOverlayTransform({
                  rotation: Array.isArray(value) ? value[0] : value,
                })
              }
            >
              <Label>Rotation</Label>
              <Slider.Output>
                {toSignedPercent(selectedOverlay.rotation, 180)}
              </Slider.Output>
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>
        </div>
      ) : (
        <div className="py-3  flex items-center flex-col">
          <span className="pb-3  w-44 text-center text-xs text-gray-600 dark:text-gray-400">
            Upload SVG text, logos, or shapes that should sit on the jersey
            body.
          </span>
          <span className="text-xs text-red-500 text-center ">
            Use with caution. Do not upload copyrighted material
          </span>
        </div>
      )}
      <div
        className="flex justify-end gap-2 pb-3"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {" "}
        {selectedOverlay ? (
          <Button
            variant="ghost"
            onClick={(event) => event.stopPropagation()}
            onPress={() => removeCustomOverlay(selectedOverlay.id)}
          >
            Remove
          </Button>
        ) : null}
        <Button
          variant="primary"
          onClick={(event) => event.stopPropagation()}
          onPress={() => overlayInputRef.current?.click()}
        >
          {selectedOverlay ? "Add SVG" : "Upload SVG"}
        </Button>
      </div>
    </div>
  );
}

function OverlayListItem({
  overlay,
  index,
  isSelected,
  onSelect,
  onToggle,
  onRemove,
}: {
  overlay: {
    id: string;
    name: string;
    enabled: boolean;
    svg?: string;
    viewBox?: string;
  };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: (selected: boolean) => void;
  onRemove: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={overlay.id}
      dragListener={false}
      dragControls={dragControls}
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 bg-white dark:bg-black ${
        isSelected
          ? "border-black dark:border-white"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        onClick={onSelect}
      >
        {overlay.svg ? (
          <svg
            viewBox={overlay.viewBox || "0 0 100 100"}
            className="h-9 w-9"
            aria-hidden="true"
          >
            <g dangerouslySetInnerHTML={{ __html: overlay.svg }} />
          </svg>
        ) : (
          <span className="text-xs text-gray-400">SVG</span>
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold">{`Overlay ${index + 1}`}</div>
        </div>
      </button>
      <Switch
        aria-label={`Toggle overlay ${index + 1}`}
        isSelected={overlay.enabled}
        onChange={onToggle}
      />
      <Button
        isIconOnly
        variant="ghost"
        aria-label={`Reorder overlay ${index + 1}`}
        onPointerDown={(event) => dragControls.start(event)}
      >
        <MaterialIcon name="drag_indicator" />
      </Button>
      <Button isIconOnly variant="ghost" onPress={onRemove}>
        <MaterialIcon name="delete" />
      </Button>
    </Reorder.Item>
  );
}
