"use client";
import { Fragment, useEffect } from "react";
import { Toaster } from "sonner";
import { Preferences } from "~/store/preferences.store";

export const AppConfig = () => {
  const [theme] = Preferences.use((state) => state.theme);

  useEffect(() => {
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
