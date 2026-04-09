import Auth from './components/Auth';
import Router from './components/Router';
import { LanguageProvider as I18nProvider } from './features/language/LanguageProvider';
import { useProfile } from './features/profile/hooks/useProfile';
import { useI18n } from './features/language/useLanguage';

function AppContent() {
  const { user, loading } = useProfile();
  const { t } = useI18n();

  if (loading) return <div className="p-4">{t('Loading...')}</div>;

  if (!user) return <Auth />;

  return <Router />;
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
