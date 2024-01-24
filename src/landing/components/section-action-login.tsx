import { ButtonAction } from "~/landing/components/button-action";
import { Container } from "~/landing/components/container";
import { CircleBackground } from "~/landing/components/illustrations/circle-background";
import { colors } from "~/styles/styles";

export function SectionActionLogin() {
  return (
    <section
      id="get-free-shares-today"
      className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
    >
      <div className="absolute hidden lg:block left-20 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground
          color={colors.brand}
          className="animate-spin-slower"
        />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Gostou? Hora de usar
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Esse vai ser o cadastro mais rápido de aplicativos que você vai
            fazer, basta clicar no botão abaixo.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonAction color="white" />
          </div>
        </div>
      </Container>
    </section>
  );
}
