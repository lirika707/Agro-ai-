import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile, CountryCode } from '../types';
import { LanguageCode } from '../../language/types';

export class ProfileService {
  private static COLLECTION = 'users';

  static async getProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, this.COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }

  static async createProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, this.COLLECTION, uid);
    
    // Default admin check based on email (from runtime context)
    const isAdmin = data.email === 'nterra558@gmail.com';
    
    const profile: UserProfile = {
      uid,
      displayName: data.displayName || null,
      email: data.email || null,
      photoURL: data.photoURL || null,
      country: data.country || 'KG',
      region: data.region || '',
      language: data.language || 'ru',
      role: isAdmin ? 'admin' : 'user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(docRef, profile);
  }

  static async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, this.COLLECTION, uid);
    
    // Safety: Strip role from update if it's being passed from a standard UI update
    // Role changes should be handled by a separate admin-only function or direct DB edit
    const { role, ...updateData } = data;
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Date.now(),
    });
  }
}
