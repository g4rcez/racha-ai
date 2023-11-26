import { createElement } from "~/lib/dom";
import { flatTuples, reduceObject } from "~/lib/fn";
import { Is } from "~/lib/is";
import { ColorThemes } from "~/store/theme";

type VariableValue = string | Record<string, string>;

export const createColors = (value: Record<string, any>) => flatTuples<string, VariableValue>(value)
    .map(([key, val]): string => {
        const [prefix, second] = key.split(".");
        return Is.undefined(second)
            ? `--${prefix}: ${val}`
            : `--${prefix}-${second.replace(prefix, "")}: ${val}`;
    })
    .join(";");

type ThemeConfig = Record<string, string | any>;

const variablesMapper = {
    radius: "radius",
    colors: (value: Omit<ThemeConfig, string>) =>
        flatTuples<string, VariableValue>(value)
            .map(([key, val]): string => {
                const [prefix, second] = key.split(".");
                return Is.undefined(second)
                    ? `--${prefix}: ${val}`
                    : `--${prefix}-${second.replace(prefix, "")}: ${val}`;
            })
            .join(";")
} satisfies Record<string, ((value: ThemeConfig | string) => void) | string>;


export const createCssTheme = (map: ThemeConfig) => {
    const reduce: Record<string, string> = reduceObject(map, (key, variables): string => {
            if (!Is.keyof(variablesMapper, key)) return "";
            const action = variablesMapper[key];
            if (Is.function(action)) return action(variables);
            return `--${key}: ${variables};`;
        }
    );
    let styleCss = "";
    for (const key in reduce) styleCss += reduce[key];
    return `:root { ${styleCss} }`;
};


export const setupTheme = (head: HTMLElement, themeConfig: ThemeConfig, id: ColorThemes) => {
    const theme = createCssTheme(themeConfig);
    const style = createElement("style", { type: "text/css", innerHTML: theme, id: "theme" });
    style.setAttribute("data-configuration", id);
    head.appendChild(style);
};

export const changeTheme = (themeConfig: ThemeConfig, id: ColorThemes) => {
    const style = document.getElementById("theme")! as HTMLStyleElement;
    style.setAttribute("data-configuration", id);
    style.innerHTML = createCssTheme(themeConfig);
};
