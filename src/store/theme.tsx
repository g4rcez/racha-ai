import { createGlobalReducer } from "use-typed-reducer";
import {Button} from "~/components/button";
import DarkTheme from "~/styles/dark.json";
import DefaultTheme from "~/styles/default.json";
import { changeTheme } from "~/styles/setup";


export type ColorThemes = "light" | "dark"

const state = {
    theme: "light" as ColorThemes
};

export const useTheme = createGlobalReducer(state, (get) => ({
    toggle: () => {
        const theme = get.state().theme === "light" ? "dark" : "light";
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            changeTheme(DarkTheme, "dark");
        } else {
            document.documentElement.classList.remove("dark");
            changeTheme(DefaultTheme, "light");
        }
        return ({ theme });
    }
}));

export const ThemeToggle = () => {
    const [state, dispatch] = useTheme();
    return <Button className="capitalize" onClick={dispatch.toggle}>{state.theme}</Button>;
};