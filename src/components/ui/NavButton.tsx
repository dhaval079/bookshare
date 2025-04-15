'use client';

import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
  href?: string;
  prefetch?: boolean;
}

const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  (
    { 
      children, 
      className = "", 
      variant = "primary", 
      size = "md", 
      loading = false, 
      fullWidth = false, 
      href,
      prefetch = true,
      ...props 
    },
    ref,
  ) => {
    const router = useRouter();

    // Handle navigation - simplified implementation
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled || loading) {
        e.preventDefault();
        return;
      }

      if (href) {
        // For navigation, dispatch route change start event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('routeChangeStart'));
        }
        
        // Navigate
        router.push(href);
      }

      if (props.onClick) {
        props.onClick(e);
      }
    };

    // Base classes
    const baseClasses = cn(
      "relative inline-flex items-center justify-center font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "active:scale-95 transform rounded-full",
      { "w-full": fullWidth },
      { "opacity-70 cursor-not-allowed": props.disabled },
      { "cursor-wait": loading },
    );

    // Variant classes
    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus-visible:ring-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
      outline:
        "border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400 hover:border-gray-400",
    };

    // Size classes
    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-13 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={loading || props.disabled}
        onClick={handleClick}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-full">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {/* Button content with conditional opacity when loading */}
        <span className={cn("flex items-center justify-center gap-2", { "opacity-0": loading })}>
          {children}
        </span>
      </button>
    );
  },
);

NavButton.displayName = "NavButton";

export default NavButton;