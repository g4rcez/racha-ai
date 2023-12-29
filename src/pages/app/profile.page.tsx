import { EyeIcon, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/button";
import { ColorPicker } from "~/components/color-picker";
import { Resizable } from "~/components/resizable";
import { Title } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { hexToHslProperty } from "~/lib/dom";
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

export default function AppProfilePage() {
    return (
        <main>
            <Customize />
        </main>
    );
}