import { ChangeEvent } from "react";
import { any, boolean, literal, object, record, string, union } from "valibot";
import { Button } from "~/components/button";
import { uuid } from "~/lib/fn";
import { Entity } from "~/models/entity";
import DarkTheme from "~/styles/dark.json";
import D from "~/styles/default.json";
import DefaultTheme from "~/styles/default.json";
import { changeTheme, createCssVariables, CssVariables, overwriteConfig } from "~/styles/setup";
import { DeepPartial } from "~/types";

type DefaultTheme = typeof D;

export type ColorThemes = "light" | "dark";

type State = {
    id: string;
    devMode: boolean;
    name: string;
    colors: Record<string, any>;
    theme: ColorThemes;
};

const schemas = {
    v1: Entity.validator(
        object({
            id: string(uuid()),
            devMode: boolean(),
            name: string(),
            colors: record(any()),
            theme: union([literal("light"), literal("dark")])
        })
    )
};

const getPreferMode = (): ColorThemes => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

const assignFlatTokens = (flat: CssVariables) => overwriteConfig(document.documentElement, flat);

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

export const Preferences = Entity.create(
    { name: "preferences", schemas, version: "v1" },
    () =>
        ({
            id: uuid(),
            colors: {},
            devMode: false,
            theme: "light",
            name: "Eu"
        }) as State,
    (get) => {
        const merge = (s: Partial<State>) => ({ ...get.state(), ...s });
        return {
            set: merge,
            colors: (colors: DeepPartial<DefaultTheme["colors"]>) => merge({ colors }),
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
            }
        };
    },
    { setMode, getPreferMode, assignFlatTokens, setup }
);

export const ThemeToggle = () => {
    const [state, dispatch] = Preferences.use();
    return <Button onClick={dispatch.toggle}>{state.theme}</Button>;
};
