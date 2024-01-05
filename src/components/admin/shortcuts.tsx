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
        text: <Fragment>Meus amigos</Fragment>
    },
    {
        href: links.cart,
        icon: ReceiptIcon,
        text: <Fragment>Nova comanda</Fragment>
    },
    {
        href: links.config,
        icon: CogIcon,
        text: <Fragment>Minhas configurações</Fragment>
    }
];

export const Shortcut = (props: Shortcut & {onClick?: () => void}) => (
        <Link
            onClick={props.onClick}
            href={props.href}
            key={`shortcuts-${props.href}`}
            className="flex h-full min-w-32 flex-col items-center justify-center gap-2 rounded border border-main-bg border-opacity-60 p-4 text-center"
        >
            {<props.icon aria-hidden="true" size={24} strokeWidth={2} absoluteStrokeWidth />} {props.text}
        </Link>
);
