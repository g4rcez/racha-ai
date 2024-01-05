import clsx from "clsx";
import React, { forwardRef, lazy } from "react";

export const AppScreen = ({ children, className, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div className={clsx("flex flex-col", className)} {...props}>
        <div className="flex justify-between px-4 pt-1" />
        {children}
    </div>
);

AppScreen.Header = forwardRef<React.ElementRef<"div">, { children: React.ReactNode }>(({ children }, ref) => (
    <div ref={ref} className="mt-6 px-4 text-white">
        {children}
    </div>
));

AppScreen.Title = forwardRef<React.ElementRef<"div">, { children: React.ReactNode }>(({ children }, ref) => (
    <div ref={ref} className="text-2xl text-white">
        {children}
    </div>
));

AppScreen.Subtitle = forwardRef<React.ElementRef<"div">, { children: React.ReactNode }>(({ children }, ref) => (
    <div ref={ref} className="text-sm text-gray-500">
        {children}
    </div>
));

AppScreen.Body = forwardRef<React.ElementRef<"div">, { className?: string; children: React.ReactNode }>(
    ({ children, className }, ref) => (
        <div ref={ref} className={clsx("mt-6 flex-1 rounded-t-2xl bg-white overflow-y-hidden will-change-transform isolate phone-emulate-body", className)}>
            {children}
        </div>
    ),
);

const ComandaPage = lazy(() => import("~/pages/app/comanda.page"));

export const AppDemo = () => (
    <AppScreen>
        <AppScreen.Body>
            <div className="p-4 isolate overflow-hidden">
                <React.Suspense fallback="Loading...">
                    <ComandaPage />
                </React.Suspense>
            </div>
        </AppScreen.Body>
    </AppScreen>
);
