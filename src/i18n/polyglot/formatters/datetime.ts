import { PolyglotConfig, Timezone } from "~/i18n/polyglot/types/types";

export namespace Datetime {
  export const getTzLabel = () =>
    Intl.DateTimeFormat(undefined).resolvedOptions().timeZone;

  export const getTzOffset = () => new Date().getTimezoneOffset();

  export const getTz = (): Timezone => ({
    offset: getTzOffset(),
    label: getTzLabel(),
  });

  export const formatters = (lang: string, options?: PolyglotConfig) => ({
    relative: new Intl.RelativeTimeFormat(lang, {
      style: "long",
      localeMatcher: "lookup",
    }).format,
    date: new Intl.DateTimeFormat(lang, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: options?.timezone,
      ...options?.date,
    }).format,
    time: new Intl.DateTimeFormat(lang, {
      hour: "numeric",
      minute: "numeric",
      timeZone: options?.timezone,
      ...options?.time,
    }).format,
    datetime: new Intl.DateTimeFormat(lang, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: options?.timezone,
      ...options?.datetime,
    }).format,
  });
}
