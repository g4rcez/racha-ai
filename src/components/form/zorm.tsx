import React, { PropsWithChildren, useCallback, useMemo, useRef, useState } from "react";
import { Is, Objects } from "sidekicker";
import { z } from "zod";
import { Button, Form, formToJson, Input, InputProps } from "~/components";
import { PrimitiveProps } from "~/types";

namespace Defs {
    type Defaults<Kind extends string, Props extends object> = Props & {
        kind: Kind;
        error?: string;
        name: string;
        Component: React.FC<Omit<Defaults<Kind, Props>, "Component">>;
    };

    export type Str = Defaults<
        "text",
        {
            type: string;
            uuid?: string;
            email?: "email";
            min?: number;
            max?: number;
            hidden?: boolean;
            mask: InputProps["mask"];
        }
    >;

    export type N = Defaults<"number", { type: "number"; min?: number; max?: number }>;

    export type All =
        | (Str | N)
        | {
              defaultValue?: string;
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
          };
}

type Props<T extends z.ZodObject<any>> = {
    schema: T;
    state?: z.infer<T>;
    className?: string;
    setState?: (callback: (state: z.infer<T>) => z.infer<T>) => void;
    onSubmit: (state: z.infer<T>, e: React.FormEvent<HTMLFormElement>) => void;
    onChange?: (state: z.infer<T>, change: { path: string; value: any }) => void;
};

const json = (str: string = "") => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

type PartialProps = Partial<{ required: boolean; value: any }>;

const zodNumber = (name: string, instance: z.ZodNumber, defaults: PartialProps): Defs.N =>
    instance._def.checks.reduce(
        (acc, el) => ({
            ...acc,
            [el.kind]: (el as any).value ?? (el as any).regex ?? el.kind
        }),
        {
            kind: "number",
            type: "number",
            name,
            ...json(instance._def.description),
            Component: (props: Defs.Str) => {
                const Render = props.hidden ? "input" : Input;
                const [error, setError] = useState("");
                const defaultValue = useRef(Is.function(defaults.value) ? defaults.value() : defaults.value);
                const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                    const validation = instance.safeParse(e.target.value);
                    return validation.success ? setError("") : setError(validation.error.issues[0].message);
                };
                return (
                    <Render
                        {...props}
                        defaultValue={defaultValue.current || ""}
                        onBlur={onBlur}
                        error={props.error || error}
                        min={props.min}
                        max={props.max}
                        type={props.hidden ? "hidden" : "number"}
                        required={defaults.required ?? true}
                    />
                );
            }
        }
    );

const zodString = (name: string, instance: z.ZodString, defaults: PartialProps): Defs.Str =>
    instance._def.checks.reduce(
        (acc, el) => ({
            ...acc,
            [el.kind]: (el as any).value ?? (el as any).regex ?? el.kind
        }),
        {
            kind: "text",
            type: "text",
            name,
            ...json(instance._def.description),
            Component: (props: Defs.Str) => {
                const Render = props.hidden ? "input" : Input;
                const [error, setError] = useState("");
                const defaultValue = useRef(Is.function(defaults.value) ? defaults.value() : defaults.value);
                const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                    const validation = instance.safeParse(e.target.value);
                    return validation.success ? setError("") : setError(validation.error.issues[0].message);
                };
                return (
                    <Render
                        {...props}
                        defaultValue={defaultValue.current || ""}
                        onBlur={onBlur}
                        error={props.error || error}
                        minLength={props.min}
                        maxLength={props.max}
                        mask={props.uuid || props.mask}
                        type={props.hidden ? "hidden" : props.email || "text"}
                        required={defaults.required ?? true}
                    />
                );
            }
        }
    );

const map = new Map<string, (name: string, instance: any, p: PartialProps) => Defs.All>([
    [z.ZodString.name, zodString],
    [z.ZodNumber.name, zodNumber],
    [
        z.ZodOptional.name,
        (name, instance: z.ZodOptional<z.ZodType>, p): Defs.All => {
            const typeName = (instance._def.innerType._def as any).typeName;
            return map.get(typeName)!(name, instance._def.innerType, { ...p, required: false });
        }
    ],
    [
        z.ZodDefault.name,
        (name, instance: z.ZodDefault<z.ZodType>, p): Defs.All => {
            const typeName = (instance._def.innerType._def as any).typeName;
            return map.get(typeName)!(name, instance._def.innerType, { ...p, value: instance._def.defaultValue });
        }
    ]
]);

export const Zorm = <T extends z.ZodObject<any>>(props: PropsWithChildren<Props<T>>) => {
    const [errors, setErrors] = useState({});
    const form = useRef<HTMLFormElement>(null);
    const elements = useMemo(() => {
        const fields = props.schema.shape;
        return Object.keys(fields).reduce<any[]>((acc, el) => {
            const field = fields[el];
            const parser = map.get(field._def.typeName);
            if (parser) acc.push(parser(el, field, {}));
            return acc;
        }, []);
    }, [props.schema]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        if (props.setState) return props.setState((prev) => Objects.set(prev, name, value));
        if (props.onChange && form.current !== null) props.onChange(formToJson(form.current), { path: name, value });
    }, []);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const formState = formToJson(e.currentTarget);
        const state = props.state ? Objects.merge(props.state, formState) : formState;
        const validation = await props.schema.safeParseAsync(state);
        if (!validation.success) return setErrors((prev) => validation.error.issues.reduce((acc, el) => Objects.set(acc, el.path.join("."), el.message), prev));
        setErrors({});
        return void props.onSubmit(validation.data, e);
    };

    const onInvalid = async (e: React.FormEvent<HTMLFormElement>) => {
        const formState = formToJson(e.currentTarget);
        const state = props.state ? Objects.merge(props.state, formState) : formState;
        const validation = await props.schema.safeParseAsync(state);
        return validation.success
            ? undefined
            : setErrors((prev) =>
                  validation.error.issues.reduce((acc, el) => {
                      const path = el.path.join(".");
                      return Objects.set(acc, path, Objects.get(prev, path, el.message));
                  }, prev)
              );
    };

    return (
        <Form ref={form} className={props.className} onSubmit={onSubmit} onInvalidCapture={onInvalid}>
            {elements.map(({ Component, ...element }) => (
                <Component {...element} error={Objects.get(errors, element.name)} key={element.name} onChange={onChange} />
            ))}
            {props.children ? props.children : <Button type="submit">Submit</Button>}
        </Form>
    );
};

Zorm.Input = <T extends PrimitiveProps<InputProps>>(props: T) => JSON.stringify(props);
