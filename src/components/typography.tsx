import { Polymorph, PolymorphicProps } from "~/components/polymorph";
import { css } from "~/lib/dom";

export const Title = (props: PolymorphicProps<{}, "h1">) => (
    <Polymorph
        {...props}
        className={css(props.className, "mb-2.5 text-3xl font-bold leading-relaxed tracking-wide")}
        as={props.as ?? "h2"}
    />
);
