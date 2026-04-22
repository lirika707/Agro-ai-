import React, { useState, useMemo } from 'react';
import { Bot, Sparkles, Trash2, Search, Calendar } from 'lucide-react';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesSearch = m.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !dateFilter || new Date(m.timestamp).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
      return matchesSearch && matchesDate;
    });
  }, [messages, searchTerm, dateFilter]);

  return (
    <div className="flex flex-col h-full bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] p-6 text-white">
        <div className="flex items-center justify-between mb-4">
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
        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
            <input 
              type="text" 
              placeholder={t('Search messages...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/20 rounded-xl text-sm placeholder-white/60 outline-none"
            />
          </div>
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-white/20 rounded-xl text-sm outline-none"
          />
        </div>
      </div>

      {/* Chat Area */}
      <DiagnosisResult 
        messages={filteredMessages}
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
