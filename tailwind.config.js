// @ts-check
import containerQueries from "@tailwindcss/container-queries";
import form from "@tailwindcss/forms";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";
import DefaultConfig from "./src/styles/default.json";

const COLOR_OPERATOR = "hsla";

const createColor = (name, prefix = "") => ({
    [name]: (props) => {
        const { opacityValue, opacityVariable } = props;
        const val = opacityVariable ? `var(${opacityVariable})` : opacityValue;
        return opacityValue
            ? prefix === ""
                ? `${COLOR_OPERATOR}(var(--${name}), ${val})`
                : `${COLOR_OPERATOR}(var(--${prefix}-${name}), ${val})`
            : prefix === ""
                ? `$COLOR_OPERATOR(var(--${name}))`
                : `$COLOR_OPERATOR(var(--${prefix}-${name}))`;
    }
});

const createColorGroup = (prefix, levels) => ({
    [prefix]: levels.reduce((acc, level) => ({ ...acc, ...createColor(level, prefix) }), {})
});

const colors = Object.keys(DefaultConfig.colors).reduce((colors, colorName) => {
    const color = DefaultConfig.colors[colorName];
    const result = typeof color === "string" ? createColor(colorName) : createColorGroup(colorName, Object.keys(color));
    return { ...colors, ...result };
}, {});

export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors,
            borderRadius: {
                DEFAULT: "var(--radius)",
                md: `calc(var(--radius) / 1.5)`,
                sm: "calc(var(--radius) / 2)",
                xs: "calc(var(--radius) / 4)",
                lg: "calc(var(--radius) * 1.25)"
            }
        }
    },
    plugins: [
        animate,
        containerQueries,
        form({ strategy: "class" }),
        plugin(function({ addVariant }) {
            addVariant("link", ["&:hover", "&:focus"]);
            addVariant("group-error", ":merge(.group):invalid:has(input:not(:focus):invalid[data-initialized=true]) &");
            addVariant("group-assert", [":merge(.group):valid:has(input:valid:not(:placeholder-shown)) &"]);
        })
    ]
};
