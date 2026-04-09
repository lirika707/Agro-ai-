import { useI18n } from '../language/useLanguage';
import { Plus, Search, Filter, MapPin, Bell, ShoppingCart, MessageCircle } from 'lucide-react';
import { useMarketplace } from './hooks/useMarketplace';
import { MarketplaceList } from './components/MarketplaceList';
import { ProductForm } from './components/ProductForm';
import { ProductDetail } from './components/ProductDetail';
import { CategoryList } from './components/CategoryList';

export default function MarketplacePage() {
  const { t } = useI18n();
  const {
    products, filteredProducts, isAdding, setIsAdding, isUploading, editingProduct,
    searchInput, setSearchInput, viewMode, setViewMode, selectedProduct, setSelectedProduct, 
    currentImageIndex, setCurrentImageIndex, isZoomed, setIsZoomed, reviews, name, setName, 
    price, setPrice, description, setDescription, imageUrls, setImageUrls, category, 
    setCategory, location, setLocation, condition, setCondition, phone, setPhone, 
    reviewRating, setReviewRating, reviewComment, setReviewComment, isReporting, 
    setIsReporting, reportReason, setReportReason, handleFileUpload, detectLocation, 
    saveProduct, startEdit, handleProductClick, submitReview, markAsSold, submitReport, 
    deleteProduct, resetForm
  } = useMarketplace();

  if (isAdding) {
    return (
      <ProductForm 
        editingProduct={editingProduct}
        name={name} setName={setName}
        price={price} setPrice={setPrice}
        description={description} setDescription={setDescription}
        imageUrls={imageUrls} setImageUrls={setImageUrls}
        category={category} setCategory={setCategory}
        location={location} setLocation={setLocation}
        condition={condition} setCondition={setCondition}
        phone={phone} setPhone={setPhone}
        isUploading={isUploading}
        onFileUpload={handleFileUpload}
        onDetectLocation={detectLocation}
        onSave={saveProduct}
        onCancel={() => { setIsAdding(false); resetForm(); }}
      />
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct}
        products={products}
        reviews={reviews}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        isZoomed={isZoomed}
        setIsZoomed={setIsZoomed}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        isReporting={isReporting}
        setIsReporting={setIsReporting}
        reportReason={reportReason}
        setReportReason={setReportReason}
        onBack={() => setSelectedProduct(null)}
        onEdit={startEdit}
        onDelete={deleteProduct}
        onMarkAsSold={markAsSold}
        onSubmitReview={submitReview}
        onSubmitReport={submitReport}
        onProductClick={handleProductClick}
      />
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('Marketplace')}</h2>
          <div className="flex items-center text-gray-500 text-sm gap-1">
            <MapPin size={14} />
            {t('Bishkek, Kyrgyzstan')}
          </div>
        </div>
        <div className="flex gap-4 text-gray-600">
          <MessageCircle size={24} />
          <ShoppingCart size={24} />
          <Plus size={24} />
          <Bell size={24} />
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <input 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)} 
            placeholder={t('Search products...')} 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none transition" 
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button className="bg-green-600 p-4 rounded-2xl text-white">
          <Filter size={20} />
        </button>
      </div>

      {/* Categories */}
      <CategoryList />

      {/* Popular */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">{t('Popular')}</h3>
        <div className="flex gap-2">
          <button className="text-green-600 font-medium text-sm">{t('Slide')}</button>
          {/* View toggle icons */}
        </div>
      </div>

      <MarketplaceList 
        products={filteredProducts}
        viewMode={viewMode}
        onProductClick={handleProductClick}
      />
    </div>
  );
}
