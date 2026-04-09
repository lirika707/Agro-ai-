import React from 'react';
import { useProfile } from '../hooks/useProfile';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A simple guard component that only renders its children if the user is an admin.
 */
export default function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  const { profile, loading } = useProfile();

  if (loading) return null;
  
  if (profile?.role !== 'admin') {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
