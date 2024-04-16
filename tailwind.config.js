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
  },
});

const createColorGroup = (prefix, levels = []) => ({
  [prefix]: levels.reduce(
    (acc, level) => ({ ...acc, ...createColor(level, prefix) }),
    {},
  ),
});

const colors = Object.keys(DefaultConfig.colors).reduce((colors, colorName) => {
  const color = DefaultConfig.colors[colorName];
  const result =
    typeof color === "string"
      ? createColor(colorName)
      : createColorGroup(colorName, Object.keys(color));
  return { ...colors, ...result };
}, {});

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "2rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["2rem", { lineHeight: "3rem" }],
      "4xl": ["2.5rem", { lineHeight: "3rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      colors,
      animation: {
        "fade-in": "fade-in 0.5s linear forwards",
        marquee: "marquee var(--marquee-duration) linear infinite",
        "spin-slow": "spin 4s linear infinite",
        "spin-slower": "spin 6s linear infinite",
        "spin-reverse": "spin-reverse 1s linear infinite",
        "spin-reverse-slow": "spin-reverse 4s linear infinite",
        "spin-reverse-slower": "spin-reverse 6s linear infinite",
      },
      keyframes: {
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        marquee: {
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        "spin-reverse": {
          to: {
            transform: "rotate(-360deg)",
          },
        },
      },
      maxWidth: { "2xl": "40rem" },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        DEFAULT: "var(--radius)",
        md: `calc(var(--radius) / 1.5)`,
        sm: "calc(var(--radius) / 2)",
        xs: "calc(var(--radius) / 4)",
        lg: "calc(var(--radius) * 1.25)",
      },
    },
  },
  plugins: [
    animate,
    containerQueries,
    form({ strategy: "class" }),
    plugin(function ({ addVariant }) {
      addVariant("link", ["&:hover", "&:active"]);
      addVariant("landing", ["&"]);
      addVariant(
        "group-error",
        [
          ":merge(.group):invalid:has(.input:not(:focus):invalid[data-initialized=true]) &",
          ":merge(.group[data-error=true]) &",
        ]
      );
      addVariant("group-assert", [
        ":merge(.group):valid:has(.input:valid:not(:placeholder-shown)) &",
      ]);
    }),
  ],
};
