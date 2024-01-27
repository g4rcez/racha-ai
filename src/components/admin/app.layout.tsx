"use client";
import { Fragment } from "react";
import { Toaster } from "sonner";
import { DesktopLayout } from "~/components/admin/desktop.layout";
import { MobileLayout } from "~/components/admin/mobile.layout";
import { PlatformDesktop, PlatformMobile } from "~/store/platform";
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
      <PlatformDesktop>
        <DesktopLayout />
      </PlatformDesktop>
      <PlatformMobile>
        <MobileLayout />
      </PlatformMobile>
    </Fragment>
  );
}
