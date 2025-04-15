'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useLoading } from '@/components/LoadingProvider';
import Spinner from '@/components/ui/Spinner';

function DashboardRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { setIsLoading } = useLoading();
  
  useEffect(() => {
    if (!isLoaded) return;
    
    const redirectUser = async () => {
      setIsLoading(true);
      if (!user) {
        router.push('/sign-in');
        return;
      }
      const userRole = user.unsafeMetadata?.role as string;
      if (!userRole) {
        router.push('/auth/role-selection');
        return;
      }
      if (userRole === 'owner') {
        router.push('/dashboard/owner');
      } else {
        router.push('/dashboard/seeker');
      }
    };
    
    redirectUser();
  }, [isLoaded, user, router, setIsLoading]);
  
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardRedirect />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';