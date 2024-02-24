import { HttpMethods } from "~/lib/http";

const createFetchMethod = (
  url: string,
  method: HttpMethods,
  requestInit?: RequestInit,
) =>
  fetch(url, {
    ...requestInit,
    method: method.toUpperCase(),
    headers: { "Content-Type": "application/json", ...requestInit?.headers },
  });
export const httpClient = {
  get: (url: string, requestInit?: Omit<RequestInit, "body">) =>
    createFetchMethod(url, "get", requestInit),
  delete: (
    url: string,
    body: object,
    requestInit?: Omit<RequestInit, "body">,
  ) =>
    createFetchMethod(url, "delete", {
      ...requestInit,
      body: JSON.stringify(body),
    }),
  patch: (url: string, body: object, requestInit?: Omit<RequestInit, "body">) =>
    createFetchMethod(url, "patch", {
      ...requestInit,
      body: JSON.stringify(body),
    }),
  post: (url: string, body: object, requestInit?: Omit<RequestInit, "body">) =>
    createFetchMethod(url, "post", {
      ...requestInit,
      body: JSON.stringify(body),
    }),
};
