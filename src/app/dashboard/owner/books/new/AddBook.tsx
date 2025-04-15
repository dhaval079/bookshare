
'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronLeft, 
  Upload, 
  Check, 
  X, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BookFormData } from '@/types';
import NavLink from '@/components/ui/NavLink';

export const bookConditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

// Sample book covers - using public images
const sampleCovers = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&w=300&q=80'
];

interface PremiumBookFormProps {
  genres: string[];
  user: any;
}

// Inner component that may use useSearchParams or other client hooks
function PremiumBookFormContent({ genres, user }: PremiumBookFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCover, setSelectedCover] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    genre: '',
    description: '',
    location: user.location || '',
    contactInfo: user.email || '',
    condition: 'good',
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Effect to update progress bar
  useEffect(() => {
    let newProgress = 0;
    
    if (step === 1) {
      // Calculate based on title, author, genre
      const fields = ['title', 'author', 'genre'];
      const filled = fields.filter(field => formData[field as keyof BookFormData]?.trim()).length;
      newProgress = Math.round((filled / fields.length) * 100);
    } else if (step === 2) {
      // Calculate based on description and condition
      const descriptionWeight = formData.description ? 50 : 0;
      const conditionWeight = formData.condition ? 50 : 0;
      newProgress = descriptionWeight + conditionWeight;
    } else if (step === 3) {
      // Calculate based on location and contactInfo
      const fields = ['location', 'contactInfo'];
      const filled = fields.filter(field => formData[field as keyof BookFormData]?.trim()).length;
      newProgress = Math.round((filled / fields.length) * 100);
    }
    
    setProgress(newProgress);
  }, [formData, step]);
  
  // Function to read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const handleCoverSelection = (cover: string) => {
    setSelectedCover(cover);
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error if value is not empty
    if (value.trim() && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setSelectedCover(dataUrl);
        toast.success('Cover image uploaded successfully!');
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to upload image. Please try again.');
      }
    }
  };
  
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.author.trim()) newErrors.author = 'Author is required';
      // Genre is optional
    } else if (currentStep === 2) {
      // Description is optional
      // Condition is pre-selected
    } else if (currentStep === 3) {
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.contactInfo.trim()) newErrors.contactInfo = 'Contact information is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    try {
      setLoading(true);
      
      // Show global loading if available
      if (typeof window !== 'undefined') {
        const loadingEvent = new CustomEvent('routeChangeStart');
        window.dispatchEvent(loadingEvent);
      }
      
      // Add cover image if selected
      const dataToSubmit = {
        ...formData,
        coverImage: selectedCover || undefined,
      };
      
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add book');
      }
      
      const book = await response.json();
      
      // Success animation
      toast.success('Book added successfully!');
      
      // Redirect after a short delay to show the success state
      setTimeout(() => {
        router.push(`/books/${book.id}`);
        router.refresh();
      }, 1000);
      
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to add book. Please try again.'
      );
    } finally {
      setLoading(false);
      
      // Hide global loading if available
      if (typeof window !== 'undefined') {
        const completeEvent = new CustomEvent('routeChangeComplete');
        window.dispatchEvent(completeEvent);
      }
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between">
          <NavLink 
            href="/dashboard/owner/books"
            className="flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            <span>Back to My Books</span>
          </NavLink>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-500">
                Step {step} of 3: {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Location & Contact'}
              </div>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
        
        {/* Form Card with animation */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
              {step === 1 ? 'Add New Book' : step === 2 ? 'Book Details' : 'Finishing Up'}
            </h1>
            
            <p className="mt-2 text-gray-600 max-w-2xl">
              {step === 1 
                ? 'Share your books with others in your community. Start by filling in the basic information about your book.'
                : step === 2 
                ? 'Add more details to help others understand what you\'re offering.'
                : 'Almost done! Add your location and contact details so interested readers can reach you.'}
            </p>
            
            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants}>
                        <Input
                          label="Book Title"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          error={errors.title}
                          placeholder="Enter book title"
                          className="text-lg"
                          required
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <Input
                          label="Author"
                          id="author"
                          name="author"
                          value={formData.author}
                          onChange={handleChange}
                          error={errors.author}
                          placeholder="Enter author name"
                          required
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <Select
                          label="Genre (Optional)"
                          id="genre"
                          name="genre"
                          value={formData.genre}
                          onChange={handleChange}
                          options={[
                            { value: '', label: 'Select a genre' },
                            ...genres.map(genre => ({ value: genre, label: genre }))
                          ]}
                        />
                      </motion.div>
                      
                      <motion.div 
                        variants={itemVariants}
                        className="pt-4 flex justify-end"
                      >
                        <Button 
                          type="button" 
                          onClick={nextStep}
                          className="px-8 py-2.5 rounded-full"
                        >
                          Next Step
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants}>
                        <div className="space-y-1">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description (Optional)
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            placeholder="Describe your book, its condition, and any specific details readers should know..."
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <Select
                          label="Condition"
                          id="condition"
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          options={bookConditions}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Book Cover (Optional)
                        </label>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          {/* Upload option */}
                          <div 
                            className={`relative aspect-[2/3] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition ${selectedCover ? 'border-gray-300' : 'border-blue-400'}`}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {selectedCover && selectedCover.startsWith('data:') ? (
                              <div className="relative w-full h-full">
                                <Image 
                                  src={selectedCover} 
                                  alt="Custom book cover" 
                                  fill 
                                  className="object-cover rounded-lg"
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <p className="text-white text-xs">Change cover</p>
                                </div>
                                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-6 w-6 text-gray-400" />
                                <span className="mt-2 text-xs text-center text-gray-500">Upload cover</span>
                              </>
                            )}
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileInput}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>
                          
                          {/* Sample covers */}
                          {sampleCovers.map((cover, index) => (
                            <div 
                              key={index}
                              className={`relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer border-2 transition ${selectedCover === cover ? 'border-blue-500 shadow-md' : 'border-transparent'}`}
                              onClick={() => handleCoverSelection(cover)}
                            >
                              <Image
                                src={cover}
                                alt="Book cover example"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                              {selectedCover === cover && (
                                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        variants={itemVariants}
                        className="pt-6 flex justify-between"
                      >
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          onClick={nextStep}
                          className="px-8 py-2.5 rounded-full"
                        >
                          Next Step
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Book preview */}
                          <div className="sm:w-1/3">
                            <div className="mb-3">
                              <span className="text-sm font-medium text-gray-500">Book Preview</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 h-full">
                              <div className="flex items-center">
                                <div className="relative h-24 w-16 overflow-hidden rounded bg-gray-200 flex-shrink-0">
                                  {selectedCover ? (
                                    <Image 
                                      src={selectedCover} 
                                      alt="Book cover" 
                                      fill 
                                      className="object-cover" 
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center">
                                      <BookOpen className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 truncate">{formData.title || 'Book Title'}</h3>
                                  <p className="text-sm text-gray-600">{formData.author || 'Author'}</p>
                                  {formData.genre && (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mt-1">
                                      {formData.genre}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {formData.description && (
                                <div className="mt-3 text-xs text-gray-600 line-clamp-3">
                                  {formData.description}
                                </div>
                              )}
                              
                              <div className="mt-3 text-xs text-gray-500">
                                Condition: {formData.condition ? formData.condition.charAt(0).toUpperCase() + formData.condition.slice(1) : 'Good'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Location & Contact */}
                          <div className="sm:w-2/3">
                            <motion.div variants={itemVariants}>
                              <Input
                                label="Location"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                error={errors.location}
                                placeholder="City, State or Region"
                                required
                                icon={MapPin}
                              />
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="mt-6">
                              <Input
                                label="Contact Information"
                                id="contactInfo"
                                name="contactInfo"
                                value={formData.contactInfo}
                                onChange={handleChange}
                                error={errors.contactInfo}
                                placeholder="Email address or phone number"
                                required
                                icon={formData.contactInfo?.includes('@') ? Mail : Phone}
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                This will be visible to other users so they can contact you about this book.
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={fadeInVariants} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Ready to share your book!</h3>
                            <div className="mt-1 text-sm text-blue-700">
                              You're about to add this book to your collection. Once listed, interested readers will be able to contact you.
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        variants={itemVariants}
                        className="pt-6 flex justify-between"
                      >
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          loading={loading}
                          className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Add Book
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Main export component with Suspense boundary
export default function PremiumBookForm({ genres, user }: PremiumBookFormProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading book form...</p>
      </div>
    </div>}>
      <PremiumBookFormContent genres={genres} user={user} />
    </Suspense>
  );
}