import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next/types";
import { getSession, nextAuthOptions } from "~/lib/auth";
import { has } from "~/lib/fn";

type Endpoint = (req: NextApiRequest, res: NextApiResponse) => any;

type SessionEndpoint = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session & {
    user: Session["user"] & { id: string };
  },
) => any;

export const authMiddleware =
  <T extends SessionEndpoint>(callback: T) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);
    if (session === null) {
      return res.status(401).json({ notAuthorized: true });
    }
    return callback(req, res, session as never);
  };

export type HttpMethods = "get" | "post" | "put" | "patch" | "delete";

const parseMethod = (method: string | undefined): HttpMethods =>
  (method?.toLowerCase() as HttpMethods) || "get";

export const endpoint =
  <T extends Partial<Record<HttpMethods, Endpoint>>>(methods: T) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    const method = parseMethod(req.method);
    return has(methods, method)
      ? methods[method]!(req, res)
      : res.status(405).json({ error: "Method not allowed" });
  };

export const parseMessageError = <
  I extends { message: string; path: Array<number | string> },
>(
  issues: I[],
) => ({
  errors: issues.map((x) => `${x.path?.join?.(".")}|${x.message}`),
});

export const serverSideMiddleware =
  (
    callback: (
      context: GetServerSidePropsContext,
      session: Session & { user: Session["user"] & { id: string } },
    ) => Promise<GetServerSidePropsResult<any>>,
  ) =>
  async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<any>> => {
    const session = await getSession(context);
    if (session === null) return { notFound: true };
    return callback(context, session as any);
  };
