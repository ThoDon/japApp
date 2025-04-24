import "server-only";
import { Locale, i18n } from "./i18nConfig";

const dictionaries = i18n.locales.reduce((acc, locale) => {
  acc[locale] = () =>
    import(`./dictionaries/${locale}.json`).then((module) => module.default);
  return acc;
}, {} as Record<Locale, () => Promise<Record<string, string>>>);

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
