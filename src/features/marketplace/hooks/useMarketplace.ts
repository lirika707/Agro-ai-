import { useState, useEffect, useMemo } from 'react';
import { auth } from '../../../services/firebase';
import { PRODUCT_CATEGORIES } from '../../../constants';
import { useI18n } from '../../language/useLanguage';
import { Product, Review, SortOption, ViewMode } from '../types';
import { MarketplaceService } from '../services/marketplace.service';

export function useMarketplace() {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState<string | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('New');
  const [phone, setPhone] = useState('');

  // Review State
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  
  // Report State
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    return MarketplaceService.getProducts(setProducts);
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      setReviews([]);
      return;
    }
    return MarketplaceService.getReviews(selectedProduct.id, setReviews);
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (filter === 'All' || p.category === filter) &&
      (
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      )
    ).sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  }, [products, filter, search, sortBy]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!auth.currentUser) {
      alert(t('You must be logged in to upload an image'));
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setImageUrls(prev => [...prev, dataUrl]);
          }
          setIsUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          setLocation(`${data.address.city || data.address.town || ''}, ${data.address.country}`);
        } catch (error) {
          console.error('Error detecting location:', error);
        }
      });
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setImageUrls([]);
    setCategory(PRODUCT_CATEGORIES[0]);
    setLocation('');
    setCondition('New');
    setPhone('');
    setEditingProduct(null);
  };

  const saveProduct = async () => {
    if (!auth.currentUser) {
      alert(t('You must be logged in to add a product'));
      return;
    }

    const missing = [];
    if (!name.trim()) missing.push(t('Product Name'));
    if (!price) missing.push(t('Price'));
    if (imageUrls.length === 0) missing.push(t('Product Image'));
    if (!category) missing.push(t('Category'));
    if (!location.trim()) missing.push(t('Location'));

    if (missing.length > 0) {
      alert(`${t('Please fill all required fields (Name, Price, Image, Category, Location)')}\n\n${t('Missing:')} ${missing.join(', ')}`);
      return;
    }
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert(t('Please enter a valid price'));
      return;
    }

    try {
      const productData = {
        name,
        price: parsedPrice,
        description,
        imageUrls,
        category,
        location,
        condition,
        phone,
        sellerId: auth.currentUser.uid,
      };

      await MarketplaceService.saveProduct(productData, editingProduct?.id);
      resetForm();
      setIsAdding(false);
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Error saving product: ${error.message}`);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setImageUrls(product.imageUrls);
    setCategory(product.category);
    setLocation(product.location);
    setCondition(product.condition);
    setPhone(product.phone);
    setIsAdding(true);
  };

  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    if (product.sellerId !== auth.currentUser?.uid) {
      await MarketplaceService.incrementViews(product.id);
    }
  };

  const submitReview = async () => {
    if (!auth.currentUser || !selectedProduct || !reviewComment.trim()) return;
    try {
      await MarketplaceService.addReview(selectedProduct.id, {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email || 'User',
        rating: reviewRating,
        comment: reviewComment,
        createdAt: Date.now()
      });
      setReviewComment('');
      setReviewRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const markAsSold = async () => {
    if (!selectedProduct) return;
    try {
      await MarketplaceService.markAsSold(selectedProduct.id);
      setSelectedProduct(prev => prev ? { ...prev, status: 'sold' } : null);
    } catch (error) {
      console.error('Error marking as sold:', error);
    }
  };

  const submitReport = async () => {
    if (!auth.currentUser || !selectedProduct || !reportReason.trim()) return;
    try {
      await MarketplaceService.submitReport({
        productId: selectedProduct.id,
        reporterId: auth.currentUser.uid,
        reason: reportReason,
        createdAt: Date.now()
      });
      alert(t('Reported successfully'));
      setIsReporting(false);
      setReportReason('');
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm(t('Are you sure you want to delete this product?'))) {
      await MarketplaceService.deleteProduct(id);
      if (selectedProduct?.id === id) setSelectedProduct(null);
    }
  };

  return {
    products, filteredProducts, isAdding, setIsAdding, isUploading, editingProduct,
    search, setSearch, searchInput, setSearchInput, filter, setFilter, sortBy, setSortBy,
    viewMode, setViewMode, selectedProduct, setSelectedProduct, currentImageIndex, setCurrentImageIndex,
    isZoomed, setIsZoomed, reviews, name, setName, price, setPrice, description, setDescription,
    imageUrls, setImageUrls, category, setCategory, location, setLocation, condition, setCondition,
    phone, setPhone, reviewRating, setReviewRating, reviewComment, setReviewComment,
    isReporting, setIsReporting, reportReason, setReportReason,
    handleFileUpload, detectLocation, saveProduct, startEdit, handleProductClick,
    submitReview, markAsSold, submitReport, deleteProduct, resetForm
  };
}
