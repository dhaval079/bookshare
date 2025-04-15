// src/components/RouteChangeListener.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Remove useSearchParams
import { Suspense } from 'react';

// Create a separate component for search params logic
function SearchParamsWatcher() {
  // Only use useSearchParams inside this component
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  
  // Your logic that depends on searchParams
  useEffect(() => {
    // This effectively isolates the hook usage
  }, [searchParams]);
  
  return null; // This component doesn't render anything
}

export function RouteChangeListener() {
  const pathname = usePathname();
  
  // Handle navigation based on pathname only
  useEffect(() => {
    // Your existing logic for handling pathname changes
  }, [pathname]);

  return (
    <Suspense fallback={null}>
      <SearchParamsWatcher />
    </Suspense>
  );
}