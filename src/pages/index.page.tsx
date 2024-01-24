import { ActionProps, redirectResponse } from "brouther";
import { AppPromiseFeatures } from "~/landing/components/app-promise-features";
import { Faq } from "~/landing/components/faq";
import { Hero } from "~/landing/components/hero";
import { LandingLayout } from "~/landing/components/landing-layout";
import { ScreenFeatures } from "~/landing/components/screen-features";
import { SectionActionLogin } from "~/landing/components/section-action-login";
import { Preferences } from "~/store/preferences.store";

export const actions = () => ({
  post: async (ctx: ActionProps) => {
    const json = await ctx.request.json();
    Preferences.action.onChangeName(json.name);
    return redirectResponse("/app");
  },
});

export default function IndexPage() {
  return (
    <LandingLayout>
      <Hero />
      <ScreenFeatures />
      <AppPromiseFeatures />
      <SectionActionLogin />
      <Faq />
    </LandingLayout>
  );
}
