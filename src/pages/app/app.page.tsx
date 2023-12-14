import { Link } from "brouther";
import { EyeIcon, EyeOff, PlusIcon, UserCircle2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/button";
import { Checkbox } from "~/components/form/checkbox";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Resizable } from "~/components/resizable";
import { SectionTitle, Title } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { hexToHslProperty } from "~/lib/dom";
import { link, links } from "~/router";
import { History } from "~/store/history.store";
import { Preferences } from "~/store/preferences.store";
import DefaultTheme from "~/styles/default.json";

const Customize = () => {
    const [state, dispatch] = Preferences.use();
    const i18n = useTranslations();
    const [hide, setHide] = useState(true);
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
        { name: "Slate", color: "#334155" },
        { name: "Blue", color: "#2563eb" },
        { name: "Cyan", color: "#06b6d4" },
        { name: "Pink", color: "#db2777" },
        { name: i18n.get("colorIndigo"), color: "#4f46e5" }
    ];
    return (
        <Resizable>
            <header className="flex w-full flex-row flex-nowrap items-center justify-between">
                <Title>{i18n.get("welcomeCustomizeTitle")}</Title>
                <Button onClick={() => setHide((p) => !p)} icon={hide ? <EyeIcon size={20} /> : <EyeOff size={20} />} />
            </header>
            {hide ? null : (
                <ul className="grid grid-cols-2 gap-4 whitespace-pre-wrap">
                    {state.devMode ? (
                        <li>
                            <input
                                onChange={(e) => changeFromRGB(e.target.value)}
                                type="color"
                                className="block h-full w-full appearance-none border border-transparent"
                            />
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

    return (
        <main className="flex flex-col gap-6">
            <Title>{i18n.get("welcome", state)}</Title>
            <Form className="flex flex-col gap-4">
                <Input
                    name="name"
                    onChange={dispatch.onChangeName}
                    placeholder={i18n.get("welcomeInputPlaceholder")}
                    required
                    title={i18n.get("welcomeInputTitle")}
                    value={state.name}
                />
                <Checkbox name="devMode" checked={state.devMode} onChange={dispatch.onChange}>
                    {i18n.get("devMode")}
                </Checkbox>
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
            <section>
                <SectionTitle title="Histórico">Todas as contas já divididas</SectionTitle>
                <ul className="mt-4 space-y-2">
                    {history.items.map((item) => (
                        <li key={item.id} className="text-lg">
                            <Link href={link(links.cartHistory, { id: item.id })}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </section>
            <Customize />
        </main>
    );
}
