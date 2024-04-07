import { Fragment } from "react";
import { Toaster } from "sonner";
import { MobileLayout } from "~/components/admin/mobile.layout";
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
      <MobileLayout />
    </Fragment>
  );
}
