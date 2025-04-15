// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// Simple in-memory cache with reduced TTL
const userCache = new Map();
const CACHE_TTL = 30000; // 30 seconds in ms - reduced from 60 seconds

export async function GET(request: Request) {
  try {
    // Get auth info
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check cache first
    const cachedUser = userCache.get(userId);
    if (cachedUser) {
      const { data, timestamp } = cachedUser;
      
      // Return cached data if still fresh
      if (Date.now() - timestamp < CACHE_TTL) {
        return NextResponse.json(data);
      }
      
      // Cache expired, delete it
      userCache.delete(userId);
    }
    
    // Get the user data from our DB
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }
    
    // Update cache
    userCache.set(userId, {
      data: user,
      timestamp: Date.now()
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in GET /api/user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get auth info
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Clear cache for this user
    userCache.delete(userId);
    
    // Get the current user from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'User not found in Clerk' },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    
    // Extract email with enhanced logging and error handling
    let primaryEmail = '';
    let emailDebugLog = [];
    
    try {
      // Check for primary email address
      if (clerkUser.primaryEmailAddressId) {
        emailDebugLog.push(`Primary email ID found: ${clerkUser.primaryEmailAddressId}`);
        
        // Verify emailAddresses array exists
        if (clerkUser.emailAddresses && Array.isArray(clerkUser.emailAddresses)) {
          const emailObj = clerkUser.emailAddresses.find(
            email => email.id === clerkUser.primaryEmailAddressId
          );
          
          if (emailObj) {
            emailDebugLog.push(`Found primary email object`);
            
            if (emailObj.emailAddress) {
              primaryEmail = emailObj.emailAddress;
              emailDebugLog.push(`Set primary email to: ${primaryEmail}`);
            } else {
              emailDebugLog.push(`Primary email object missing emailAddress property`);
            }
          } else {
            emailDebugLog.push(`Could not find email object matching primary ID`);
          }
        } else {
          emailDebugLog.push(`No valid emailAddresses array found`);
        }
      } else {
        emailDebugLog.push(`No primaryEmailAddressId found`);
      }
      
      // Try fallback to first email if primary not found
      if (!primaryEmail && clerkUser.emailAddresses && 
          Array.isArray(clerkUser.emailAddresses) && 
          clerkUser.emailAddresses.length > 0) {
        
        emailDebugLog.push(`Using fallback: first available email`);
        
        const firstEmail = clerkUser.emailAddresses[0];
        if (firstEmail && firstEmail.emailAddress) {
          primaryEmail = firstEmail.emailAddress;
          emailDebugLog.push(`Set email to first available: ${primaryEmail}`);
        } else {
          emailDebugLog.push(`First email object missing emailAddress property`);
        }
      }
    } catch (emailError: unknown) {
      emailDebugLog.push(`Error extracting email: ${emailError instanceof Error ? emailError.message : String(emailError)}`);
      console.error('Email extraction error:', emailError);
    }
    
    // Log email extraction process
    console.log('User API - Email extraction log:', emailDebugLog.join(' → '));
    
    // If no email found, check for existing user email
    if (!primaryEmail) {
      console.log(`Warning: Could not extract email from Clerk user ${userId}`);
      
      // Try to get existing email from database
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { email: true }
      });
      
      if (existingUser && existingUser.email) {
        primaryEmail = existingUser.email;
        console.log(`Using existing email from database: ${primaryEmail}`);
      } else {
        return NextResponse.json(
          { error: 'Unable to determine user email address' },
          { status: 400 }
        );
      }
    }
    
    // Check if user exists in database
    const userExists = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    
    let user;
    
    if (userExists) {
      // Update existing user
      user = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          role: data.role,
          mobileNumber: data.mobileNumber || userExists.mobileNumber,
          location: data.location || userExists.location,
          bio: data.bio || userExists.bio,
          email: primaryEmail, // Ensure email is up to date
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : (clerkUser.firstName || clerkUser.username || userExists.name),
        },
      });
    } else {
      // User doesn't exist in our database yet - create them with Clerk data
      try {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            name: clerkUser.firstName && clerkUser.lastName 
              ? `${clerkUser.firstName} ${clerkUser.lastName}` 
              : (clerkUser.firstName || clerkUser.username || 'New User'),
            email: primaryEmail,
            role: data.role,
            mobileNumber: data.mobileNumber || '',
            location: data.location || '',
            bio: data.bio || '',
          },
        });
      } catch (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user record', details: createError instanceof Error ? createError.message : String(createError) },
          { status: 500 }
        );
      }
    }
    
    // Update cache with new data
    userCache.set(userId, {
      data: user,
      timestamp: Date.now()
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in PUT /api/user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}