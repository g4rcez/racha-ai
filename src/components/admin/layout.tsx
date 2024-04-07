import React, { PropsWithChildren, useEffect, useRef } from "react";
import { AppConfig } from "~/components/admin/app-config";
import { MobileLayout } from "~/components/admin/mobile.layout";
import { ClientSide } from "~/components/client-side";

const defaults = "text-body bg-body-bg w-full h-full";

const classes = {
  mobile: `data-[platform=mobile]:block data-[platform=desktop]:hidden ${defaults}`,
  desktop: `data-[platform=mobile]:hidden data-[platform=desktop]:block ${defaults}`,
};

function AdminLayoutRoot(props: PropsWithChildren) {
  const page = props.children;
  const prompt = useRef<any | null>(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      prompt.current = event;
    });
  }, []);

  return (
    <ClientSide>
      <AppConfig />
      <div data-platform="mobile" className={classes.mobile}>
        <MobileLayout children={page} />
      </div>
    </ClientSide>
  );
}

export default function AdminLayout(page: React.ReactElement) {
  return <AdminLayoutRoot>{page}</AdminLayoutRoot>;
}
