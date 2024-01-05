import { ActionProps, Form, Link, redirectResponse } from "brouther";
import { LucideIcon } from "lucide-react";
import React from "react";
import { AppDemo } from "~/components/app-demo";
import { Button } from "~/components/button";
import { Input } from "~/components/form/input";
import { PhoneFrame } from "~/components/landing/phone";
import { Logo } from "~/components/logo";
import { TextRotator } from "~/components/text-rotator";
import { Title } from "~/components/typography";
import { links } from "~/router";
import { Preferences } from "~/store/preferences.store";

const WhySectionItem = ({ title, Icon, children }: React.PropsWithChildren<{ title: string; Icon: LucideIcon }>) => (
    <div>
        <header className="flex flex-col items-center justify-center text-center">
            <Icon absoluteStrokeWidth strokeWidth={2} size={24} />
            <Title as="h4">{title}</Title>
        </header>
        <p className="text-balance text-center">{children}</p>
    </div>
);

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
    "para comemorar com o seu amor"
];

export default function IndexPage() {
    const [preferences] = Preferences.use();
    return (
        <div className="flex h-screen w-screen flex-auto flex-col overflow-x-hidden bg-white text-slate-700">
            <header className="sticky top-0 z-10 flex w-full bg-slate-50 shadow-md">
                <nav className="container mx-auto flex max-w-6xl justify-between px-4 py-8">
                    <Link href={links.index}>
                        <Logo />
                    </Link>
                </nav>
            </header>
            <section className="container mx-auto flex w-full max-w-6xl flex-col gap-8 py-6 lg:mt-10 lg:flex-row">
                <div className="space-y-4 text-balance px-4 lg:py-12">
                    <header>
                        <h2 className="text-left text-4xl font-extrabold leading-relaxed tracking-wide">
                            Nunca foi tão fácil dividir as contas
                            <span className="text-main-bg">
                                <TextRotator text={texts} ms={3500} />
                            </span>
                        </h2>
                        <p className="pt-8 text-lg font-light leading-relaxed lg:pt-0">
                            Chega de confusão na hora de dividir a conta. Vai de{" "}
                            <Link href={links.index} className="font-normal text-main-bg hover:underline">
                                racha aí
                            </Link>
                            . Seu novo melhor amigo na hora de pagar as contas com a galera.
                        </p>
                    </header>
                    {preferences.name === "" ? (
                        <Form encType="json" method="post" className="container flex max-w-lg items-end gap-2">
                            <Input
                                title="Como devemos te chamar?"
                                name="name"
                                required
                                placeholder="Digite seu nome ou apelido..."
                            />
                            <Button type="submit" size="medium">
                                Começar a usar
                            </Button>
                        </Form>
                    ) : (
                        <Link className="my-6 flex flex-col items-center gap-2 text-xl" href={links.app}>
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
            <section className="my-12 flex flex-col items-center justify-center gap-6 px-4">
                <Title className="text-balance text-center" as="h3">
                    Nunca mais pague uma conta errada
                </Title>
                <p className="max-w-2xl text-balance text-center">
                    O <span className="text-main-bg">Racha aí</span> é o app ideal para você dividir sua conta com a
                    galera. Você nunca mais vai ter que pagar a mais num lugar sem comanda. Diga adeus as comandas de
                    uma mesa que geram confusão na hora de pagar.
                </p>
            </section>
            {/*<section hidden aria-hidden className="my-12 flex flex-col items-center justify-center gap-6 px-4">*/}
            {/*    <Title className="text-balance text-center" as="h3">*/}
            {/*        Por quê usar o racha aí?*/}
            {/*    </Title>*/}
            {/*    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">*/}
            {/*        <WhySectionItem title="Praticidade" Icon={FastForwardIcon}>*/}
            {/*            É fácil, rápido e você ainda pode usar sem estar conectado à internet.*/}
            {/*        </WhySectionItem>*/}
            {/*        <WhySectionItem title="Privacidade" Icon={FolderKeyIcon}>*/}
            {/*            Os dados são seus. Você pode usar o <b>Racha aí</b>*/}
            {/*        </WhySectionItem>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </div>
    );
}
