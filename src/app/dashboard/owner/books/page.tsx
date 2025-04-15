// src/app/dashboard/owner/books/page.tsx
// This is a server component (no 'use client' directive)
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import MyBooksClient from './MyBooksClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function MyBooksPage() {
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
  
  // Fetch user's books
  const books = await prisma.book.findMany({
    where: { ownerId: dbUser.id },
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
  });
  
  return <MyBooksClient initialBooks={books} />;
}