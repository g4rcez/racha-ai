import { PlusIcon, Trash2Icon } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { Button } from "~/components/button";
import { Drawer } from "~/components/drawer";
import { Checkbox } from "~/components/form/checkbox";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Mobile } from "~/components/mobile";
import { useTranslations } from "~/i18n";
import { Dict } from "~/lib/dict";
import { getHtmlInput } from "~/lib/dom";
import { sanitize, sortUuidList } from "~/lib/fn";
import { Cart, CartUser } from "~/store/cart.store";
import { Friends, User } from "~/store/friends.store";
import { Preferences } from "~/store/preferences.store";

type EditUserProps = {
    user: User;
    onChangeUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
    ownerId: string;
};

const EditUser = (props: EditUserProps) => {
    const i18n = useTranslations();
    const isOwner = props.user.id === props.ownerId;
    const onReset = () => props.onDeleteUser(props.user);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = getHtmlInput(e.currentTarget.form!, "user").value;
        props.onChangeUser({ ...props.user, name });
    };

    return (
        <li>
            <Form onReset={onReset} className="flex flex-row items-end gap-2">
                <Input
                    required
                    name="user"
                    value={props.user.name}
                    onChange={onChange}
                    title={i18n.get("updateFriendInput")}
                    placeholder={i18n.get("userInputPlaceholder")}
                    rightLabel={isOwner ? i18n.get("yourself") : undefined}
                />
                <Button theme="danger" type="reset" aria-label={i18n.get("addFriend")}>
                    <Trash2Icon absoluteStrokeWidth strokeWidth={2} size={16} />
                </Button>
            </Form>
        </li>
    );
};

export const FriendsCrud = () => {
    const i18n = useTranslations();
    const [state, dispatch] = Friends.use();
    const [preferences, _dispatch] = Preferences.use();
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

    const users = sortUuidList(state.users, "id");
    return (
        <ul className="flex flex-col gap-4">
            <li>
                <Form onSubmit={onSubmit} className="flex flex-row items-end gap-2">
                    <Input
                        name="user"
                        optionalText=""
                        autoFocus={!Mobile.use()}
                        title={i18n.get("addFriendInput")}
                        placeholder={i18n.get("userInputPlaceholder")}
                    />
                    <Button type="submit" aria-label={i18n.get("addFriend")}>
                        <PlusIcon absoluteStrokeWidth strokeWidth={2} size={16} />
                    </Button>
                </Form>
            </li>
            {users.map((user) => (
                <EditUser
                    ownerId={preferences.id}
                    key={user.id}
                    onChangeUser={dispatch.update}
                    onDeleteUser={dispatch.delete}
                    user={user}
                />
            ))}
        </ul>
    );
};

type ConsumerProps = {
    friends: Dict<string, CartUser>;
    onDelete: (user: CartUser) => void;
    onAdd: (user: CartUser, alone?: boolean) => void;
};

export const SelectConsumerFriends = (props: ConsumerProps) => {
    const [visible, setVisible] = useState(false);
    const [me] = Preferences.use((s) => s.user);
    const [users, dispatch] = Friends.use((s) => s.users);
    const i18n = useTranslations();
    const consumers = users.toSorted((a, b) => b.id.localeCompare(a.id));

    const createNewUser = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const input = form.elements.namedItem("name") as HTMLInputElement;
        const name = input.value;
        const user = Cart.newUser(Friends.new(name));
        dispatch.new(user);
        form.reset();
        input.focus();
    };

    const onCheckFriend = (u: User) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!props.friends.has(me.id)) props.onAdd(Cart.newUser(me));
        const checked = e.target.checked;
        const user = Cart.newUser(u);
        return checked ? props.onAdd(user) : props.onDelete(user);
    };

    return (
        <div className="my-2 grid grid-cols-2 items-end gap-4">
            <Button onClick={() => props.onAdd(Cart.newUser(me), true)}>Tô sozinho</Button>
            <Drawer
                open={visible}
                onChange={setVisible}
            >
                <Drawer.Trigger asChild>
                    <Button>Com os amigos</Button>
                </Drawer.Trigger>
                <Drawer.Content>
                    <Drawer.Title>Lista de amigos</Drawer.Title>
                    <ul className="space-y-4 my-4">
                        <li>
                            <Form className="flex flex-nowrap items-end gap-2" onSubmit={createNewUser}>
                                <Input
                                    name="name"
                                    autoComplete="off"
                                    title="Nome do amigo"
                                    placeholder={i18n.get("userInputPlaceholder")}
                                />
                                <Mobile>
                                    <Button
                                        aria-label="Adicionar amigo"
                                        title="Adicionar amigo"
                                        type="submit"
                                        icon={<PlusIcon absoluteStrokeWidth strokeWidth={2} aria-hidden="true" />}
                                    />
                                </Mobile>
                            </Form>
                        </li>
                        {consumers.map((user) => (
                            <li className="flex items-center justify-between" key={`${user.id}-comanda-list`}>
                                <Checkbox
                                    data-id={user.id}
                                    onChange={onCheckFriend(user)}
                                    checked={props.friends.has(user.id)}
                                >
                                    <span>{user.name}</span>
                                </Checkbox>
                            </li>
                        ))}
                    </ul>
                    <Drawer.Trigger asChild>
                        <Button className="w-full">Salvar</Button>
                    </Drawer.Trigger>
                </Drawer.Content>
            </Drawer>
        </div>
    );
};
