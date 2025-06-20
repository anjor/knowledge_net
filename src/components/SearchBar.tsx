import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, tags: string[]) => void;
}

const POPULAR_TAGS = [
  'medical', 'ai-training', 'climate', 'finance', 'imaging', 
  'science', 'machine-learning', 'research', 'biotech', 'genomics'
];

const DATA_FORMATS = ['json', 'csv', 'parquet', 'hdf5', 'xml', 'binary'];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [minQuality, setMinQuality] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const tags = [...selectedTags];
    if (selectedFormat) {
      tags.push(`format:${selectedFormat}`);
    }
    if (minQuality > 0) {
      tags.push(`quality:${minQuality}+`);
    }
    onSearch(query, tags);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    setSelectedFormat('');
    setMinQuality(0);
    onSearch('', []);
  };

  const hasActiveFilters = query || selectedTags.length > 0 || selectedFormat || minQuality > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Main Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search datasets by name, description, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Search
        </button>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-lg transition flex items-center space-x-2 ${
            showFilters 
              ? 'border-blue-500 text-blue-600 bg-blue-50' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
              {selectedTags.length + (selectedFormat ? 1 : 0) + (minQuality > 0 ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          {/* Popular Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Popular Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Format and Quality Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Formats</option>
                {DATA_FORMATS.map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Quality Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Quality Score: {minQuality}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={minQuality}
                onChange={(e) => setMinQuality(parseInt(e.target.value))}
                className="block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Active Filters and Clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedFormat && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Format: {selectedFormat.toUpperCase()}
                    <button
                      onClick={() => setSelectedFormat('')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {minQuality > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Quality: {minQuality}%+
                    <button
                      onClick={() => setMinQuality(0)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
              
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Search Suggestions */}
      {!showFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Popular searches:</span>
          {['medical imaging', 'climate data', 'financial time series', 'genomics'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
                handleSearch();
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};