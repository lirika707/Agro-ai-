import { User, Package, LogOut, Edit2, Globe, MapPin, Languages, ChevronRight, HelpCircle, Phone, Palette } from 'lucide-react';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { useI18n } from '../../features/language/useLanguage';
import { useProfile } from '../../features/profile/hooks/useProfile';

export default function ProfileDashboard({ onNavigate }: { onNavigate: (section: 'dashboard' | 'edit' | 'language' | 'listings' | 'theme') => void }) {
  const { t } = useI18n();
  const { profile } = useProfile();
  const user = auth.currentUser;

  if (!user) return null;

  const menuItems = [
    { icon: Edit2, label: t('Edit Profile'), action: () => onNavigate('edit') },
    { icon: Package, label: t('My Listings'), action: () => onNavigate('listings') },
    { icon: Languages, label: t('Language'), action: () => onNavigate('language') },
    { icon: Palette, label: t('Theme'), action: () => onNavigate('theme') },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-blue-50 dark:bg-gray-900 min-h-screen p-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center py-8">
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-blue-100 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
          ) : (
            <User size={48} className="text-blue-400 dark:text-gray-500" />
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">{user.displayName || t('Anonymous Farmer')}</h2>
      </div>

      {/* Menu Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-xl">
                <item.icon size={20} />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ))}
      </div>

      {/* Support Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <button className="w-full flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-xl"><HelpCircle size={20} /></div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">{t('FAQ')}</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-xl"><Phone size={20} /></div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">{t('Support')}</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={() => signOut(auth)}
        className="w-full flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        <LogOut size={20} />
        {t('Sign Out')}
      </button>
    </div>
  );
}
