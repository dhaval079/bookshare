// src/components/NotFoundClient.tsx
'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Now it's safe to use ssr: false in a client component
const SearchParamsComponent = dynamic(
  () => import('@/components/SearchParamsComponent'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

export default function NotFoundClient() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        404 - Page Not Found
      </h1>

      <Suspense fallback={<div>Loading params...</div>}>
        <SearchParamsComponent />
      </Suspense>

      <div className="mt-8">
        <Link href="/">Go back home</Link>
      </div>
    </div>
  );
}