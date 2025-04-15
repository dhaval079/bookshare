import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Container from '@/components/ui/Container';
import prisma from '@/lib/prisma';
import RoleSelectionWrapper from '@/components/RoleSelectionWrapper';

export default async function RoleSelectionPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (dbUser?.role) {
    redirect(dbUser.role === 'owner' ? '/dashboard/owner' : '/dashboard/seeker');
  }

  return (
    <Container size="sm" className="py-12">
      <Suspense fallback={<div>Loading role selection...</div>}>
        <RoleSelectionWrapper />
      </Suspense>
    </Container>
  );
}