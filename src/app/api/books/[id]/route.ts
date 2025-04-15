import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, context: { params: any }) {
  // cast id to string (if it might be an array, take the first element)
  const { id } = context.params as { id: string };

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, mobileNumber: true },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: any }) {
  const { id } = context.params as { id: string };

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Get the user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the book
    const book = await prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Check if user is the owner
    if (book.ownerId !== user.id) {
      return NextResponse.json({ error: 'You can only update your own books' }, { status: 403 });
    }

    // Update book
    const updatedBook = await prisma.book.update({
      where: { id },
      data,
      include: {
        owner: {
          select: { id: true, name: true, email: true, mobileNumber: true },
        },
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: any }) {
  const { id } = context.params as { id: string };

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the book
    const book = await prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Check if user is the owner
    if (book.ownerId !== user.id) {
      return NextResponse.json({ error: 'You can only delete your own books' }, { status: 403 });
    }

    // Delete book
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
