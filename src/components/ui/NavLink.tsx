'use client';

import { ReactNode, forwardRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLoading } from '@/components/LoadingProvider';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, className = '', prefetch = true, onClick, ...props }, ref) => {
    const pathname = usePathname();
    const router = useRouter();
    const { startLoading } = useLoading();
    const isActive = pathname === href;
    
    // Handle external links
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // If link is disabled, don't proceed
      if (props.disabled) {
        e.preventDefault();
        return;
      }

      // For internal links that aren't the current page, show loading state
      if (!isExternal && href !== pathname) {
        // Dispatch custom event for loading indicator
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('routeChangeStart'));
          startLoading(); // Also use the LoadingProvider directly
        }
      }

      // Call the original onClick if provided
      if (onClick) {
        onClick(e);
      }
    };

    // For external links, use regular anchor tag
    if (isExternal) {
      return (
        <a 
          ref={ref}
          href={href}
          className={`${className} ${isActive ? 'active' : ''}`}
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    // For internal links, use Next.js Link
    return (
      <Link
        ref={ref}
        href={href}
        className={`${className} ${isActive ? 'active' : ''}`}
        onClick={handleClick}
        prefetch={prefetch}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = 'NavLink';

export default NavLink;