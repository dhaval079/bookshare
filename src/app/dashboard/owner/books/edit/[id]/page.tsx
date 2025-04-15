import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BookForm from '@/components/books/BookForm';
import Card from '@/components/ui/Card';
import prisma from '@/lib/prisma';
import { BookFormData } from '@/types';


export default async function EditBookPage(props: any) {
  const { id } = props.params;
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
  
  // Fetch book details
  const book = await prisma.book.findUnique({
    where: { id },
  });
  
  if (!book) {
    notFound();
  }
  
  // Check if current user is the owner of the book
  if (book.ownerId !== dbUser.id) {
    redirect('/dashboard/owner/books');
  }
  
  // Extract required form data
  const formData: BookFormData = {
    title: book.title,
    author: book.author,
    genre: book.genre || '',
    description: book.description || '',
    location: book.location,
    contactInfo: book.contactInfo,
    condition: book.condition as any || 'good',
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Book
        </h1>
        <p className="mt-1 text-gray-600">
          Update the details of your book listing.
        </p>
      </div>
      
      <Card>
        <Card.Content>
          <BookForm 
            initialData={formData} 
            isEditing 
            bookId={id} 
          />
        </Card.Content>
      </Card>
    </DashboardLayout>
  );
}