import { MoonIcon, SunIcon } from "lucide-react";
import { createGlobalReducer } from "use-typed-reducer";
import { z } from "zod";
import { Button } from "~/components/button";
import { useTranslations } from "~/i18n";
import { deepMerge, parseFromSchema } from "~/lib/fn";
import { Preferences } from "~/models/preferences";
import { User } from "~/models/user";
import { useFriends } from "~/store/friends.store";
import { createStorageMiddleware } from "~/store/middleware";
import DarkTheme from "~/styles/dark.json";
import DefaultTheme from "~/styles/default.json";
import { changeTheme, createCssVariables } from "~/styles/setup";
import { ThemeConfig } from "~/styles/styles.type";
import { DeepPartial } from "~/types";

export type ColorThemes = "light" | "dark";

const schemas = {
    v1: z
        .object({
            id: z.string().uuid(),
            devMode: z.boolean(),
            nickname: z.string().min(1),
            colors: z.record(z.any()),
            theme: z.literal("dark").or(z.literal("light"))
        })
        .transform((x) => new Preferences(x))
        .default(new Preferences())
};

type Versions = keyof typeof schemas;

const versions = {
    v1: (a: any) => parseFromSchema(a, schemas.v1)
} satisfies Record<Versions, (a: any) => State>;

const currentVersion: Versions = "v1";

const currentSchema = schemas[currentVersion];

type State = z.infer<typeof currentSchema>;

const storage = createStorageMiddleware("preferences", currentVersion, versions);

export const initialPreferences: State = storage.get();

const friends = useFriends.dispatchers;

export const usePreferences = createGlobalReducer(
    initialPreferences,
    (get) => ({
        devMode: (developerMode: boolean) => {
            const state = get.state();
            state.devMode = developerMode;
            return state;
        },
        user: (user: User) => {
            const state = get.state();
            state.nickname = user.name;
            friends.upsert(user);
            return state;
        },
        nickname: (nickname: string) => {
            const state = get.state();
            state.nickname = nickname;
            const user = state.user;
            user.name = nickname;
            friends.upsert(user);
            return state;
        },
        colors: (colors: DeepPartial<ThemeConfig["colors"]>) => {
            const merge = deepMerge(get.state().colors, colors);
            Preferences.assignFlatTokens(createCssVariables(merge));
            const state = get.state();
            state.colors = colors;
            return state;
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
            const state = get.state();
            state.theme = theme;
            return state;
        }
    }),
    undefined,
    [storage.middleware]
);

export const ThemeToggle = () => {
    const [state, dispatch] = usePreferences();
    const i18n = useTranslations();
    const message = i18n.get("darkModeToggleButton", state);
    return (
        <Button
            aria-label={message}
            title={message}
            theme="transparent"
            className="capitalize"
            onClick={dispatch.toggle}
        >
            {state.theme === "dark" ? (
                <SunIcon absoluteStrokeWidth strokeWidth={2} size={24} />
            ) : (
                <MoonIcon absoluteStrokeWidth strokeWidth={2} size={24} />
            )}
        </Button>
    );
};
