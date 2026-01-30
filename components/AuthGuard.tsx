'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'fan' | 'talent' | 'admin';
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRole, redirectTo = '/login' }: AuthGuardProps) {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Check role if required
      if (requiredRole && profile) {
        const hasAccess =
          requiredRole === 'admin' ? profile.role === 'admin' :
          requiredRole === 'talent' ? profile.role === 'talent' || profile.role === 'admin' :
          true; // 'fan' role has access to customer dashboard

        if (!hasAccess) {
          // Redirect to appropriate dashboard based on role
          const redirectPath =
            profile.role === 'admin' ? '/admin' :
            profile.role === 'talent' ? '/dashboard' :
            '/customer-dashboard';
          router.push(redirectPath);
        }
      }
    }
  }, [loading, isAuthenticated, profile, requiredRole, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated yet (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-neutral-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check role access
  if (requiredRole && profile) {
    const hasAccess =
      requiredRole === 'admin' ? profile.role === 'admin' :
      requiredRole === 'talent' ? profile.role === 'talent' || profile.role === 'admin' :
      true;

    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-neutral-400">Redirecting to your dashboard...</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
