import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "~/components/button";

type Provider = { name: string; id: string };

const providers: Provider[] = [{ name: "Github", id: "github" }];

export default function SignIn() {
  return (
    <main className="flex flex-col gap-6 items-center justify-center h-screen w-screen">
      {providers.map((provider) => (
        <Button key={provider.name} onClick={() => signIn(provider.id)}>
          Sign in with {provider.name}
        </Button>
      ))}
    </main>
  );
}
