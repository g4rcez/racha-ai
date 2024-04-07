import { Fragment, useEffect } from "react";
import { Toaster } from "sonner";
import { Preferences } from "~/store/preferences.store";

export const AppConfig = () => {
  const [state] = Preferences.use((state) => state);

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
        theme={state.theme}
        visibleToasts={3}
      />
    </Fragment>
  );
};
