import React from 'react';
import { useI18n } from '../features/language/useLanguage';
import { Bot, ShoppingBag, TrendingUp, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../services/firebase';

interface HomeProps {
  onNavigate: (tab: 'diagnosis' | 'forum' | 'marketplace' | 'profile') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useI18n();
  const user = auth.currentUser;

  const stats = [
    {
      id: 'diagnosis',
      label: t('DIAGNOSES'),
      value: '0',
      icon: <Bot size={24} className="text-white" />,
      color: 'bg-blue-500',
    },
    {
      id: 'marketplace',
      label: t('LISTINGS'),
      value: '0',
      icon: <ShoppingBag size={24} className="text-white" />,
      color: 'bg-orange-500',
    },
    {
      id: 'market-price',
      label: t('MARKET PRICE'),
      value: t('Live'),
      icon: <TrendingUp size={24} className="text-white" />,
      color: 'bg-purple-500',
    },
    {
      id: 'alerts',
      label: t('ALERTS'),
      value: '0',
      icon: <AlertCircle size={24} className="text-white" />,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#2D6A4F] to-[#40916C] p-8 md:p-12 text-white shadow-2xl shadow-green-900/20"
      >
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {t('Assalomu alaykum!')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-md leading-relaxed">
            {t('Welcome back to AgroSmart. Your smart assistant for a better harvest.')}
          </p>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </motion.div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => stat.id !== 'market-price' && stat.id !== 'alerts' && onNavigate(stat.id as any)}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-green-50 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm text-[#2D6A4F]">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[#2D6A4F]">{t('Need help with your crops?')}</h3>
            <p className="text-sm text-green-700/70">{t('Our AI assistant is ready to help.')}</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('diagnosis')}
          className="w-full md:w-auto bg-[#2D6A4F] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1B4332] transition-colors shadow-lg shadow-green-900/20"
        >
          {t('Start Diagnosis')}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
