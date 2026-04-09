import React from 'react';
import { Bot, User, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { Message } from '../types';

interface DiagnosisResultProps {
  messages: (Message & { id: string })[];
  loading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  deleteMessage: (messageId: string) => void;
  t: (key: string) => string;
}

export function DiagnosisResult({ messages, loading, scrollRef, deleteMessage, t }: DiagnosisResultProps) {
  return (
    <div 
      ref={scrollRef as any}
      className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#F8F9FA] min-w-0"
    >
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
          <Bot size={48} className="text-[#2D6A4F]" />
          <p className="max-w-xs text-sm font-medium text-[#2D6A4F]">
            {t('I am your expert farmer assistant. How can I help you today?')}
          </p>
        </div>
      )}

      <AnimatePresence initial={false}>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} min-w-0`}
          >
            <div className={`flex gap-3 max-w-[90%] md:max-w-[70%] lg:max-w-[60%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} min-w-0`}>
              <div className={`p-4 rounded-[20px] shadow-sm relative group max-w-full min-w-0 ${
                m.role === 'user' 
                  ? 'bg-[#00A859] text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}>
                <button
                  onClick={() => deleteMessage(m.id)}
                  className={`absolute ${m.role === 'user' ? '-left-8' : '-right-8'} top-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition ${
                    m.role === 'user' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-400 hover:text-red-500'
                  }`}
                  title={t('Delete Message')}
                >
                  <Trash2 size={16} />
                </button>
                {m.image && (
                  <img src={m.image} alt="Uploaded" className="rounded-xl mb-3 max-w-full h-auto border border-white/20" />
                )}
                <div className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-[#2D6A4F] prose-ul:list-disc prose-ul:pl-4 prose-li:my-1 prose-hr:border-gray-200 break-words overflow-hidden ${m.role === 'user' ? 'prose-invert' : ''}`}>
                  <Markdown>{m.text}</Markdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {loading && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start min-w-0"
        >
          <div className="flex gap-3 max-w-[85%] flex-row min-w-0">
            <div className="p-4 rounded-[20px] shadow-sm bg-white text-gray-800 border border-gray-100 rounded-bl-none flex items-center gap-3 max-w-full min-w-0">
              <Loader2 size={16} className="animate-spin text-[#00A859]" />
              <span className="text-sm font-medium text-gray-600 truncate">{t('Thinking...')}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
