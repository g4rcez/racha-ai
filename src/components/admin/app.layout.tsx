import { Fragment, useEffect } from "react";
import { Toaster } from "sonner";
import { DesktopLayout } from "~/components/admin/desktop.layout";
import { MobileLayout } from "~/components/admin/mobile.layout";
import { PlatformDesktop, PlatformMobile } from "~/store/platform";
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
      <PlatformDesktop>
        <DesktopLayout />
      </PlatformDesktop>
      <PlatformMobile>
        <MobileLayout />
      </PlatformMobile>
    </Fragment>
  );
}
