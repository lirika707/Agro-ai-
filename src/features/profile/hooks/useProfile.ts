import { useState, useEffect } from 'react';
import { auth } from '../../../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { ProfileService } from '../services/profile.service';
import { UserProfile } from '../types';

export function useProfile() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          let userProfile = await ProfileService.getProfile(currentUser.uid);
          if (!userProfile) {
            await ProfileService.createProfile(currentUser.uid, {
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
            });
            userProfile = await ProfileService.getProfile(currentUser.uid);
          }
          setProfile(userProfile);
        } catch (err: any) {
          setError(err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!auth.currentUser) return;
    try {
      await ProfileService.updateProfile(auth.currentUser.uid, data);
      const updatedProfile = await ProfileService.getProfile(auth.currentUser.uid);
      setProfile(updatedProfile);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const isAdmin = profile?.role === 'admin';

  return { user, profile, isAdmin, loading, error, updateProfile };
}
