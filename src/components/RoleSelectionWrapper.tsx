'use client';

import dynamic from 'next/dynamic';

// Dynamically import the RoleSelection component, only on the client-side
const RoleSelectionClient = dynamic(
  () => import('@/components/onboarding/RoleSelection'),
  { ssr: false }
);

// Export a wrapper component that renders the dynamic component
export default function RoleSelectionWrapper() {
  return <RoleSelectionClient />;
}