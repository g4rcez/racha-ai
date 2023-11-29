import { Fragment } from "react";
import { createPolyglotStore } from "~/i18n/polyglot/polyglot.client";
import { createPolyglot, createPolyglotNative } from "~/i18n/polyglot/polyglot.core";
import { ColorThemes } from "~/store/preferences.store";

const native = createPolyglotNative("pt-BR", () => ({
    darkModeToggleButton: (props: { theme: ColorThemes }) =>
        `Trocar para modo ${props.theme === "dark" ? "claro" : "escuro"}`,
    colorDefault: "Cor padrão",
    colorOrange: "Laranja",
    colorGreen: "Verde",
    colorIndigo: "Violeta",
    userInput: "Nome",
    userInputPlaceholder: "João das Neves",
    addFriendInput: "Nome do amigo",
    updateFriendInput: "Nome do amigo",
    addFriend: "Adicionar novo amigo",
    friendsPageTitle: "Sessão de amigos",
    appPageTitle: "Bem vindo ao Divide aí",
    devMode: "Habilitar modo de avançado?",
    landingPageTitle: "Bem vindo ao Divide aí",
    welcomeInputTitle: "Como devo te chamar?",
    welcomeInputPlaceholder: "Meu nome",
    welcomeCustomizeTitle: "Customizar",
    yourself: "Você mesmo",
    welcome: (props: { nickname: string }) => (
        <Fragment>
            Olá, <span className="text-main-bg">{props.nickname}</span>
        </Fragment>
    )
}));

export const i18n = createPolyglot(native);

export const useI18n = createPolyglotStore(i18n);

export const useTranslations = () => useI18n()[0];
