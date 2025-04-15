// src/lib/utils.ts
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export const bookConditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export const bookStatuses = [
  { value: 'available', label: 'Available' },
  { value: 'rented', label: 'Rented' },
  { value: 'exchanged', label: 'Exchanged' },
];

// Common book genres for filtering
export const bookGenres = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Science',
  'Technology',
  'Art',
  'Poetry',
  'Travel',
  'Cooking',
  'Children',
  'Young Adult',
  'Comics',
  'Religion',
  'Philosophy',
];

// Generate random color from a string (consistent for same input)
export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 95%)`;
}

// Format phone number for display
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number has a valid length
  if (cleaned.length < 10) return phoneNumber;
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format as +X XXX XXX XXXX for international numbers
  return `+${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
}

// Format email addresses to partially hide them for privacy
export function formatEmailForPrivacy(email: string): string {
  const [username, domain] = email.split('@');
  
  // Show only first and last character of username, hide the rest with *
  const hiddenUsername = username.length > 2
    ? `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}`
    : username;
  
  return `${hiddenUsername}@${domain}`;
}

// Get time elapsed since a date (e.g., "2 days ago")
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a month
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Less than a year
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  
  // More than a year
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

// Generate random avatars by name
export function getAvatarUrl(name: string, size = 200) {
  // For a real app, you'd use a service like UI Avatars or Dicebear
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random`;
}

// Format book details for metadata
export function getBookMetadata(book: any) {
  return {
    title: `${book.title} by ${book.author} | BookShare`,
    description: book.description || `${book.title} by ${book.author}. Available for ${book.status === 'available' ? 'rent or exchange' : book.status} in ${book.location}.`,
    openGraph: {
      title: `${book.title} by ${book.author}`,
      description: truncateText(book.description || `Available for ${book.status === 'available' ? 'rent or exchange' : book.status} in ${book.location}.`, 160),
      images: [{ url: book.coverImage || `/api/placeholder/300/450?text=${encodeURIComponent(book.title)}` }],
    },
  };
}

// Convert a date to a relative time string (e.g., 'today', 'yesterday', 'last week')
export function relativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  
  // Set to midnight for day comparisons
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const pastDay = new Date(past.getFullYear(), past.getMonth(), past.getDate());
  
  // Calculate difference in days
  const diffTime = nowDay.getTime() - pastDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays > 1 && diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays > 7 && diffDays <= 14) return 'last week';
  if (diffDays > 14 && diffDays <= 30) return `${Math.round(diffDays / 7)} weeks ago`;
  if (diffDays > 30 && diffDays <= 365) return `${Math.round(diffDays / 30)} months ago`;
  
  return `${Math.round(diffDays / 365)} years ago`;
}

// Generate initials from a name (e.g., "John Doe" -> "JD")
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Format large numbers with commas (e.g., 1000 -> "1,000")
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Check if a value is empty (null, undefined, empty string, empty array, or empty object)
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// Generate a random ID (useful for temporary keys)
export function generateId(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

// Check if a string is a valid email
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Check if a string is a valid phone number (simple version)
export function isValidPhone(phone: string): boolean {
  const regex = /^\+?[0-9]{10,15}$/;
  return regex.test(phone.replace(/\D/g, ''));
}

// Debounce function to limit how often a function can be called
export function debounce<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function to limit the rate at which a function is executed
export function throttle<F extends (...args: any[]) => any>(func: F, limit: number): (...args: Parameters<F>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<F>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}