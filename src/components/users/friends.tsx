import { CheckIcon, Edit2Icon, Trash2Icon, User2Icon } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { Button } from "~/components/core/button";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { useTranslations } from "~/i18n";
import { getHtmlInput } from "~/lib/dom";
import { User } from "~/store/friends.store";

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
        <li key={props.user.id} className="flex justify-between gap-x-6 border-b border-muted py-5 first:border-t last:border-b-0">
            <div className="flex min-w-0 items-center gap-x-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-main-bg/70">
                    <User2Icon color="hsl(var(--main-DEFAULT))" />
                </div>
                <div className="flex-auto">
                    <p className="text-sm font-semibold">
                        {props.index}. {props.user.name}
                    </p>
                    {mode === "edit" ? (
                        <Form onSubmit={onSubmit} className="mt-2 flex flex-row items-end gap-2">
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
                            <Button size="icon" type="submit" className="mb-1" theme="transparent" icon={<CheckIcon color="hsl(var(--success-DEFAULT))" />} />
                        </Form>
                    ) : null}
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-6">
                <span className="flex flex-row flex-nowrap gap-2">
                    <Button size="icon" theme="transparent" onClick={() => setMode("edit")} icon={<Edit2Icon size={18} color="hsl(var(--main-bg))" />} />
                    <Button size="icon" onClick={onReset} theme="transparent" icon={<Trash2Icon size={18} color="hsl(var(--danger-DEFAULT))" />} />
                </span>
            </div>
        </li>
    );
};
