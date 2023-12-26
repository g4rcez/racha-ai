import { PolyglotConfig } from "~/i18n/polyglot/types/types";

export namespace Lists {
    export const comparator = (locale: string) => new Intl.Collator(locale, {});

    export const formatters = (lang: string, _options?: PolyglotConfig) => ({
        and: new Intl.ListFormat(lang, { style: "long", localeMatcher: "lookup", type: "conjunction" }).format,
        listUnit: new Intl.ListFormat(lang, { style: "long", localeMatcher: "lookup", type: "unit" }).format,
        or: new Intl.ListFormat(lang, { style: "long", localeMatcher: "lookup", type: "disjunction" }).format,
    });
}
