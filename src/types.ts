import type React from "react";

export type Override<Source, New> = Omit<Source, keyof New> & New;

export type Label = string | React.ReactNode | React.ReactElement;
