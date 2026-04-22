import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import Layout from './Layout';
import { useI18n } from '../features/language/useLanguage';
import EGINLogo from './EGINLogo';

export default function Auth() {
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error.message || t("Failed to sign in with Google"));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <EGINLogo className="mb-8 scale-150" />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSignIn}
          className="bg-[#5A5A40] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          {t('Sign in with Google')}
        </button>
      </div>
    </Layout>
  );
}
