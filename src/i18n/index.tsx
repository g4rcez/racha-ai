import { createPolyglotStore } from "~/i18n/polyglot/polyglot.client";
import { createPolyglot, createPolyglotNative } from "~/i18n/polyglot/polyglot.core";

const native = createPolyglotNative("pt-BR", () => ({
    userInput: "Nome",
    userInputPlaceholder: "João das Neves"
}));

export const i18n = createPolyglot(native);

export const useI18n = createPolyglotStore(i18n);
