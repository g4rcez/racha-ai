import React, { Fragment, PropsWithChildren } from "react";

export const PatternMatch = (
  props: PropsWithChildren<{ default: React.ReactElement }>,
) => (
  <Fragment>
    {React.Children.map(props.children, (opt: any) => {
      const props = opt.props;
      return props.when ? props.children : null;
    })}
  </Fragment>
);

PatternMatch.Case = (props: PropsWithChildren<{ when: boolean }>) =>
  props.children;
