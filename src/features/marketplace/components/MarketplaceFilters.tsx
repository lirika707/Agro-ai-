import { PRODUCT_CATEGORIES } from '../../../constants';
import { useI18n } from '../../language/useLanguage';
import { LayoutGrid, List, Search } from 'lucide-react';
import { SortOption, ViewMode } from '../types';

interface MarketplaceFiltersProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  onSearch: () => void;
  filter: string;
  setFilter: (val: string) => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (val: ViewMode) => void;
}

export function MarketplaceFilters({
  searchInput, setSearchInput, onSearch,
  filter, setFilter, sortBy, setSortBy,
  viewMode, setViewMode
}: MarketplaceFiltersProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-grow max-w-3xl">
        <div className="relative flex-grow group">
          <input 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            placeholder={t('Search...')} 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition group-hover:shadow-md" 
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2D6A4F] transition-colors" size={20} />
        </div>
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition font-bold text-gray-700 hover:shadow-md"
          >
            <option value="All">{t('All')}</option>
            {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{t(c)}</option>)}
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)} 
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none transition font-bold text-gray-700 hover:shadow-md"
          >
            <option value="newest">{t('Newest')}</option>
            <option value="popular">{t('Popular')}</option>
            <option value="category">{t('By Category')}</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <button 
          onClick={() => setViewMode('grid')} 
          className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#2D6A4F] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <LayoutGrid size={20} />
        </button>
        <button 
          onClick={() => setViewMode('list')} 
          className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#2D6A4F] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <List size={20} />
        </button>
      </div>
    </div>
  );
}
