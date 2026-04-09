import React from 'react';
import { Bot, Sparkles, Trash2 } from 'lucide-react';
import { useDiagnosis } from './hooks/useDiagnosis';
import { DiagnosisResult } from './components/DiagnosisResult';
import { DiagnosisForm } from './components/DiagnosisForm';

export default function DiagnosisPage() {
  const {
    messages,
    input,
    setInput,
    image,
    setImage,
    loading,
    scrollRef,
    fileInputRef,
    handleImageUpload,
    sendMessage,
    deleteMessage,
    clearHistory,
    t
  } = useDiagnosis();

  return (
    <div className="flex flex-col h-full bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold leading-tight">{t('Farmer AI')}</h2>
            <p className="text-xs text-white/70">{t('Expert Agricultural Assistant')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearHistory}
            className="p-2 hover:bg-white/20 rounded-full transition"
            title={t('Clear History')}
          >
            <Trash2 size={20} />
          </button>
          <Sparkles className="text-yellow-400 animate-pulse" size={20} />
        </div>
      </div>

      {/* Chat Area */}
      <DiagnosisResult 
        messages={messages}
        loading={loading}
        scrollRef={scrollRef}
        deleteMessage={deleteMessage}
        t={t}
      />

      {/* Input Area */}
      <DiagnosisForm 
        input={input}
        setInput={setInput}
        image={image}
        setImage={setImage}
        loading={loading}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
        sendMessage={sendMessage}
        t={t}
      />
    </div>
  );
}
