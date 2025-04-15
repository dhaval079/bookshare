"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Bookmark, CheckCircle } from 'lucide-react';

// This component can be imported in your layout.tsx file
const EnhancedLoader = () => {
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingPercent, setLoadingPercent] = useState(0);
  
  // Loading stages for better UX feedback
  const loadingStages = [
    "Connecting to BookShare",
    "Loading your books",
    "Preparing your dashboard",
    "Almost there"
  ];
  
  // Quotes about books to display while loading
  const bookQuotes = [
    "A reader lives a thousand lives before they die. The person who never reads lives only one.",
    "Books are a uniquely portable magic.",
    "Reading is to the mind what exercise is to the body.",
    "There is no friend as loyal as a book."
  ];
  
  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setLoadingPercent(prev => {
        const newPercent = Math.min(prev + Math.random() * 5, 100);
        
        // Update loading stage based on progress
        if (newPercent > 90) setLoadingStage(3);
        else if (newPercent > 65) setLoadingStage(2);
        else if (newPercent > 30) setLoadingStage(1);
        
        return newPercent;
      });
    }, 200);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 z-50">
      <div className="w-full max-w-md px-8 py-8 flex flex-col items-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div 
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            <motion.div
              animate={{ 
                y: [0, -5, 0], 
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="relative z-10 text-white"
            >
              <BookOpen size={48} className="drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* App name */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl font-bold text-center text-gray-900 mb-2"
        >
          BookShare
        </motion.h1>
        
        {/* Loading stage text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-8 mt-1 mb-6"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-blue-600 font-medium"
            >
              {loadingStages[loadingStage]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 mb-8 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${loadingPercent}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
        
        {/* Book quotes */}
        <div className="w-full bg-blue-50 rounded-lg p-4 border border-blue-100 mt-2 h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingStage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-start"
            >
              <Bookmark className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
              <p className="text-blue-700 text-sm italic">"{bookQuotes[loadingStage]}"</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Loading animation - floating books */}
        <div className="relative h-20 w-full mt-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${15 + i * 18}%`,
                top: '50%',
                translateY: '-50%'
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, i % 2 === 0 ? 5 : -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className={`w-10 h-14 rounded-md flex items-center justify-center shadow-md 
                ${i % 4 === 0 ? 'bg-blue-500' : 
                  i % 4 === 1 ? 'bg-indigo-500' : 
                  i % 4 === 2 ? 'bg-purple-500' : 'bg-sky-500'} 
                text-white font-bold text-xs`}
              >
                BOOK
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Status updates */}
        <div className="flex flex-col items-center mt-4">
          <div className="flex items-center text-xs text-gray-500 space-x-2">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1, 0.95]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <CheckCircle size={16} className={loadingPercent > 30 ? "text-green-500" : "text-gray-300"} />
            </motion.div>
            <span className={loadingPercent > 30 ? "text-green-600" : "text-gray-400"}>Resources loaded</span>
            
            <span className="mx-1">•</span>
            
            <motion.div
              animate={{
                opacity: loadingPercent > 60 ? [0.5, 1, 0.5] : 1,
                scale: loadingPercent > 60 ? [0.95, 1, 0.95] : 1
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <CheckCircle size={16} className={loadingPercent > 60 ? "text-green-500" : "text-gray-300"} />
            </motion.div>
            <span className={loadingPercent > 60 ? "text-green-600" : "text-gray-400"}>Components ready</span>
            
            <span className="mx-1">•</span>
            
            <motion.div
              animate={{
                opacity: loadingPercent > 90 ? [0.5, 1, 0.5] : 1,
                scale: loadingPercent > 90 ? [0.95, 1, 0.95] : 1
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <CheckCircle size={16} className={loadingPercent > 90 ? "text-green-500" : "text-gray-300"} />
            </motion.div>
            <span className={loadingPercent > 90 ? "text-green-600" : "text-gray-400"}>Finalizing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoader;