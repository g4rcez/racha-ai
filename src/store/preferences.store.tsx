import { uuidv7 } from "@kripod/uuidv7";
import { MoonIcon, SunIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { any, boolean, literal, object, record, string, union } from "valibot";
import { Button } from "~/components/button";
import { useTranslations } from "~/i18n";
import { uuid } from "~/lib/fn";
import { Entity } from "~/models/entity";
import { Friends, User } from "~/store/friends.store";
import DarkTheme from "~/styles/dark.json";
import D from "~/styles/default.json";
import DefaultTheme from "~/styles/default.json";
import { changeTheme, createCssVariables, CssVariables, overwriteConfig } from "~/styles/setup";
import { DeepPartial } from "~/types";

type DefaultTheme = typeof D;

export type ColorThemes = "light" | "dark";

type State = {
    colors: Record<string, any>;
    devMode: boolean;
    id: string;
    name: string;
    theme: ColorThemes;
    user: User;
};

const schemas = {
    v1: Entity.validator(
        object({
            id: string(uuid()),
            devMode: boolean(),
            name: string(),
            colors: record(any()),
            theme: union([literal("light"), literal("dark")]),
            user: Friends.schema
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
    (storage?: Partial<State>) => {
        const id = uuidv7();
        return {
            id: storage?.id ?? id,
            colors: storage?.colors ?? {},
            devMode: storage?.devMode ?? false,
            theme: storage?.theme ?? "light",
            name: storage?.name ?? "Eu",
            user: storage?.user ?? ({ id, createdAt: new Date(), name: "Eu" } as User)
        } as State;
    },
    (get) => {
        const merge = (s: Partial<State>) => ({ ...get.state(), ...s });
        return {
            set: merge,
            colors: (colors: DeepPartial<DefaultTheme["colors"]>) => {
                if (colors) {
                    overwriteConfig(document.documentElement, createCssVariables(colors));
                }
                return merge({ colors });
            },
            onChangeName: (e: ChangeEvent<HTMLInputElement>) => {
                const name = e.target.value;
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
            }
        };
    },
    { setMode, getPreferMode, assignFlatTokens, setup }
);

export const ThemeToggle = () => {
    const i18n = useTranslations();
    const [state, dispatch] = Preferences.use();
    const isLight = state.theme === "light";

    return (
        <Button aria-label={i18n.get("darkModeToggleButton", state)} onClick={dispatch.toggle}>
            {isLight ? <MoonIcon /> : <SunIcon />}
        </Button>
    );
};