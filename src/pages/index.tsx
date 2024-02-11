import { useEffect } from "react";
import { AppPromiseFeatures } from "~/landing/components/app-promise-features";
import { Faq } from "~/landing/components/faq";
import { Hero } from "~/landing/components/hero";
import { LandingLayout } from "~/landing/components/landing-layout";
import { ScreenFeatures } from "~/landing/components/screen-features";
import { SectionActionLogin } from "~/landing/components/section-action-login";

export default function IndexPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("landing");
    return () => void document.documentElement.classList.remove("landing");
  }, []);

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
