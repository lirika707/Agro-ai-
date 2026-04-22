import { useState, useEffect } from 'react';
import { useI18n } from '../../features/language/useLanguage';
import { Sun, Moon, Palette } from 'lucide-react';

export default function ThemeSettings({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = (dark: boolean) => {
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <Palette size={24} className="text-[#2D6A4F] dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Theme')}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => toggleTheme(false)}
          className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
            !isDarkMode ? 'bg-blue-50 border-[#2D6A4F] dark:border-blue-400' : 'bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600'
          }`}
        >
          <Sun size={40} className="text-yellow-500" />
          <span className="font-bold text-gray-900 dark:text-white">{t('Light Mode')}</span>
        </button>
        <button
          onClick={() => toggleTheme(true)}
          className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
            isDarkMode ? 'bg-blue-900/20 border-blue-400' : 'bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600'
          }`}
        >
          <Moon size={40} className="text-blue-400" />
          <span className="font-bold text-gray-900 dark:text-white">{t('Dark Mode')}</span>
        </button>
      </div>
      <button onClick={onBack} className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-2xl font-bold">{t('Back')}</button>
    </div>
  );
}
