// src/app/books/page.tsx
import Container from '@/components/ui/Container';
import BookList from '@/components/books/BookList';
import BookListSkeleton from '@/components/books/BookListSkeleton';
import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { Search, BookOpen, Filter } from 'lucide-react';
import { BookWithOwner } from '@/types';
import Spinner from '@/components/ui/Spinner';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Preload essential data
async function getInitialBooks() {
  const books = await prisma.book.findMany({
    where: {
      status: 'available',
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          mobileNumber: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 12, // Load only first page
  });
  
  return books;
}

async function getGenres() {
  const genres = await prisma.book.findMany({
    where: { 
      genre: { not: null },
      status: 'available' 
    },
    select: { genre: true },
    distinct: ['genre']
  });

  const uniqueGenres = genres
    .map(item => item.genre)
    .filter(Boolean)
    .sort() as string[];
    
  return uniqueGenres;
}

export default async function BooksPage() {
  // Parallel data fetching
  const [initialBooks, uniqueGenres] = await Promise.all([
    getInitialBooks(),
    getGenres()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="relative pb-16 pt-16 sm:pb-20 sm:pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[calc(50%-500px)] top-0 -z-10 w-[1000px] h-[1000px] transform-gpu opacity-20 blur-3xl">
            <div 
              className="aspect-square h-full w-full rounded-full bg-gradient-to-tr from-blue-700 via-blue-300 to-purple-500" 
              style={{
                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
            />
          </div>
        </div>

        <Container>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              <span className="block">Discover Books in</span>
              <span className="block text-blue-600">Your Community</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              Browse through our collection of books available for rent or exchange from people around you.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-4">
              <div className="relative max-w-xl w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full p-3 pl-10 text-sm rounded-full border-0 bg-white/80 backdrop-blur-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-base"
                  placeholder="Search for titles, authors, or genres..."
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Books</h2>
              <p className="mt-1 text-sm text-gray-500">Find books available for rent or exchange</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <div className="relative inline-block text-left">
                <select className="rounded-md border-0 py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 hover:bg-gray-50">
                  <option>Sort: Newest</option>
                  <option>Sort: Oldest</option>
                  <option>Sort: A-Z</option>
                  <option>Sort: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 mb-8 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              All
            </span>
            {uniqueGenres.map((genre) => (
              <span key={genre} className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 hover:bg-gray-100 cursor-pointer">
                {genre}
              </span>
            ))}
          </div>

          <Suspense fallback={<BookListSkeleton />}>
            <BookList initialBooks={initialBooks as BookWithOwner[]} showFilters={false} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}