import React from 'react';
import { Home, Stethoscope, ShoppingBag, MessageSquare, User, ShieldCheck } from 'lucide-react';
import { useI18n } from '../features/language/useLanguage';
import AdminGuard from '../features/profile/components/AdminGuard';
import EGINLogo from './EGINLogo';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: 'home' | 'diagnosis' | 'forum' | 'marketplace' | 'profile';
  onNavigate?: (tab: 'home' | 'diagnosis' | 'forum' | 'marketplace' | 'profile') => void;
}

export default function Layout({ children, activeTab, onNavigate }: LayoutProps) {
  const { t } = useI18n();

  const navItems = [
    { id: 'home', label: t('Home'), icon: <Home size={24} /> },
    { id: 'diagnosis', label: t('Diagnosis'), icon: <Stethoscope size={24} /> },
    { id: 'marketplace', label: t('Market'), icon: <ShoppingBag size={24} /> },
    { id: 'forum', label: t('Community'), icon: <MessageSquare size={24} /> },
    { id: 'profile', label: t('Profile'), icon: <User size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      {onNavigate && (
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-6 fixed h-full">
          <div className="mb-10 px-2">
            <EGINLogo />
          </div>
          
          <nav className="flex-grow space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#2D6A4F] text-white shadow-lg shadow-green-900/20' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <AdminGuard>
              <button
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all text-purple-600 hover:bg-purple-50"
                onClick={() => alert('Admin Panel Access Granted')}
              >
                <ShieldCheck size={24} />
                <span>{t('Admin Panel')}</span>
              </button>
            </AdminGuard>
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100">
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-grow ${onNavigate ? 'md:ml-64' : ''} pb-24 md:pb-8`}>
        <div className={`${activeTab === 'diagnosis' ? 'w-full' : 'max-w-5xl mx-auto'} p-4 md:p-10`}>
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <EGINLogo />
          </div>
          
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10 min-h-[calc(100vh-120px)]">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      {onNavigate && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-3 flex justify-around items-center z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${
                activeTab === item.id ? 'text-[#2D6A4F]' : 'text-gray-400'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${activeTab === item.id ? 'bg-green-50' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
          <AdminGuard>
            <button
              onClick={() => alert('Admin Panel Access Granted')}
              className="flex flex-col items-center gap-1 min-w-[64px] transition-all text-purple-400"
            >
              <div className="p-1 rounded-lg transition-all">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{t('Admin')}</span>
            </button>
          </AdminGuard>
        </nav>
      )}
    </div>
  );
}
