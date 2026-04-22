import { useState, useEffect } from 'react';
import { db, auth } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useI18n } from '../../features/language/useLanguage';
import { Package, X } from 'lucide-react';
import LoadingState from '../ui/LoadingState';
import EmptyState from '../ui/EmptyState';

export default function MyListings({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'products'), where('sellerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm(t('Are you sure you want to delete this product?'))) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('My Listings')}</h2>
      {loading ? (
        <LoadingState message={t('Loading your listings...')} />
      ) : myProducts.length === 0 ? (
        <EmptyState title={t("No listings yet")} description={t("You haven't published any products yet.")} icon={<Package size={40} className="text-gray-300" />} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map(product => (
            <div key={product.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-4">
              <img src={product.imageUrls?.[0] || product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-2xl" />
              <h4 className="text-lg font-bold mt-4">{product.name}</h4>
              <p className="text-[#2D6A4F] font-black">{product.price} сом</p>
              <button onClick={() => handleDeleteProduct(product.id)} className="mt-4 w-full py-2 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2">
                <X size={16} /> {t('Delete')}
              </button>
            </div>
          ))}
        </div>
      )}
      <button onClick={onBack} className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">{t('Back')}</button>
    </div>
  );
}
