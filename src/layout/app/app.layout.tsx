import { Fragment } from "react";
import { Toaster } from "sonner";
import { Platform } from "~/components/platform";
import { DesktopLayout } from "~/layout/app/desktop.layout";
import { MobileLayout } from "~/layout/app/mobile.layout";
import { Preferences } from "~/store/preferences.store";

export default function AdminLayout() {
  const [theme] = Preferences.use((state) => state.theme);
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
