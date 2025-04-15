// src/app/books/[id]/page.tsx
import { notFound } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import NavLink from '@/components/ui/NavLink';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { BookOpen, MapPin, Calendar, ArrowLeft, MessageCircle, Share2 } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Params } from 'next/dist/server/request/params';

type BookPageProps = {
  params: {
    id: string;
  };
  searchParams?: Record<string, string | string[]>;
};

export default async function BookPage(props: any) {
  const { id } = props.params;
  const { userId } = await auth();
  const user = await currentUser();

  // Fetch book details
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          mobileNumber: true,
          clerkId: true,
          bio: true,
          location: true,
        },
      },
    },
  });

  if (!book) {
    notFound();
  }

  // Check if current user is the owner
  const isOwner = Boolean(userId && book.owner.clerkId === userId);

  // Fetch related books (same genre or same author)
  const relatedBooks = await prisma.book.findMany({
    where: {
      id: { not: id },
      status: 'available',
      OR: [{ genre: book.genre }, { author: book.author }],
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
    take: 4,
  });

  // Generate placeholder image URL based on book title
  const imageUrl =
    book.coverImage ||
    `/api/placeholder/400/600?text=${encodeURIComponent(book.title)}`;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <div className="mb-8">
          <NavLink
            href="/books"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all books
          </NavLink>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src={imageUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-6 space-y-4">
                <Button variant="primary" fullWidth className="py-3 rounded-xl">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Owner
                </Button>
                <Button variant="outline" fullWidth className="py-3 rounded-xl">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Book
                </Button>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-700 mt-1">by {book.author}</p>
                </div>
                <Badge
                  status={book.status as 'available' | 'rented' | 'exchanged'}
                  className="text-sm"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {book.genre && (
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-700">
                      Genre: <span className="font-medium">{book.genre}</span>
                    </span>
                  </div>
                )}
                {book.condition && (
                  <div className="flex items-center">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      Condition:{' '}
                      {book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">{book.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">
                    Listed on {formatDate(book.createdAt)}
                  </span>
                </div>
              </div>

              {book.description && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <div className="prose prose-blue max-w-none text-gray-600">
                    <p>{book.description}</p>
                  </div>
                </div>
              )}

              <div className="mt-10 pt-10 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Owner</h2>
                <div className="flex items-start">
                  <Avatar name={book.owner.name} size="lg" className="mr-4" />
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">{book.owner.name}</h3>
                    {book.owner.location && (
                      <p className="text-gray-600 text-sm flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {book.owner.location}
                      </p>
                    )}
                    {book.owner.bio && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {book.owner.bio}
                      </p>
                    )}
                    <div className="mt-3">
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                        Contact: {book.contactInfo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="mt-8 bg-blue-50 rounded-xl p-4">
                  <h3 className="font-medium text-blue-800">
                    You are the owner of this book
                  </h3>
                  <div className="mt-3 flex space-x-3">
                    <NavLink href={`/dashboard/owner/books/edit/${book.id}`}>
                      <Button size="sm">Edit Book</Button>
                    </NavLink>
                    <Button variant="outline" size="sm">
                      Change Status
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <NavLink
                  key={relatedBook.id}
                  href={`/books/${relatedBook.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md transition transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="aspect-[2/3] relative">
                      <Image
                        src={
                          relatedBook.coverImage ||
                          `/api/placeholder/300/450?text=${encodeURIComponent(
                            relatedBook.title
                          )}`
                        }
                        alt={relatedBook.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                        {relatedBook.title}
                      </h3>
                      <p className="text-sm text-gray-600">{relatedBook.author}</p>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}