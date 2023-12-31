import { PropsWithChildren } from "react";
import { Polymorph, PolymorphicProps } from "~/components/polymorph";
import { css } from "~/lib/dom";
import { Label } from "~/types";

export const Title = (props: PolymorphicProps<{}, "h1" | "h2" | "h3" | "h4">) => (
    <Polymorph
        {...props}
        className={css("text-3xl font-medium leading-relaxed tracking-wide", props.className)}
        as={props.as ?? "h2"}
    />
);

type Props = { title: Label; titleClassName?: string; paragraphClassName?: string; headerClassName?: string };

export const SectionTitle = (props: PropsWithChildren<Props>) => (
    <header className={css("flex flex-col", props.headerClassName)}>
        <Title className={css("mb-1", props.titleClassName)}>{props.title}</Title>
        <p>{props.children}</p>
    </header>
);
