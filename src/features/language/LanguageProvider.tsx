import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES } from './types';
import { getTranslation, DEFAULT_LANGUAGE } from './i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'app_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved as LanguageCode;
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => {
      const currentIndex = SUPPORTED_LANGUAGES.findIndex(l => l.code === prev);
      const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
      const nextLang = SUPPORTED_LANGUAGES[nextIndex].code;
      localStorage.setItem(STORAGE_KEY, nextLang);
      return nextLang;
    });
  }, []);

  const t = useCallback((key: string) => {
    return getTranslation(language, key);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
