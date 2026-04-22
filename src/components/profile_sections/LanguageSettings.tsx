import { useI18n } from '../../features/language/useLanguage';
import { useProfile } from '../../features/profile/hooks/useProfile';
import { SUPPORTED_LANGUAGES } from '../../features/language/types';
import { Languages } from 'lucide-react';

export default function LanguageSettings({ onBack }: { onBack: () => void }) {
  const { t, setLanguage, language } = useI18n();
  const { updateProfile } = useProfile();

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <Languages size={24} className="text-[#2D6A4F]" />
        <h2 className="text-2xl font-bold">{t('Language')}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code);
              updateProfile({ language: lang.code });
            }}
            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
              language === lang.code ? 'bg-green-50 border-[#2D6A4F]' : 'bg-gray-50 border-gray-100'
            }`}
          >
            <span className="text-4xl">{lang.flag}</span>
            <span className="font-bold">{lang.name}</span>
          </button>
        ))}
      </div>
      <button onClick={onBack} className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">{t('Back')}</button>
    </div>
  );
}
