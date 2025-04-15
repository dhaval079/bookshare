// src/components/SearchParamsComponent.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchParamsComponent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('from') || '';
  
  return (
    <p className="text-sm text-gray-500 mt-1">
      {query ? `You were redirected from: ${query}` : ''}
    </p>
  );
}