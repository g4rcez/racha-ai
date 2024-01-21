import {
  asyncActions,
  asyncComponent,
  asyncLoader,
  createMappedRouter,
} from "brouther";
import { i18n } from "~/i18n";

const getIndexPage = () => import("~/pages/index.page");

export const {
  link,
  links,
  navigation: navigate,
  config: routerConfig,
} = createMappedRouter({
  index: {
    path: "/",
    actions: asyncActions(getIndexPage),
    element: asyncComponent(getIndexPage),
    data: { title: i18n.get("landingPageTitle"), name: "" },
  },
  app: {
    path: "/app",
    element: asyncComponent(() => import("~/pages/app/app.page")),
    data: {
      title: i18n.get("appPageTitle"),
      name: "Racha aí",
    },
  },
  friends: {
    path: "/app/friends",
    element: asyncComponent(() => import("~/pages/app/friends.page")),
    data: { title: i18n.get("friendsPageTitle"), name: "Amigos" },
  },
  cart: {
    path: "/app/cart",
    element: asyncComponent(() => import("~/pages/app/comanda.page")),
    data: { title: i18n.get("appPageTitle"), name: "Comanda" },
  },
  cartHistory: {
    path: "/app/cart/:id",
    element: asyncComponent(() => import("~/pages/app/cart-id.page")),
    loader: asyncLoader(() => import("~/pages/app/cart-id.page")),
    data: { title: i18n.get("appPageTitle"), name: "Histórico" },
  },
  config: {
    path: "/app/config/",
    element: asyncComponent(() => import("~/pages/app/config.page")),
    data: { title: "Configurações", name: "Configurações" },
  },
  debug: {
    path: "/app/debug/",
    element: asyncComponent(() => import("~/pages/app/debug.page")),
    data: { title: "Debug", name: "Debug" },
  },
} as const);
