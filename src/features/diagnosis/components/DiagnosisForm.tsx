import React from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface DiagnosisFormProps {
  input: string;
  setInput: (val: string) => void;
  image: string | null;
  setImage: (val: string | null) => void;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
  t: (key: string) => string;
}

export function DiagnosisForm({
  input, setInput, image, setImage, loading, fileInputRef,
  handleImageUpload, sendMessage, t
}: DiagnosisFormProps) {
  return (
    <div className="p-6 bg-white border-t border-gray-100">
      {image && (
        <div className="relative inline-block mb-4">
          <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-[#2D6A4F] shadow-md" />
          <button 
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition"
          >
            <X size={12} />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-[#2D6A4F] hover:bg-green-50 rounded-full transition"
          title={t('Upload Image')}
        >
          <ImageIcon size={24} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t('Ask me anything about farming...')}
          className="flex-grow p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition"
        />
        <button 
          onClick={sendMessage}
          disabled={loading || (!input.trim() && !image)}
          className="bg-[#2D6A4F] text-white p-4 rounded-2xl shadow-lg hover:bg-[#1B4332] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
        </button>
      </div>
    </div>
  );
}
