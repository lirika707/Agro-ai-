import { LanguageCode } from '../language/types';

export type CountryCode = 'KG' | 'UZ';
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  country: CountryCode;
  region: string;
  language: LanguageCode;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}
