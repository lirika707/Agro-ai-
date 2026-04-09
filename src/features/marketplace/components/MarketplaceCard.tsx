import { Product, ViewMode } from '../types';
import { useI18n } from '../../language/useLanguage';

interface MarketplaceCardProps {
  product: Product;
  viewMode: ViewMode;
  onClick: (product: Product) => void;
}

export function MarketplaceCard({ product, viewMode, onClick }: MarketplaceCardProps) {
  const { t } = useI18n();

  return (
    <div 
      onClick={() => onClick(product)} 
      className={`bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer flex group relative ${
        viewMode === 'grid' ? 'flex-col' : 'flex-row h-48'
      }`}
    >
      {product.status === 'sold' && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full z-10 uppercase tracking-widest shadow-lg">
          {t('Sold')}
        </div>
      )}
      <div className={`${viewMode === 'grid' ? 'w-full aspect-square' : 'w-48 h-full'} overflow-hidden`}>
        <img 
          src={product.imageUrls?.[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          referrerPolicy="no-referrer" 
        />
      </div>
      <div className={`p-6 flex flex-col flex-grow ${viewMode === 'list' ? 'justify-center' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <p className="text-[#2D6A4F] font-black text-xl">{product.price} сом</p>
          {viewMode === 'grid' && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {new Date(product.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#2D6A4F] transition-colors">
          {product.name}
        </h4>
        {viewMode === 'list' && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-gray-400 text-xs font-medium">📍 {product.location}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400">👁 {product.views || 0}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
              {t(product.category)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
