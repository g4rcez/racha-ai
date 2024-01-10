import { Datetime } from "~/i18n/polyglot/formatters/datetime";
import { Lists } from "~/i18n/polyglot/formatters/lists";
import { createFormatters, Formatters, parse } from "~/i18n/polyglot/parser";
import { Locales } from "the-mask-input";
import {
  ExtractVariables,
  GenericTranslationFn,
  PolyglotConfig,
  PolyglotFullConfig,
  Timezone,
  TranslationMap,
} from "~/i18n/polyglot/types/types";
import { Is } from "~/lib/is";

export const createPolyglotNative = <
  Locale extends Locales,
  Map extends (formatters: Formatters) => TranslationMap,
>(
  language: Locale,
  map: Map,
) => ({ map, language }) as const;

export type InferNativeLanguage<
  Config extends ReturnType<typeof createPolyglotNative>,
> = (formatters: Formatters) => ReturnType<Config["map"]>;

export const createPolyglot = <
  Config extends ReturnType<typeof createPolyglotNative>,
  Translations extends Partial<
    Record<
      Locales,
      | (() => Promise<{
          default: (formatters: Formatters) => ReturnType<Config["map"]>;
        }>)
      | ((formatters: Formatters) => ReturnType<Config["map"]>)
    >
  >,
>(
  initialConfig: Config,
  translations?: Translations,
  options: PolyglotFullConfig = {},
) => {
  type LanguageMap = ReturnType<Config["map"]>;
  type DefaultLanguage = Config["language"];
  type Languages = keyof Translations | DefaultLanguage;
  type Comparator = ReturnType<typeof Lists.comparator>;
  type AcceptedLanguages = keyof Translations | DefaultLanguage;
  type Formatters = ReturnType<typeof createFormatters>;

  type CachedConfig = {
    compare: Comparator;
    format: Formatters;
    language: keyof Translations | DefaultLanguage;
    map: TranslationMap;
    timezone: Timezone;
  };

  const defaultFormatters = createFormatters(initialConfig.language, options);

  const defaultMap: TranslationMap = initialConfig.map(defaultFormatters);

  const defaultLanguage: AcceptedLanguages = initialConfig.language;

  const cache = new Map<AcceptedLanguages, CachedConfig>();

  const config = {
    compare: Lists.comparator(defaultLanguage),
    format: defaultFormatters,
    language: defaultLanguage,
    map: defaultMap,
  };

  const setCachedConfig = (
    language: AcceptedLanguages,
    comparator: Comparator,
    format: Formatters,
    map: TranslationMap,
    timezone: Timezone,
  ) => {
    const result = { map, compare: comparator, format, language, timezone };
    cache.set(language, result);
    return result;
  };

  const alias = Object.keys(config.map).reduce(
    (acc, el) => ({ ...acc, [el]: el }),
    {} as { [K in keyof LanguageMap]: K },
  );

  const fetchLanguage = async (
    newLanguage: Languages,
    extraOptions?: PolyglotConfig,
  ) => {
    const { languages } = options;
    const formatters = createFormatters(newLanguage as string, {
      ...options,
      ...languages?.[newLanguage],
      ...extraOptions,
    });
    const result =
      newLanguage === initialConfig.language
        ? defaultMap
        : await (translations?.[newLanguage] as any)?.(formatters);
    if (Is.function(result))
      return { format: formatters, map: result(formatters) };
    const map = result?.default ? result.default(formatters) : result;
    return { map, format: formatters };
  };

  const getFromLanguageMap = async <
    Language extends Locales,
    V extends keyof LanguageMap,
  >(
    ...[
      language,
      key,
      props,
      options,
    ]: LanguageMap[V] extends GenericTranslationFn
      ? [
          language: Language,
          key: V,
          props: Parameters<LanguageMap[V]>[0],
          options?: PolyglotFullConfig,
        ]
      : [language: Language, key: V, options?: PolyglotFullConfig]
  ) => {
    if (language === initialConfig.language) {
      const prop = config.map[key as string];
      return Is.function(prop) ? prop(props, options) : prop;
    }
    const result = await fetchLanguage(language, options);
    const prop = result.map[key as string];
    return Is.function(prop) ? prop(props) : prop;
  };

  const createLanguage = async (
    newLanguage: keyof Translations | DefaultLanguage,
    extraOptions?: PolyglotFullConfig,
  ) => {
    if (
      newLanguage !== initialConfig.language &&
      !Is.keyof(translations || {}, newLanguage as string)
    ) {
      throw new Error("Language not found");
    }
    const cached = cache.get(newLanguage);
    if (cached !== undefined) return cached;
    const result = await fetchLanguage(newLanguage, extraOptions);
    const timezone = Datetime.getTz();
    return setCachedConfig(
      newLanguage,
      Lists.comparator(newLanguage as string),
      result.format,
      result.map,
      timezone,
    );
  };

  const get = <V extends keyof LanguageMap>(
    ...[key, props, options]: LanguageMap[V] extends GenericTranslationFn
      ? [
          key: V,
          props: Parameters<LanguageMap[V]>[0],
          options?: PolyglotFullConfig,
        ]
      : [
          key: V,
          options?: PolyglotFullConfig & {
            variables: LanguageMap[V] extends string
              ? ExtractVariables<LanguageMap[V]>
              : Partial<Record<string, unknown>>;
          },
        ]
  ) => {
    const conf = config.map;
    const vars = { ...props, ...(props as any)?.variables };
    if (Is.keyof(conf, key as string)) {
      const prop = conf[key as string];
      const text = Is.function(prop) ? prop(vars, options) : prop;
      return parse(text, vars ?? {}, config.format);
    }
    if (options?.fallback) {
      const prop = conf[options.fallback];
      return parse(
        Is.function(prop) ? prop(vars, options) : prop,
        vars ?? {},
        config.format,
      );
    }
    throw new Error(`Property ${key as string} not exist in`, conf);
  };

  const setLanguage = async (
    newLanguage: keyof Translations | DefaultLanguage,
    extraOptions?: PolyglotFullConfig,
  ) => {
    if (
      newLanguage !== initialConfig.language &&
      !Is.keyof(translations || {}, newLanguage as string)
    ) {
      throw new Error("Language not found");
    }
    const result = await fetchLanguage(newLanguage, extraOptions);
    config.language = newLanguage;
    config.format = result.format;
    config.map = result.map;
    config.compare = Lists.comparator(newLanguage as string);
    return config;
  };

  return {
    alias,
    createLanguage,
    compare: config.compare,
    format: config.format,
    get,
    parse: <P extends object>(text: string, params: P) =>
      parse(text, params, config.format),
    getFromLanguageMap,
    map: config.map,
    setLanguage,
    get language() {
      return config.language;
    },
  };
};

export type InferLanguages<
  Config extends ReturnType<typeof createPolyglot<any, any>>,
> = NonNullable<Parameters<Config["setLanguage"]>[0]>;
