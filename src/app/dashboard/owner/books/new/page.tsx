// src/app/dashboard/owner/books/new/page.tsx
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import BookFormClientWrapper from '@/components/BookFormWrapper2'; 

// Force dynamic rendering
export const dynamic = 'force-dynamic'; // Note the correct export name

export default async function NewBookPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // If user is not an owner, redirect
  if (!dbUser || dbUser.role !== 'owner') {
    redirect('/dashboard');
  }

  // Get genres for dropdown
  const genres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy',
    'Mystery', 'Thriller', 'Romance', 'Biography',
    'History', 'Self-Help', 'Business', 'Science',
    'Technology', 'Art', 'Poetry', 'Travel',
    'Cooking', 'Children', 'Young Adult', 'Comics',
    'Religion', 'Philosophy'
  ];

  // Pass props to the client component wrapper
  return <BookFormClientWrapper genres={genres} user={dbUser} />;
}