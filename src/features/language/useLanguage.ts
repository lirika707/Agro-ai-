import { useContext } from 'react';
import { LanguageContext } from './LanguageProvider';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Alias for easier migration if needed, but we'll update imports
export const useI18n = useLanguage;
