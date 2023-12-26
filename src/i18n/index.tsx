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
    colorIndigo: "Anil",
    myCustomColor: "Minha cor",
    userInput: "Nome",
    userInputPlaceholder: "João das Neves",
    addFriendInput: "Nome do amigo",
    updateFriendInput: "Nome do amigo",
    addFriend: "Adicionar novo amigo",
    friendsPageTitle: "Sessão de amigos",
    appPageTitle: "Bem vindo ao Divide aí",
    devMode: "Habilitar modo avançado?",
    landingPageTitle: "Bem vindo ao Divide aí",
    welcomeInputTitle: "Como devo te chamar?",
    welcomeInputPlaceholder: "Meu nome",
    welcomeCustomizeTitle: "Customizar",
    yourself: "Você mesmo",
    hasUpdate: "Temos uma atualização, deseja atualizar?",
    historyTitle: "Meu histórico",
    historicDescription: "Aqui você pode conferir tudo o que você já rachou com a galera.",
    closeModal: (props: { title: string }) => `Fechar sessão de ${props.title}`,
    welcome: (props: { name: string }) => (
        <Fragment>Olá {props.name === "" ? "" : <span className="text-main-bg">, {props.name}</span>}</Fragment>
    ),
}));

export const i18n = createPolyglot(native, { "en-US": () => import("./en-us") });

export const useI18n = createPolyglotStore(i18n);

export const useTranslations = () => useI18n()[0];
