import { Link } from "brouther";
import { CogIcon, ReceiptIcon, UsersIcon } from "lucide-react";
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
                Meus amigos
            </Fragment>
        )
    },
    {
        href: links.cart,
        icon: ReceiptIcon,
        text: (
            <Fragment>
                Nova comanda
            </Fragment>
        )
    },
    {
        href: links.config,
        icon: CogIcon,
        text: <Fragment>Minhas configurações</Fragment>
    }
];

export const Shortcut = (props: Shortcut) => (
    <Link
        href={props.href}
        key={`shortcuts-${props.href}`}
        className="flex flex-col items-center justify-center max-w-32 h-full text-center gap-2 rounded border border-main-bg border-opacity-60 p-4"
    >
        {<props.icon aria-hidden="true" size={24} strokeWidth={2} absoluteStrokeWidth />} {props.text}
    </Link>
);
