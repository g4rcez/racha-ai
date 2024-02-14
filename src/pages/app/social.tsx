import Link from "next/link";
import { useRouter } from "next/router";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import React from "react";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Groups } from "~/db/users";
import { getSession } from "~/lib/auth";
import { httpClient } from "~/lib/http-client";
import { Endpoints } from "~/models/endpoints";
import { Links } from "~/router";
import { User } from "~/services/user";

const serverSideProps = (groups?: Groups[]) => ({
  groups: groups
    ? groups.map((x) => ({
        ...x,
        createdAt: x.createdAt.toISOString(),
        deletedAt: x.deletedAt ? x.deletedAt.toISOString() : null,
      }))
    : [],
});

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession(context);
  if (session === null) return { props: serverSideProps() };
  const id = (session.user as any)?.id;
  if (!id) return { props: serverSideProps() };
  const userGroups = await User.getFriends(id);
  return userGroups.isSuccess()
    ? { props: serverSideProps(userGroups.success) }
    : { props: serverSideProps() };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

function V2FriendsPage(props: Props) {
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const json = Object.fromEntries(new FormData(e.currentTarget) as any);
    const response = await httpClient.post(Endpoints.createGroup, json);
    if (response.ok) {
      await response.json();
      router.reload();
    }
  };

  return (
    <main className="flex flex-col gap-8">
      <Card title="Meus grupos">
        <ul>
          {props.groups.map((group) => (
            <li key={group.id}>
              <Link href={Links.userGroupId(group.id)}>{group.title}</Link>
            </li>
          ))}
        </ul>
      </Card>
      <Card
        title="Novo grupo"
        description="Crie grupos de amigos para facilitar suas contas"
      >
        <Form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input required name="title" title="Nome" />
          <Input required name="description" title="Description" />
          <input
            name="avatar"
            type="hidden"
            value="https://placehold.co/400/fff/13343C"
          />
          <Button type="submit">Criar grupo</Button>
        </Form>
      </Card>
    </main>
  );
}

V2FriendsPage.getLayout = AdminLayout;

export default V2FriendsPage;
