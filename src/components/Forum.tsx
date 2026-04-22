import { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FORUM_STRUCTURE, FORUM_CATEGORIES } from '../constants';
import { useI18n } from '../features/language/useLanguage';
import { Plus, X } from 'lucide-react';

export default function Forum({ onSelectQuestion }: { onSelectQuestion: (id: string) => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(FORUM_CATEGORIES[0]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState<string | 'All'>('All');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editReason, setEditReason] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'answered' | 'viewed'>('newest');
  
  const [view, setView] = useState<'main' | 'subcat' | 'list'>('main');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  const { t } = useI18n();

  const sortOptions = [
    { value: 'newest', label: t('Newest') },
    { value: 'answered', label: t('Most Answered') },
    { value: 'viewed', label: t('Most Viewed') },
  ];

  const editQuestion = async (id: string, oldData: any) => {
    if (!editedTitle || !editedDescription || !editReason) return;
    const qRef = doc(db, 'questions', id);
    await updateDoc(qRef, {
      title: editedTitle,
      description: editedDescription,
      imageUrls: imageUrls || [],
      editHistory: arrayUnion({
        timestamp: new Date().toISOString(),
        userId: auth.currentUser?.uid,
        userName: auth.currentUser?.displayName || 'Anonymous',
        reason: editReason,
        oldTitle: oldData.title,
        oldDescription: oldData.description,
        oldImageUrls: oldData.imageUrls || []
      })
    });
    setEditingQuestionId(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditReason('');
    setImageUrls([]);
  };

  const startEdit = (q: any) => {
    setEditingQuestionId(q.id);
    setEditedTitle(q.title);
    setEditedDescription(q.description);
    setImageUrls(q.imageUrls || []);
  };

  useEffect(() => {
    let q = query(collection(db, 'questions'), orderBy('timestamp', 'desc'));
    if (filter !== 'All') {
      q = query(q, where('category', '==', filter));
    }
    return onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (sortOption === 'answered') {
        docs.sort((a, b) => (b.answersCount || 0) - (a.answersCount || 0));
      } else if (sortOption === 'viewed') {
        docs.sort((a, b) => (b.views || 0) - (a.views || 0));
      }
      
      setQuestions(docs);
    });
  }, [filter, sortOption]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setImageUrls(prev => [...prev, dataUrl]);
          }
          setIsUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!title || !description) return;
    await addDoc(collection(db, 'questions'), {
      title,
      description,
      category,
      imageUrls,
      userId: auth.currentUser?.uid,
      userName: auth.currentUser?.displayName || 'Anonymous',
      timestamp: new Date().toISOString(),
    });
    setTitle('');
    setDescription('');
    setImageUrls([]);
    setIsFormVisible(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#2D6A4F]">{t('Community')}</h2>
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
          <div className="grid grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img src={url} alt="Post" className="w-full h-full object-cover rounded-2xl" />
                <button onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
              </div>
            ))}
            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-green-50">
              <Plus className="text-gray-400" />
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition">
            {FORUM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button disabled={isUploading} onClick={askQuestion} className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/10 hover:bg-[#1B4332] transition-colors">{isUploading ? t('Uploading...') : t('Post Question')}</button>
        </div>
      )}

      {view === 'main' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FORUM_STRUCTURE.map(cat => (
            <button key={cat.name} onClick={() => { setSelectedCategory(cat); setView('subcat'); }} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-left hover:border-[#2D6A4F]/20 transition-all">
              <h3 className="text-xl font-bold text-[#2D6A4F] mb-2">{t(cat.name)}</h3>
              <p className="text-sm text-gray-500">{cat.subcategories.length} {t('subcategories')}</p>
            </button>
          ))}
        </div>
      )}

      {view === 'subcat' && selectedCategory && (
        <div className="space-y-6">
          <button onClick={() => setView('main')} className="text-[#2D6A4F] font-bold">← {t('Back to Categories')}</button>
          <h2 className="text-2xl font-bold text-[#2D6A4F]">{t(selectedCategory.name)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedCategory.subcategories.map((sub: string) => (
              <button key={sub} onClick={() => { setSelectedSubcategory(sub); setView('list'); }} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm text-left hover:border-[#2D6A4F]/20 transition-all">
                <h4 className="text-lg font-bold text-gray-900">{t(sub)}</h4>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-6">
          <button onClick={() => setView('subcat')} className="text-[#2D6A4F] font-bold">← {t('Back to Subcategories')}</button>
          <h2 className="text-2xl font-bold text-[#2D6A4F]">{t(selectedSubcategory || '')}</h2>

          <div className="flex gap-2 mb-4">
            <label className="text-sm font-bold text-gray-700 self-center">{t('Sort by')}:</label>
            {sortOptions.map(option => (
              <button 
                key={option.value} 
                onClick={() => setSortOption(option.value as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${sortOption === option.value ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {questions.map(q => (
              <div key={q.id} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm transition-all group">
                {editingQuestionId === q.id ? (
                  <div className="space-y-4">
                    <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} placeholder={t('Title')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} placeholder={t('Description')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 min-h-[100px]" />
                    <div className="grid grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square">
                          <img src={url} alt="Post" className="w-full h-full object-cover rounded-2xl" />
                          <button onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
                        </div>
                      ))}
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-green-50">
                        <Plus className="text-gray-400" />
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                    <input value={editReason} onChange={(e) => setEditReason(e.target.value)} placeholder={t('Reason for edit')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    <div className="flex gap-2">
                      <button onClick={() => editQuestion(q.id, q)} className="bg-[#2D6A4F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#1B4332]">{t('Save')}</button>
                      <button onClick={() => setEditingQuestionId(null)} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold">{t('Cancel')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="cursor-pointer" onClick={() => onSelectQuestion(q.id)}>
                    {/* Header: User Info & Metadata */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                        {q.userName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{q.userName || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{new Date(q.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div className="ml-auto text-xs text-gray-400">
                        <span>{t('Views')}: {q.views || 0}</span>
                      </div>
                    </div>

                    {/* Content Section: Title & Image */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2D6A4F]">{q.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{q.description}</p>
                      </div>
                      {q.imageUrls && q.imageUrls.length > 0 && (
                        <img src={q.imageUrls[0]} alt="Post" className="w-24 h-24 object-cover rounded-xl" />
                      )}
                    </div>

                    {/* Footer: Actions */}
                    <div className="mt-4 flex items-center justify-between text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 rounded-full p-2"><Plus size={16} /></div>
                        <span className="text-sm font-bold">{q.answersCount || 0} {t('answers')}</span>
                      </div>
                      
                      {q.userId === auth.currentUser?.uid && (
                        <button onClick={(e) => { e.stopPropagation(); startEdit(q); }} className="text-xs text-blue-600 hover:underline">{t('Edit')}</button>
                      )}
                    </div>

                    {q.editHistory && q.editHistory.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-[10px] text-gray-500">
                        {t('Last edit')}: {q.editHistory[q.editHistory.length-1].userName}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
