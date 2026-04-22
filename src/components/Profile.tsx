import { useState } from 'react';
import { auth } from '../services/firebase';
import { useI18n } from '../features/language/useLanguage';
import ProfileDashboard from './profile_sections/ProfileDashboard';
import EditProfile from './profile_sections/EditProfile';
import LanguageSettings from './profile_sections/LanguageSettings';
import MyListings from './profile_sections/MyListings';
import ThemeSettings from './profile_sections/ThemeSettings';

export default function Profile() {
  const { t } = useI18n();
  const user = auth.currentUser;
  const [activeSection, setActiveSection] = useState<'dashboard' | 'edit' | 'language' | 'listings' | 'theme'>('dashboard');

  if (!user) return null;

  const renderSection = () => {
    switch (activeSection) {
      case 'edit': return <EditProfile onBack={() => setActiveSection('dashboard')} />;
      case 'language': return <LanguageSettings onBack={() => setActiveSection('dashboard')} />;
      case 'listings': return <MyListings onBack={() => setActiveSection('dashboard')} />;
      case 'theme': return <ThemeSettings onBack={() => setActiveSection('dashboard')} />;
      default: return <ProfileDashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {renderSection()}
    </div>
  );
}
