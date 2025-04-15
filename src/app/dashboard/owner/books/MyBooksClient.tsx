// src/app/dashboard/owner/books/MyBooksClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  BookOpen, 
  Filter, 
  ChevronDown, 
  ArrowUpRight,
  Sparkles,
  BookMarked
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import BookList from '@/components/books/BookList';
import { BookWithOwner } from '@/types';
import { useUser } from '@clerk/nextjs';
import NavLink from '@/components/ui/NavLink';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const statsVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function MyBooksClient({ initialBooks }: { initialBooks: BookWithOwner[] }) {
  const { user } = useUser();
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState(initialBooks || []);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    rented: 0,
    exchanged: 0
  });
  
  // Calculate stats from books
  useEffect(() => {
    if (books.length) {
      const total = books.length;
      const available = books.filter(book => book.status === 'available').length;
      const rented = books.filter(book => book.status === 'rented').length;
      const exchanged = books.filter(book => book.status === 'exchanged').length;
      
      setStats({ total, available, rented, exchanged });
    }
  }, [books]);
  
return (
    <DashboardLayout>
      <div className="relative mb-10">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl -z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative px-6 py-8 rounded-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium">
                <BookMarked className="mr-1 h-3 w-3" />
                <span>My Library</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Books Collection
              </h1>
              <p className="text-gray-600 max-w-xl">
                Manage your book listings, track their status, and connect with readers in your community.
              </p>
            </div>
            <div className="flex space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink href="/dashboard/owner/books/new">
                  <Button 
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Book
                  </Button>
                </NavLink>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={statsVariants} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Books</p>
              <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={statsVariants} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Available</p>
              <h3 className="text-2xl font-bold mt-1 text-green-600">{stats.available}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={statsVariants} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Rented</p>
              <h3 className="text-2xl font-bold mt-1 text-blue-600">{stats.rented}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={statsVariants} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Exchanged</p>
              <h3 className="text-2xl font-bold mt-1 text-purple-600">{stats.exchanged}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3L21 7L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 7H7C5.89543 7 5 7.89543 5 9V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 21L3 17L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 17H17C18.1046 17 19 16.1046 19 15V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filter Animation */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Filter Your Books</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="exchanged">Exchanged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <input 
                    type="text" 
                    placeholder="Fiction, Non-fiction, etc." 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Added Date
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Time</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="mr-2">Reset</Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <BookList
            initialBooks={books}
            showOwnerActions
            showFilters={false}
          />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}