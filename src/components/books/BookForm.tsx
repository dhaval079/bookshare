'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BookFormData } from '@/types';
import { Upload, X, Check } from 'lucide-react';

// Moved outside component to prevent recreation on each render
export const bookConditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

// Memoized image preview component
const ImagePreview = memo(({ 
  coverImage, 
  onRemove, 
  onClick 
}: { 
  coverImage: string; 
  onRemove: () => void; 
  onClick: () => void;
}) => (
  <div className={`relative rounded-lg overflow-hidden border-2 border-blue-500`}>
    <div className="relative aspect-[2/3] w-full">
      <Image 
        src={coverImage} 
        alt="Book cover preview" 
        fill
        className="object-cover"
        unoptimized 
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <span className="text-white text-xs font-medium">Cover Image</span>
      </div>
    </div>
  </div>
));

ImagePreview.displayName = 'ImagePreview';

// Memoized upload placeholder component
const UploadPlaceholder = memo(({ onClick }: { onClick: () => void }) => (
  <div 
    onClick={onClick} 
    className="aspect-[2/3] w-full flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-300 rounded-lg"
  >
    <Upload className="h-8 w-8 text-gray-400 mb-2" />
    <p className="text-sm text-gray-500 text-center">Click to upload a cover image</p>
    <p className="text-xs text-gray-400 mt-1">JPEG, PNG or GIF (max 5MB)</p>
  </div>
));

UploadPlaceholder.displayName = 'UploadPlaceholder';

// Tips component
const ImageTips = memo(() => (
  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
    <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for a great book cover:</h3>
    <ul className="text-xs text-blue-700 space-y-1">
      <li className="flex items-start">
        <Check className="h-3 w-3 text-blue-500 mt-0.5 mr-1 flex-shrink-0" />
        Use a clear, well-lit image of the book
      </li>
      <li className="flex items-start">
        <Check className="h-3 w-3 text-blue-500 mt-0.5 mr-1 flex-shrink-0" />
        Ensure the title and author are visible
      </li>
      <li className="flex items-start">
        <Check className="h-3 w-3 text-blue-500 mt-0.5 mr-1 flex-shrink-0" />
        A portrait (vertical) orientation works best
      </li>
      <li className="flex items-start">
        <Check className="h-3 w-3 text-blue-500 mt-0.5 mr-1 flex-shrink-0" />
        Books with covers get more attention
      </li>
    </ul>
  </div>
));

ImageTips.displayName = 'ImageTips';

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  isEditing?: boolean;
  bookId?: string;
}

export default function BookForm({ 
  initialData = {}, 
  isEditing = false,
  bookId
}: BookFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData.title || '',
    author: initialData.author || '',
    genre: initialData.genre || '',
    description: initialData.description || '',
    location: initialData.location || '',
    contactInfo: initialData.contactInfo || '',
    condition: initialData.condition || 'good',
  });
  
  const [coverImage, setCoverImage] = useState<string>(initialData.coverImage || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Function to read file as data URL - memoized
  const readFileAsDataURL = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle file selection - memoized
  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please upload an image file');
          return;
        }
        
        // Validate file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB');
          return;
        }
        
        // Convert file to data URL
        const dataUrl = await readFileAsDataURL(file);
        setCoverImage(dataUrl);
        toast.success('Cover image uploaded successfully!');
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to upload image. Please try again.');
      }
    }
  }, [readFileAsDataURL]);

  // Remove uploaded image - memoized
  const removeImage = useCallback(() => {
    setCoverImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  // Handle form field changes - memoized
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  // Form validation - memoized
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.contactInfo) newErrors.contactInfo = 'Contact information is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  // Handle form submission - memoized
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Create the endpoint based on whether we're editing or creating
      const endpoint = isEditing 
        ? `/api/books/${bookId}` 
        : '/api/books';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Include coverImage in the data to be submitted
      const dataToSubmit = {
        ...formData,
        coverImage: coverImage || undefined,
      };
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save book');
      }
      
      const book = await response.json();
      
      toast.success(
        isEditing 
          ? 'Book updated successfully!' 
          : 'Book added successfully!'
      );
      
      // Redirect to book page or dashboard
      router.push(isEditing 
        ? `/books/${book.id}` 
        : '/dashboard/owner/books'
      );
      router.refresh();
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to save book. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [validateForm, isEditing, bookId, formData, coverImage, router]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
      />
      
      <Input
        label="Author"
        id="author"
        name="author"
        value={formData.author}
        onChange={handleChange}
        error={errors.author}
        required
      />
      
      <Input
        label="Genre (Optional)"
        id="genre"
        name="genre"
        value={formData.genre}
        onChange={handleChange}
      />
      
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>
      
      <Input
        label="Location"
        id="location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
        required
        placeholder="City, State"
      />
      
      <Input
        label="Contact Information"
        id="contactInfo"
        name="contactInfo"
        value={formData.contactInfo}
        onChange={handleChange}
        error={errors.contactInfo}
        required
        placeholder="Email or Phone Number"
      />
      
      <Select
        label="Condition"
        id="condition"
        name="condition"
        value={formData.condition}
        onChange={handleChange}
        options={bookConditions}
      />
      
      {/* Book Cover Image Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Book Cover Image (Optional)
        </label>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Image Preview */}
          <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            {coverImage ? (
              <ImagePreview 
                coverImage={coverImage} 
                onRemove={removeImage} 
                onClick={() => fileInputRef.current?.click()} 
              />
            ) : (
              <UploadPlaceholder onClick={() => fileInputRef.current?.click()} />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          {/* Upload Instructions & Tips */}
          <div className="space-y-3">
            <ImageTips />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="h-4 w-4 inline mr-2" />
              {coverImage ? 'Change Image' : 'Upload Image'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button 
          type="submit" 
          loading={loading} 
          fullWidth
        >
          {isEditing ? 'Update Book' : 'Add Book'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}