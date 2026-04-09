import { useState, useEffect, useRef } from 'react';
import { auth } from '../../../services/firebase';
import { useI18n } from '../../language/useLanguage';
import { Message } from '../types';
import { DiagnosisService } from '../services/diagnosis.service';
type MessageWithId = Message & { id: string };

export function useDiagnosis() {
  const [messages, setMessages] = useState<MessageWithId[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubscribe = DiagnosisService.getHistory(auth.currentUser.uid, setMessages);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !image) return;
    if (!auth.currentUser) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      image: image || undefined
    };

    // Save user message to Firestore
    await DiagnosisService.saveMessage(auth.currentUser.uid, userMessage);

    setInput('');
    setImage(null);
    setLoading(true);

    try {
      const systemInstruction = `You are an expert farmer and agronomist assistant. 
      Your goal is to help users with their farming questions, plant diseases, and agricultural advice.
      Be practical, helpful, and use a friendly but professional farmer's tone.
      If an image is provided, analyze it for plant diseases.
      If it's a disease diagnosis, always provide:
      1. Plant Name
      2. Disease Name
      3. Scientific Name
      4. Treatment
      5. Medicine/Pesticide recommendations
      6. Dosage and Frequency
      
      Format your response using Markdown for better readability. 
      If you are diagnosing a disease, use a clear structure or table.`;

      const aiResponse = await DiagnosisService.generateAIResponse(messages, userMessage, systemInstruction);

      // Save model response to Firestore
      await DiagnosisService.saveMessage(auth.currentUser.uid, {
        role: 'model',
        text: aiResponse.text,
        plantName: aiResponse.plantName,
        diseaseName: aiResponse.diseaseName,
        scientificName: aiResponse.scientificName
      });

    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { id: 'error', role: 'model', text: t('Sorry, I encountered an error. Please try again.') }]);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    await DiagnosisService.deleteMessage(messageId);
  };

  const clearHistory = async () => {
    if (!auth.currentUser) return;
    await DiagnosisService.clearHistory(auth.currentUser.uid);
  };

  return {
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
  };
}
