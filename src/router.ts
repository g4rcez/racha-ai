import { asyncComponent, createMappedRouter } from "brouther";
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
    }
});

export const routerConfig = router.config;

export const links = router.links;

export const navigate = router.navigation;

export const link = router.link;
