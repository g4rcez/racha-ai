import { PlusIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { Button } from "~/components/button";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { useTranslations } from "~/i18n";
import { getHtmlInput } from "~/lib/dom";
import { sanitize, sortUuidList } from "~/lib/fn";
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

export default function FriendsPage() {
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
        <main>
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
        </main>
    );
}
