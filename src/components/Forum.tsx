import { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { FORUM_CATEGORIES } from '../constants';
import { useI18n } from '../features/language/useLanguage';

export default function Forum({ onSelectQuestion }: { onSelectQuestion: (id: string) => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(FORUM_CATEGORIES[0]);
  const [filter, setFilter] = useState<string | 'All'>('All');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    let q = query(collection(db, 'questions'), orderBy('timestamp', 'desc'));
    if (filter !== 'All') {
      q = query(q, where('category', '==', filter));
    }
    return onSnapshot(q, (snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [filter]);

  const askQuestion = async () => {
    if (!title || !description) return;
    await addDoc(collection(db, 'questions'), {
      title,
      description,
      category,
      userId: auth.currentUser?.uid,
      userName: auth.currentUser?.displayName || 'Anonymous',
      timestamp: new Date().toISOString(),
    });
    setTitle('');
    setDescription('');
    setIsFormVisible(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#2D6A4F]">{t('Community Forum')}</h2>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-[#2D6A4F] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-green-900/10 hover:bg-[#1B4332] transition-colors flex items-center gap-2"
        >
          {isFormVisible ? t('Cancel') : t('Ask a Question')}
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-[#2D6A4F]">{t('Ask a Question')}</h3>
          <input 
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={t('Title')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition"
          />
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder={t('Description')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition min-h-[120px]"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition">
            {FORUM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={askQuestion} className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/10 hover:bg-[#1B4332] transition-colors">{t('Post Question')}</button>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setFilter('All')} className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${filter === 'All' ? 'bg-[#2D6A4F] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100 hover:border-[#2D6A4F]'}`}>{t('All')}</button>
        {FORUM_CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${filter === c ? 'bg-[#2D6A4F] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100 hover:border-[#2D6A4F]'}`}>{c}</button>
        ))}
      </div>

      <div className="grid gap-4">
        {questions.map(q => (
          <div key={q.id} onClick={() => onSelectQuestion(q.id)} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-[#2D6A4F]/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-[#2D6A4F] bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">{q.category}</span>
              <p className="text-xs text-gray-400">{new Date(q.timestamp).toLocaleDateString()}</p>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2D6A4F] transition-colors">{q.title}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold">{q.userName?.[0]}</span>
              </div>
              <span>{q.userName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
