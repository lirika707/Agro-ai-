export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  category: string;
  location: string;
  condition: string;
  phone: string;
  sellerId: string;
  createdAt: number;
  views: number;
  status?: 'sold';
  soldAt?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface Report {
  productId: string;
  reporterId: string;
  reason: string;
  createdAt: number;
}

export type SortOption = 'newest' | 'popular' | 'category';
export type ViewMode = 'grid' | 'list';
