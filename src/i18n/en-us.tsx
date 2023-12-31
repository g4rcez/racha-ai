import { Fragment } from "react";
import { ColorThemes } from "~/store/preferences.store";

const enUsMap = () => ({
    darkModeToggleButton: (props: { theme: ColorThemes }) =>
        `Change to ${props.theme === "dark" ? "light" : "dark"} mode`,
    colorDefault: "Default color",
    colorOrange: "Orange",
    colorGreen: "Green",
    colorIndigo: "Indigo",
    myCustomColor: "My color",
    userInput: "Name",
    userInputPlaceholder: "John Snow",
    addFriendInput: "Friend's name",
    updateFriendInput: "Friend's name",
    addFriend: "Add new friend",
    friendsPageTitle: "My friends",
    appPageTitle: "Welcome to Racha aí",
    devMode: "Toggle dev mode",
    landingPageTitle: "Welcome to Racha aí",
    welcomeInputTitle: "How can I call you?",
    welcomeInputPlaceholder: "My name",
    welcomeCustomizeTitle: "Customize",
    yourself: "Yourself",
    hasUpdate: "We have an update. Do you wish to update?",
    historyTitle: "My history",
    historicDescription: "Here you can check your bills history",
    closeModal: (props: { title: string }) => `Close session of ${props.title}`,
    welcome: (props: { name: string }) => (
        <Fragment>
            Hello, <span className="text-main-bg">{props.name}</span>
        </Fragment>
    ),
});

export default enUsMap;
