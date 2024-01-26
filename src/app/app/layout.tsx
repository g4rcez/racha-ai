import { PropsWithChildren } from "react";
import { AppConfig } from "~/components/admin/app-config";
import { DesktopLayout } from "~/components/admin/desktop.layout";
import { MobileLayout } from "~/components/admin/mobile.layout";
import { ClientSide } from "~/components/client-side";

export default function AdminLayout(props: PropsWithChildren) {
  return (
    <ClientSide>
      <AppConfig />
      <div className="hidden sm:block text-body bg-body-bg">
        <DesktopLayout children={props.children} />
      </div>
      <div className="block sm:hidden text-body bg-body-bg">
        <MobileLayout children={props.children} />
      </div>
    </ClientSide>
  );
}
