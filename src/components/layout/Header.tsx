'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, X, LogOut, User as UserIcon, 
  Home, Book, Bell, ChevronDown, 
  Search,
  BookAIcon
} from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import NavLink from '../ui/NavLink';
import Button from '../ui/Button';
import { useLoading } from '@/components/LoadingProvider';
import Link from 'next/link';

// The HeaderLogo is memoized to prevent unnecessary re-renders
const HeaderLogo = () => (
  <NavLink href="/" className="flex items-center">
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"></div>
      <svg 
        className="relative z-10 text-white w-6 h-6"
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span className="ml-2.5 text-xl font-bold text-gray-900 tracking-tight">BookShare</span>
  </NavLink>
);

// Notification icon
const NotificationsIcon = ({ count }: { count: number }) => (
  <div className="relative">
    <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  </div>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications] = useState(3); // Example notification count
  const { signOut } = useClerk();
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { startLoading } = useLoading();

  // Get user role from metadata
  const userRole = user?.unsafeMetadata?.role as string;

  const getDashboardLink = () => {
    if (!userRole) return '/auth/role-selection';
    return userRole === 'owner' ? '/dashboard/owner' : '/dashboard/seeker';
  };

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    startLoading();
    await signOut();
    router.push('/');
  };

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    startLoading();
    router.push(href);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileOpen && 
        profileRef.current && 
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      
      if (
        isSearchOpen && 
        searchInputRef.current && 
        event.target !== searchInputRef.current && 
        !(event.target instanceof Element && event.target.closest('.search-container'))
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen, isSearchOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="mx-auto justify-center items-center max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <HeaderLogo />

          {/* Navigation */}
          <div className="hidden items-center ml-28 md:flex justify-center space-x-4">
            <div className="flex items-center space-x-1">
              {/* Fixed: Added newTab={true} to open in a new tab */}
              <Button href="/books"     variant="secondary"
    className="mx-3 px-3 py-2 flex items-center rounded-full transition-all duration-300 bg-blue-100 hover:bg-blue-200 hover:text-blue-700 hover:shadow-sm"
    newTab={true}>
      <BookAIcon className="mr-1.5 h-4 w-4" />
                Browse Books
              </Button>
              
              {isSignedIn && isLoaded && (
  <Button
    variant="outline"
    onClick={() => window.open(getDashboardLink(), '_blank')}
    className="mx-3 px-3 py-2 flex items-center rounded-full transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
  >
    <Home className="mr-1.5 h-4 w-4" />
    <span className="font-medium">Dashboard</span>
  </Button>
)}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Search Input (expandable) */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 search-container"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search books..."
                    className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications */}
            {isSignedIn && <NotificationsIcon count={notifications} />}

            {/* Role indicator */}
            {isSignedIn && isLoaded && userRole && (
              <div className="hidden md:block">
                <div className={`rounded-full px-4 py-1.5 ${
                  userRole === 'owner' 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  <div className="flex items-center justify-center">
                    <UserIcon className="mr-1.5 h-3.5 w-3.5" />
                    <span className="text-sm font-medium">Book {userRole === 'owner' ? 'Owner' : 'Seeker'}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile */}
            <div className="relative profile-menu mt-1" ref={profileRef}>
              {isSignedIn ? (
                <div>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white p-1.5 pl-2 pr-3 shadow-sm hover:shadow transition-all duration-200"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-white">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="hidden text-sm font-medium text-gray-700 md:block">
                      {user?.firstName || user?.username?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                      >
                        <div className="relative border-b border-gray-100 p-4">
                          <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                          <div className="flex items-center">
                            <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-white shadow-md">
                              {user?.imageUrl ? (
                                <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                  {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {user?.fullName || user?.username}
                              </p>
                              <p className="truncate text-xs text-gray-500">
                                {user?.primaryEmailAddress?.emailAddress}
                              </p>
                              {userRole && (
                                <div className="mt-1">
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                                    ${userRole === 'owner' 
                                      ? 'bg-indigo-100 text-indigo-800' 
                                      : 'bg-green-100 text-green-800'}`}
                                  >
                                    <UserIcon className="mr-1 h-3 w-3" />
                                    Book {userRole === 'owner' ? 'Owner' : 'Seeker'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-1 mt-2">
                        {isSignedIn && isLoaded && (
  <Button
    variant="outline"
    onClick={() => window.open(getDashboardLink(), '_blank')}
    className="mx-3 px-3 py-2 flex items-center rounded-full transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
  >
    <Home className="mr-1.5 h-4 w-4" />
    <span className="font-medium">Dashboard</span>
  </Button>
)}
                          
                          <button
                            onClick={() => handleNavigation('/dashboard/profile')}
                            className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                          >
                            <UserIcon className="mr-3 h-5 w-5 text-gray-500" />
                            Profile
                          </button>
                          
                          <div className="my-1 h-px bg-gray-100 mx-2"></div>
                          
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation('/sign-in')}
                    className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Sign in
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/sign-up')}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:from-blue-600 hover:to-indigo-700"
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="ml-1 md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white shadow-lg"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Fixed: Added newTab={true} to open in a new tab for mobile menu too */}
              <Button href="/books" newTab={true}>
                Browse Books
              </Button>
              
              {isSignedIn && (
                <Button
                  variant="outline"
                  onClick={() => handleNavigation(getDashboardLink())}
                  className="w-full mt-2 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left flex items-center"
                >
                  <Home className="mr-2 h-5 w-5 text-gray-500" />
                  Dashboard
                </Button>
              )}

              {/* Mobile Search */}
              <div className="relative px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search books..."
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            
            {isSignedIn && (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.fullName || user?.username}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.primaryEmailAddress?.emailAddress}
                    </div>
                    {userRole && (
                      <div className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                          ${userRole === 'owner' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-green-100 text-green-800'}`}
                        >
                          <UserIcon className="mr-1 h-3 w-3" />
                          Book {userRole === 'owner' ? 'Owner' : 'Seeker'}
                        </span>
                      </div>
                    )}
                  </div>
                  {notifications > 0 && (
                    <div className="ml-auto">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                        {notifications}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-1 px-2">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation('/dashboard/profile')}
                    className="w-full rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left flex items-center"
                  >
                    <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full rounded-lg px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}