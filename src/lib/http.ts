import { NextApiRequest, NextApiResponse } from "next";
import { has } from "sidekicker";
import { Nullable } from "~/types";

type Endpoint = (req: NextApiRequest, res: NextApiResponse) => any;

type User = { id: string; email: string };

type Session = { user: User };

type SessionEndpoint = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => any;

export const fakeSession: Nullable<Session> = { user: { id: "", email: "" } };

const session = fakeSession;

export const authMiddleware =
  <T extends SessionEndpoint>(callback: T) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
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
