// src/components/LoadingProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode, Suspense } from 'react';
import { usePathname } from 'next/navigation'; // Remove useSearchParams from here
import { motion, AnimatePresence } from 'framer-motion';

// Separate component for search params functionality
function SearchParamsWatcher({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) {
  // Use next/navigation inside this component only
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // This will run when search params change
    setIsLoading(false);
  }, [searchParams, setIsLoading]);
  
  return null; // This component doesn't render anything
}

// Create loading context
type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
  startLoading: () => {},
  stopLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Maximum loading time to prevent infinite loading states
  const maxLoadingTimeMs = 5000;

  const startLoading = () => {
    // Clear any existing loading timers
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    
    setIsLoading(true);
    
    // Set a maximum loading time as a fallback
    loadingTimerRef.current = setTimeout(() => {
      stopLoading();
    }, maxLoadingTimeMs);

    // Dispatch event for other components to react
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('loadingStarted'));
    }
  };

  const stopLoading = () => {
    // Clear any existing loading timers
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    
    setIsLoading(false);
    
    // Dispatch event for other components to react
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('loadingStopped'));
    }
  };

  // When pathname changes, stop any active loading states
  useEffect(() => {
    stopLoading();
  }, [pathname]);
  
  // Listen for global navigation events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleRouteChangeStart = () => startLoading();
    const handleRouteChangeComplete = () => stopLoading();
    
    window.addEventListener('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('routeChangeComplete', handleRouteChangeComplete);
    
    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading, stopLoading }}>
      {/* Wrap the SearchParams component with Suspense */}
      <Suspense fallback={null}>
        <SearchParamsWatcher setIsLoading={setIsLoading} />
      </Suspense>
      
      <div className="relative">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-600 overflow-hidden"
            >
              <motion.div 
                className="h-full bg-blue-400"
                initial={{ width: "0%" }}
                animate={{
                  width: ["0%", "30%", "60%", "80%"],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}