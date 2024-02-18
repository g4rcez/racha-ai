import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppConfig } from "~/components/admin/app-config";
import { DesktopLayout } from "~/components/admin/desktop.layout";
import { MobileLayout } from "~/components/admin/mobile.layout";
import { ClientSide } from "~/components/client-side";
import { useAuthSession } from "~/hooks/use-auth-session";
import { DesktopSize, Platform, Platforms } from "~/store/platform";
import { Nullable } from "~/types";

const defaults = "text-body bg-body-bg w-full h-full";

const classes = {
  mobile: `data-[platform=mobile]:block data-[platform=desktop]:hidden ${defaults}`,
  desktop: `data-[platform=mobile]:hidden data-[platform=desktop]:block ${defaults}`,
};

function AdminLayoutRoot(props: PropsWithChildren) {
  const page = props.children;
  const [platform, setPlatform] = useState<Nullable<Platforms>>(null);
  const prompt = useRef<any | null>(null);
  const session = useAuthSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      prompt.current = event;
    });
  }, []);

  const onLoad = useCallback(() => {
    const platformDiscovery = (e?: MediaQueryListEvent | UIEvent) => {
      if (e === undefined)
        return setPlatform(
          Platform.isMobile() ? Platforms.Mobile : Platforms.PC,
        );
      if ((e as MediaQueryListEvent).matches)
        return setPlatform(Platforms.Mobile);
      return setPlatform(
        window.innerWidth < DesktopSize ? Platforms.Mobile : Platforms.PC,
      );
    };
    const match = window.matchMedia("@media (pointer:none), (pointer:coarse)");
    platformDiscovery(undefined);
    match.addEventListener("change", platformDiscovery);
    window.addEventListener("resize", platformDiscovery);
    return () => {
      match.removeEventListener("change", platformDiscovery);
      window.removeEventListener("resize", platformDiscovery);
    };
  }, []);

  return (
    <ClientSide onLoad={onLoad}>
      <AppConfig />
      <Fragment>
        {platform === null ? (
          <Fragment>
            <div data-platform="desktop" className={classes.desktop}>
              <DesktopLayout children={page} />
            </div>
            <div data-platform="mobile" className={classes.mobile}>
              <MobileLayout children={page} />
            </div>
          </Fragment>
        ) : platform === Platforms.Mobile ? (
          <div data-platform="mobile" className={classes.mobile}>
            <MobileLayout children={page} />
          </div>
        ) : (
          <div data-platform="desktop" className={classes.desktop}>
            <DesktopLayout children={page} />
          </div>
        )}
      </Fragment>
    </ClientSide>
  );
}

export default function AdminLayout(
  page: React.ReactElement,
  session: Session,
) {
  return (
    <SessionProvider session={session}>
      <AdminLayoutRoot>{page}</AdminLayoutRoot>
    </SessionProvider>
  );
}
