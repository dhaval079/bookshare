// src/components/ui/Badge.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  status: 'available' | 'rented' | 'exchanged';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  animated?: boolean;
}

export default function Badge({ 
  status, 
  className = '', 
  size = 'md',
  showDot = true,
  animated = false 
}: BadgeProps) {
  const statusClasses = {
    available: 'bg-green-100 text-green-800 border-green-200',
    rented: 'bg-blue-100 text-blue-800 border-blue-200',
    exchanged: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  const dotColors = {
    available: 'bg-green-500',
    rented: 'bg-blue-500',
    exchanged: 'bg-gray-500',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };
  
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  
  const BadgeComponent = animated ? motion.span : 'span';
  const animationProps = animated ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 500, damping: 30 },
  } : {};

  return (
    <BadgeComponent
      {...animationProps}
      className={cn(
        `inline-flex items-center rounded-full border ${statusClasses[status]} ${sizes[size]}`,
        className
      )}
    >
      {showDot && (
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotColors[status]}`}></span>
      )}
      {label}
    </BadgeComponent>
  );
}