import { uuidv7 } from "@kripod/uuidv7";
import React from "react";
import { z } from "zod";
import { Card } from "~/components/core/card";
import { Zorm } from "~/components/form/zorm";

const schema = z.object({
    id: z
        .string()
        .uuid("UUID inválido")
        .describe(Zorm.Input({ title: "ID", placeholder: "ID", hidden: true }))
        .default(() => uuidv7()),
    name: z
        .string()
        .min(1)
        .max(256)
        .describe(Zorm.Input({ title: "Nome", placeholder: "Informe seu nome..." })),
    email: z
        .string()
        .email()
        .describe(Zorm.Input({ title: "Email", placeholder: "Email" })),
    cep: z
        .string()
        .regex(/\d{5}-\d{3}/)
        .describe(Zorm.Input({ title: "CEP", placeholder: "Informe um CEP...", mask: "cep" })),
    integer: z.coerce
        .number()
        .min(10)
        .max(50)
        .describe(Zorm.Input({ title: "Inteiro", placeholder: "Informe um número inteiro..." }))
});

export default function ZormPage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-black p-8">
            <Card title="Zorm Tests" className="bg-slate-900">
                <Zorm schema={schema} onSubmit={console.log} className="grid  grid-flow-dense gap-4 md:grid-cols-2" />
            </Card>
        </div>
    );
}
