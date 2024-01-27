import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { Fragment } from "react";
import { Container } from "~/landing/components/container";
import { LoginButton } from "~/landing/components/landing-button";
import { LandingLogo } from "~/landing/components/landing-logo";
import { landingNavLinks, NavLinks } from "~/landing/components/nav-links";

const MenuIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M5 6h14M5 18h14M5 12h14"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronUpIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M17 14l-5-5-5 5"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MobileNavLink = (
  props: Omit<
    React.ComponentPropsWithoutRef<typeof Popover.Button<typeof Link>>,
    "as" | "className"
  >,
) => (
  <Popover.Button
    as={Link}
    className="block text-base leading-7 tracking-tight text-gray-700"
    {...props}
  />
);

export const Header = () => (
  <header>
    <nav>
      <Container className="relative z-50 flex justify-between py-8">
        <div className="relative z-10 flex items-center gap-16">
          <Link href="/" aria-label="Home">
            <LandingLogo />
          </Link>
          <div className="hidden lg:flex lg:gap-10">
            <NavLinks />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Popover className="lg:hidden">
            {({ open }) => (
              <Fragment>
                <Popover.Button
                  className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 ui-not-focus-visible:outline-none"
                  aria-label="Toggle site navigation"
                >
                  {({ open }) =>
                    open ? (
                      <ChevronUpIcon className="h-6 w-6" />
                    ) : (
                      <MenuIcon className="h-6 w-6" />
                    )
                  }
                </Popover.Button>
                <AnimatePresence initial={false}>
                  {open && (
                    <Fragment>
                      <Popover.Overlay
                        static
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-0 bg-slate-400/60 backdrop-blur"
                      />
                      <Popover.Panel
                        static
                        as={motion.div}
                        initial={{ opacity: 0, y: -32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: -32,
                          transition: { duration: 0.2 },
                        }}
                        className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-24 shadow-2xl shadow-gray-900/20"
                      >
                        <div className="space-y-4">
                          {landingNavLinks.map(([name, href]) => (
                            <MobileNavLink key={`${href}-nav-link`} href={href}>
                              {name}
                            </MobileNavLink>
                          ))}
                        </div>
                        <div className="mt-8 flex flex-col gap-4">
                          <LoginButton />
                        </div>
                      </Popover.Panel>
                    </Fragment>
                  )}
                </AnimatePresence>
              </Fragment>
            )}
          </Popover>
          <LoginButton className="hidden lg:block" />
        </div>
      </Container>
    </nav>
  </header>
);
