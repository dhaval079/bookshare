"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  fullWidth?: boolean
  className?: string
  children?: React.ReactNode
  href?: string
  newTab?: boolean
}

const EnhancedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      children, 
      className = "", 
      variant = "primary", 
      size = "md", 
      loading = false, 
      fullWidth = false, 
      href,
      newTab = false,
      ...props 
    },
    ref,
  ) => {
    // Base classes
    const baseClasses = cn(
      "relative inline-flex items-center justify-center font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "active:scale-95 transform rounded-full",
      { "w-full": fullWidth },
      { "opacity-70 cursor-not-allowed": props.disabled },
      { "cursor-wait": loading },
    )

    // Variant classes
    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus-visible:ring-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
      outline:
        "border-2 border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400 hover:border-gray-400",
    }

    // Size classes
    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-13 px-8 text-base",
    }

    const buttonClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className,
    )

    // Loading content
    const loadingSpinner = loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-full">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )

    // Content with conditional opacity during loading
    const buttonContent = (
      <span className={cn("flex items-center justify-center gap-2", { "opacity-0": loading })}>
        {children}
      </span>
    )

    // If an href is provided, render as a link
    if (href) {
      if (newTab) {
        // External link or open in new tab
        return (
          <a
            href={href}
            className={buttonClasses}
            target="_blank"
            rel="noopener noreferrer"
            {...(props as any)}
          >
            {loadingSpinner}
            {buttonContent}
          </a>
        )
      } else {
        // Internal link using Next.js Link
        return (
          <Link
            href={href}
            className={buttonClasses}
            {...(props as any)}
          >
            {loadingSpinner}
            {buttonContent}
          </Link>
        )
      }
    }

    // Default: render as a button
    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={loading || props.disabled}
        {...props}
      >
        {loadingSpinner}
        {buttonContent}
      </button>
    )
  },
)

EnhancedButton.displayName = "EnhancedButton"

export default EnhancedButton