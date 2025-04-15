// src/app/api/books/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { getCache, setCache } from '@/lib/redis';

// In-memory LRU cache as fallback (if Redis is not available)
const MEMORY_CACHE = new Map<string, { data: any; expiry: number }>();
const CACHE_SIZE_LIMIT = 50;
const CACHE_TTL = 60 * 1000; // 60 seconds

// Helper function to get from memory cache
function getFromMemoryCache(key: string) {
  const item = MEMORY_CACHE.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    MEMORY_CACHE.delete(key);
    return null;
  }
  
  return item.data;
}

// Helper function to set to memory cache
function setToMemoryCache(key: string, data: any) {
  // Clean up cache if it's too large
  if (MEMORY_CACHE.size >= CACHE_SIZE_LIMIT) {
    const oldestKey = MEMORY_CACHE.keys().next().value;
    if (oldestKey !== undefined) {
      MEMORY_CACHE.delete(oldestKey);
    }
  }
  
  MEMORY_CACHE.set(key, { 
    data, 
    expiry: Date.now() + CACHE_TTL 
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPreload = request.headers.get('x-preload') === 'true';
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const ownerId = searchParams.get('ownerId');
    const title = searchParams.get('title');
    const author = searchParams.get('author');
    const location = searchParams.get('location');
    const genre = searchParams.get('genre');
    const status = searchParams.get('status');
    
    // Generate cache key based on query parameters
    const cacheKey = `books:${page}:${limit}:${ownerId || ''}:${title || ''}:${author || ''}:${location || ''}:${genre || ''}:${status || ''}`;
    
    // Try to get from cache (Redis or memory)
    const cachedData = await getCache(cacheKey) || getFromMemoryCache(cacheKey);
    
    if (cachedData && !isPreload) {
      return NextResponse.json(cachedData);
    }
    
    // Build query conditions
    const where: any = {};
    
    if (ownerId) where.ownerId = ownerId;
    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (author) where.author = { contains: author, mode: 'insensitive' };
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (genre) where.genre = { contains: genre, mode: 'insensitive' };
    if (status) where.status = status;
    
    // Use a transaction to perform both queries in a single database round trip
    const [totalCount, books] = await prisma.$transaction([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              // Only include essential fields
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      })
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    const responseData = {
      books,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages,
      }
    };
    
    // Cache the result
    await setCache(cacheKey, responseData, 60); // Cache for 60 seconds
    setToMemoryCache(cacheKey, responseData);
    
    // If this is a preload request, return a lightweight response
    if (isPreload) {
      return NextResponse.json({ success: true, cached: true });
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Get the user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user is an owner
    if (user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only book owners can create listings' },
        { status: 403 }
      );
    }
    
    // Create new book
    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        genre: data.genre,
        description: data.description,
        location: data.location,
        contactInfo: data.contactInfo,
        status: 'available',
        condition: data.condition,
        coverImage: data.coverImage,
        ownerId: user.id,
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
    });
    
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book listing' },
      { status: 500 }
    );
  }
}