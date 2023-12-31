import { Link } from "brouther";
import { ReceiptIcon, UsersIcon } from "lucide-react";
import React, { Fragment } from "react";
import { links } from "~/router";

type Shortcut = {
    icon: React.FC<any>;
    text: React.ReactNode;
    href: (typeof links)[keyof typeof links];
};

export const shortcuts: Shortcut[] = [
    {
        href: links.friends,
        icon: UsersIcon,
        text: (
            <Fragment>
                Adicionar
                <br /> amigos
            </Fragment>
        )
    },
    {
        href: links.cart,
        icon: ReceiptIcon,
        text: (
            <Fragment>
                Nova
                <br /> comanda
            </Fragment>
        )
    }
];

export const Shortcut = (props: Shortcut) => (
    <Link
        href={props.href}
        key={`shortcuts-${props.href}`}
        className="flex flex-col items-center gap-2 rounded border border-main-bg border-opacity-60 p-2 px-4"
    >
        {<props.icon aria-hidden="true" size={24} strokeWidth={2} absoluteStrokeWidth />} {props.text}
    </Link>
);
