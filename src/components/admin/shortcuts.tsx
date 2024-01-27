import {
  HistoryIcon,
  MenuIcon,
  ReceiptIcon,
  UploadIcon,
  UserRound,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";
import { LocalStorage } from "storage-manager-js";
import { Is } from "~/lib/is";
import { Links } from "~/router";

export type ShortcutLink = {
  type: "link";
  href: string;
  title: string;
  tags: string[];
  icon: React.FC<any>;
  text: React.ReactNode;
};

export type ShortcutAction = {
  type: "action";
  tags: string[];
  className: string;
  icon: React.FC<any>;
  text: React.ReactNode;
  action: (args: { open: () => void }) => Promise<any> | any;
};

export type ShortcutButton = {
  type: "button";
  tags: string[];
  icon: React.FC<any>;
  text: React.ReactNode;
  action: () => Promise<any> | any;
};

type Shortcut = ShortcutLink | ShortcutButton | ShortcutAction;

export const isShortcutLink = (a: Shortcut): a is ShortcutLink =>
  a.type === "link";

export const isMenuAction = (a: Shortcut): a is ShortcutAction =>
  a.type === "action";

export const shortcuts: Shortcut[] = [
  {
    type: "link",
    href: Links.app,
    icon: HistoryIcon,
    tags: ["menu", "action"],
    title: "Histórico",
    text: (
      <Fragment>
        Meu
        <br /> histórico
      </Fragment>
    ),
  },
  {
    type: "link",
    href: Links.friends,
    icon: UsersIcon,
    tags: ["home", "menu", "action"],
    title: "Amigos",
    text: (
      <Fragment>
        Adicionar
        <br /> amigos
      </Fragment>
    ),
  },
  {
    type: "action",
    action: (args) => {
      args.open();
    },
    icon: MenuIcon,
    tags: ["action"],
    text: <Fragment>Menu</Fragment>,
    className: "rounded bg-main-bg py-2 text-white",
  },
  {
    type: "link",
    href: Links.cart,
    icon: ReceiptIcon,
    tags: ["home", "menu", "action"],
    title: "Comanda",
    text: (
      <Fragment>
        Nova
        <br /> comanda
      </Fragment>
    ),
  },
  {
    type: "link",
    href: Links.profile,
    icon: UserRound,
    tags: ["home", "menu", "action"],
    title: "Perfil",
    text: (
      <Fragment>
        Meu
        <br /> perfil
      </Fragment>
    ),
  },
  {
    type: "button",
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

export const getActionBarShortcuts = (): Array<ShortcutLink | ShortcutAction> =>
  shortcuts.filter((shortcut): shortcut is ShortcutLink =>
    shortcut.tags.includes("action"),
  );
