import { en } from './translations/en';
import { ru } from './translations/ru';
import { ky } from './translations/ky';
import { uz } from './translations/uz';
import { LanguageCode, TranslationMap } from './types';

export const translations: Record<LanguageCode, TranslationMap> = {
  en,
  ru,
  ky,
  uz,
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const getTranslation = (lang: LanguageCode, key: string): string => {
  return translations[lang][key] || translations[DEFAULT_LANGUAGE][key] || key;
};
