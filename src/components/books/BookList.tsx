'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { BookWithOwner } from '@/types';
import BookCard from './BookCard';
import BookListSkeleton from './BookListSkeleton';
import BookFilter from './BookFilter';
import Spinner from '@/components/ui/Spinner';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import NavLink from '@/components/ui/NavLink';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface BookListProps {
  initialBooks?: BookWithOwner[];
  showOwnerActions?: boolean;
  showFilters?: boolean;
  ownerId?: string;
  className?: string;
}

// Optimized BookActions component
const BookActions = ({ 
  book,
  onStatusChange,
  onDelete
}: { 
  book: BookWithOwner;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
    <select
      value={book.status}
      onChange={(e) => onStatusChange(book.id, e.target.value)}
      className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="available">Available</option>
      <option value="rented">Rented</option>
      <option value="exchanged">Exchanged</option>
    </select>
    <div className="flex space-x-2">
      <NavLink href={`/dashboard/owner/books/edit/${book.id}`}>
        <Button variant="secondary" size="sm" className="w-full sm:w-auto">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </NavLink>
      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(book.id)}
        className="w-full sm:w-auto"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  </div>
);

// Empty state component
const EmptyBookList = ({ showOwnerActions, filters }: { 
  showOwnerActions: boolean;
  filters: any;
}) => (
  <div className="py-16 text-center bg-gray-50 rounded-xl border border-gray-200">
    <div className="mx-auto h-12 w-12 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">No books found</h3>
    <p className="mt-2 text-gray-500 max-w-md mx-auto">
      {Object.values(filters).some(v => v) 
        ? "Try adjusting your filters to see more results" 
        : "There are no books available at the moment"}
    </p>
    {showOwnerActions && (
      <div className="mt-6">
        <NavLink href="/dashboard/owner/books/new">
          <Button variant="primary" className="rounded-full px-6">
            Add Your First Book
          </Button>
        </NavLink>
      </div>
    )}
  </div>
);

// Simplified pagination component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="mt-10 flex justify-center">
      <nav className="flex items-center space-x-2" aria-label="Pagination">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show first 2 pages, current page, and last 2 pages
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors
                  ${currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
};

export default function BookList({
  initialBooks = [],
  showOwnerActions = false,
  showFilters = true,
  ownerId,
  className = '',
}: BookListProps) {
  const [books, setBooks] = useState<BookWithOwner[]>(initialBooks);
  const [loading, setLoading] = useState(initialBooks.length === 0);
  const [filtering, setFiltering] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    genre: '',
    status: '',
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Simplified fetchBooks function
  const fetchBooks = useCallback(async (pageNum = 1) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Set loading state
    setFiltering(true);
    
    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      // Build query parameters efficiently
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12'
      });
      
      // Only add non-empty filters
      if (ownerId) params.append('ownerId', ownerId);
      if (filters.title) params.append('title', filters.title);
      if (filters.location) params.append('location', filters.location);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.status) params.append('status', filters.status);
      
      // Fetch data
      const response = await fetch(`/api/books?${params.toString()}`, {
        signal: controller.signal
      });
      
      // Handle errors
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      // Parse response
      const data = await response.json();
      
      // Update state with response data
      if (data.books && Array.isArray(data.books)) {
        setBooks(data.books);
        setTotalPages(data.pagination?.totalPages || 1);
      } else if (Array.isArray(data)) {
        setBooks(data);
        setTotalPages(1);
      }
    } catch (error) {
      // Only report non-abort errors
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error('Error fetching books:', error);
        toast.error('Failed to fetch books');
      }
    } finally {
      // Reset loading states
      setFiltering(false);
      setLoading(false);
    }
  }, [filters, ownerId]);

  // Initial fetch if no initial books provided
  useEffect(() => {
    if (initialBooks.length === 0) {
      fetchBooks();
    }
  }, [fetchBooks, initialBooks.length]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
    fetchBooks(1);
    setFilterOpen(false);
  }, [fetchBooks]);

  // Handle page changes
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    fetchBooks(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchBooks]);

  // Handle book deletion
  const handleDeleteBook = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      
      // Remove book from state
      setBooks((prev) => prev.filter((book) => book.id !== id));
      toast.success('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  }, []);

  // Handle book status change
  const handleStatusChange = useCallback(async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update book status');
      }
      
      // Update book in state
      setBooks((prev) =>
        prev.map((book) =>
          book.id === id ? { ...book, status } : book
        )
      );
      
      toast.success('Book status updated');
    } catch (error) {
      console.error('Error updating book status:', error);
      toast.error('Failed to update book status');
    }
  }, []);

  return (
    <div className={className}>
      {showFilters && (
        <>
          <div className="md:hidden mb-4">
            <Button 
              onClick={() => setFilterOpen(!filterOpen)} 
              variant="outline" 
              className="w-full flex justify-between items-center"
            >
              <span>Filters {Object.values(filters).some(v => v) ? '(Active)' : ''}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
          
          <div
            className={cn(
              "md:block transition-all duration-300 overflow-hidden",
              filterOpen ? "max-h-[1000px] opacity-100" : "md:opacity-100 max-h-0 md:max-h-none opacity-0"
            )}
          >
            <div className="mb-6">
              <BookFilter onFilterChange={handleFilterChange} activeFilters={filters} />
            </div>
          </div>
        </>
      )}
      
      {(loading || filtering) ? (
        <BookListSkeleton />
      ) : books.length === 0 ? (
        <EmptyBookList showOwnerActions={showOwnerActions} filters={filters} />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                featured={book.id === books[0]?.id}
                actions={
                  showOwnerActions ? (
                    <BookActions 
                      book={book} 
                      onStatusChange={handleStatusChange} 
                      onDelete={handleDeleteBook}
                    />
                  ) : undefined
                }
              />
            ))}
          </div>
          
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}