import { CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { css } from "~/lib/dom";

export type FeedbackProps = React.PropsWithChildren<
    Partial<{
        title: string | React.ReactElement | React.ReactNode;
        hideLeft?: boolean;
        className?: string;
        placeholder: string;
        reportStatus: boolean;
    }>
>;
export const InputFeedback = ({ reportStatus, hideLeft = false, className, children, title }: FeedbackProps) => (
    <div className={css("w-full justify-between", hideLeft && children === null ? "hidden" : "flex", className)}>
        {hideLeft ? null : (
            <span className="flex items-center gap-1">
                {title}
                {reportStatus ? (
                    <span className="flex aspect-square h-4 w-4 items-center justify-center">
                        <CheckCircle
                            className="hidden aspect-square h-3 w-3 opacity-0 transition-opacity duration-300 group-assert:block group-assert:text-success group-assert:opacity-100"
                            aria-hidden="true"
                            size={16}
                            strokeWidth={1}
                            absoluteStrokeWidth
                        />
                        <XCircle
                            className="hidden aspect-square h-3 w-3 opacity-0 transition-opacity duration-300 group-error:block group-error:opacity-100"
                            aria-hidden="true"
                            size={16}
                            strokeWidth={1}
                            absoluteStrokeWidth
                        />
                    </span>
                ) : null}
            </span>
        )}
        {children}
    </div>
);
