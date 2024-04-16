import { uuidv7 } from "@kripod/uuidv7";
import React, { useEffect } from "react";
import { z } from "zod";
import { Button } from "~/components/core/button";
import { Card } from "~/components/core/card";
import { Zorm } from "~/components/form/zorm";

const createOptions = <const O extends [Option, ...Option[]]>(options: O): z.ZodDiscriminatedUnion<"value", any> =>
    z.discriminatedUnion(
        "value",
        options.map((opt) =>
            z.object({
                value: z.literal(opt.value),
                label: z.literal(opt.label)
            })
        ) as any
    );

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
        .describe(Zorm.Input({ title: "Inteiro", placeholder: "Informe um número inteiro..." })),
    language: createOptions([
        { value: "js", label: "Javascript" },
        { value: "ts", label: "Typescript" },
        { value: "csharp", label: "C#" }
    ])
});

const parseDiscriminatedOptions = (union: z.ZodDiscriminatedUnion<"value", any>) =>
    union._def.options.map((option: any) => ({
        label: option.shape.label._def.value,
        value: option.shape.value._def.value
    }));

type Option = { value: string; label: string };

export default function ZormPage() {
    useEffect(() => {
        console.log(parseDiscriminatedOptions(schema.shape.language));
    }, []);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-black p-8">
            <Card title="Zorm Tests" className="bg-slate-900">
                <Zorm schema={schema} onSubmit={console.log} className="flex flex-col gap-4">
                    <Button type="submit" className="col-span-2">
                        Salvar
                    </Button>
                </Zorm>
            </Card>
        </div>
    );
}
