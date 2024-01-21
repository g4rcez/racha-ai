import { Link } from "brouther";
import {
  CogIcon,
  HistoryIcon,
  ReceiptIcon,
  UploadIcon,
  UsersIcon,
} from "lucide-react";
import React, { Fragment } from "react";
import { LocalStorage } from "storage-manager-js";
import { Is } from "~/lib/is";
import { links } from "~/router";

export type ShortcutLink = {
  icon: React.FC<any>;
  text: React.ReactNode;
  href: (typeof links)[keyof typeof links];
  tags: string[];
};

export type ShortcutButton = {
  action: () => Promise<any> | any;
  icon: React.FC<any>;
  text: React.ReactNode;
  tags: string[];
};

type Shortcut = ShortcutLink | ShortcutButton;

export const isShortcutLink = (a: any): a is ShortcutLink => !Is.nil(a.href);

export const shortcuts: Shortcut[] = [
  {
    href: links.friends,
    icon: UsersIcon,
    tags: ["home", "menu"],
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
    tags: ["home", "menu"],
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
    tags: ["home", "menu"],
    text: (
      <Fragment>
        Minhas
        <br /> configurações
      </Fragment>
    ),
  },
  {
    icon: UploadIcon,
    tags: ["menu"],
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
          console.error(e);
        }
      }
    },
  },
  {
    href: links.app,
    icon: HistoryIcon,
    tags: ["menu"],
    text: (
      <Fragment>
        Meu
        <br /> histórico
      </Fragment>
    ),
  },
];

const className =
  "flex flex-col w-full text-center justify-center items-center border border-main-bg/60 p-4 rounded gap-2";

export const Shortcut = (props: Shortcut & { onClick?: () => void }) =>
  !Is.nil((props as ShortcutLink).href) ? (
    <Link
      className={className}
      onClick={props.onClick}
      href={(props as ShortcutLink).href}
      key={`shortcuts-${(props as ShortcutLink).href}`}
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
        (props as ShortcutButton).action?.();
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

export const getHomeShortcuts = (): ShortcutLink[] =>
  shortcuts.filter(
    (shortcut): shortcut is ShortcutLink =>
      !Is.nil((shortcut as ShortcutLink).href) &&
      shortcut.tags.includes("home"),
  );

export const getMenuShortcuts = () =>
  shortcuts.filter((shortcut) => shortcut.tags.includes("menu"));
