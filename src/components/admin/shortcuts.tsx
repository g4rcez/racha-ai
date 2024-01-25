import Link from "next/link";
import {
  HistoryIcon,
  ReceiptIcon,
  UploadIcon,
  UserRound,
  UsersIcon,
} from "lucide-react";
import React, { Fragment } from "react";
import { LocalStorage } from "storage-manager-js";
import { Is } from "~/lib/is";

export type ShortcutLink = {
  href: string;
  icon: React.FC<any>;
  tags: string[];
  text: React.ReactNode;
  title: string;
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
    href: "/app",
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
    href: "/app/friends",
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
    href: "/app/cart",
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
    href: "/app/config",
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

export const getActionBarShortcuts = (): ShortcutLink[] =>
  shortcuts.filter((shortcut): shortcut is ShortcutLink =>
    shortcut.tags.includes("action"),
  );
