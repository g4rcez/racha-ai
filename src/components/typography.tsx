import { PropsWithChildren } from "react";
import { Polymorph, PolymorphicProps } from "~/components/polymorph";
import { css } from "~/lib/dom";
import { Label } from "~/types";

export const Title = (props: PolymorphicProps<{}, "h1">) => (
    <Polymorph
        {...props}
        className={css("mb-2.5 text-3xl font-bold leading-relaxed tracking-wide", props.className)}
        as={props.as ?? "h2"}
    />
);

type Props = { title: Label; titleClassName?: string };

export const SectionTitle = (props: PropsWithChildren<Props>) => (
    <header className="flex flex-col">
        <Title className={css("-mb-1", props.titleClassName)}>{props.title}</Title>
        <p>{props.children}</p>
    </header>
);
