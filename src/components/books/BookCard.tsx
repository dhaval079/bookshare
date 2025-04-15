'use client';

import { useState } from 'react';
import { BookWithOwner } from '@/types';
import { BookOpen, MapPin, Calendar, Heart } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import NavLink from '@/components/ui/NavLink';
import { formatDate } from '@/lib/utils';

interface BookCardProps {
  book: BookWithOwner;
  actions?: React.ReactNode;
  featured?: boolean;
}

export default function BookCard({ 
  book, 
  actions, 
  featured = false 
}: BookCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Generate placeholder image URL based on book title
  const imageUrl = book.coverImage || `/api/placeholder/400/600?text=${encodeURIComponent(book.title)}`;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className={`group relative rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        featured ? 'border-2 border-blue-200' : 'border border-gray-100'
      }`}
    >
      <NavLink href={`/books/${book.id}`} className="block h-full">
        <div className="relative">
          {/* Cover Image with skeleton loading state */}
          <div className="aspect-[2/3] overflow-hidden rounded-t-xl relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
            <img
              src={imageUrl}
              alt={book.title}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Like button */}
            <button 
              onClick={handleLike} 
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
            >
              <Heart 
                className={`h-5 w-5 transition-colors ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} 
              />
            </button>
            
            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <Badge status={book.status as 'available' | 'rented' | 'exchanged'} />
            </div>
            
            {/* Genre tag if available */}
            {book.genre && (
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-white">
                  {book.genre}
                </span>
              </div>
            )}
          </div>
          
          {/* Book details */}
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <BookOpen className="mr-1 h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-1">{book.author}</span>
            </p>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[100px]">{book.location}</span>
              </div>
              
              {book.owner && (
                <div className="flex items-center text-xs text-gray-500">
                  <Avatar 
                    name={book.owner.name} 
                    size="sm"
                    className="mr-1 h-5 w-5 flex-shrink-0" 
                  />
                  <span className="truncate max-w-[80px]">{book.owner.name}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 text-xs text-gray-400 flex items-center">
              <Calendar className="mr-1 h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1">Added {formatDate(book.createdAt)}</span>
            </div>
          </div>
        </div>
      </NavLink>
      
      {actions && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 rounded-b-xl">
          {actions}
        </div>
      )}
      
      {/* Featured tag */}
      {featured && (
        <div className="absolute -top-3 -right-3 transform rotate-12">
          <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-lg">
            Featured
          </span>
        </div>
      )}
    </div>
  );
}