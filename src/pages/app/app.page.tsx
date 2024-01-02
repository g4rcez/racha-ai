import { Link } from "brouther";
import { SoupIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Shortcut, shortcuts } from "~/components/admin/shortcuts";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { SectionTitle, Title } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { CartMath } from "~/lib/cart-math";
import { link, links } from "~/router";
import { History } from "~/store/history.store";
import { Preferences } from "~/store/preferences.store";

export default function AppPage() {
    const [state, dispatch] = Preferences.use();
    const [history, historyDispatch] = History.use();
    const i18n = useTranslations();
    const items = history.items.toSorted((a, b) => b.createdAt.getDate() - a.createdAt.getDate());
    const firstStateName = useMemo(() => state.user.name, []);

    useEffect(() => {
        historyDispatch.init();
    }, []);

    return (
        <main className="flex flex-col gap-6 pb-8">
            <header className="flex flex-col gap-2">
                <Title>{i18n.get("welcome", state)}</Title>
                {firstStateName === "" ? (
                    <Form className="flex flex-col gap-4">
                        <Input
                            required
                            name="name"
                            value={state.name}
                            title={i18n.get("welcomeInputTitle")}
                            placeholder={i18n.get("welcomeInputPlaceholder")}
                            onChange={(e) => dispatch.onChangeName(e.target.value)}
                        />
                    </Form>
                ) : null}
            </header>
            <ul className="flex snap-x snap-mandatory snap-center flex-nowrap gap-4 overflow-x-auto scroll-smooth py-2">
                {shortcuts.map((shortcut) => (
                    <li key={`shortcut-${shortcut.href}`}>
                        <Shortcut {...shortcut} />
                    </li>
                ))}
            </ul>
            {items.length === 0 ? null : (
                <section>
                    <SectionTitle title={i18n.get("historyTitle")}>{i18n.get("historicDescription")}</SectionTitle>
                    <ul className="mt-4 space-y-6">
                        {items.map((item) => (
                            <li key={item.id}>
                                <Link
                                    className="group flex min-w-full flex-col gap-2 rounded border border-main-bg/20 p-4 transition-all link:border-main-bg/60"
                                    href={link(links.cartHistory, { id: item.id })}
                                >
                                    <header className="flex items-end justify-between">
                                        <div className="flex gap-2">
                                            <SoupIcon className="group-hover:text-main-bg group-active:text-main-bg" />
                                            <h3 className="text-xl transition-colors group-hover:text-main-bg group-active:text-main-bg">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm">{i18n.format.date(item.createdAt)}</p>
                                    </header>
                                    <p>Total: {CartMath.calculate(item as never, i18n.format.money).total}</p>
                                    <p>Dividido por: {item.users.size.toString()} pessoas</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}
