import { PlusIcon } from "lucide-react";
import React from "react";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { EditUser } from "~/components/users/friends";
import { useTranslations } from "~/i18n";
import { getHtmlInput } from "~/lib/dom";
import { sanitize } from "~/lib/fn";
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
    const name = sanitize(input.value);
    if (name === "") return;
    const hasUserName = Friends.hasUser(name, Array.from(state.users.values()));
    if (!hasUserName) {
      dispatch.upsert(Friends.new(name));
      input.focus();
      return form.reset();
    }
  };

  return (
    <main className="flex gap-4 flex-col">
      <Card title="Novo amigo" className="space-y-3">
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
            <PlusIcon
              color="hsl(var(--main-bg))"
              absoluteStrokeWidth
              strokeWidth={2}
              size={16}
            />
          </Button>
        </Form>
      </Card>
      <Card
        title="Seus amigos"
        description="Os amigos que já dividiram conta com você"
      >
        <ul className="space-y-4">
          {state.users.arrayMap((user, _, index) => (
            <EditUser
              key={user.id}
              index={index + 1}
              ownerId={preferences.id}
              onChangeUser={dispatch.upsert}
              onDeleteUser={dispatch.delete}
              user={user}
            />
          ))}
        </ul>
      </Card>
    </main>
  );
};

FriendsPage.getLayout = AdminLayout;

export default FriendsPage;
