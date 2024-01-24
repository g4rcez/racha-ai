import clsx from "clsx";
import { MenuIcon, MoonIcon } from "lucide-react";
import React, { forwardRef } from "react";
import { LandingLogo } from "~/landing/components/landing-logo";
import { Label } from "~/types";

export const AppFrame = ({
  children,
  className,
  logo = <LandingLogo />,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { logo?: Label }) => (
  <div className={clsx("flex flex-col", className)} {...props}>
    <div className="flex justify-between px-4 pt-4">
      {logo}
      <div className="flex flex-row gap-4">
        <MoonIcon absoluteStrokeWidth strokeWidth={2} color="black" />
        <MenuIcon absoluteStrokeWidth strokeWidth={2} color="black" />
      </div>
    </div>
    {children}
  </div>
);

AppFrame.Header = forwardRef<
  React.ElementRef<"div">,
  { children: React.ReactNode }
>(function AppScreenHeader({ children }, ref) {
  return (
    <div ref={ref} className="mt-4 px-4 text-white">
      {children}
    </div>
  );
});

AppFrame.Title = forwardRef<
  React.ElementRef<"div">,
  { children: React.ReactNode }
>(function AppScreenTitle({ children }, ref) {
  return (
    <div ref={ref} className="text-2xl text-body mb-6">
      {children}
    </div>
  );
});

AppFrame.Subtitle = forwardRef<
  React.ElementRef<"div">,
  { children: React.ReactNode }
>(function AppScreenSubtitle({ children }, ref) {
  return (
    <div ref={ref} className="text-sm text-gray-500">
      {children}
    </div>
  );
});

AppFrame.Body = forwardRef<
  React.ElementRef<"div">,
  { className?: string; children: React.ReactNode }
>(function AppScreenBody({ children, className }, ref) {
  return (
    <div
      ref={ref}
      className={clsx("mt-2 flex-auto rounded-t-2xl bg-white", className)}
    >
      {children}
    </div>
  );
});
