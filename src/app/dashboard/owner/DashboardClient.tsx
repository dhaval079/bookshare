'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusCircle, 
  BookOpen,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Eye,
  BarChart3,
  ChevronRight,
  Search
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import NavButton from '@/components/ui/NavButton';
import NavLink from '@/components/ui/NavLink';
import Card from '@/components/ui/Card';
import { timeAgo } from '@/lib/utils';

// Helper function to get chart data colors based on status
const getStatusColor = (status: any) => {
  switch(status) {
    case 'available': return {
      badge: 'bg-green-100 text-green-800 border border-green-200',
      icon: 'text-green-500',
      bg: 'bg-green-50'
    };
    case 'rented': return {
      badge: 'bg-blue-100 text-blue-800 border border-blue-200',
      icon: 'text-blue-500',
      bg: 'bg-blue-50'
    };
    case 'exchanged': return {
      badge: 'bg-purple-100 text-purple-800 border border-purple-200',
      icon: 'text-purple-500',
      bg: 'bg-purple-50'
    };
    default: return {
      badge: 'bg-gray-100 text-gray-800 border border-gray-200',
      icon: 'text-gray-500',
      bg: 'bg-gray-50'
    };
  }
};

// Define types for our props with minimal required properties
interface OwnerDashboardClientProps {
  user: {
    firstName: string;
    name: string;
    imageUrl?: string;
  };
  stats: {
    totalBooks: number;
    availableBooks: number;
    rentedBooks: number;
    exchangedBooks: number;
  };
  recentBooks: any[];
}

// Memo the stat card for better performance
const StatCard = memo(({ title, value, icon: Icon, color, percentage }: any) => (
  <Card className={`bg-white overflow-hidden border-t-4 ${color}`}>
    <Card.Content className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="bg-opacity-20 p-3 rounded-lg" style={{ backgroundColor: color }}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      
      {percentage !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="rounded-full h-2" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
          </div>
          <p className="mt-1 text-xs text-gray-500">{percentage}% of your collection</p>
        </div>
      )}
    </Card.Content>
  </Card>
));

// Memo the book table row for better performance
const BookTableRow = memo(({ book, index }: { book: any, index: number }) => {
  const statusColors = getStatusColor(book.status);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <tr key={book.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="relative h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-gray-100 mr-3">
            {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className={`h-full w-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <BookOpen className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{book.title}</h3>
            <p className="text-xs text-gray-600">{book.author}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.badge}`}>
          {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {timeAgo(book.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {book.genre || "—"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <div className="flex justify-end gap-2">
          <NavLink href={`/dashboard/owner/books/edit/${book.id}`}>
            <Button variant="outline" size="sm" className="text-gray-600 px-2 py-1">
              Edit
            </Button>
          </NavLink>
          <NavLink href={`/books/${book.id}`}>
            <Button size="sm" className="text-white px-2 py-1">
              View
            </Button>
          </NavLink>
        </div>
      </td>
    </tr>
  );
});

export default function OwnerDashboardClient({
  user,
  stats,
  recentBooks
}: OwnerDashboardClientProps) {
  const [greeting, setGreeting] = useState('');
  const firstName = user.firstName || user.name.split(' ')[0];
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Calculate the percentage of books by status for the visual representation
  const totalBooks = stats.totalBooks > 0 ? stats.totalBooks : 1; // Prevent division by zero
  const availablePercentage = Math.round((stats.availableBooks / totalBooks) * 100);
  const rentedPercentage = Math.round((stats.rentedBooks / totalBooks) * 100);
  const exchangedPercentage = Math.round((stats.exchangedBooks / totalBooks) * 100);

  return (
    <DashboardLayout>
      {/* Welcome Header Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {firstName}!
            </h1>
            <p className="mt-2 text-gray-600 max-w-xl">
              Welcome to your BookShare dashboard. Manage your books, track their status, and connect with other book lovers.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-3">
            <NavLink href="/books">
              <Button variant="outline" className="flex items-center gap-2 bg-white">
                <Search size={16} />
                Browse Books
              </Button>
            </NavLink>
            <NavLink href="/dashboard/owner/books/new">
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Add New Book
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
      
      {/* Stats Overview with visual elements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="mr-2 text-blue-600" size={20} />
          Book Statistics
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <StatCard 
            title="Total Books" 
            value={stats.totalBooks} 
            icon={BookOpen} 
            color="border-t-blue-500" 
            percentage={100} 
          />
          <StatCard 
            title="Available" 
            value={stats.availableBooks} 
            icon={Eye} 
            color="border-t-green-500" 
            percentage={availablePercentage} 
          />
          <StatCard 
            title="Rented" 
            value={stats.rentedBooks} 
            icon={ArrowUpRight} 
            color="border-t-blue-500" 
            percentage={rentedPercentage} 
          />
          <StatCard 
            title="Exchanged" 
            value={stats.exchangedBooks} 
            icon={TrendingUp} 
            color="border-t-purple-500" 
            percentage={exchangedPercentage} 
          />
        </div>
      </div>
      
      {/* Books Section */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="mr-2 text-blue-600" size={20} />
            Your Books Library
          </h2>
          <div className="flex gap-3">
            <NavLink href="/dashboard/owner/books/new">
              <Button size="sm" className="flex items-center gap-2">
                <PlusCircle size={16} />
                Add Book
              </Button>
            </NavLink>
            <NavLink href="/dashboard/owner/books">
              <Button variant="outline" size="sm" className="flex items-center gap-1 group">
                View All <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </NavLink>
          </div>
        </div>
        
        {recentBooks.length === 0 ? (
          <Card className="bg-white p-8 text-center">
            <div className="rounded-full bg-blue-50 p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Your library is empty
            </h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Add your first book to start sharing with others in your community. It only takes a minute!
            </p>
            <div className="mt-6">
              <NavLink href="/dashboard/owner/books/new">
                <Button className="px-8 py-2.5">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Your First Book
                </Button>
              </NavLink>
            </div>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Book</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Added</th>
                    <th className="px-6 py-4">Genre</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentBooks.map((book, index) => (
                    <BookTableRow key={book.id} book={book} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
            
            {stats.totalBooks > recentBooks.length && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                <NavLink href="/dashboard/owner/books">
                  <Button variant="outline">
                    View All {stats.totalBooks} Books
                  </Button>
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}