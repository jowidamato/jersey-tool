import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";
import { useEffect, useMemo } from "react";
import { Button, Dropdown, Label } from "@heroui/react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { JerseyColorsProvider } from "@/context/JerseyContext";
import { configToState } from "@/utils/utils";
import { type JerseyConfig } from "@/utils/jerseyConfig";
import { Actions } from "@/pages/Jerseys/Customizer/Content/Actions";
import { ThemeToggle } from "@/components/ThemeToggle";

const SPORT_ROUTES = [
  { id: "football", path: "/football", label: "Football" },
  { id: "basketball", path: "/basketball", label: "Basketball" },
  { id: "hockey", path: "/hockey", label: "Ice Hockey" },
  {
    id: "american-football",
    path: "/american-football",
    label: "American Football",
  },
  { id: "formula-1", path: "/formula-1", label: "Formula 1" },
  { id: "baseball", path: "/baseball", label: "Baseball" },
  { id: "rugby", path: "/rugby", label: "Rugby" },
  { id: "handball", path: "/handball", label: "Handball" },
];

export function Component() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute =
    SPORT_ROUTES.find((r) => location.pathname.startsWith(r.path)) ??
    SPORT_ROUTES[0];
  const isJerseyRoute = SPORT_ROUTES.some((r) =>
    location.pathname.startsWith(r.path),
  );
  const routeState = location.state as {
    uploadedConfig?: JerseyConfig;
    resetOnEntry?: boolean;
  } | null;
  const routedUpload = routeState?.uploadedConfig ?? null;
  const resetOnEntry = routeState?.resetOnEntry === true;
  const initial = useMemo(
    () =>
      isJerseyRoute && routedUpload
        ? configToState(
            routedUpload,
            currentRoute.id as
              | "football"
              | "basketball"
              | "hockey"
              | "american-football"
              | "formula-1"
              | "baseball"
              | "rugby"
              | "handball",
            routedUpload?.name ?? null,
            null,
            null,
          )
        : null,
    [currentRoute.id, isJerseyRoute, routedUpload],
  );

  useEffect(() => {
    if (!isJerseyRoute || !resetOnEntry || routedUpload) return;

    navigate(location.pathname + location.search + location.hash, {
      replace: true,
      state: null,
    });
  }, [
    isJerseyRoute,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    resetOnEntry,
    routedUpload,
  ]);

  return (
    <>
      <ScrollRestoration getKey={(location) => location.pathname} />

      <JerseyColorsProvider
        key={isJerseyRoute ? currentRoute.id : "home"}
        initial={initial}
        skipActiveDraftHydration={resetOnEntry}
        variant={
          isJerseyRoute
            ? (currentRoute.id as
                | "football"
                | "basketball"
                | "hockey"
                | "american-football"
                | "formula-1"
                | "baseball"
                | "rugby"
                | "handball")
            : undefined
        }
      >
        <main className="flex-col  min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-7rem)] relative">
          <header className=" flex items-center  px-3 lg:px-0  w-full  sticky top-0 z-10 backdrop-blur-md">
            <div className="flex w-full gap-2 items-center my-2 justify-between max-w-5xl mx-auto">
              {location.pathname === "/" ? null : (
                <Button
                  isIconOnly
                  variant="ghost"
                  aria-label="Back to home"
                  onPress={() => navigate("/")}
                >
                  <MaterialIcon
                    name="arrow_back_ios"
                    size={22}
                    className="pl-2"
                  />
                </Button>
              )}
              <div className="flex w-full items-center justify-between gap-2 ">
                {location.pathname === "/" ? (
                  <span className="text-2xl font-BarlowCondensed font-semibold pl-6">
                    Jerseys
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <Dropdown>
                      <Dropdown.Trigger
                        aria-label="Select sport"
                        className="flex gap-2 items-center"
                      >
                        <span className="text-xl sm:text-2xl font-BarlowCondensed font-semibold">
                          {currentRoute.label}
                        </span>
                        <MaterialIcon name="keyboard_arrow_down" size={24} />
                      </Dropdown.Trigger>
                      <Dropdown.Popover className="min-w-[256px]">
                        <Dropdown.Menu
                          selectedKeys={new Set([currentRoute.id])}
                          selectionMode="single"
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            const route = SPORT_ROUTES.find(
                              (r) => r.id === selected,
                            );
                            if (route) navigate(route.path);
                          }}
                        >
                          {SPORT_ROUTES.map((route) => (
                            <Dropdown.Item
                              key={route.id}
                              id={route.id}
                              textValue={route.label}
                            >
                              <Dropdown.ItemIndicator />
                              <Label>{route.label}</Label>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </div>
                )}
                <Actions
                  variant={
                    currentRoute.id as
                      | "football"
                      | "basketball"
                      | "hockey"
                      | "american-football"
                      | "formula-1"
                      | "baseball"
                      | "rugby"
                      | "handball"
                  }
                  isJerseyRoute={isJerseyRoute}
                />
              </div>
            </div>
          </header>

          <section className="w-full max-w-5xl mx-auto">
            <Outlet />
          </section>
          <div className="fixed right-3 bottom-3">
            <ThemeToggle iconOnly />
          </div>
        </main>
      </JerseyColorsProvider>
    </>
  );
}
