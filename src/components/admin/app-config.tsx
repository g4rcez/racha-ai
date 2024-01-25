"use client";
import { Fragment, useEffect } from "react";
import { Toaster } from "sonner";
import { ColorThemes, Preferences } from "~/store/preferences.store";
import DefaultTheme from "~/styles/default.json";
import { setupTheme } from "~/styles/setup";

export const AppConfig = () => {
  const [theme] = Preferences.use((state) => state.theme);
  useEffect(() => {
    setupTheme(DefaultTheme, DefaultTheme.name as ColorThemes);
    const initialPreferences = Preferences.initialState();
    Preferences.setup(initialPreferences);
  }, []);

  return (
    <Fragment>
      <Toaster
        className="toaster group"
        closeButton
        duration={3000}
        theme={theme}
        visibleToasts={3}
      />
    </Fragment>
  );
};
