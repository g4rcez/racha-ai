import { Fragment, useEffect } from "react";
import { Toaster } from "sonner";
import { DesktopLayout } from "~/layout/app/desktop.layout";
import { MobileLayout } from "~/layout/app/mobile.layout";
import { Platform } from "~/store/platform";
import { Preferences } from "~/store/preferences.store";

export default function AdminLayout() {
  const [theme] = Preferences.use((state) => state.theme);
  useEffect(() => {
    document.documentElement.classList.add("bg-body-bg");
    document.documentElement.classList.add("text-body");
    return () => {
      document.documentElement.classList.remove("bg-body-bg");
      document.documentElement.classList.remove("text-body");
    };
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
      <Platform.desktop>
        <DesktopLayout />
      </Platform.desktop>
      <Platform.mobile>
        <MobileLayout />
      </Platform.mobile>
    </Fragment>
  );
}
