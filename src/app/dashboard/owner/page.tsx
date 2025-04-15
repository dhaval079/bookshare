// src/app/dashboard/owner/page.tsx
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import OwnerDashboardClient from './DashboardClient';
import { Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

async function getUserData(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
}

async function getBookStatsAndRecent(userId: string) {
  // Optimized to use a single groupBy query instead of multiple count queries
  const [bookStats, recentBooks] = await Promise.all([
    prisma.book.groupBy({
      by: ['status'],
      where: { 
        ownerId: userId 
      },
      _count: {
        _all: true
      }
    }),
    prisma.book.findMany({
      where: { ownerId: userId },
      select: {
        id: true,
        title: true,
        author: true,
        genre: true,
        status: true,
        coverImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
  ]);
  
  // Process the results to get the counts by status
  const stats = {
    totalBooks: 0,
    availableBooks: 0,
    rentedBooks: 0,
    exchangedBooks: 0
  };
  
  // Sum up the counts from the aggregation
  bookStats.forEach(stat => {
    const count = stat._count._all;
    stats.totalBooks += count;
    
    if (stat.status === 'available') {
      stats.availableBooks = count;
    } else if (stat.status === 'rented') {
      stats.rentedBooks = count;
    } else if (stat.status === 'exchanged') {
      stats.exchangedBooks = count;
    }
  });
  
  return { stats, recentBooks };
}

export default async function OwnerDashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  try {
    // Get user data
    const dbUser = await getUserData(user.id);
    
    // If user is not an owner, redirect
    if (!dbUser || dbUser.role !== 'owner') {
      redirect('/dashboard');
    }
    
    // Get stats and recent books in a single operation
    const { stats, recentBooks } = await getBookStatsAndRecent(dbUser.id);

    return (
      <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
        <OwnerDashboardClient
          user={{
            firstName: user.firstName || '',
            name: dbUser.name
          }}
          stats={stats}
          recentBooks={recentBooks}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading dashboard:", error);
    // Show a more user-friendly error page
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Something went wrong</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          We're having trouble loading your dashboard. Please try again in a moment.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh page
        </button>
      </div>
    );
  }
}