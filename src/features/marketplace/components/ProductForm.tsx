import { PRODUCT_CATEGORIES } from '../../../constants';
import { useI18n } from '../../language/useLanguage';
import { Plus, X } from 'lucide-react';
import { Product } from '../types';

interface ProductFormProps {
  editingProduct: Product | null;
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  imageUrls: string[];
  setImageUrls: (val: string[] | ((prev: string[]) => string[])) => void;
  category: string;
  setCategory: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  condition: string;
  setCondition: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDetectLocation: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProductForm({
  editingProduct, name, setName, price, setPrice, description, setDescription,
  imageUrls, setImageUrls, category, setCategory, location, setLocation,
  condition, setCondition, phone, setPhone, isUploading,
  onFileUpload, onDetectLocation, onSave, onCancel
}: ProductFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-8 p-4 md:p-8 bg-[#F8F9FA] min-h-screen">
      <button 
        onClick={onCancel}
        className="text-[#2D6A4F] font-bold hover:underline mb-4 inline-block flex items-center gap-2"
      >
        <span>←</span> {t('Back to Marketplace')}
      </button>
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-2xl font-bold text-[#2D6A4F]">{editingProduct ? t('Edit Product') : t('Add Product')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">{t('Product Name')}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('Product Name')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">{t('Price')} (som)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={t('Price')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition" />
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">{t('Description')}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('Description')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition min-h-[120px]" />
          </div>
          <div className="col-span-full space-y-4">
            <label className="text-sm font-bold text-gray-700 ml-2">{t('Product Images')} *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover rounded-[24px] border border-gray-100" />
                  <button 
                    onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[24px] cursor-pointer hover:bg-green-50 hover:border-[#2D6A4F]/30 transition group">
                <Plus size={24} className="text-gray-400 group-hover:text-[#2D6A4F] mb-2" />
                <span className="text-xs text-gray-500 group-hover:text-[#2D6A4F] font-bold">{t('Add Image')}</span>
                <input type="file" accept="image/*" onChange={onFileUpload} className="hidden" />
              </label>
            </div>
            {isUploading && <p className="text-sm text-[#2D6A4F] font-bold animate-pulse">{t('Uploading image...')}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">{t('Category')}</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition">
              {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{t(c)}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">{t('Location')}</label>
            <div className="flex gap-2">
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('Location')} className="flex-grow p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition" />
              <button onClick={onDetectLocation} className="bg-green-50 text-[#2D6A4F] px-4 py-2 rounded-2xl font-bold border border-[#2D6A4F]/20 hover:bg-green-100 transition">{t('Detect')}</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">{t('Condition')}</label>
            <input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder={t('Condition')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">{t('Phone')}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('Phone')} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition" />
          </div>
        </div>
        <button disabled={isUploading} onClick={onSave} className={`w-full text-white py-5 rounded-[24px] font-bold text-lg shadow-lg shadow-green-900/10 transition ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2D6A4F] hover:bg-[#1B4332]'}`}>
          {isUploading ? t('Uploading image...') : (editingProduct ? t('Save Changes') : t('Add Product'))}
        </button>
      </div>
    </div>
  );
}
