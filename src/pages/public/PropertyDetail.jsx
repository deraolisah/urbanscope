import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheck, FiMail, FiPlay } from 'react-icons/fi';
import { AiOutlinePicture } from "react-icons/ai";
import { HiMiniChevronLeft, HiMiniChevronDown, HiOutlineHeart, HiMiniShare, HiHeart } from "react-icons/hi2";
import { GrLocation } from "react-icons/gr";
import { PropertyContext } from "../../contexts/PropertyContext";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import "./PropertyDetail.css";
import gsap from "gsap";
// import { Helmet } from 'react-helmet';



// Loading spinner component - moved outside to avoid hook issues
const LoadingSpinner = ({ type = 'image' }) => (
  <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-light rounded-lg">
    <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
      type === 'video' ? 'border-blue-600' : 'border-dark'
    }`}></div>
    <p className="mt-3 text-dark/60 text-sm">
      {type === 'video' ? 'Loading video...' : 'Loading image...'}
    </p>
  </div>
);

// Error state component - moved outside to avoid hook issues
const ErrorState = ({ type = 'image', onRetry }) => (
  <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-light rounded-lg p-4">
    <div className="text-red-500 text-4xl mb-2">⚠️</div>
    <p className="text-dark/60 text-center text-sm">
      {type === 'video' 
        ? 'Failed to load video. Please check your connection.' 
        : 'Failed to load image. Please try again.'
      }
    </p>
    <button 
      onClick={onRetry}
      className="mt-3 px-4 py-2 bg-dark/10 hover:bg-dark/20 rounded text-sm transition-colors"
    >
      Retry
    </button>
  </div>
);

const PropertyDetail = () => {
  const [pricing, setPricing] = useState(false);
  const [agentDetails, setAgentDetails] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoThumbnail, setVideoThumbnail] = useState('');
  
  // Loading states for each media item
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});

  const { id } = useParams();
  const { properties, loading, getFormattedPrice } = useContext(PropertyContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  
  const property = properties.find(p => p._id === id);
  const priceInfo = property ? getFormattedPrice(property) : null;

  const hasVideo = property?.videoUrl && property.videoUrl.trim() !== '';


  // <Helmet>
  //   <title> {property.title} | UrbanScope </title>
  //   <meta name="description" content={`Explore ${property.title} located in ${property.location}. ${property.summary}`} />
  // </Helmet>

  // Create combined media array (video + images)
  const mediaItems = [];
  if (hasVideo && property) {
    mediaItems.push({
      type: 'video',
      url: property.videoUrl,
      thumbnail: videoThumbnail
    });
  }

  if (property) {
    property.images.forEach((img, index) => {
      mediaItems.push({
        type: 'image',
        url: img,
        index: index
      });
    });
  }

  const totalMediaItems = mediaItems.length;

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  // Function to extract Vimeo video ID
  const getVimeoVideoId = (url) => {
    const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : false;
  };

  // Function to generate video thumbnail URL
  // const generateVideoThumbnail = (videoUrl) => {
  //   if (!videoUrl) return '';

  //   // YouTube thumbnails
  //   if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
  //     const videoId = getYouTubeVideoId(videoUrl);
  //     if (videoId) {
  //       return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  //     }
  //   }
    
  //   // Vimeo thumbnails
  //   if (videoUrl.includes('vimeo.com')) {
  //     const videoId = getVimeoVideoId(videoUrl);
  //     if (videoId) {
  //       return `https://vumbnail.com/${videoId}.jpg`;
  //     }
  //   }
    
  //   // For direct video files or unsupported platforms, return the first property image
  //   return property?.images[0] || '';
  // };

  // Function to check if thumbnail exists
  const checkThumbnailExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Function to get best available YouTube thumbnail
  const getBestYouTubeThumbnail = async (videoId) => {
    const thumbnailQualities = [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/default.jpg`
    ];

    for (const thumbnailUrl of thumbnailQualities) {
      const exists = await checkThumbnailExists(thumbnailUrl);
      if (exists) {
        return thumbnailUrl;
      }
    }
    
    return thumbnailQualities[thumbnailQualities.length - 1];
  };

  // Effect to generate and set video thumbnail
  useEffect(() => {
    const generateThumbnail = async () => {
      if (!hasVideo || !property?.videoUrl) {
        setVideoThumbnail(property?.images[0] || '');
        return;
      }

      try {
        const videoUrl = property.videoUrl;
        
        if (property.videoThumbnail) {
          setVideoThumbnail(property.videoThumbnail);
          return;
        }

        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
          const videoId = getYouTubeVideoId(videoUrl);
          if (videoId) {
            const bestThumbnail = await getBestYouTubeThumbnail(videoId);
            setVideoThumbnail(bestThumbnail);
          } else {
            setVideoThumbnail(property.images[0] || '');
          }
        } else if (videoUrl.includes('vimeo.com')) {
          const videoId = getVimeoVideoId(videoUrl);
          if (videoId) {
            setVideoThumbnail(`https://vumbnail.com/${videoId}.jpg`);
          } else {
            setVideoThumbnail(property.images[0] || '');
          }
        } else {
          setVideoThumbnail(property.images[0] || '');
        }
      } catch (error) {
        console.error('Error generating video thumbnail:', error);
        setVideoThumbnail(property?.images[0] || '');
      }
    };

    generateThumbnail();
  }, [property, hasVideo]);

  // GSAP animation effect
  useEffect(() => {
    if (isLightboxOpen) {
      gsap.fromTo(".lightbox", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
  }, [isLightboxOpen]);

  // Reset loading states when lightbox opens
  useEffect(() => {
    if (isLightboxOpen) {
      setLoadingStates({});
      setErrorStates({});
    }
  }, [isLightboxOpen]);

  // Initialize loading state when media changes
  useEffect(() => {
    if (isLightboxOpen && loadingStates[currentIndex] === undefined) {
      setLoadingStates(prev => ({ ...prev, [currentIndex]: true }));
    }
  }, [currentIndex, isLightboxOpen, loadingStates]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  }
  
  const nextMedia = () => {
    setCurrentIndex((currentIndex + 1) % totalMediaItems);
  }
  
  const prevMedia = () => {
    setCurrentIndex((currentIndex - 1 + totalMediaItems) % totalMediaItems);
  }
  
  const togglePricing = () => {
    setPricing(!pricing);
  }
  
  const toggleAgentDetails = () => {
    setAgentDetails(!agentDetails);
  }
  
  const handleFavoriteToggle = async () => {
    await toggleFavorite(property._id);
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return '';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = getYouTubeVideoId(url);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }
    
    if (url.includes('vimeo.com')) {
      const videoId = getVimeoVideoId(url);
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }
    }
    
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return url;
    }
    
    return url;
  }

  // Handle media load
  const handleMediaLoad = (index) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    setErrorStates(prev => ({ ...prev, [index]: false }));
  };

  // Handle media error
  const handleMediaError = (index) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    setErrorStates(prev => ({ ...prev, [index]: true }));
  };

  // Handle retry for media
  const handleRetry = (index) => {
    setErrorStates(prev => ({ ...prev, [index]: false }));
    setLoadingStates(prev => ({ ...prev, [index]: true }));
  };

  // Function to render lightbox content
  const renderLightboxContent = () => {
    if (!property || mediaItems.length === 0) return null;

    const currentMedia = mediaItems[currentIndex];
    const isLoading = loadingStates[currentIndex];
    const hasError = errorStates[currentIndex];
    
    if (currentMedia.type === 'video') {
      return (
        <div className="relative w-full h-0 pb-[56.25%] shadow-lg">
          {isLoading && <LoadingSpinner type="video" />}
          {hasError && <ErrorState type="video" onRetry={() => handleRetry(currentIndex)} />}
          {!hasError && (
            <iframe
              src={getVideoEmbedUrl(currentMedia.url)}
              className={`absolute top-0 left-0 w-full h-full rounded-lg ${
                isLoading ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-300`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Property video tour"
              onLoad={() => handleMediaLoad(currentIndex)}
              onError={() => handleMediaError(currentIndex)}
            />
          )}
        </div>
      );
    } else {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && <LoadingSpinner type="image" />}
          {hasError && <ErrorState type="image" onRetry={() => handleRetry(currentIndex)} />}
          {!hasError && (
            <img
              src={currentMedia.url}
              alt={`Property image ${currentIndex + 1}`}
              className={`rounded-lg max-h-[70vh] w-auto object-contain shadow-lg ${
                isLoading ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-300`}
              onLoad={() => handleMediaLoad(currentIndex)}
              onError={() => handleMediaError(currentIndex)}
            />
          )}
        </div>
      );
    }
  };

  if (loading) return <div className="container py-4">Loading...</div>;
  if (!property) return <div className="container py-4">Property not found</div>;

  return (
    <div className="container py-4 space-y-8 relative">
      {/* Back button */}
      <button onClick={() => window.history.back()} className="absolute z-2 ml-2 mt-2 text-xs md:text-sm btn-secondary border border-light/5 text-light bg-light/20 backdrop-blur-xs text-shadow-sm shadow">
        <HiMiniChevronLeft className='text-lg -mr-2' />
        Go back
      </button>

      {/* Property images with video priority */}
      <div className={`property-images-grid relative rounded-md ${property.images.length < 4 ? "bg-dark/5" : "" }`}>
        {/* Video Thumbnail - Always first if video exists */}
        {hasVideo && (
          <div className="grid-item-1 relative group cursor-pointer" onClick={() => openLightbox(0)}>
            <img 
              src={videoThumbnail || null} 
              alt="Property video tour" 
              className="w-full h-full object-cover"
              loading='lazy'
              onError={(e) => {
                e.target.src = property.images[0] || null;
              }}
            />
            <div className="absolute inset-0 bg-dark/40 flex items-center justify-center group-hover:bg-dark/50 transition-all duration-300">
              <div className="bg-white/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                <FiPlay className="text-2xl text-dark ml-1" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 bg-dark text-white px-2 py-1 rounded text-xs font-semibold">
              Video Tour
            </div>
          </div>
        )}

        {/* Regular images */}
        {property.images.slice(0, hasVideo ? 3 : 4).map((img, index) => (
          <div 
            key={index} 
            className={`grid-item-${hasVideo ? index + 2 : index + 1}`}
          >
            <img 
              src={img} 
              alt={`Property ${index + 1}`} 
              className="w-full h-full object-cover cursor-pointer" 
              loading='lazy'
              onClick={() => openLightbox(hasVideo ? index + 1 : index)} 
            />
          </div>
        ))}

        {/* Show "More" button if there are more media items than displayed */}
        {totalMediaItems > (hasVideo ? 4 : 4) && (
          <button 
            className='flex items-center gap-1 absolute z-4 bottom-0 md:bottom-2 right-2 btn-tertiary py-1.5 w-fit cursor-pointer pointer-events-none rounded-full shadow text-xs' 
            onClick={() => openLightbox(hasVideo ? 4 : 4)}
          > 
            <AiOutlinePicture />
            More 
          </button>
        )}
      </div>

      {/* Combined Lightbox for Video and Images */}
      {isLightboxOpen && (
        <div className="fixed w-full h-full top-0 left-0 bg-light flex flex-col items-center justify-center z-50 p-0">
          <button
            className="absolute top-4 right-4 text-dark text-3xl font-bold cursor-pointer z-10 bg-dark/20 rounded-full w-8 h-8 flex items-center justify-center hover:bg-dark/40 transition-colors"
            onClick={closeLightbox}
          >
            &times;
          </button>

          <div className="relative max-w-4xl mx-auto w-full max-h-[80vh] px-4">
            {renderLightboxContent()}
            
            {/* Navigation arrows */}
            <button
              className="absolute w-10 h-10 top-1/2 left-0 transform -translate-y-1/2 text-dark bg-light rounded-full shadow text-xl flex items-center justify-center cursor-pointer hover:bg-light/90 transition-colors"
              onClick={prevMedia}
            >
              &#10094;
            </button>
            <button
              className="absolute w-10 h-10 top-1/2 right-0 transform -translate-y-1/2 text-dark bg-light rounded-full shadow text-xl flex items-center justify-center cursor-pointer hover:bg-light/90 transition-colors"
              onClick={nextMedia}
            >
              &#10095;
            </button>
          </div>

          {/* Media indicators */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {mediaItems.map((media, index) => (
              <span
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-8 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                  currentIndex === index 
                    ? media.type === 'video' ? 'bg-blue-600 scale-120' : 'bg-dark scale-125'
                    : 'bg-dark/20 hover:bg-dark/40'
                }`}
                title={media.type === 'video' ? 'Video Tour' : `Image ${index}`}
              ></span>
            ))}
          </div>

          {/* Media counter and type indicator */}
          <div className="text-dark mt-4 text-center">
            <p className="text-sm">
              {currentIndex + 1} / {totalMediaItems}
              {mediaItems[currentIndex]?.type === 'video' && ' • Video'}
            </p>
          </div>
        </div>
      )}

      {/* Rest of the component remains the same */}
      <div className='grid md:grid-cols-2 gap-4 space-y-8 pb-4'>
        <div className="flex flex-col items-start gap-1.5">
          <h3 className='text-xl font-extrabold uppercase'> {property.title} </h3>
          <p className="text-sm font-normal flex items-center gap-1"> <GrLocation /> {property.location} </p>
          <h3 className="text-4xl font-extrabold mt-4">
            {priceInfo.formatted}
            <span className='text-base font-normal text-dark/80'> 
              {priceInfo.description}
            </span>
          </h3>
          <button onClick={togglePricing} className="cursor-pointer font-semibold underline flex items-center gap-0">
            Pricing details and terms 
            <HiMiniChevronDown className='text-sm' />
          </button>

          {pricing && (
            <div className='bg-dark/80 w-full h-full fixed z-50 top-0 left-0 flex items-center justify-center px-4'> 
              <div className='bg-light h-68 w-lg mx-auto shadow-md rounded-sm p-6 flex flex-col items-start justify-between'>
                <div className='w-full flex items-center justify-between'>
                  <h4 className='text-lg font-extrabold'> Pricing Details </h4>
                  <button onClick={() => { setPricing(false)}} className="cursor-pointer text-dark text-2xl font-bold bg-dark/5 w-8 h-8 rounded-full shadow flex items-center justify-center">
                    &times;
                  </button>
                </div>
                <hr className='w-full my-2 border-dark/20' />
                <div>
                  <p> <strong> Price: </strong> ₦{property?.price} </p>
                  <p> <strong> Inspection Fee: </strong> ₦{property?.price} </p>
                  <p> <strong> Contract: </strong> ₦{property?.price} </p>
                </div>
                <hr className='w-full my-2 border-dark/20' />
                <p className='text-sm'> ⚠️ Disclaimer: Price mentioned on property is not subject to any changes. </p>
              </div>
            </div>
          )}

          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-dark/5 border border-dark/5 rounded-sm mt-4">
            <div className="text-center">
              <div className="font-semibold text-2xl">
                {property.propertyType}
                <span className='text-sm font-normal mt-1 block'> Property Type </span>
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl">
                {property.size}m²
                <span className='text-sm font-normal mt-1 block'> Size </span>
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl">
                {property.bedrooms}
                <span className='text-sm font-normal mt-1 block'> Bedrooms </span>
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl">
                {property.bathrooms}
                <span className='text-sm font-normal mt-1 block'> Bathrooms </span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5">
            <button className='btn-tertiary gap-1 truncate' title={property.agentName} onClick={toggleAgentDetails}>
              <span className="text-gray-600">Agent:</span>
              <span className="font-semibold overflow-hidden truncate"> {property?.agentName || "Realtor"} </span>
              <HiMiniChevronDown className='text-sm -ml-1' />
            </button>
            {agentDetails && (
              <div className='bg-dark/80 w-full h-full fixed z-50 top-0 left-0 flex items-center justify-center px-4'> 
                <div className='bg-light h-68 w-lg mx-auto shadow-md rounded-sm p-6 flex flex-col items-start justify-between'>
                  <div className='w-full flex items-center justify-between'>
                    <h4 className='text-lg font-extrabold'> Agent Details </h4>
                    <button onClick={() => { setAgentDetails(false)}} className="cursor-pointer text-dark text-2xl font-bold bg-dark/5 w-8 h-8 rounded-full shadow flex items-center justify-center">
                      &times;
                    </button>
                  </div>
                  <hr className='w-full my-2 border-dark/20' />
                  <div>
                    <p> <strong>Name: </strong> {property?.agentName} </p>
                    <p> <strong>Contact: </strong> {property?.agentNumber} </p>
                    <p> <strong>Email: </strong> {property?.agentEmail} </p>
                    <p> <strong>Social: </strong> {property?.social} </p>
                  </div>
                  <hr className='w-full my-2 border-dark/20' />
                  <p className='text-sm'> Trusted by multiple satisfied clients. </p>
                </div>
              </div>
            )}

            <button className="btn">Send a request</button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1"> About {property.propertyType} </h2>
            <p className="md:text-lg leading-relaxed mb-2">
              {property.description.length > 130 ? (
                showFullDescription ? property.description : property.description.slice(0, 130) + ".."
              ) : (
                property.description.slice(0, 130)
              )}
            </p>
            {property.description.length > 130 && (
              <button
                onClick={() => setShowFullDescription(prev => !prev)}
                className="font-semibold text-sm text-blue-600 underline cursor-pointer"
              >
                {showFullDescription ? "Show less" : "Full description"}
              </button>
            )}
          </div>

          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 md:mt-6">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <FiCheck className="text-green-500 mr-2" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>

          <div className='flex gap-1.5 mt-2'>
            <button 
              className={`btn-tertiary flex items-center gap-2 ${isFavorite(property._id) ? 'text-red-500' : ''}`}
              onClick={handleFavoriteToggle}
            >
              {isFavorite(property._id) ? <HiHeart className="text-red-500" /> : <HiOutlineHeart />}
              {isFavorite(property._id) ? 'Saved' : 'Save'}
            </button>
            <button className='btn-tertiary'> <HiMiniShare /> Share </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;