import { PlusIcon } from "lucide-react";
import React from "react";
import { normalize } from "sidekicker";
import { Button, Card, Form, Input } from "~/components";
import AdminLayout from "~/components/admin/layout";
import { EditUser } from "~/components/users/friends";
import { useTranslations } from "~/i18n";
import { getHtmlInput } from "~/lib/dom";
import { Friends } from "~/store/friends.store";
import { Platform } from "~/store/platform";
import { Preferences } from "~/store/preferences.store";
import { NextPageWithLayout } from "~/types";

const FriendsPage: NextPageWithLayout = () => {
    const i18n = useTranslations();
    const [state, dispatch] = Friends.use();
    const [preferences, _dispatch] = Preferences.use();
    const isDesktop = !Platform.use();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const input = getHtmlInput(form, "user");
        const name = normalize(input.value);
        if (name === "") return;
        const hasUserName = Friends.hasUser(name, Array.from(state.users.values()));
        if (!hasUserName) {
            dispatch.upsert(Friends.new(name));
            input.focus();
            return form.reset();
        }
    };

    return (
        <main className="flex flex-col gap-4">
            <Card title="Novo amigo" className="space-y-3">
                <Form onSubmit={onSubmit} className="flex flex-row items-end gap-2">
                    <Input
                        name="user"
                        optionalText=""
                        autoFocus={isDesktop}
                        title={i18n.get("addFriendInput")}
                        placeholder={i18n.get("userInputPlaceholder")}
                        right={
                            <Button
                                data-id="add-friend"
                                size="small"
                                type="submit"
                                className="mb-1"
                                theme="transparent"
                                aria-label={i18n.get("addFriend")}
                                icon={<PlusIcon className="text-main-soft" absoluteStrokeWidth strokeWidth={2} size={16} />}
                            />
                        }
                    />
                </Form>
            </Card>
            <Card title="Seus amigos" description="Os amigos que já dividiram conta com você">
                <ul className="space-y-4">
                    {state.users.arrayMap((user, _, index) => (
                        <EditUser key={user.id} index={index + 1} ownerId={preferences.id} onChangeUser={dispatch.upsert} onDeleteUser={dispatch.delete} user={user} />
                    ))}
                </ul>
            </Card>
        </main>
    );
};

FriendsPage.getLayout = AdminLayout;

export default FriendsPage;
