import { auth } from '../../../services/firebase';
import { useI18n } from '../../language/useLanguage';
import { Bell, List, Maximize2, MessageCircle, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Review } from '../types';

interface ProductDetailProps {
  product: Product;
  products: Product[];
  reviews: Review[];
  currentImageIndex: number;
  setCurrentImageIndex: (idx: number) => void;
  isZoomed: boolean;
  setIsZoomed: (val: boolean) => void;
  reviewRating: number;
  setReviewRating: (val: number) => void;
  reviewComment: string;
  setReviewComment: (val: string) => void;
  isReporting: boolean;
  setIsReporting: (val: boolean) => void;
  reportReason: string;
  setReportReason: (val: string) => void;
  onBack: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onMarkAsSold: () => void;
  onSubmitReview: () => void;
  onSubmitReport: () => void;
  onProductClick: (product: Product) => void;
}

export function ProductDetail({
  product, products, reviews, currentImageIndex, setCurrentImageIndex,
  isZoomed, setIsZoomed, reviewRating, setReviewRating, reviewComment, setReviewComment,
  isReporting, setIsReporting, reportReason, setReportReason,
  onBack, onEdit, onDelete, onMarkAsSold, onSubmitReview, onSubmitReport, onProductClick
}: ProductDetailProps) {
  const { t } = useI18n();

  const paginate = (newDirection: number) => {
    if (!product.imageUrls || product.imageUrls.length <= 1) return;
    const newIndex = currentImageIndex + newDirection;
    if (newIndex < 0) {
      setCurrentImageIndex(product.imageUrls.length - 1);
    } else if (newIndex >= product.imageUrls.length) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(newIndex);
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-900">
          <X size={24} />
        </button>
        <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
        <div className="flex gap-4 text-gray-600">
          <MessageCircle size={24} />
          <ShoppingCart size={24} />
          <Bell size={24} />
        </div>
      </div>
      
      {/* Product Image */}
      <div className="aspect-square relative">
        <img 
          src={product.imageUrls?.[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="bg-white/80 p-2 rounded-full shadow-sm"><Maximize2 size={20} /></button>
          <button className="bg-white/80 p-2 rounded-full shadow-sm"><X size={20} /></button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">{t('In Stock')}</span>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase">{t(product.category)}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <div className="flex items-center text-gray-500 text-sm gap-1">
              <span>⭐ 4.5 (124 reviews)</span>
              <span>•</span>
              <span>{product.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-600 font-bold text-2xl">{product.price} сом/кг</p>
            <p className="text-gray-500 text-sm">10 тонн</p>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-grow">
            <p className="font-bold text-gray-900">Бакыт Токтогулов</p>
            <p className="text-gray-500 text-sm">Официальный поставщик • 5 лет на рынке</p>
          </div>
          <span className="text-yellow-500 font-bold">⭐ 4.6</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100">
            <MessageCircle className="text-blue-500" />
            <span className="text-xs font-bold text-gray-700">{t('Call')}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100">
            <MessageCircle className="text-green-500" />
            <span className="text-xs font-bold text-gray-700">{t('Chat')}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100">
            <MessageCircle className="text-gray-500" />
            <span className="text-xs font-bold text-gray-700">{t('Profile')}</span>
          </button>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('Reviews')}</h3>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400 italic text-sm">{t('No reviews yet')}</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900 text-sm">{review.userName}</span>
                    <span className="text-yellow-500 font-bold text-sm">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
