import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Search, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BookList from '@/components/books/BookList';
import prisma from '@/lib/prisma';
import { BookWithOwner } from '@/types';
import NavLink from '@/components/ui/NavLink';

export const dynamic = 'force-dynamic';

export default async function SeekerDashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  
  // If user is not a seeker, redirect
  if (!dbUser || dbUser.role !== 'seeker') {
    redirect('/dashboard');
  }
  
  // Fetch recent available books
  const recentBooks = await prisma.book.findMany({
    where: { status: 'available' },
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
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Seeker Dashboard
        </h1>
        <p className="mt-1 text-gray-600">
          Find books to rent or exchange from other users.
        </p>
      </div>
      
      <Card className="bg-white p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Looking for books?
            </h2>
            <p className="mt-1 text-gray-600">
              Browse available books in your community.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <NavLink href="/books">
              <Button>
              <Search className="mr-2 h-4 w-4" />
              Browse All Books</Button>
            </NavLink>
          </div>
        </div>
      </Card>
      
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Recently Added Books
        </h2>
        
        {recentBooks.length === 0 ? (
          <Card className="bg-white p-6 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No books available
            </h3>
            <p className="mt-1 text-gray-600">
              Check back soon for new listings.
            </p>
          </Card>
        ) : (
          <BookList initialBooks={recentBooks as BookWithOwner[]} showFilters={false} />
        )}
        
        {recentBooks.length > 0 && (
          <div className="mt-6 text-center">
            <NavLink href="/books">
              <Button variant="outline">View All Books</Button>
            </NavLink>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}