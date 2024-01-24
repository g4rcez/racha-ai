import { DesktopAppFeatures } from "~/landing/components/app-screen/desktop-app";
import { MobileAppFeatures } from "~/landing/components/app-screen/mobile-app";
import { Container } from "~/landing/components/container";

export const ScreenFeatures = () => (
  <section
    id="features"
    aria-label="Tudo para organizar suas despesas"
    className="bg-gray-900 py-20 sm:py-32"
  >
    <Container>
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
        <h2 className="text-3xl font-medium tracking-tight text-white">
          Tudo para organizar suas despesas
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          Nós ajudamos você a organizar suas comandas de mesa, viagens e até na
          hora de dividir a sua conta da Netflix.
        </p>
      </div>
    </Container>
    <div className="mt-16 md:hidden">
      <MobileAppFeatures />
    </div>
    <Container className="hidden md:mt-20 md:block">
      <DesktopAppFeatures />
    </Container>
  </section>
);
