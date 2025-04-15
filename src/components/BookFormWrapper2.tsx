// src/components/BookFormWrapper.tsx (Updated)
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import with ssr EXPLICITLY set to false
const DynamicBookForm = dynamic(
  () => import('@/app/dashboard/owner/books/new/AddBook'), 
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading book form...</p>
        </div>
      </div>
    )
  }
);

interface BookFormWrapperProps {
  genres: string[]; // Adjust this type based on your actual genres structure
  user: any; // Replace 'any' with your actual user type when available
}

export default function BookFormWrapper({ genres, user }: BookFormWrapperProps) {
  // No need for extra Suspense here, the dynamic import handles it
  return <DynamicBookForm genres={genres} user={user} />;
}