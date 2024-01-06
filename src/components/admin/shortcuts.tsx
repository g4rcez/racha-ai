import { Link } from "brouther";
import { ReceiptIcon, UploadIcon, UsersIcon } from "lucide-react";
import React, { Fragment } from "react";
import { LocalStorage } from "storage-manager-js";
import { Is } from "~/lib/is";
import { links } from "~/router";

export type AsLink = {
  icon: React.FC<any>;
  text: React.ReactNode;
  href: (typeof links)[keyof typeof links];
};

export type AsButton = {
  action: () => Promise<any> | any;
  icon: React.FC<any>;
  text: React.ReactNode;
};

type Shortcut = AsLink | AsButton;

export const shortcuts: Shortcut[] = [
  {
    href: links.friends,
    icon: UsersIcon,
    text: (
      <Fragment>
        Adicionar
        <br /> amigos
      </Fragment>
    ),
  },
  {
    href: links.cart,
    icon: ReceiptIcon,
    text: (
      <Fragment>
        Nova
        <br /> comanda
      </Fragment>
    ),
  },
  {
    action: async () => {
      const json = LocalStorage.json();
      const file = new File([JSON.stringify(json, null, 4)], "racha-ai.json", {
        type: "application/json",
      });
      await navigator.share([file] as any);
    },
    icon: UploadIcon,
    text: <Fragment>Exportar dados</Fragment>,
  },
];

export const Shortcut = (props: Shortcut) =>
  !Is.nil((props as AsLink).href) ? (
    <Link
      href={(props as AsLink).href}
      key={`shortcuts-${(props as AsLink).href}`}
      className="flex flex-col items-center gap-2 rounded border border-main-bg border-opacity-60 p-2 px-4"
    >
      {
        <props.icon
          aria-hidden="true"
          size={24}
          strokeWidth={2}
          absoluteStrokeWidth
        />
      }{" "}
      {props.text}
    </Link>
  ) : (
    <button className="flex flex-col items-center gap-2 rounded border border-main-bg border-opacity-60 p-2 px-4">
      {
        <props.icon
          aria-hidden="true"
          size={24}
          strokeWidth={2}
          absoluteStrokeWidth
        />
      }{" "}
      {props.text}
    </button>
  );
