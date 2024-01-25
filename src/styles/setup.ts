import { flatTuples, reduceObject } from "~/lib/fn";
import { Is } from "~/lib/is";
import { ColorThemes } from "~/store/preferences.store";

type VariableValue = string | Record<string, string>;

type ThemeConfig = Record<string, string | any>;

export const createFromFlatToken = (key: string, val: string) => {
  const [prefix, second] = key.split(".");
  return Is.undefined(second)
    ? `--${prefix}: ${val}`
    : `--${prefix}-${second.replace(prefix, "")}: ${val}`;
};

export const createColors = (value: Record<string, any>) =>
  flatTuples<string, VariableValue>(value).map(([key, val]): string =>
    createFromFlatToken(key, val as string),
  );

export const createCssVariables = (merge: Record<string, any>) =>
  flatTuples<string, string>(merge).map(([token, val]) =>
    createFromFlatToken(token, val)
      .split(":")
      .map((x) => x.trim()),
  ) as CssVariables;

const variablesMapper = {
  radius: "radius",
  colors: (value: Omit<ThemeConfig, string>) => createColors(value).join(";"),
} satisfies Record<string, ((value: ThemeConfig | string) => void) | string>;

export const createCssTheme = (map: ThemeConfig) => {
  const reduce: Record<string, string> = reduceObject(
    map,
    (key, variables): string => {
      if (!Is.keyof(variablesMapper, key)) return "";
      const action = variablesMapper[key];
      if (Is.function(action)) return action(variables);
      return `--${key}: ${variables};`;
    },
  );
  let styleCss = "";
  for (const key in reduce) styleCss += reduce[key];
  return `:root { ${styleCss} }`;
};

export const setupTheme = (themeConfig: ThemeConfig, id: ColorThemes) => {
  const theme = createCssTheme(themeConfig);
  const style = document.getElementById("theme");
  if (style === null) return;
  style.id = "theme";
  style.innerHTML = theme;
  style.setAttribute("data-configuration", id);
};

export const changeTheme = (themeConfig: ThemeConfig, id: ColorThemes) => {
  const style = document.getElementById("theme");
  if (style === null) return;
  style.setAttribute("data-configuration", id);
  style.innerHTML = createCssTheme(themeConfig);
};

export type CssVariables = [token: string, value: string][];

export const overwriteConfig = (root: HTMLElement, preferences: CssVariables) =>
  preferences.forEach(([key, value]) => root.style.setProperty(key, value));
