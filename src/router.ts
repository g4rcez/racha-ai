import { asyncComponent, asyncLoader, createMappedRouter } from "brouther";
import { i18n } from "~/i18n";

const router = createMappedRouter({
    index: {
        path: "/",
        element: asyncComponent(() => import("~/pages/index.page")),
        data: {
            title: i18n.get("landingPageTitle")
        }
    },
    app: {
        path: "/app",
        element: asyncComponent(() => import("~/pages/app/app.page")),
        data: {
            title: i18n.get("appPageTitle")
        }
    },
    friends: {
        path: "/app/friends",
        element: asyncComponent(() => import("~/pages/app/friends.page")),
        data: {
            title: i18n.get("friendsPageTitle")
        }
    },
    cart: {
        path: "/app/cart",
        element: asyncComponent(() => import("~/pages/app/comanda.page")),
        data: {
            title: i18n.get("appPageTitle")
        }
    },
    cartHistory: {
        path: "/app/cart/:id",
        element: asyncComponent(() => import("~/pages/app/cart-id.page")),
        loader: asyncLoader(() => import("~/pages/app/cart-id.page")),
        data: {
            title: i18n.get("appPageTitle")
        }
    }
});

export const routerConfig = router.config;

export const links = router.links;

export const navigate = router.navigation;

export const link = router.link;
