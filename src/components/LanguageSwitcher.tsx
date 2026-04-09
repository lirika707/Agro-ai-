import { useLanguage } from '../features/language/useLanguage';
import { SUPPORTED_LANGUAGES } from '../features/language/types';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex gap-1">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
            language === lang.code
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-gray-400 hover:bg-gray-50'
          }`}
          title={lang.name}
        >
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
