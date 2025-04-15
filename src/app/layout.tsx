// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';
import { LoadingProvider } from '@/components/LoadingProvider';
import { RouteChangeListener } from '@/components/RouteChangeListener';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the EnhancedLoader to avoid including it in the initial bundle
// This way it only loads when needed
const EnhancedLoader = dynamic(() => import('@/components/EnhancedLoader'), {
  loading: () => (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'BookShare - Peer-to-Peer Book Exchange',
  description: 'Connect with other book lovers to exchange, rent, or give away books in your community.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        layout: {
          shimmer: false, // Disable shimmer as it adds extra loading time
          logoPlacement: 'none', // Remove logo loading
        },
        variables: {
          colorPrimary: '#3b82f6' // Match our blue color
        }
      }}
    >
      <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} antialiased`}>
          <LoadingProvider>
            <RouteChangeListener />
            <div className="flex min-h-screen flex-col">
              <Suspense fallback={<div className="h-16 bg-white shadow animate-pulse"></div>}>
                <Header />
              </Suspense>
              <main className="flex-1">
                <Suspense fallback={<EnhancedLoader />}>
                  {children}
                </Suspense>
              </main>
              <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse"></div>}>
                <Footer />
              </Suspense>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                },
                success: {
                  duration: 2000,
                  style: {
                    background: '#166534',
                  },
                },
                error: {
                  duration: 3000,
                  style: {
                    background: '#991b1b',
                  },
                },
              }}
            />
          </LoadingProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}