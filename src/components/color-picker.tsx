import React, { useRef } from "react";
import { Button } from "~/components/button";
import { useTranslations } from "~/i18n";

type Props = {
    color?: string;
    onChangeColor: (rgb: string) => void;
};

export const ColorPicker = (props: Props) => {
    const i18n = useTranslations();
    const ref = useRef<HTMLInputElement>(null);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => props.onChangeColor(e.target.value);

    return (
        <label className="relative inline-block w-full">
            <input
                ref={ref}
                type="color"
                onChange={onChange}
                className="absolute inset-0 h-full w-full appearance-none border border-transparent opacity-0"
            />
            <Button
                onClick={() => ref.current?.click()}
                className="flex w-full items-center justify-center border border-main-bg text-center"
            >
                {i18n.get("myCustomColor")}
            </Button>
        </label>
    );
};
