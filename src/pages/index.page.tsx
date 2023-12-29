import { ActionProps, Form, Link, redirectResponse } from "brouther";
import { AppDemo } from "~/components/app-demo";
import { Button } from "~/components/button";
import { Input } from "~/components/form/input";
import { PhoneFrame } from "~/components/landing/phone";
import { Logo } from "~/components/logo";
import { TextRotator } from "~/components/text-rotator";
import { Title } from "~/components/typography";
import { links } from "~/router";
import { Preferences } from "~/store/preferences.store";

export const actions = () => ({
    post: async (ctx: ActionProps) => {
        const json = await ctx.request.json();
        Preferences.action.onChangeName(json.name);
        return redirectResponse("/app");
    }
});

const texts = [
    "para viajar com a família",
    "ir ao bar com a galera",
    "para ir em festas",
    "para comemorar com seu amor",
]

export default function IndexPage() {
    const [preferences] = Preferences.use();
    return (
        <div className="flex h-screen overflow-x-hidden w-screen flex-auto flex-col bg-white text-slate-700">
            <header className="sticky top-0 flex w-full bg-slate-50 shadow-md z-10">
                <nav className="container mx-auto flex max-w-6xl justify-between py-8 px-4">
                    <Link href={links.index}>
                        <Logo />
                    </Link>
                </nav>
            </header>
            <section className="container mx-auto mt-4 lg:mt-10 flex w-full lg:flex-row flex-col max-w-6xl gap-8 py-6">
                <div className="space-y-4 text-balance py-12 px-4">
                    <header>
                        <h2 className="text-4xl text-left font-extrabold leading-relaxed tracking-wide">
                            Nunca foi tão fácil dividir as contas
                            <span className="text-main-bg">
                                <TextRotator text={texts} ms={3500}/>
                            </span>
                        </h2>
                        <p className="text-lg font-light leading-relaxed pt-8 lg:pt-0">
                            Chega de confusão na hora de dividir a conta. Vai de{" "}
                            <Link href={links.index} className="font-normal hover:underline text-main-bg">racha aí</Link>.
                            Seu novo melhor amigo na hora de pagar as contas com a galera.
                        </p>
                    </header>
                        {preferences.name === "" ? (
                            <Form encType="json" method="post" className="container flex max-w-lg items-end gap-2">
                                <Input title="Como devemos te chamar?" name="name" required placeholder="Digite seu nome ou apelido..." />
                                <Button type="submit" size="medium">
                                    Começar a usar
                                </Button>
                            </Form>
                        ) : (
                            <Link className="flex flex-col items-center gap-2 text-xl my-6" href={links.app}>
                            <span className="text-balance">
                                Olá <b>{preferences.name}</b>, bem vindo de volta
                            </span>
                                <Button className="w-fit font-normal">Ir para o app</Button>
                            </Link>
                        )}
                </div>
                <div className="container mx-auto w-full max-w-md text-center">
                    <PhoneFrame className="pointer-events-none mx-auto max-w-[366px]">
                        <AppDemo />
                    </PhoneFrame>
                </div>
            </section>
            <section className="flex flex-col items-center justify-center my-12">
                <Title as="h3">Nunca mais pague uma conta errada</Title>
                <p className="text-balance max-w-2xl text-center">O <span className="text-main-bg">Racha aí</span> é o app ideal para você dividir sua conta com a galera.
                    Você nunca mais vai ter que pagar a mais num lugar sem comanda.
                </p>
            </section>
        </div>
    );
}
