import { Linq } from "linq-arrays";
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
import { Cart, CartUser } from "~/store/cart.store";
import { Friends, User } from "~/store/friends.store";
import { Platform } from "~/store/platform";

type EditUserProps = {
  user: User;
  index: number;
  ownerId: string;
  onChangeUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
};

type ViewMode = "view" | "edit";

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
      className="flex justify-between gap-x-6 py-5 first:border-t border-b border-muted last:border-b-0"
    >
      <div className="flex min-w-0 gap-x-4 items-center">
        <div className="size-12 flex items-center justify-center rounded-full bg-main-bg/70">
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
                autoFocus
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
        <span className="flex flex-row flex-nowrap gap-2">
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

type ConsumerProps<F extends User | CartUser> = {
  me: User;
  friends: Dict<string, F>;
  onDelete: (user: CartUser) => void;
  onChangeUser?: (id: string, name: string) => void;
  onAdd: (user: CartUser, alone?: boolean) => void;
};

export const SelectConsumerFriends = <T extends User | CartUser>(
  props: ConsumerProps<T>,
) => {
  const me = props.me;
  const [visible, setVisible] = useState(false);
  const [state, dispatch] = Friends.use();
  const i18n = useTranslations();
  const isDesktop = !Platform.use();
  const users = new Linq(state.users.toArray()).OrderBy("name", "asc").Select();

  const createNewUser = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const input = form.elements.namedItem("name") as HTMLInputElement;
    const name = input.value;
    const user = Cart.newUser(Friends.new(name));
    dispatch.upsert(user);
    input.value = "";
    input.focus();
    props.onAdd(user);
  };

  const onCheckFriend =
    (u: User) => (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onAdd(Cart.newUser(me));
      const checked = e.target.checked;
      const user = Cart.newUser(u);
      return checked ? props.onAdd(user) : props.onDelete(user);
    };

  return (
    <div className="my-2 grid grid-cols-2 items-end gap-4">
      <Button
        data-name="share-alone"
        onClick={() => props.onAdd(Cart.newUser(me), true)}
      >
        Tô sozinho
      </Button>
      <Drawer open={visible} onChange={setVisible}>
        <Drawer.Trigger asChild>
          <Button data-name="share-friends">Com os amigos</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Amigos e grupos</Drawer.Title>
          <ul data-name="friends" role="list" className="my-4 space-y-6">
            <li>
              <Form
                onSubmit={createNewUser}
                className="flex flex-nowrap items-end gap-2"
              >
                <Input
                  name="name"
                  autoFocus={isDesktop}
                  autoComplete="name"
                  title="Nome do amigo"
                  placeholder={i18n.get("userInputPlaceholder")}
                  right={
                    <Button
                      size="small"
                      type="submit"
                      className="mb-1"
                      theme="transparent"
                      title="Adicionar amigo"
                      aria-label="Adicionar amigo"
                      icon={
                        <PlusIcon
                          className="text-main-bg"
                          strokeWidth={1}
                          aria-hidden="true"
                          absoluteStrokeWidth
                        />
                      }
                    />
                  }
                />
              </Form>
            </li>
            {users.map((user) => (
              <li
                key={`${user.id}-comanda-list`}
                className="flex w-full items-center justify-between"
              >
                <Checkbox
                  data-id={user.id}
                  container="w-full"
                  onChange={onCheckFriend(user)}
                  checked={props.friends.has(user.id)}
                >
                  <span>{user.name}</span>
                </Checkbox>
              </li>
            ))}
          </ul>
          <Drawer.Trigger asChild>
            <Button data-name="save" className="w-full">
              Salvar
            </Button>
          </Drawer.Trigger>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};
