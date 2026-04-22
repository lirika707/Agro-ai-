import { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { useI18n } from '../features/language/useLanguage';

export default function QuestionDetail({ questionId, onBack }: { questionId: string, onBack: () => void }) {
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [answerText, setAnswerText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    const qRef = doc(db, 'questions', questionId);
    getDoc(qRef).then(doc => setQuestion({ id: doc.id, ...doc.data() }));

    const aQuery = query(collection(db, 'questions', questionId, 'answers'), orderBy('timestamp', 'asc'));
    return onSnapshot(aQuery, (snapshot) => {
      setAnswers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [questionId]);

  const postAnswer = async () => {
    if (!answerText) return;
    await addDoc(collection(db, 'questions', questionId, 'answers'), {
      text: answerText,
      userId: auth.currentUser?.uid,
      userName: auth.currentUser?.displayName || 'Anonymous',
      timestamp: new Date().toISOString(),
      replyTo: replyingTo,
      reactions: {},
    });
    setAnswerText('');
    setReplyingTo(null);
  };

  const handleReaction = async (answerId: string, emoji: string) => {
    const answerRef = doc(db, 'questions', questionId, 'answers', answerId);
    await updateDoc(answerRef, {
      [`reactions.${emoji}`]: arrayUnion(auth.currentUser?.uid)
    });
  };

  const handleDelete = async (answerId: string) => {
    await deleteDoc(doc(db, 'questions', questionId, 'answers', answerId));
  };

  const handleEdit = async (answerId: string) => {
    await updateDoc(doc(db, 'questions', questionId, 'answers', answerId), { text: editedText });
    setEditingAnswerId(null);
  };

  if (!question) return <div>{t('Loading...')}</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="text-[#2D6A4F] font-bold flex items-center gap-2 hover:underline transition-all">
        <span>←</span> {t('Back to Forum')}
      </button>
      
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {question.imageUrls && question.imageUrls.length > 0 && (
          <img src={question.imageUrls[0]} alt="Topic" className="w-full h-64 object-cover" />
        )}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{question.title}</h2>
          
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">
                {question.userName?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700">{question.userName || 'Anonymous'}</span>
            </div>
            
            <div className="text-sm text-gray-500">
              {new Date(question.timestamp).toLocaleDateString()}
            </div>
            <div className="text-sm font-bold text-[#2D6A4F] bg-green-50 px-3 py-1 rounded-full">
              {question.category}
            </div>
          </div>

          <p className="text-gray-800 leading-relaxed text-lg">{question.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 px-2">{t('Answers')} ({answers.length})</h3>
        {answers.map(a => (
          <div key={a.id} className={`bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm transition-all ${a.replyTo ? 'ml-8 border-l-4 border-l-[#2D6A4F]' : ''}`}>
            {a.replyTo && (
              <div className="bg-gray-50 p-3 rounded-xl mb-4 text-xs text-gray-500 border-l-2 border-[#2D6A4F]/30">
                <span className="font-bold text-[#2D6A4F]">{t('Replying to')}:</span> "{answers.find(ans => ans.id === a.replyTo)?.text.substring(0, 40)}..."
              </div>
            )}
            {editingAnswerId === a.id ? (
              <textarea 
                value={editedText} 
                onChange={(e) => setEditedText(e.target.value)} 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition min-h-[100px]" 
              />
            ) : (
              <p className="text-gray-800 leading-relaxed">{a.text}</p>
            )}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#2D6A4F]">{a.userName?.[0]}</span>
                </div>
                <p className="text-gray-500 text-xs font-medium">{a.userName}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 bg-gray-50 p-1 rounded-full border border-gray-100">
                  {['👍', '❤️', '😂'].map(emoji => (
                    <button 
                      key={emoji} 
                      onClick={() => handleReaction(a.id, emoji)} 
                      className="hover:bg-white p-1.5 rounded-full transition-all text-xs flex items-center gap-1"
                    >
                      <span>{emoji}</span>
                      <span className="font-bold text-[10px]">{a.reactions?.[emoji]?.length || 0}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 ml-2">
                  {a.userId === auth.currentUser?.uid && (
                    <>
                      {editingAnswerId === a.id ? (
                        <button onClick={() => handleEdit(a.id)} className="text-xs font-bold text-green-600 hover:underline">{t('Save')}</button>
                      ) : (
                        <button onClick={() => { setEditingAnswerId(a.id); setEditedText(a.text); }} className="text-xs font-bold text-[#2D6A4F] hover:underline">{t('Edit')}</button>
                      )}
                      <button onClick={() => handleDelete(a.id)} className="text-xs font-bold text-red-500 hover:underline">{t('Delete')}</button>
                    </>
                  )}
                  <button onClick={() => setReplyingTo(a.id)} className="text-xs font-bold text-[#2D6A4F] hover:underline">{t('Reply')}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#2D6A4F]">{t('Your Answer')}</h3>
          {replyingTo && (
            <button onClick={() => setReplyingTo(null)} className="text-xs text-red-500 font-bold hover:underline">
              {t('Cancel Reply')}
            </button>
          )}
        </div>
        {replyingTo && (
          <div className="bg-green-50 p-3 rounded-xl text-xs text-[#2D6A4F] border-l-4 border-[#2D6A4F]">
            {t('Replying to')}: "{answers.find(a => a.id === replyingTo)?.text.substring(0, 40)}..."
          </div>
        )}
        <textarea 
          value={answerText} onChange={(e) => setAnswerText(e.target.value)}
          placeholder={t('Share your knowledge...')} 
          className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition min-h-[120px]"
        />
        <button 
          onClick={postAnswer} 
          className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/10 hover:bg-[#1B4332] transition-colors"
        >
          {replyingTo ? t('Post Reply') : t('Post Answer')}
        </button>
      </div>
    </div>
  );
}
