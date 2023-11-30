import { Polymorph, PolymorphicProps } from "~/components/polymorph";
import { css } from "~/lib/dom";

export const Title = (props: PolymorphicProps<{}, "h1">) => (
    <Polymorph
        {...props}
        className={css("mb-2.5 text-3xl font-bold leading-relaxed tracking-wide", props.className)}
        as={props.as ?? "h2"}
    />
);
