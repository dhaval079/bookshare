// src/components/BookFormWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import PremiumBookForm with SSR disabled.
const PremiumBookForm = dynamic(() => import('@/app/dashboard/owner/books/new/AddBook'), {
  ssr: false,
});

interface BookFormWrapperProps {
  genres: string[];
  user: any;  // Replace `any` with your specific type if desired.
}

export default function BookFormWrapper({ genres, user }: BookFormWrapperProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading book form...</div>}>
      <PremiumBookForm genres={genres} user={user} />
    </Suspense>
  );
}
