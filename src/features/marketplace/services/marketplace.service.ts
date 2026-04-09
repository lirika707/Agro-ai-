import { db } from '../../../services/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  increment 
} from 'firebase/firestore';
import { Product, Review, Report } from '../types';

export const MarketplaceService = {
  getProducts(callback: (products: Product[]) => void) {
    const q = query(collection(db, 'products'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });
  },

  getReviews(productId: string, callback: (reviews: Review[]) => void) {
    const q = query(
      collection(db, 'products', productId, 'reviews'), 
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });
  },

  async saveProduct(productData: Partial<Product>, id?: string) {
    if (id) {
      return updateDoc(doc(db, 'products', id), productData);
    } else {
      return addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: Date.now(),
        views: 0
      });
    }
  },

  async deleteProduct(id: string) {
    return deleteDoc(doc(db, 'products', id));
  },

  async incrementViews(id: string) {
    return updateDoc(doc(db, 'products', id), {
      views: increment(1)
    });
  },

  async addReview(productId: string, reviewData: Omit<Review, 'id'>) {
    return addDoc(collection(db, 'products', productId, 'reviews'), reviewData);
  },

  async markAsSold(productId: string) {
    return updateDoc(doc(db, 'products', productId), {
      status: 'sold',
      soldAt: Date.now()
    });
  },

  async submitReport(reportData: Report) {
    return addDoc(collection(db, 'reports'), reportData);
  }
};
