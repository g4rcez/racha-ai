import { PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Groups } from "~/db/users";
import { serverSideMiddleware } from "~/lib/http";
import { httpClient } from "~/lib/http-client";
import { Endpoints } from "~/models/endpoints";
import { User } from "~/services/user";
import { Nullable, ParseToRaw } from "~/types";

export const getServerSideProps = serverSideMiddleware(async (ctx, session) => {
  const groupId = ctx.params?.id ?? "";
  const group = await User.getGroupById(session.user.id, groupId as string);
  if (group.isError()) {
    return { props: { group: null } };
  }
  return { props: { group: group.success } };
});

type Props = {
  group: Nullable<ParseToRaw<Groups> & { users: User.MappedUser[] }>;
};

function AppSocialGroupsIdPage(props: Props) {
  const group = props.group;
  const router = useRouter();
  const groupId = router.query.id as string;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLFormElement
    ).value;
    const response = await httpClient.patch(Endpoints.memberId(groupId), {
      email,
    });
    return response.ok ? router.reload() : console.log(response);
  };

  const onDelete = async (e: React.ChangeEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const user = form.dataset.id as string;
    await httpClient.delete(Endpoints.memberId(groupId), {
      user,
    });
    router.reload();
  };

  return (
    <main className="flex flex-col gap-8">
      <Card onSubmit={onSubmit} as={Form} title="Adicionar amigo">
        <Input
          required
          type="email"
          name="email"
          title="Email"
          placeholder="email.amigo@email.com"
          right={
            <Button
              type="submit"
              size="small"
              theme="transparent"
              icon={<PlusIcon size={18} />}
            />
          }
        />
      </Card>
      {group === null ? null : (
        <Card
          title="Membros do grupo"
          description={`Seu grupo possui ${group.users.length} membros`}
        >
          <ul className="space-y-2 mt-8">
            {group.users.map((user) => (
              <li className="flex w-full justify-between" key={user.id}>
                {user.name}
                <Form data-id={user.id} onSubmit={onDelete}>
                  <Button
                    type="submit"
                    theme="transparent-danger"
                    icon={<Trash2Icon size={16} className="text-danger-bg" />}
                  />
                </Form>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}

AppSocialGroupsIdPage.getLayout = AdminLayout;

export default AppSocialGroupsIdPage;
