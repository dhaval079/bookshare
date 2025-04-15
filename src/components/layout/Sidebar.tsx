'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, PlusCircle, List, Search, User } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import NavLink from '../ui/NavLink';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  
  const userRole = user?.publicMetadata?.role as string || 'unknown';
  
  const ownerLinks = [
    {
      href: '/dashboard/owner',
      label: 'Dashboard',
      icon: BookOpen,
    },
    {
      href: '/dashboard/owner/books',
      label: 'My Books',
      icon: List,
    },
    {
      href: '/dashboard/owner/books/new',
      label: 'Add Book',
      icon: PlusCircle,
    },
  ];
  
  const seekerLinks = [
    {
      href: '/dashboard/seeker',
      label: 'Dashboard',
      icon: Search,
    },
  ];
  
  const links = userRole === 'owner' ? ownerLinks : seekerLinks;
  
  return (
    <div className="fixed inset-y-0 left-0 z-10 hidden w-64 transform bg-white shadow-lg transition duration-300 sm:block">
      <div className="flex h-16 items-center px-6">
        <NavLink href="/" className="flex items-center">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold">BookShare</span>
        </NavLink>
      </div>
      
      <nav className="flex flex-col p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <NavLink
              key={link.href}
              href={link.href}
              className={`mb-1 flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {link.label}
            </NavLink>
          );
        })}
        
        <div className="my-4 h-px bg-gray-200" />
        
        <NavLink
          href="/dashboard/profile"
          className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            pathname === '/dashboard/profile'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User className="mr-3 h-5 w-5" />
          Profile
        </NavLink>
      </nav>
    </div>
  );
}