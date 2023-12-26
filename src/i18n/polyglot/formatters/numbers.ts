import { LocaleCurrencyCode, localeCurrencyMap } from "~/i18n/polyglot/types/currency";
import { PolyglotConfig } from "~/i18n/polyglot/types/types";

export namespace Numbers {
    const getCountryCode = (localeString: string): LocaleCurrencyCode => {
        const components = localeString.split("_");
        if (components.length === 2) return components.pop()?.toUpperCase() as LocaleCurrencyCode;
        const parts = localeString.split("-");
        if (parts.length === 2) return parts.pop()?.toUpperCase() as LocaleCurrencyCode;
        return localeString.toUpperCase() as LocaleCurrencyCode;
    };

    const getCurrency = function (locale: string) {
        const countryCode = getCountryCode(locale);
        return countryCode in localeCurrencyMap ? localeCurrencyMap[countryCode] : null;
    };

    export const formatters = (lang: string, options?: PolyglotConfig) => ({
        number: new Intl.NumberFormat(lang, options?.number).format,
        percent: new Intl.NumberFormat(lang, { style: "percent", ...options?.percent }).format,
        money: new Intl.NumberFormat(lang, {
            style: "currency",
            currency: getCurrency(lang) as string,
            ...options?.money,
        }).format,
    });

    export const unitProxyHandler = (lang: string, options?: PolyglotConfig) => (target: any, p: string | symbol) => {
        if (p in target) return target[p];
        try {
            const assign = new Intl.NumberFormat(lang, { unit: p as string, style: "unit", ...options?.unit }).format;
            target[p] = assign;
            return assign;
        } catch (e) {
            return undefined;
        }
    };
}
