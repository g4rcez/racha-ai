import { PropsWithChildren } from "react";
import { AppConfig } from "~/components/admin/app-config";
import { DesktopLayout } from "~/components/admin/desktop.layout";
import { MobileLayout } from "~/components/admin/mobile.layout";
import { PlatformDesktop, PlatformMobile } from "~/store/platform";

export default function AdminLayout(props: PropsWithChildren) {
  return (
    <html className="text-body bg-body-bg">
      <body>
        <AppConfig />
        <PlatformDesktop>
          <DesktopLayout children={props.children} />
        </PlatformDesktop>
        <PlatformMobile>
          <MobileLayout children={props.children} />
        </PlatformMobile>
      </body>
    </html>
  );
}
