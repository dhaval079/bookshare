// app/dashboard/profile/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Phone, MapPin, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';

// Force dynamic rendering to avoid static generation issues with client hooks
export const dynamic = 'force-dynamic';

interface PublicMetadata {
  role?: string;
}

function ProfileContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    location: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      setFormData({
        mobileNumber: userData.mobileNumber || '',
        location: userData.location || '',
        bio: userData.bio || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <p className="mt-1 text-gray-600">Manage your personal information and settings.</p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <Card.Content className="flex flex-col items-center py-6">
              <Avatar
                name={user.fullName || user.username || ''}
                src={user.imageUrl}
                size="lg"
                className="h-24 w-24"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {user.fullName || user.username}
              </h2>
              <p className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
              <div className="mt-6 w-full space-y-2">
                {formData.mobileNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {formData.mobileNumber}
                  </div>
                )}
                {formData.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    {formData.location}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="mr-2 h-4 w-4" />
                  {(user.unsafeMetadata as PublicMetadata).role || 'No role set'}
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" onClick={() => user.update({})}>
                  Edit Profile in Clerk
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium">Profile Information</h2>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Mobile Number"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Your mobile number"
                />
                <Input
                  label="Location"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="A short bio about yourself"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12">Loading dashboard...</div>}>
      <DashboardLayout>
        <ProfileContent />
      </DashboardLayout>
    </Suspense>
  );
}