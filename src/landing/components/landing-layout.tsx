import React, { Fragment } from "react";
import { Footer } from "~/landing/components/footer";
import { Header } from "~/landing/components/header";

export const LandingLayout = ({ children }: { children: React.ReactNode }) => (
  <Fragment>
    <Header />
    <main className="flex-auto">{children}</main>
    <Footer />
  </Fragment>
);
