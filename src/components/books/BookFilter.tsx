'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, X, Filter, Ghost } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { motion, AnimatePresence } from 'framer-motion';

export const bookStatuses = [
  { value: 'available', label: 'Available' },
  { value: 'rented', label: 'Rented' },
  { value: 'unavailable', label: 'Unavailable' },
];

export const bookGenres = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Romance',
  'Horror',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Cooking',
  'Travel',
  'Poetry'
];

interface BookFilterProps {
  onFilterChange: (filters: {
    title: string;
    location: string;
    genre: string;
    status: string;
  }) => void;
  activeFilters?: {
    title: string;
    location: string;
    genre: string;
    status: string;
  };
}

export default function BookFilter({ 
  onFilterChange, 
  activeFilters = { title: '', location: '', genre: '', status: '' } 
}: BookFilterProps) {
  const [filters, setFilters] = useState<{
    [key: string]: string;
    title: string;
    location: string;
    genre: string;
    status: string;
  }>({
    title: activeFilters.title || '',
    location: activeFilters.location || '',
    genre: activeFilters.genre || '',
    status: activeFilters.status || '',
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  // Count active filters
  useEffect(() => {
    setActiveCount(Object.values(filters).filter(Boolean).length);
  }, [filters]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };
  

  const handleReset = () => {
    const resetFilters = {
      title: '',
      location: '',
      genre: '',
      status: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  const handleQuickFilterClick = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Generate status chips
  const statusChips = bookStatuses.map(status => ({
    name: 'status',
    value: status.value,
    label: status.label,
    color: 
      status.value === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
      status.value === 'rented' ? 'bg-blue-50 text-blue-700 border-blue-200' :
      'bg-gray-50 text-gray-700 border-gray-200'
  }));
  
  // Generate popular locations (these would typically come from your backend)
  const popularLocations = [
    { name: 'location', value: 'New York', label: 'New York' },
    { name: 'location', value: 'Los Angeles', label: 'Los Angeles' },
    { name: 'location', value: 'Chicago', label: 'Chicago' },
    { name: 'location', value: 'Boston', label: 'Boston' },
  ];
  
  // Generate genre chips from the utility function
  const genreChips = bookGenres.slice(0, 6).map(genre => ({
    name: 'genre',
    value: genre,
    label: genre,
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Filter className="mr-2 h-5 w-5 text-gray-500" />
            Filter Books
            {activeCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {activeCount}
              </span>
            )}
          </h2>
          <Button 
            size="sm" 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Ghost className="mr-1 h-4 w-4" />
            {isExpanded ? 'Less options' : 'More options'}
          </Button>
        </div>
        
        {/* Quick filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {statusChips.map(chip => (
              <button
                key={chip.value}
                onClick={() => handleQuickFilterClick(chip.name, chip.value)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  filters[chip.name] === chip.value
                    ? `${chip.color} ring-1 ring-offset-1`
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {chip.label}
                {filters[chip.name] === chip.value && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <Search className="h-4 w-4 text-gray-400" />
  </div>
  <input
    type="text"
    name="title"
    placeholder="Search by title or author..."
    value={filters.title}
    onChange={handleInputChange}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
    }}
    className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
  />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="whitespace-nowrap">
                Apply Filters
              </Button>
              {activeCount > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  className="whitespace-nowrap"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Select
                      id="location"
                      name="location"
                      value={filters.location}
                      onChange={handleInputChange}
                      options={[
                        { value: '', label: 'All Locations' },
                        ...popularLocations.map(loc => ({ value: loc.value, label: loc.label }))
                      ]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <Select
                      id="genre"
                      name="genre"
                      value={filters.genre}
                      onChange={handleInputChange}
                      options={[
                        { value: '', label: 'All Genres' },
                        ...bookGenres.map(genre => ({ value: genre, label: genre }))
                      ]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <Select
                      id="status"
                      name="status"
                      value={filters.status}
                      onChange={handleInputChange}
                      options={[
                        { value: '', label: 'All Statuses' },
                        ...bookStatuses,
                      ]}
                    />
                  </div>
                </div>
                
                {/* Popular genres */}
                <div className="mt-5">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {genreChips.map(chip => (
                      <button
                        key={chip.value}
                        type="button"
                        onClick={() => handleQuickFilterClick(chip.name, chip.value)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                          filters[chip.name] === chip.value
                            ? `${chip.color} ring-1 ring-offset-1`
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Popular locations */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Locations</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularLocations.map(loc => (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => handleQuickFilterClick(loc.name, loc.value)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                          filters[loc.name] === loc.value
                            ? 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-offset-1'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
      
      {/* Active filters */}
      {activeCount > 0 && (
        <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-700">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span 
                  key={key} 
                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                >
                  {key}: {value}
                  <button 
                    type="button"
                    onClick={() => {
                      const newFilters = { ...filters, [key]: '' };
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                    className="ml-1 flex-shrink-0 text-blue-700 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}