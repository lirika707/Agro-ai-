import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useI18n } from '../features/language/useLanguage';
import { User, Package, LogOut, Edit2, Check, X, Globe, MapPin, Languages } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useProfile } from '../features/profile/hooks/useProfile';
import { CountryCode } from '../features/profile/types';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../features/language/types';
import LoadingState from './ui/LoadingState';
import EmptyState from './ui/EmptyState';

export default function Profile() {
  const { t, setLanguage } = useI18n();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState<CountryCode>('KG');
  const [region, setRegion] = useState('');
  const [language, setProfileLanguage] = useState<LanguageCode>('ru');
  const [isEditing, setIsEditing] = useState(false);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || user?.displayName || '');
      setCountry(profile.country);
      setRegion(profile.region);
      setProfileLanguage(profile.language);
    }
  }, [profile, user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await updateAuthProfile(user, { displayName });
      await updateProfile({
        displayName,
        country,
        region,
        language,
      });
      setLanguage(language); // Sync app language with profile language
      setMessage({ type: 'success', text: t('Profile updated successfully') });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm(t('Are you sure you want to delete this product?'))) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Header Card */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D6A4F]/5 rounded-bl-full -mr-8 -mt-8" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 bg-[#2D6A4F]/10 rounded-[32px] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-[#2D6A4F]" />
              )}
            </div>
          </div>

          <div className="flex-grow text-center md:text-left space-y-2">
            {isEditing ? (
              <div className="space-y-4 w-full">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 px-4 py-2 rounded-2xl outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all w-full md:w-auto"
                    placeholder={t('Display Name')}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdateProfile}
                      className="p-3 bg-[#2D6A4F] text-white rounded-2xl hover:bg-[#1B4332] transition-all shadow-lg shadow-green-900/20"
                    >
                      <Check size={20} />
                    </button>
                    <button 
                      onClick={() => { setIsEditing(false); setDisplayName(user.displayName || ''); }}
                      className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Globe size={10} /> {t('Country')}
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value as CountryCode)}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all text-sm font-medium"
                    >
                      <option value="KG">🇰🇬 Kyrgyzstan</option>
                      <option value="UZ">🇺🇿 Uzbekistan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <MapPin size={10} /> {t('Region')}
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all text-sm font-medium"
                      placeholder={t('e.g. Osh, Tashkent')}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Languages size={10} /> {t('Language')}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setProfileLanguage(e.target.value as LanguageCode)}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all text-sm font-medium"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-3 group">
                  <h2 className="text-3xl font-bold text-gray-900">{user.displayName || t('Anonymous Farmer')}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-400 hover:text-[#2D6A4F] hover:bg-green-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 font-medium text-sm">
                  <span className="flex items-center gap-1">
                    <Globe size={14} className="text-[#2D6A4F]" />
                    {country === 'KG' ? 'Kyrgyzstan' : 'Uzbekistan'}
                  </span>
                  {region && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#2D6A4F]" />
                      {region}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Languages size={14} className="text-[#2D6A4F]" />
                    {SUPPORTED_LANGUAGES.find(l => l.code === language)?.name}
                  </span>
                </div>
              </div>
            )}
            <p className="text-gray-500 font-medium">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="px-4 py-1.5 bg-green-50 text-[#2D6A4F] text-xs font-bold rounded-full border border-[#2D6A4F]/10 uppercase tracking-wider">
                  {t('Farmer')}
                </span>
                {profile?.role === 'admin' && (
                  <span className="px-4 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-full border border-purple-600/10 uppercase tracking-wider">
                    {t('Admin')}
                  </span>
                )}
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-600/10 uppercase tracking-wider">
                  {myProducts.length} {t('Listings')}
                </span>
              </div>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center gap-2 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {t('Sign Out')}
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* My Listings Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-4">
          <div className="p-2 bg-[#2D6A4F]/10 rounded-xl">
            <Package size={24} className="text-[#2D6A4F]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{t('My Listings')}</h3>
        </div>

        {loadingProducts || profileLoading ? (
          <LoadingState message={t('Loading your listings...')} />
        ) : myProducts.length === 0 ? (
          <EmptyState 
            title={t("No listings yet")}
            description={t("You haven't published any products yet. Start selling today!")}
            icon={<Package size={40} className="text-gray-300" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map(product => (
              <div key={product.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group relative">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.imageUrls?.[0] || product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {product.status === 'sold' && (
                      <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                        {t('Sold')}
                      </span>
                    )}
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg backdrop-blur-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="text-[#2D6A4F] font-black text-xl">{product.price} сом</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#2D6A4F] transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-gray-400">📍 {product.location}</span>
                    <span className="text-xs font-bold text-gray-400">👁 {product.views || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
