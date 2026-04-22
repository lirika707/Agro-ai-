import { useState } from 'react';
import { auth } from '../../services/firebase';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { useI18n } from '../../features/language/useLanguage';
import { useProfile } from '../../features/profile/hooks/useProfile';
import { CountryCode } from '../../features/profile/types';
import { Check, X, Globe, MapPin, User, Languages } from 'lucide-react';

export default function EditProfile({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const { profile, updateProfile } = useProfile();
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [country, setCountry] = useState<CountryCode>(profile?.country || 'KG');
  const [region, setRegion] = useState(profile?.region || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await updateAuthProfile(user, { displayName, photoURL });
      await updateProfile({ displayName, country, region, phone, bio, photoURL });
      setMessage({ type: 'success', text: t('Profile updated successfully') });
      setTimeout(onBack, 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
      <h2 className="text-2xl font-bold">{t('Edit Profile')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" placeholder={t('Display Name')} />
        <input type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" placeholder={t('Photo URL')} />
        <select value={country} onChange={(e) => setCountry(e.target.value as CountryCode)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <option value="KG">🇰🇬 Kyrgyzstan</option>
          <option value="UZ">🇺🇿 Uzbekistan</option>
        </select>
        <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" placeholder={t('Region')} />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" placeholder={t('Phone')} />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 md:col-span-2" placeholder={t('Bio')} />
      </div>
      <div className="flex gap-4">
        <button onClick={handleUpdateProfile} className="px-8 py-4 bg-[#2D6A4F] text-white rounded-2xl font-bold">{t('Save')}</button>
        <button onClick={onBack} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">{t('Cancel')}</button>
      </div>
      {message && <p className={message.type === 'success' ? 'text-green-600' : 'text-red-600'}>{message.text}</p>}
    </div>
  );
}
