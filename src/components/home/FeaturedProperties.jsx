import React, { useContext, useEffect, useRef, useState } from 'react';
import PropertyPreview from './PropertyPreview';
import { PropertyContext } from '../../contexts/PropertyContext';
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

const FeaturedProperties = () => {
  // const featuredSectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { featuredProperties, loading, fetchFeaturedProperties } = useContext(PropertyContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // Check if we need controls (more items than visible)
  useEffect(() => {
    const checkScrollNeeded = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const isScrollable = container.scrollWidth > container.clientWidth;
        setShowControls(isScrollable);
      }
    };

    checkScrollNeeded();
    window.addEventListener('resize', checkScrollNeeded);
    
    return () => window.removeEventListener('resize', checkScrollNeeded);
  }, [featuredProperties]);

  // Scroll to specific index
  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const itemCount = featuredProperties.slice(0, 4).length;
      const scrollPosition = (scrollWidth / itemCount) * index;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  // Next and previous functions with wrap-around
  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % featuredProperties.slice(0, 4).length;
    scrollToIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + featuredProperties.slice(0, 4).length) % featuredProperties.slice(0, 4).length;
    scrollToIndex(prevIndex);
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const itemCount = featuredProperties.slice(0, 4).length;
      const newIndex = Math.round((scrollLeft / scrollWidth) * itemCount);
      setCurrentIndex(newIndex);
    }
  };


  if (loading) return <div className="container text-center py-8"> Loading Featured Properties... </div>;

  if (!Array.isArray(featuredProperties) || featuredProperties.length === 0) {
    return (
      <div className="container py-8 text-center"> 
        No featured properties available.
        <button onClick={() => { fetchFeaturedProperties(); } } className='btn w-fit mx-auto mt-4'> Refresh </button>
      </div>
    );
  }

  const displayProperties = featuredProperties.slice(0, 4);

  return (
    <section className="container py-10 transition-colors duration-50 relative">
      {/* Featured Properties Section */}
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center leading-tight uppercase mb-4 md:mb-8">
        Featured Properties
      </h2>
      
      {/* Properties Container with Navigation */}
      <div className="relative mt-2">
        {/* Properties Grid/Scroll */}
        <div 
          ref={scrollContainerRef}
          className='w-full h-full flex gap-4 overflow-x-scroll lg:grid lg:grid-cols-4 scrollbar-hidden snap-x snap-mandatory'
          onScroll={handleScroll}
        >
          {displayProperties.map((property) => (
            <div key={property._id} className='flex-shrink-1 snap-start'>
              <PropertyPreview property={property} />
              {/* <hr className='mt-8 border-dark/10' /> */}
            </div>
          ))}
        </div>

        <div className='flex items-center justify-between mt-8.5'>
          {/* Dot Pagination */}
          {showControls && (
            <div className='flex ml-auto items-center justify-start gap-2.5'>
              {displayProperties.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-dark w-4 scale-120' 
                      : 'bg-dark/30 hover:bg-dark/60'
                  }`}
                  aria-label={`Go to property ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          {showControls && (
            <div className='w-full flex h-full items-center justify-end gap-2'>
              <button 
                onClick={prevSlide}
                className="bg-white/20 hover:bg-dark/10 cursor-pointer text-dark rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg border border-dark/10 transition-all duration-200 hover:scale-110"
                aria-label="Previous properties"
              >
                {/* &#10094; */}
                <MdSkipPrevious />
              </button>
              <button 
                onClick={nextSlide}
                className="bg-white/20 hover:bg-dark/10 cursor-pointer text-dark rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg border border-dark/10 transition-all duration-200 hover:scale-110"
                aria-label="Next properties"
              >
                {/* &#10095; */}
                <MdSkipNext />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;