import { Link } from "brouther";
import { EyeIcon, EyeOff, PlusIcon, UserCircle2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/button";
import { ColorPicker } from "~/components/color-picker";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Resizable } from "~/components/resizable";
import { SectionTitle, Title } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { CartMath } from "~/lib/cart-math";
import { hexToHslProperty } from "~/lib/dom";
import { link, links } from "~/router";
import { History } from "~/store/history.store";
import { Preferences } from "~/store/preferences.store";
import DefaultTheme from "~/styles/default.json";

const Customize = () => {
    const [state, dispatch] = Preferences.use();
    const i18n = useTranslations();
    const [hide, setHide] = useState(false);
    const changeFromRGB = (rgb: string) => {
        const bg = hexToHslProperty(rgb);
        return dispatch.colors({ main: { bg: bg } });
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const color = e.currentTarget.dataset.color ?? "";
        return !color.includes(",") ? changeFromRGB(color) : dispatch.colors({ main: { bg: color } });
    };

    const colors = [
        { name: i18n.get("colorDefault"), color: DefaultTheme.colors.main.bg },
        { name: i18n.get("colorOrange"), color: "#d97706" },
        { name: "Yellow", color: "#eab308" },
        { name: i18n.get("colorGreen"), color: "#059669" },
        { name: "Lime", color: "#65a30d" },
        { name: "Blue", color: "#2563eb" },
        { name: "Cyan", color: "#06b6d4" },
        { name: i18n.get("colorIndigo"), color: "#4f46e5" },
        { name: "Violeta", color: "#7c3aed" },
        { name: "Pink", color: "#db2777" },
        { name: "Rose", color: "#f43f5e" },
    ];

    return (
        <Resizable>
            <header className="flex w-full flex-row flex-nowrap items-center justify-between">
                <Title>{i18n.get("welcomeCustomizeTitle")}</Title>
                <Button
                    theme="transparent"
                    onClick={() => setHide((p) => !p)}
                    icon={hide ? <EyeIcon size={20} /> : <EyeOff size={20} />}
                />
            </header>
            {hide ? null : (
                <ul className="grid grid-cols-2 gap-4 whitespace-pre-wrap">
                    {state.devMode ? (
                        <li>
                            <ColorPicker onChangeColor={changeFromRGB} color={state.colors.main?.bg} />
                        </li>
                    ) : null}
                    {colors.map((x) => {
                        const backgroundColor = x.color.includes(",") ? `hsl(${x.color})` : x.color;
                        return (
                            <Button
                                style={{ backgroundColor }}
                                onClick={onClick}
                                data-color={x.color}
                                key={`color-${x.name}`}
                                theme="transparent"
                                children={x.name}
                            />
                        );
                    })}
                </ul>
            )}
        </Resizable>
    );
};

export default function AppPage() {
    const [state, dispatch] = Preferences.use();
    const [history] = History.use();
    const i18n = useTranslations();
    const items = history.items.toSorted((a, b) => a.createdAt.getDate() - b.createdAt.getDate());

    return (
        <main className="flex flex-col gap-6 pb-8">
            <Title>{i18n.get("welcome", state)}</Title>
            <Form className="flex flex-col gap-4">
                <Input
                    required
                    name="name"
                    value={state.name}
                    onChange={dispatch.onChangeName}
                    title={i18n.get("welcomeInputTitle")}
                    placeholder={i18n.get("welcomeInputPlaceholder")}
                />
            </Form>
            <section className="my-4 grid grid-cols-2 gap-6">
                <Button
                    href={links.friends}
                    as={Link}
                    icon={<PlusIcon absoluteStrokeWidth strokeWidth={2} size={16} />}
                >
                    Adicionar amigos
                </Button>
                <Button
                    href={links.cart}
                    as={Link}
                    icon={<UserCircle2 absoluteStrokeWidth strokeWidth={1} size={16} />}
                >
                    Nova comanda
                </Button>
            </section>
            {items.length === 0 ? null : (
                <section>
                    <SectionTitle title="Histórico">{i18n.get("historicDescription")}</SectionTitle>
                    <ul className="mt-4 space-y-2">
                        {items.map((item) => (
                            <li key={item.id}>
                                <Link
                                    className="group flex min-w-full flex-col gap-2 rounded border border-main-bg/20 p-4 transition-all link:border-main-bg/60"
                                    href={link(links.cartHistory, { id: item.id })}
                                >
                                    <header className="flex items-end justify-between">
                                        <h3 className="text-xl transition-colors group-hover:text-main-bg group-active:text-main-bg">
                                            {item.title}
                                        </h3>
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
            <Customize />
        </main>
    );
}
