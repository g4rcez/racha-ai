import { PlusIcon, Trash2Icon } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/button";
import { Checkbox } from "~/components/form/checkbox";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Modal } from "~/components/modal";
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
                        autoFocus
                        name="user"
                        optionalText=""
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

type ConsumerProps = { onChangeFriends: (friends: User[], justMe: boolean) => void; friends: Dict<string, User> };

export const SelectConsumerFriends = (props: ConsumerProps) => {
    const [visible, setVisible] = useState(false);
    const [me] = Preferences.use((s) => s.user);
    const [users, dispatch] = Friends.use((s) => s.users);
    const [localFriends, setLocalFriends] = useState<Dict<string, CartUser>>(() =>
        new Dict<string, CartUser>(props.friends.map(Cart.newUser)).set(me.id, Cart.newUser(me)),
    );
    const i18n = useTranslations();
    const consumers = users.toSorted((a, b) => b.id.localeCompare(a.id));

    const createNewUser = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const input = form.elements.namedItem("name") as HTMLInputElement;
        const name = input.value;
        const user = Friends.new(name);
        dispatch.new(user);
        setLocalFriends((prev) => new Dict(prev).set(user.id, Cart.newUser(user)));
        form.reset();
        input.focus();
    };

    const onCheckFriend = (user: User) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        return setLocalFriends((prev) => {
            const clone = new Dict(prev);
            if (checked) return clone.set(user.id, Cart.newUser(user));
            return clone.remove(user.id);
        });
    };

    useEffect(() => {
        if (visible) props.onChangeFriends([...localFriends.values()], false);
    }, [props.onChangeFriends, localFriends]);

    return (
        <div className="my-2 grid grid-cols-2 items-end gap-4">
            <Button onClick={() => props.onChangeFriends([me], true)}>Tô sozinho</Button>
            <Modal
                visible={visible}
                onChange={setVisible}
                title="Lista de amigos"
                description="Aqui você irá selecionar todos os amigos que vão dividir a conta com você"
                trigger={<Button>Tô com os amigos</Button>}
            >
                <ul className="space-y-4">
                    <li>
                        <Form onSubmit={createNewUser}>
                            <Input
                                autoComplete="off"
                                name="name"
                                title="Nome do amigo"
                                placeholder={i18n.get("userInputPlaceholder")}
                            />
                        </Form>
                    </li>
                    {consumers.map((user) => (
                        <li className="flex items-center justify-between" key={`${user.id}-comanda-list`}>
                            <Checkbox
                                data-id={user.id}
                                onChange={onCheckFriend(user)}
                                checked={localFriends.has(user.id)}
                            >
                                <span>{user.name}</span>
                            </Checkbox>
                        </li>
                    ))}
                </ul>
            </Modal>
        </div>
    );
};
