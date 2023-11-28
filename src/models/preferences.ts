import { Entity } from "~/models/entity";
import { ColorThemes } from "~/store/preferences.store";
import DarkTheme from "~/styles/dark.json";
import DefaultTheme from "~/styles/default.json";
import { changeTheme, createCssVariables, CssVariables, overwriteConfig } from "~/styles/setup";
import { ThemeConfig } from "~/styles/styles.type";
import { DeepPartial } from "~/types";

export class Preferences implements Entity {
    public theme: ColorThemes;
    public devMode: boolean;
    public nickname: string;
    public colors: DeepPartial<ThemeConfig["colors"]>;

    constructor(preferences?: Partial<Preferences>) {
        this.theme = preferences?.theme ?? Preferences.getPreferMode();
        this.colors = preferences?.colors ?? {};
        this.devMode = preferences?.devMode ?? false;
        this.nickname = preferences?.nickname ?? "Usuário";
        console.log(preferences, this);
    }

    public static setMode(colorTheme: ColorThemes) {
        if (colorTheme === "dark") {
            document.documentElement.classList.add("dark");
            changeTheme(DarkTheme, "dark");
        } else {
            document.documentElement.classList.remove("dark");
            changeTheme(DefaultTheme, "light");
        }
    }

    public static setup(store?: DeepPartial<Preferences>) {
        const colorTheme = store?.theme ?? Preferences.getPreferMode();
        Preferences.setMode(colorTheme);
        if (store?.colors) {
            overwriteConfig(document.documentElement, createCssVariables(store.colors));
        }
    }

    public static getPreferMode(): ColorThemes {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    public static assignFlatTokens(flat: CssVariables) {
        overwriteConfig(document.documentElement, flat);
    }

    public static new(p: Preferences) {
        return new Preferences(p);
    }

    clone() {
        return new Preferences(this);
    }
}
