"use client";
import {
  CheckIcon,
  Edit2Icon,
  PlusIcon,
  Trash2Icon,
  User2Icon,
} from "lucide-react";
import React, { FormEvent, useState } from "react";
import { Button } from "~/components/button";
import { Drawer } from "~/components/drawer";
import { Checkbox } from "~/components/form/checkbox";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { useTranslations } from "~/i18n";
import { Dict } from "~/lib/dict";
import { getHtmlInput } from "~/lib/dom";
import { sanitize, sortUuidList } from "~/lib/fn";
import { Cart, CartUser } from "~/store/cart.store";
import { Friends, User } from "~/store/friends.store";
import { Platform, PlatformMobile } from "~/store/platform";
import { Preferences } from "~/store/preferences.store";

type EditUserProps = {
  user: User;
  index: number;
  ownerId: string;
  onChangeUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
};

export const EditUser = (props: EditUserProps & { index: number }) => {
  const i18n = useTranslations();
  const isOwner = props.user.id === props.ownerId;
  const [mode, setMode] = useState<ViewMode>("view");

  const onReset = () => props.onDeleteUser(props.user);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const name = getHtmlInput(e.currentTarget, "user").value;
    props.onChangeUser({ ...props.user, name });
    setMode("view");
  };

  return (
    <li
      key={props.user.id}
      className="flex justify-between gap-x-6 py-5 border-b"
    >
      <div className="flex min-w-0 gap-x-4 items-center">
        <div className="size-12 flex items-center justify-center rounded-full bg-main-bg/40">
          <User2Icon color="hsl(var(--main-DEFAULT))" />
        </div>
        <div className="flex-auto">
          <p className="text-sm font-semibold">
            {props.index}. {props.user.name}
          </p>
          {mode === "edit" ? (
            <Form
              onSubmit={onSubmit}
              className="flex flex-row items-end gap-2 mt-2"
            >
              <Input
                required
                hideLeft
                name="user"
                defaultValue={props.user.name}
                title={i18n.get("updateFriendInput")}
                placeholder={i18n.get("userInputPlaceholder")}
                rightLabel={isOwner ? i18n.get("yourself") : undefined}
              />
              <Button
                size="icon"
                type="submit"
                className="mb-1"
                theme="transparent"
                icon={<CheckIcon color="hsl(var(--success-DEFAULT))" />}
              />
            </Form>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-x-6">
        <span className="flex flex-row flex-nowrap gap-4">
          <Button
            size="icon"
            theme="transparent"
            onClick={() => setMode("edit")}
            icon={<Edit2Icon size={18} color="hsl(var(--main-bg))" />}
          />
          <Button
            size="icon"
            onClick={onReset}
            theme="transparent"
            icon={<Trash2Icon size={18} color="hsl(var(--danger-DEFAULT))" />}
          />
        </span>
      </div>
    </li>
  );
};

type ViewMode = "view" | "edit";

export const FriendsCrud = () => {
  const i18n = useTranslations();
  const [state, dispatch] = Friends.use();
  const [preferences, _dispatch] = Preferences.use();
  const isDesktop = !Platform.use();
  const users = sortUuidList(state.users, "id");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const input = getHtmlInput(form, "user");
    const name = sanitize(input.value);
    if (name === "") return;
    const hasUserName = Friends.hasUser(name, state.users);
    if (!hasUserName) {
      dispatch.new(Friends.new(name));
      input.focus();
      return form.reset();
    }
  };
  return (
    <ul className="space-y-2">
      <li>
        <Form onSubmit={onSubmit} className="flex flex-row items-end gap-2">
          <Input
            name="user"
            optionalText=""
            autoFocus={isDesktop}
            title={i18n.get("addFriendInput")}
            placeholder={i18n.get("userInputPlaceholder")}
          />
          <Button
            size="small"
            type="submit"
            className="mb-1"
            theme="transparent"
            aria-label={i18n.get("addFriend")}
          >
            <PlusIcon absoluteStrokeWidth strokeWidth={2} size={16} />
          </Button>
        </Form>
      </li>
      {users.map((user, index) => (
        <EditUser
          key={user.id}
          index={index + 1}
          ownerId={preferences.id}
          onChangeUser={dispatch.update}
          onDeleteUser={dispatch.delete}
          user={user}
        />
      ))}
    </ul>
  );
};

type ConsumerProps = {
  me: User;
  friends: Dict<string, CartUser>;
  onDelete: (user: CartUser) => void;
  onAdd: (user: CartUser, alone?: boolean) => void;
  onChangeUser?: (id: string, name: string) => void;
};

export const SelectConsumerFriends = (props: ConsumerProps) => {
  const me = props.me;
  const [visible, setVisible] = useState(false);
  const [users, dispatch] = Friends.use((s) => s.users);
  const i18n = useTranslations();
  const friends = users.toSorted((a, b) => b.id.localeCompare(a.id));

  const createNewUser = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const input = form.elements.namedItem("name") as HTMLInputElement;
    const name = input.value;
    const user = Cart.newUser(Friends.new(name));
    dispatch.new(user);
    form.reset();
    input.focus();
    props.onAdd(user);
  };

  const onCheckFriend =
    (u: User) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!props.friends.has(me.id)) props.onAdd(Cart.newUser(me));
      const checked = e.target.checked;
      const user = Cart.newUser(u);
      return checked ? props.onAdd(user) : props.onDelete(user);
    };

  return (
    <div className="my-2 grid grid-cols-2 items-end gap-4">
      <Button onClick={() => props.onAdd(Cart.newUser(me), true)}>
        Tô sozinho
      </Button>
      <Drawer open={visible} onChange={setVisible}>
        <Drawer.Trigger asChild>
          <Button>Com os amigos</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Lista de amigos</Drawer.Title>
          <ul role="list" className="my-4 space-y-6">
            <li>
              <Form
                onSubmit={createNewUser}
                className="flex flex-nowrap items-end gap-2"
              >
                <Input
                  name="name"
                  autoComplete="name"
                  title="Nome do amigo"
                  placeholder={i18n.get("userInputPlaceholder")}
                />
                <PlatformMobile>
                  <Button
                    type="submit"
                    title="Adicionar amigo"
                    aria-label="Adicionar amigo"
                    className="mb-1"
                    icon={
                      <PlusIcon
                        absoluteStrokeWidth
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    }
                  />
                </PlatformMobile>
              </Form>
            </li>
            {friends.map((user) => {
              const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const name = e.target.value;
                props.onChangeUser?.(user.id, name);
              };
              const exists = props.friends.has(user.id);
              return (
                <li
                  className="flex w-full items-center justify-between"
                  key={`${user.id}-comanda-list`}
                >
                  <Checkbox
                    data-id={user.id}
                    container="w-full"
                    onChange={onCheckFriend(user)}
                    checked={props.friends.has(user.id)}
                  >
                    {exists ? (
                      <Input
                        title=""
                        hideLeft
                        name="name"
                        optionalText=""
                        value={user.name}
                        rightLabel={null}
                        container="w-full"
                        onChange={onChange}
                        autoComplete="name"
                        placeholder={i18n.get("userInputPlaceholder")}
                      />
                    ) : (
                      <span>{user.name}</span>
                    )}
                  </Checkbox>
                </li>
              );
            })}
          </ul>
          <Drawer.Trigger asChild>
            <Button className="w-full">Salvar</Button>
          </Drawer.Trigger>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};
