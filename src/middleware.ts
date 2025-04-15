// src/middleware.ts
import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher, createClerkClient } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/books',
  '/books/(.*)',
  '/api/webhook/clerk',
  '/sign-in',
  '/sign-up',
  // Include static files and other public resources
  '/favicon.ico',
  '/api/placeholder/(.*)'
];

// Create a matcher for the public routes
const isPublic = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for public routes
  if (isPublic(req)) {
    return NextResponse.next();
  }
  
  // For protected routes, check if the user is authenticated
  const { userId } = await auth();
  
  // Initialize response
  let response = NextResponse.next();
  
  // Important performance optimization: use headers to store auth state
  // This prevents redundant Clerk API calls
  if (userId) {
    response.headers.set('x-user-authenticated', 'true');
    response.headers.set('x-user-id', userId);
  }
  
  return response;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};