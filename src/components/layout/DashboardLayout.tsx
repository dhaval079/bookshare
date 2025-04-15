'use client';

import { ReactNode, useState, useEffect, memo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { 
  BookText, Library, PlusCircle, List, Search, User, 
  ChevronLeft, ChevronRight, LogOut, Home 
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import { useRouter } from 'next/navigation';
import NavLink from '../ui/NavLink';
import { useLoading } from '@/components/LoadingProvider';

// Memoize navigation link to prevent unnecessary rendering
const NavItem = memo(({ href, icon: Icon, label, isActive, collapsed, onClick }: {
  href: string;
  icon: any;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) => (
  <NavLink
    href={href}
    className={`mb-1 flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
    onClick={onClick}
    prefetch={true}
  >
    <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
    {!collapsed && <span>{label}</span>}
  </NavLink>
));

NavItem.displayName = 'NavItem';

// Memoize user profile section to prevent unnecessary rendering
const UserProfile = memo(({ user, userRole, collapsed }: {
  user: any;
  userRole: string;
  collapsed: boolean;
}) => (
  <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50 p-4">
    {collapsed ? (
      <div className="flex justify-center">
        <Avatar
          name={user?.fullName || user?.username || ''}
          src={user?.imageUrl}
          size="sm"
        />
      </div>
    ) : (
      <div className="flex items-center">
        <Avatar
          name={user?.fullName || user?.username || ''}
          src={user?.imageUrl}
        />
        <div className="ml-3 overflow-hidden">
          <p className="truncate text-sm font-medium text-gray-900">
            {user?.fullName || user?.username}
          </p>
          <p className="truncate text-xs text-gray-500">
            {userRole === 'owner' ? 'Book Owner' : 'Book Seeker'}
          </p>
        </div>
      </div>
    )}
  </div>
));

UserProfile.displayName = 'UserProfile';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  
  // Get user role from metadata
  const userRole = user?.publicMetadata?.role as string || 'unknown';
  
  // Check if on mobile - only calculate on mount or window resize
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      const newIsMobile = window.innerWidth < 1024;
      setIsMobile(newIsMobile);
      // On mobile, sidebar should be collapsed by default
      if (newIsMobile !== isMobile) {
        setCollapsed(newIsMobile);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isMobile]);
  
  // Memoized sign out handler to prevent recreation
  const handleSignOut = useCallback(async () => {
    try {
      startLoading();
      await signOut();
      router.push('/');
    } finally {
      stopLoading();
    }
  }, [signOut, router, startLoading, stopLoading]);

  // Define navigation links once
  const ownerLinks = [
    {
      href: '/dashboard/owner',
      label: 'Dashboard',
      icon: Home,
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
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: User,
    },
  ];
  
  const seekerLinks = [
    {
      href: '/dashboard/seeker',
      label: 'Dashboard',
      icon: Search,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: User,
    },
  ];
  
  // Select links based on user role
  const links = userRole === 'owner' ? ownerLinks : seekerLinks;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          animate={{ width: collapsed ? '72px' : (isMobile ? '100%' : '240px') }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-y-0 left-0 z-20 bg-white shadow-lg lg:block ${isMobile && collapsed ? 'hidden' : ''}`}
        >
          <div className="flex h-16 items-center justify-between px-4">
            {!collapsed && (
              <NavLink href="/" className="flex items-center group">
                <Library className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold">BookShare</span>
              </NavLink>
            )}
            
            {collapsed && (
              <Library className="h-8 w-8 text-blue-600 mx-auto" />
            )}
            
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          
          <nav className="flex flex-col p-4">
            {links.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={pathname === link.href}
                collapsed={collapsed}
                onClick={isMobile ? () => setCollapsed(true) : undefined}
              />
            ))}
            
            <div className="my-4 h-px bg-gray-200" />
            
            <button
              onClick={handleSignOut}
              className={`flex items-center rounded-md px-4 py-2 text-sm font-medium text-red-500 transition-colors duration-200 hover:bg-red-50 ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </nav>
          
          {/* User profile section */}
          {isLoaded && user && (
            <UserProfile 
              user={user} 
              userRole={userRole} 
              collapsed={collapsed}
            />
          )}
        </motion.div>
        
        {/* Mobile overlay when sidebar is open */}
        {isMobile && !collapsed && (
          <div 
            className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
        
        {/* Main content */}
        <motion.div
          animate={{ marginLeft: collapsed || isMobile ? '0px' : '240px' }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 flex-col min-h-screen"
        >
          {isMobile && (
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center">
                  <button 
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <span className="ml-2 text-lg font-medium">Dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium hidden sm:block">{user?.firstName || user?.username}</span>
                  <Avatar
                    name={user?.fullName || user?.username || ''}
                    src={user?.imageUrl}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          <main className="flex-1 py-8">
            <Container>
              {children}
            </Container>
          </main>
        </motion.div>
      </div>
    </div>
  );
}