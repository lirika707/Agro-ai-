export type LanguageCode = 'en' | 'ru' | 'ky' | 'uz';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
];

export type TranslationMap = Record<string, string>;
