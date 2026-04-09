import { Product, ViewMode } from '../types';
import { MarketplaceCard } from './MarketplaceCard';
import EmptyState from '../../../components/ui/EmptyState';
import { useI18n } from '../../language/useLanguage';

interface MarketplaceListProps {
  products: Product[];
  viewMode: ViewMode;
  onProductClick: (product: Product) => void;
}

export function MarketplaceList({ products, viewMode, onProductClick }: MarketplaceListProps) {
  const { t } = useI18n();

  if (products.length === 0) {
    return (
      <EmptyState 
        title={t('No products found')}
        description={t('Try adjusting your filters or search to find what you are looking for.')}
      />
    );
  }

  return (
    <div className={`grid gap-8 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'grid-cols-1'
    }`}>
      {products.map(product => (
        <MarketplaceCard 
          key={product.id} 
          product={product} 
          viewMode={viewMode} 
          onClick={onProductClick} 
        />
      ))}
    </div>
  );
}
