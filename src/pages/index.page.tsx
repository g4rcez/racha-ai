import { ActionProps, Form, Link, redirectResponse } from "brouther";
import { AppDemo } from "~/components/app-demo";
import { Button } from "~/components/button";
import { Input } from "~/components/form/input";
import { PhoneFrame } from "~/components/landing/phone";
import { Logo } from "~/components/logo";
import { links } from "~/router";
import { Preferences } from "~/store/preferences.store";

export const actions = () => ({
    post: async (ctx: ActionProps) => {
        const json = await ctx.request.json();
        Preferences.action.set({ name: json.name });
        return redirectResponse("/app");
    }
});

export default function IndexPage() {
    return (
        <div className="flex h-screen w-screen flex-auto flex-col bg-white text-slate-800">
            <header className="sticky top-0 flex w-full bg-slate-50 shadow-md z-10">
                <nav className="container mx-auto flex max-w-6xl justify-between py-8 px-4">
                    <Link href={links.index}>
                        <Logo />
                    </Link>
                </nav>
            </header>
            <section className="container mx-auto mt-12 flex w-full max-w-6xl flex-col gap-8 py-6">
                <div className="space-y-4 text-balance text-center px-4">
                    <header>
                        <h2 className="text-4xl font-extrabold leading-relaxed tracking-wide text-main-bg">
                            O app para rachar a conta
                        </h2>
                        <p className="text-lg font-light leading-relaxed">
                            Chega de confusão na hora de dividir a conta. Vai de{" "}
                            <strong className="font-normal text-main-bg">racha aí</strong>
                        </p>
                    </header>
                    <Form encType="json" method="post" className="container mx-auto flex max-w-lg items-end gap-2">
                        <Input hideLeft name="name" title="" required placeholder="Como devemos te chamar?" />
                        <Button type="submit" size="medium">
                            Começar a usar
                        </Button>
                    </Form>
                </div>
                <div className="container mx-auto w-full max-w-md text-center">
                    <PhoneFrame className="pointer-events-none mx-auto max-w-[366px]">
                        <AppDemo />
                    </PhoneFrame>
                </div>
            </section>
        </div>
    );
}
