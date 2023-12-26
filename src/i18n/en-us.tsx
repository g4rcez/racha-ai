import { Fragment } from "react";
import { ColorThemes } from "~/store/preferences.store";

const enUsMap = () => ({
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
    historyTitle: "My history",
    historicDescription: "Here you can check your bills history",
    closeModal: (props: { title: string }) => `Fechar sessão de ${props.title}`,
    welcome: (props: { name: string }) => (
        <Fragment>
            Olá, <span className="text-main-bg">{props.name}</span>
        </Fragment>
    ),
});

export default enUsMap;
