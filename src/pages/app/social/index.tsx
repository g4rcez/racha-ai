import { useRouter } from "next/router";
import React from "react";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { httpClient } from "~/lib/http-client";
import { Endpoints } from "~/models/endpoints";

function V2FriendsPage() {
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
      <Card
        title="Novo grupo"
        description="Crie grupos de amigos para facilitar suas contas"
      >
        <Form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            required
            name="title"
            title="Nome"
            minLength={1}
            maxLength={255}
          />
          <Input
            required
            minLength={1}
            maxLength={255}
            name="description"
            title="Description"
          />
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
