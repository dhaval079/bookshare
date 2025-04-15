// src/app/page.tsx (Keep this as a server component)
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client component with SSR disabled
const HomePageClient = dynamic(() => import('@/components/HomePageClient'), {
  ssr: true, // You can set this to false if you have hydration issues
});

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>}>
      <HomePageClient />
    </Suspense>
  );
}