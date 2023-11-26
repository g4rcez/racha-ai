import { asyncComponent, createMappedRouter } from "brouther";

const router = createMappedRouter({
    index: {
        path: "/",
        element: asyncComponent(() => import("~/pages/index.page"))
    }
});

export const routerConfig = router.config;

export const links = router.links;

export const navigate = router.navigation;

export const link = router.link;
