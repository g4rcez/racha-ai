import { PlusIcon } from "lucide-react";
import React from "react";
import { Button } from "~/components/button";
import { Checkbox } from "~/components/form/checkbox";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Title } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { hexToHslProperty } from "~/lib/dom";
import { usePreferences } from "~/store/preferences.store";
import DefaultTheme from "~/styles/default.json";

export default function AppPage() {
    const [state, dispatch] = usePreferences();
    const i18n = useTranslations();
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

    const changeFromRGB = (rgb: string) => {
        const bg = hexToHslProperty(rgb);
        return dispatch.colors({ main: { bg: bg } });
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const color = e.currentTarget.dataset.color ?? "";
        return !color.includes(",") ? changeFromRGB(color) : dispatch.colors({ main: { bg: color } });
    };

    return (
        <main className="flex flex-col gap-6">
            <Title>{i18n.get("welcome", state)}</Title>
            <Form className="flex flex-col gap-4">
                <Input
                    onChange={(e) => dispatch.nickname(e.target.value)}
                    placeholder={i18n.get("welcomeInputPlaceholder")}
                    required
                    title={i18n.get("welcomeInputTitle")}
                    value={state.nickname}
                />
                <Checkbox checked={state.devMode} onChange={(e) => dispatch.devMode(e.target.checked)}>
                    {i18n.get("devMode")}
                </Checkbox>
            </Form>
            <Button icon={<PlusIcon absoluteStrokeWidth strokeWidth={2} size={16} />}>Nova comanda</Button>
            <section className="mb-6 space-y-4">
                <Button>Cor principal</Button>
                <Input title="Teste" placeholder="Teste de cor" />
            </section>
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
        </main>
    );
}
