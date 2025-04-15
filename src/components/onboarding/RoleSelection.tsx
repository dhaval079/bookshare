// src/components/onboarding/RoleSelection.tsx
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { BookOpen, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUser } from '@clerk/nextjs';

// Inner component that safely uses search params
function RoleSelectionContent() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const handleSubmit = async () => {
    if (!role) {
      toast.error('Please select a role');
      return;
    }
    
    if (!isLoaded || !user) {
      toast.error('User not loaded yet');
      return;
    }
    
    try {
      setLoading(true);
      setDebugInfo('Starting role update process');
      
      // Add some user debug info
      const debugUserInfo = {
        id: user.id,
        fullName: user.fullName,
        primaryEmail: user.primaryEmailAddress?.emailAddress,
      };
      
      setDebugInfo(`User info: ${JSON.stringify(debugUserInfo)}`);
      
      // First update user role in our DB
      setDebugInfo('Sending fetch request to /api/user');
      
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      
      const responseData = await response.json();
      setDebugInfo(`API response status: ${response.status}, data: ${JSON.stringify(responseData)}`);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update user role');
      }
      
      // Then update user role in Clerk (if DB update succeeds)
      setDebugInfo('Updating Clerk user metadata');
      
      try {
        await user.update({
          unsafeMetadata: {
            role,
          },
        });
        setDebugInfo('Clerk update successful');
      } catch (clerkError) {
        console.error('Clerk update error:', clerkError);
        setDebugInfo(`Clerk update failed: ${clerkError instanceof Error ? clerkError.message : String(clerkError)}`);
        // Continue even if Clerk update fails - we'll handle it on next login
      }
      
      toast.success('Role updated successfully!');
      setDebugInfo('Role update successful, redirecting...');
      
      // Redirect to appropriate dashboard
      router.push(role === 'owner' ? '/dashboard/owner' : '/dashboard/seeker');
    } catch (error) {
      console.error('Error updating role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update role. Please try again.';
      setDebugInfo(`Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-md py-8">
      <h1 className="text-center text-2xl font-bold text-gray-900">
        Choose Your Role
      </h1>
      <p className="mt-2 text-center text-gray-600">
        Select how you want to use the Book Exchange Portal
      </p>
      
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div
          className={`cursor-pointer rounded-lg border p-6 ${
            role === 'owner'
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
              : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
          }`}
          onClick={() => setRole('owner')}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-4 text-center text-lg font-medium text-gray-900">
            Book Owner
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            List your books for others to rent or exchange
          </p>
        </div>
        
        <div
          className={`cursor-pointer rounded-lg border p-6 ${
            role === 'seeker'
              ? 'border-green-500 bg-green-50 ring-2 ring-green-500'
              : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
          }`}
          onClick={() => setRole('seeker')}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Search className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-4 text-center text-lg font-medium text-gray-900">
            Book Seeker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Find books to rent or exchange from other users
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <Button
          onClick={handleSubmit}
          loading={loading}
          fullWidth
          disabled={!role}
        >
          Continue
        </Button>
      </div>
      
      {debugInfo && (
        <div className="mt-6 rounded-md border border-gray-300 bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-700">Debug Information:</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-600">
            {debugInfo}
          </pre>
        </div>
      )}
    </div>
  );
}

// Main component that exports the role selection functionality
export default function RoleSelection() {
  // This component doesn't directly use useSearchParams, but wraps
  // the content component in its own Suspense boundary for safety
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <RoleSelectionContent />
    </Suspense>
  );
}