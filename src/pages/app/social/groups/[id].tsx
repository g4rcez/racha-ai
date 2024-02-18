import { useRouter } from "next/router";
import React from "react";
import AdminLayout from "~/components/admin/layout";
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
  const params = ctx.params?.id ?? "";
  const group = await User.getGroupById(session.user.id, params as string);
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
  const groupId = useRouter().query.id as string;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLFormElement
    ).value;
    const response = await httpClient.post(Endpoints.addMember(groupId), {
      email,
    });
    return response.ok ? alert("OK") : console.log(response);
  };

  return (
    <main className="flex flex-col gap-8">
      <Card onSubmit={onSubmit} as={Form} title="Adicionar amigo">
        <Input
          required
          type="email"
          name="email"
          title="Email"
          placeholder="email.do.amigo@email.com"
        />
      </Card>
      {group === null ? null : (
        <Card
          title="Membros do grupo"
          description={`Seu grupo possui ${group.users.length} membros`}
        >
          <ul className="space-y-4">
            {group.users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}

AppSocialGroupsIdPage.getLayout = AdminLayout;

export default AppSocialGroupsIdPage;
