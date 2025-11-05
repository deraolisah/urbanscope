import React, { useState, useEffect, useContext } from 'react';
import PropertyCard from '../../components/PropertyCard';
import PropertyList from '../../components/PropertyList';
import { MdOutlineFilterList, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FiGrid } from "react-icons/fi";
import { HiMiniListBullet } from "react-icons/hi2";
import { PropertyContext } from '../../contexts/PropertyContext';

// Skeleton Loader Components (unchanged)
const SkeletonPropertyCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="h-48 bg-gray-300"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-8 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const SkeletonPropertyList = () => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="flex gap-4">
      <div className="w-40 h-32 bg-gray-300 rounded-lg flex-shrink-0"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

const Explore = () => {
  const { properties, loading, fetchProperties } = useContext(PropertyContext);
  const [priceRange, setPriceRange] = useState({ min: 100, max: 1000000000 });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showLayout, setShowLayout] = useState('grid');
  const [sortBy, setSortBy] = useState('price');
  const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Show 9 properties per page

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setPriceRange({ min: 100, max: 1000000000 });
    setSelectedTypes([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Search handler
  const handleSearch = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    setSearchQuery(e.target.value.trim());
    setCurrentPage(1);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Range slider handlers
  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange.max - 10);
    setPriceRange(prev => ({ ...prev, min: value }));
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange.min + 10);
    setPriceRange(prev => ({ ...prev, max: value }));
  };

  // Input field handlers
  const handleMinPriceInputChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const value = Number(rawValue);
    if (!isNaN(value) && value >= 100 && value <= priceRange.max - 10) {
      setPriceRange(prev => ({ ...prev, min: value }));
    }
  };

  const handleMaxPriceInputChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const value = Number(rawValue);
    if (!isNaN(value) && value <= 1000000000 && value >= priceRange.min + 10) {
      setPriceRange(prev => ({ ...prev, max: value }));
    }
  };

  // Handle input blur to validate and clamp values
  const handleMinPriceBlur = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    let value = Number(rawValue);
    if (isNaN(value)) value = 100;
    value = Math.max(100, Math.min(value, priceRange.max - 10));
    setPriceRange(prev => ({ ...prev, min: value }));
  };

  const handleMaxPriceBlur = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    let value = Number(rawValue);
    if (isNaN(value)) value = 1000000000;
    value = Math.min(1000000000, Math.max(value, priceRange.min + 10));
    setPriceRange(prev => ({ ...prev, max: value }));
  };

  // Format number with commas for display
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Filter and sort properties with search
  const filteredProperties = properties
    .filter(p => {
      const isActive = p.status === 'active';
      const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(p.propertyType);
      
      // Search filter - check multiple fields
      const matchesSearch = searchQuery === '' || 
        (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.propertyType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.features?.some(feature => 
           feature.toLowerCase().includes(searchQuery.toLowerCase())
         ));

      return isActive && matchesPrice && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'alphabet':
          return a.title?.localeCompare(b.title);
        case 'alphabet-desc':
          return b.title?.localeCompare(a.title);
        case 'date':
          return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
        case 'date-desc':
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        default:
          return 0;
      }
    });


  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  
  // Get current properties for the page
  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, selectedTypes, sortBy]);


  return (
    <div className="flex min-h-screen bg-dark/5 relative container md:!p-0">
      {showFilter && (
        <div
          onClick={() => setShowFilter(false)}
          className="cursor-pointer fixed z-3 inset-0 bg-dark/80 backdrop-blur-xs"
        ></div>
      )}

      {/* Sidebar Filters */}
      <aside className={`md:block w-full md:w-1/4 bg-white p-6 pb-8 shadow-md left-0 md:sticky z-10 md:top-16 fixed h-[68%] md:min-h-screen md:h-full overflow-y-auto scrollbar-hidden md:overflow-y-visible rounded-t-2xl md:rounded-t-none bottom-0 md:opacity-100 md:translate-y-0 md:pointer-events-auto transition-all duration-400 ${showFilter ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-20 pointer-events-none"}`}>
        <div className="sticky top-20 space-y-6">
          <h2 className="text-xl font-extrabold w-full flex items-center justify-between">
            Filter <span className='font-normal text-base'> ({filteredProperties.length} results) </span>
          </h2>

          <hr className='md:hidden border-dark/10'/>

          {/* Price Filter Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold"> Price </h4>

            {/* Dual Range Slider Container */}
            <div className="relative mb-8">
              {/* Track */}
              <div className="h-1 bg-gray-300 rounded-full absolute top-1/2 left-0 right-0 -translate-y-1/2"></div>
              
              {/* Active Range */}
              <div 
                className="h-1 bg-dark rounded-full absolute top-1/2 -translate-y-1/2"
                style={{
                  left: `${((priceRange.min - 100) / (1000000000 - 100)) * 100}%`,
                  right: `${100 - ((priceRange.max - 100) / (1000000000 - 100)) * 100}%`
                }}
              ></div>

              {/* Min Price Slider */}
              <input
                type="range"
                min="100"
                max="1000000000"
                value={priceRange.min}
                onChange={handleMinPriceChange}
                className="absolute top-1/2 left-0 right-0 w-full h-1 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-dark [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
              />

              {/* Max Price Slider */}
              <input
                type="range"
                min="100"
                max="1000000000"
                value={priceRange.max}
                onChange={handleMaxPriceChange}
                className="absolute top-1/2 left-0 right-0 w-full h-1 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-dark [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
              />
            </div>

            {/* Price Input Fields */}
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1">
                {/* <label className="text-xs text-gray-600 block mb-1">Min Price</label> */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    type="text"
                    value={formatNumber(priceRange.min)}
                    onChange={handleMinPriceInputChange}
                    onBlur={handleMinPriceBlur}
                    className="w-full pl-8 pr-3 py-2 border border-dark/10 rounded focus:outline-none focus:border-dark text-xs font-semibold"
                  />
                </div>
              </div>
              
              <div className="text-dark/80"> - </div>
              
              <div className="flex-1">
                {/* <label className="text-xs text-gray-600 block mb-1">Max Price</label> */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    type="text"
                    value={formatNumber(priceRange.max)}
                    onChange={handleMaxPriceInputChange}
                    onBlur={handleMaxPriceBlur}
                    className="w-full pl-8 pr-3 py-2 border border-dark/10 rounded focus:outline-none focus:border-dark text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rest of your filters remain the same */}
          {/* Type Filter */}
          <div className="flex flex-col items-start">
            <h4 className="text-md font-semibold mb-1"> Real Estate Type </h4>
            {["House", "Apartment", "Land"].map(type => (
              <label key={type} className="flex items-center space-x-2.5 mb-2 cursor-pointer group text-md">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  className="w-4 h-4 text-dark rounded cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-dark transition-colors">{type + "s"}</span>
              </label>
            ))}
          </div>

          {/* Cities Filter */}
          <div>
            <h4 className="text-md font-semibold mb-1"> Cities </h4>
            <select 
                className="w-full focus:outline-none cursor-pointer text-md text-dark font-medium p-1.5 py-2.5 rounded border border-dark/10 "
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="all"> All Cities </option>
                <option value="lagos-m"> Lagos - Mainland </option>
                <option value="lagos-i"> Lagos - Island </option>
                <option value="london"> London </option>
                <option value="dubai"> Dubai </option>
                <option value="shanghai"> Shanghai </option>
              </select>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <h4 className="text-md font-semibold mb-1"> Bedrooms </h4>
            <div className='flex items-center flex-wrap space-x-4'>
              {["1", "2", "3","4 and more"].map(bedroom => (
                <label key={bedroom} className="flex items-center space-x-1.5 cursor-pointer group text-md">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(bedroom)}
                    onChange={() => handleTypeToggle(bedroom)}
                    className="w-4 h-4 text-dark rounded cursor-pointer"
                    />
                  <span className="text-gray-700 group-hover:text-dark transition-colors">{bedroom}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bathrooms Filter */}
          <div>
            <h4 className="text-md font-semibold mb-1"> Bathrooms </h4>
            <div className='flex items-center flex-wrap space-x-4'>
              {["Any", "Combined", "Separate"].map(bathroom => (
                <label key={bathroom} className="flex items-center space-x-1.5 cursor-pointer group text-md">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(bathroom)}
                    onChange={() => handleTypeToggle(bathroom)}
                    className="w-4 h-4 text-dark rounded cursor-pointer"
                    />
                  <span className="text-gray-700 group-hover:text-dark transition-colors">{bathroom}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center flex-wrap gap-3 mt-8">
            <button 
              className="btn flex-1 text-nowrap" 
              onClick={() => setShowFilter(false)}
            >
              Apply Filters
            </button>
            <button 
              className="btn-tertiary flex-1" 
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      {loading && (
        <main className="w-full md:w-3/4 h-fit p-4 pb-8 px-0 md:px-6 space-y-4">
          {/* Skeleton for header controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className='w-full flex items-center justify-between gap-0'>
              <div className='py-1.5 px-3 border border-r-0 border-dark/10 bg-gray-200 w-full rounded-l placeholder:text-sm h-9'></div>
              <div className='btn border-0 py-1.5 px-4 rounded-none rounded-r bg-gray-400 h-9 w-20'></div>
            </div>
            <div className='w-full flex items-center justify-between sm:justify-end gap-2'>
              <div className="w-40 h-9 bg-gray-200 rounded border border-dark/10"></div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gray-200 rounded border border-dark/10"></div>
                <div className="w-9 h-9 bg-gray-200 rounded border border-dark/10"></div>
                <div className="w-9 h-9 bg-gray-200 rounded border border-dark/10 md:hidden"></div>
              </div>
            </div>
          </div>

          {/* Skeleton for property cards */}
          {showLayout === "grid" ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
              {[...Array(6)].map((_, index) => ( // Changed to 6 for pagination
                <SkeletonPropertyCard key={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {[...Array(6)].map((_, index) => ( // Changed to 6 for pagination
                <SkeletonPropertyList key={index} />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Content when not loading */}
      {!loading && (
      <main className="w-full md:w-3/4 h-fit p-4 pb-8 px-0 md:px-6 space-y-4">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className='w-full flex items-center justify-between gap-0'>
            <input 
              type='search' 
              placeholder='Enter Keyword..' 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className='py-1 px-3 border border-dark/10 focus:border-dark w-full !rounded placeholder:text-sm' 
            />
          </div>

          <div className='w-full flex items-center justify-between sm:justify-end gap-2'>
            {/* Sort */}
            <div className="text-dark/80 flex items-center gap-1">
              <select 
                className="focus:outline-none cursor-pointer text-sm text-dark/60 font-medium p-1.5 rounded border border-dark/10 "
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="price">Price - Low to High</option>
                <option value="price-desc">Price - High to Low</option>
                <option value="alphabet">Name - A to Z</option>
                <option value="alphabet-desc">Name - Z to A</option>
                <option value="date">Date - Oldest First</option>
                <option value="date-desc">Date - Newest First</option>
              </select>
            </div>

            {/* Layout */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLayout("grid")}
                title="Grid Layout"
                className={`text-xl text-dark/50 p-1.5 border border-dark/10 hover:bg-dark/5 cursor-pointer rounded ${showLayout === "grid" ? "bg-dark/10 text-dark/100" : ""}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setShowLayout("list")}
                title="List Layout"
                className={`text-xl text-dark/50 p-1.5 border border-dark/10 hover:bg-dark/5 cursor-pointer rounded ${showLayout === "list" ? "bg-dark/10 text-dark/100" : ""}`}
              >
                <HiMiniListBullet />
              </button>
              <button
                onClick={toggleFilter}
                title='Filters'
                className="flex md:hidden items-center gap-2 p-1.5 text-xl text-dark/60 cursor-pointer hover:bg-dark/5 border border-dark/10 rounded"
              >
                <MdOutlineFilterList />
              </button>
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="flex items-center justify-between bg-light p-3 rounded-lg">
            <div className="text-sm text-start space-x-2 text-dark/60">
              Search results for: 
              <span className="font-semibold"> "{searchQuery}"</span> 
              <br className='flex md:hidden' />
              <span className="text-dark/80">({filteredProperties.length} properties found)</span>
            </div>
            <button 
              onClick={clearSearch}
              className="text-xs text-dark/50 hover:text-dark cursor-pointer text-nowrap"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Property Display - UPDATED to use currentProperties */}
        <div className=''>
          {showLayout === "grid" ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
              {currentProperties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {currentProperties.map(property => (
                <PropertyList key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>

        {/* No Results Message */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center bg-light rounded-lg py-20">
            <div className="text-gray-500 text-xl mb-2">
              {searchQuery ? 'No properties found matching your search' : 'No properties found'}
            </div>
            <p className="text-gray-400 text-sm">
              {searchQuery ? 'Try different keywords or adjust your filters' : 'Adjust your filters to see more results.'}
            </p>
            <div className='flex items-center justify-center space-x-2 mt-4'>
              <button onClick={resetFilters} className="btn w-fit">
                {searchQuery ? 'Clear Search & Filters' : 'Reset All Filters'}
              </button>
              {!searchQuery && (
                <button onClick={() => { scrollTo(0, 0); fetchProperties(); }} className="btn w-fit">
                  Refresh
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination - UPDATED */}
        {/* {filteredProperties.length > itemsPerPage && ( */}
          <div className='rounded-md text-center flex items-center justify-between'>
            <button 
              className='btn-tertiary w-fit disabled:opacity-50 disabled:cursor-not-allowed' 
              onClick={() => {prevPage(); scrollTo(0,0) }}
              disabled={currentPage === 1}
              title='Previous Page'
              >
              Previous
            </button>

            <div className="flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    currentPage === number
                      ? 'bg-dark text-white'
                      : 'bg-light text-dark/60 hover:bg-dark/10'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            {/* <span className='bg-light p-2.5 px-4 rounded-md btn-tertiary w-fit'>
              {currentPage} / {totalPages}
            </span> */}
            
            <button 
              className='btn-tertiary w-fit disabled:opacity-50 disabled:cursor-not-allowed' 
              onClick={() => {nextPage(); scrollTo(0,0) }}
              disabled={currentPage === totalPages}
              title='Next Page'
            >
              Next
            </button>
          </div>
        {/* )} */}

        {/* Page Numbers - Optional: Add page number buttons */}
        {/* {filteredProperties.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  currentPage === number
                    ? 'bg-dark text-white'
                    : 'bg-light text-dark/60 hover:bg-dark/10'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        )} */}
      </main>
      )}
    </div>
  );
};

export default Explore;