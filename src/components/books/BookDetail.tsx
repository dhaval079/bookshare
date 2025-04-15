'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookWithOwner } from '@/types';
import { Mail, MapPin, Phone, BookOpen, Tag, Calendar, Share2, Heart, MessageCircle, Star, AlertTriangle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface BookDetailProps {
  book: BookWithOwner;
  isOwner: boolean;
  onStatusChange?: (status: string) => void;
}

export default function BookDetail({
  book,
  isOwner,
  onStatusChange,
}: BookDetailProps) {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleStatusChange = async (status: string) => {
    if (!onStatusChange) return;
    
    try {
      setLoading(true);
      await onStatusChange(status);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    // In a real app, we would implement actual sharing functionality
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
    setShowShareModal(false);
  };

  const handleContact = () => {
    if (!contactMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    // In a real app, we would send the message to the owner
    toast.success('Message sent to the owner');
    setContactMessage('');
    setShowContactModal(false);
  };

  const handleReport = () => {
    // In a real app, we would implement actual reporting functionality
    toast.success('Thank you for your report. We will review this listing.');
    setShowReportModal(false);
  };

  // Generate placeholder image URL based on book title
  const imageUrl = book.coverImage || `/api/placeholder/300/450?text=${encodeURIComponent(book.title)}`;

  // Calculate availability color based on status
  const statusColor = 
    book.status === 'available' ? 'bg-green-500' :
    book.status === 'rented' ? 'bg-blue-500' : 'bg-gray-500';

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8">
          <div className="md:col-span-1">
            <div className="relative">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg mb-4">
                <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}></div>
                <Image 
                  src={imageUrl}
                  alt={book.title}
                  fill
                  className="object-cover transition-opacity duration-500"
                  onLoadingComplete={() => setImageLoaded(true)}
                />
                
                {/* Like button */}
                <button 
                  onClick={handleLike}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </button>
                
                {/* Status indicator */}
                <div className="absolute top-3 left-3">
                  <Badge status={book.status as 'available' | 'rented' | 'exchanged'} className="shadow-md" />
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className={`h-3 w-3 rounded-full ${statusColor} mr-2`}></div>
                <span className="text-sm font-medium capitalize">
                  {book.status === 'available' ? 'Available now' : book.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  fullWidth 
                  className="py-3 rounded-xl"
                  onClick={() => setShowContactModal(true)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Owner
                </Button>
                
                <Button 
                  variant="outline" 
                  fullWidth 
                  className="py-3 rounded-xl"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Book
                </Button>
              </div>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowReportModal(true)} 
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center w-full"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Report this listing
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{book.title}</h1>
                  <p className="text-xl text-gray-700 mt-1">by {book.author}</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {book.genre && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-50 mr-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Genre</span>
                      <div className="font-medium text-gray-900">{book.genre}</div>
                    </div>
                  </div>
                )}
                
                {book.condition && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-50 mr-3">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Condition</span>
                      <div className="font-medium text-gray-900 capitalize">{book.condition}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-50 mr-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location</span>
                    <div className="font-medium text-gray-900">{book.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-amber-50 mr-3">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Listed on</span>
                    <div className="font-medium text-gray-900">{formatDate(book.createdAt)}</div>
                  </div>
                </div>
              </div>
              
              {book.description && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <div className="prose prose-blue max-w-none text-gray-600 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <p>{book.description}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-10 pt-10 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Owner</h2>
                <div className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <Avatar name={book.owner.name} size="lg" className="mr-4" />
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">{book.owner.name}</h3>
                    {/* {book.owner.location && (
                      <p className="text-gray-600 text-sm flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {book.owner.location}
                      </p>
                    )} */}
                    <div className="mt-3">
                      <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700 border border-gray-200">
                        Contact: {book.contactInfo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isOwner && onStatusChange && (
                <div className="mt-8 bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-3">Manage Book Status</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      onClick={() => handleStatusChange('available')}
                      disabled={book.status === 'available' || loading}
                      variant={book.status === 'available' ? 'primary' : 'outline'}
                      fullWidth
                      className={book.status === 'available' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      Available
                    </Button>
                    <Button
                      onClick={() => handleStatusChange('rented')}
                      disabled={book.status === 'rented' || loading}
                      variant={book.status === 'rented' ? 'primary' : 'outline'}
                      fullWidth
                      className={book.status === 'rented' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    >
                      Rented
                    </Button>
                    <Button
                      onClick={() => handleStatusChange('exchanged')}
                      disabled={book.status === 'exchanged' || loading}
                      variant={book.status === 'exchanged' ? 'primary' : 'outline'}
                      fullWidth
                      className={book.status === 'exchanged' ? 'bg-gray-600 hover:bg-gray-700' : ''}
                    >
                      Exchanged
                    </Button>
                  </div>
                </div>
              )}
              
            </motion.div>
          </div>
        </div>
      </Card>
      
      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Book Owner"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Avatar name={book.owner.name} className="mr-3" />
            <div>
              <h3 className="font-medium">{book.owner.name}</h3>
              <p className="text-sm text-gray-500">Owner of "{book.title}"</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Hi, I'm interested in your book..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleContact} fullWidth>
              Send Message
            </Button>
            <Button variant="outline" onClick={() => setShowContactModal(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share This Book"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg mb-4">
  <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}></div>
  <Image 
    src={imageUrl}
    alt={book.title}
    fill
    className="object-cover transition-opacity duration-500"
    onLoadingComplete={() => setImageLoaded(true)}
    unoptimized={book.coverImage?.startsWith('data:') ? true : false}
  />
  
  {/* Like button */}
  <button 
    onClick={handleLike}
    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
  >
    <Heart 
      className={`h-5 w-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
    />
  </button>
  
  {/* Status indicator */}
  <div className="absolute top-3 left-3">
    <Badge status={book.status as 'available' | 'rented' | 'exchanged'} className="shadow-md" />
  </div>
</div>
          </div>
          
          <div className="text-center">
            <h3 className="font-medium">{book.title}</h3>
            <p className="text-sm text-gray-500">by {book.author}</p>
          </div>
          
          <div className="bg-gray-50 rounded-md p-3 text-center border border-gray-200">
            <span className="text-sm text-gray-700 break-all">{typeof window !== 'undefined' ? window.location.href : ''}</span>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleShare} fullWidth>
              Copy Link
            </Button>
            <Button variant="outline" onClick={() => setShowShareModal(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Listing"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            If you believe this listing violates our community guidelines, please let us know why.
          </p>
          
          <div>
            <label htmlFor="reportReason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Report
            </label>
            <select
              id="reportReason"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option>Inappropriate content</option>
              <option>Misleading information</option>
              <option>Spam or scam</option>
              <option>Duplicate listing</option>
              <option>Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="reportDetails" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              id="reportDetails"
              rows={3}
              placeholder="Please provide any additional information..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleReport} variant="danger" fullWidth>
              Submit Report
            </Button>
            <Button variant="outline" onClick={() => setShowReportModal(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}