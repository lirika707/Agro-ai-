import { useState } from 'react';
import Home from './Home';
import Diagnosis from '../features/diagnosis/DiagnosisPage';
import Forum from './Forum';
import QuestionDetail from './QuestionDetail';
import Marketplace from '../features/marketplace/MarketplacePage';
import Profile from './Profile';
import Layout from './Layout';

export type TabId = 'home' | 'diagnosis' | 'forum' | 'marketplace' | 'profile';

export default function Router() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const navigateTo = (tab: TabId) => {
    setActiveTab(tab);
    setSelectedQuestionId(null);
  };

  const renderContent = () => {
    if (activeTab === 'home') return <Home onNavigate={navigateTo} />;
    if (activeTab === 'diagnosis') return <Diagnosis />;
    if (activeTab === 'marketplace') return <Marketplace />;
    if (activeTab === 'profile') return <Profile />;
    if (selectedQuestionId) {
      return <QuestionDetail questionId={selectedQuestionId} onBack={() => setSelectedQuestionId(null)} />;
    }
    return <Forum onSelectQuestion={setSelectedQuestionId} />;
  };

  return (
    <Layout activeTab={activeTab} onNavigate={navigateTo}>
      {renderContent()}
    </Layout>
  );
}
