import { useMemo } from "react";
import { Uniwind } from "uniwind";

import { useAppearancePreferences } from "../features/settings/appearance/AppearancePreferencesProvider";
import { MOBILE_THEME_VARIABLE_NAMES, type MobileThemeVariables } from "./mobileTheme";

function readActiveThemeVariables(): MobileThemeVariables {
  const values = Uniwind.getCSSVariable([...MOBILE_THEME_VARIABLE_NAMES]);
  if (!Array.isArray(values)) throw new Error("Uniwind did not return the active theme variables.");

  return Object.fromEntries(
    MOBILE_THEME_VARIABLE_NAMES.map((name, index) => {
      const value = values[index];
      if (value === undefined) throw new Error(`Uniwind theme variable ${name} is not defined.`);
      return [name, value];
    }),
  ) as MobileThemeVariables;
}

/**
 * Complete JS palette for native and third-party APIs that cannot consume a
 * Uniwind className (React Navigation, native editors, Markdown, SVG gradients,
 * Reanimated worklets). Ordinary React Native rendering must use className.
 *
 * This bridge follows the appearance preference context instead of subscribing
 * every consumer to individual CSS variables. The provider applies the
 * registered Uniwind theme first, then publishes matching JS interop state.
 */
export function useUniwindTheme(): MobileThemeVariables {
  const { themeAppearance, themeId, themeRuntimeRevision } = useAppearancePreferences();
  return useMemo(readActiveThemeVariables, [themeAppearance, themeId, themeRuntimeRevision]);
}
