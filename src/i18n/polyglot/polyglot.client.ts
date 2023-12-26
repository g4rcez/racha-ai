import { createGlobalReducer } from "use-typed-reducer";
import { i18n } from "~/i18n";
import { createPolyglot, InferLanguages } from "~/i18n/polyglot/polyglot.core";
import { PolyglotFullConfig } from "~/i18n/polyglot/types/types";

export const createPolyglotStore = <Config extends ReturnType<typeof createPolyglot<any, any>>>(config: Config) => {
    const changeLanguage = (lang: string) => {
        document.documentElement.lang = lang;
    };
    changeLanguage(config.language);
    return createGlobalReducer(
        {
            format: config.format,
            language: config.language,
            map: config.map,
            get: config.get as typeof i18n.get,
        },
        () => ({
            set: async (newLanguage: InferLanguages<Config>, extraOptions?: PolyglotFullConfig) => {
                const result = await config.setLanguage(newLanguage, extraOptions);
                return { map: result.map as any, language: newLanguage, format: result.format };
            },
        }),
        undefined,
        [
            (state) => {
                changeLanguage(state.language);
                return state;
            },
        ],
    );
};
