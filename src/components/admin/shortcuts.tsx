import { Link } from "brouther";
import { CogIcon, ReceiptIcon, UploadIcon, UsersIcon } from "lucide-react";
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

export const isShortcutLink = (a: any): a is AsLink => !Is.nil(a.href);

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
    href: links.config,
    icon: CogIcon,
    text: (
      <Fragment>
        Minhas
        <br /> configurações
      </Fragment>
    ),
  },
  {
    icon: UploadIcon,
    text: (
      <Fragment>
        Exportar
        <br /> dados
      </Fragment>
    ),
    action: async () => {
      const json = LocalStorage.json();
      const content = JSON.stringify(json, null, 4);
      const opts = { type: "application/json" };
      const file = new File([content], "racha-ai.json", opts);
      if (Is.function(navigator.share)) {
        try {
          await navigator.share({
            files: [file],
            title: "Racha aí",
            url: window.location.origin,
            text: "Exportando seus dados do app",
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
];

const className =
  "flex flex-col w-full text-center justify-center items-center border border-main-bg/60 p-4 max-w-36 rounded gap-2";

export const Shortcut = (props: Shortcut & { onClick?: () => void }) =>
  !Is.nil((props as AsLink).href) ? (
    <Link
      className={className}
      onClick={props.onClick}
      href={(props as AsLink).href}
      key={`shortcuts-${(props as AsLink).href}`}
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
    <button
      onClick={() => {
        (props as AsButton).action?.();
        props.onClick?.();
      }}
      className={className}
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
    </button>
  );
