import { Outlet, useHref, useRouteError } from "brouther";
import { lazy, useEffect } from "react";

const Admin = lazy(() => import("~/layout/app/app.layout"));

export const Layout = () => {
  const path = useHref();
  const [_error, page] = useRouteError();
  useEffect(() => {
    const data: any = page?.data ?? {};
    if (data.title) {
      document.title = data.title;
    }
  }, [page]);
  if (path === "/") return <Outlet />;
  if (path.startsWith("/app")) return <Admin />;
  return <Outlet />;
};
