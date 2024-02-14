import { uuidv7 } from "@kripod/uuidv7";
import { MoonIcon, SunIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { z } from "zod";
import { useTranslations } from "~/i18n";
import { changeThemeColor, hslToHex } from "~/lib/dom";
import { onlyNumbers } from "~/lib/fn";
import { Store } from "~/models/store";
import { Friends, User } from "~/store/friends.store";
import DarkTheme from "~/styles/dark.json";
import D from "~/styles/default.json";
import DefaultTheme from "~/styles/default.json";
import {
  changeTheme,
  createCssVariables,
  CssVariables,
  overwriteConfig,
} from "~/styles/setup";
import { DeepPartial, ParseToRaw } from "~/types";

type DefaultTheme = typeof D;

export type ColorThemes = "light" | "dark";

type State = {
  colors: Record<string, any>;
  devMode: boolean;
  id: string;
  installed: boolean;
  name: string;
  theme: ColorThemes;
  user: User;
};

const schemas = {
  v1: Store.validator(
    z.object({
      name: z.string(),
      devMode: z.boolean(),
      id: z.string().uuid(),
      user: Friends.schema,
      colors: z.record(z.any()),
      installed: z.boolean().default(false),
      theme: z.literal("light").or(z.literal("dark")),
    }),
  ),
};

const getPreferMode = (): ColorThemes =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const assignFlatTokens = (flat: CssVariables) =>
  overwriteConfig(document.documentElement, flat);

const setMode = (colorTheme: ColorThemes) => {
  if (colorTheme === "dark") {
    document.documentElement.classList.add("dark");
    changeTheme(DarkTheme, "dark");
  } else {
    document.documentElement.classList.remove("dark");
    changeTheme(DefaultTheme, "light");
  }
};

const setup = (state?: DeepPartial<State>) => {
  const colorTheme = state?.theme ?? Preferences.getPreferMode();
  Preferences.setMode(colorTheme);
  if (state?.colors) {
    overwriteConfig(document.documentElement, createCssVariables(state.colors));
  }
};

export const Preferences = Store.create(
  { name: "preferences", schemas, version: "v1" },
  (storage?: ParseToRaw<State>): State => {
    const id = uuidv7();
    return {
      id: storage?.id ?? id,
      name: storage?.name ?? "",
      colors: storage?.colors ?? {},
      theme: storage?.theme ?? "light",
      devMode: storage?.devMode ?? true,
      installed: storage?.installed || false,
      user: storage?.user ?? ({ id, createdAt: new Date(), name: "" } as User),
    };
  },
  (get) => {
    const merge = (s: Partial<State>) => ({ ...get.state(), ...s });
    return {
      set: merge,
      colors: (colors: DeepPartial<DefaultTheme["colors"]>) => {
        const main = colors.main?.bg
          ?.split(",")
          .map(onlyNumbers)
          .map((x) => Number.parseInt(x, 10));
        if (Array.isArray(main)) {
          const hex = hslToHex(main[0], main[1], main[2]);
          changeThemeColor(hex);
        }
        if (colors) {
          overwriteConfig(document.documentElement, createCssVariables(colors));
        }
        return merge({ colors });
      },
      onChangeName: (name: string) => {
        return merge({ name, user: { ...get.state().user, name } });
      },
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        const type = e.target.type;
        if (type === "checkbox") {
          const checked = e.target.checked;
          return merge({ [name]: checked });
        }
        return merge({ [name]: value });
      },
      toggle: () => {
        const theme = get.state().theme === "light" ? "dark" : "light";
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
          changeTheme(DarkTheme, "dark");
        } else {
          document.documentElement.classList.remove("dark");
          changeTheme(DefaultTheme, "light");
        }
        return merge({ theme });
      },
    };
  },
  { setMode, getPreferMode, assignFlatTokens, setup },
);

export const ThemeToggle = () => {
  const [state, dispatch] = Preferences.use();
  const i18n = useTranslations();
  const isLight = state.theme === "light";
  return (
    <button
      onClick={dispatch.toggle}
      aria-label={i18n.get("darkModeToggleButton", state)}
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
