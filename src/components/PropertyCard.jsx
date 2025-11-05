import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { PropertyContext } from '../contexts/PropertyContext';
import { BsArrowUpRight } from "react-icons/bs";
import { LiaBedSolid } from "react-icons/lia";
import { LiaBathSolid } from "react-icons/lia";

const PropertyCard = ({ property }) => {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const { getFormattedPrice } = useContext(PropertyContext);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(property._id);
  };

  const priceInfo = getFormattedPrice(property);

  {property.status === "inactive" ? (
    ""
  ) : (
    ""
  )}

  return (
    <div className='w-full flex flex-col items-start hover:shadow-md rounded-sm overflow-hidden bg-light relative group'>
      {/* Transaction Type Badge */}
      <div className={`absolute z-1 top-2 left-2 px-2 py-1 shadow rounded text-xs font-semibold pointer-events-none ${priceInfo.badge}`}>
        {priceInfo.transactionType}
      </div>
      {/* Property Type Badge */}
      <div className={`absolute z-1 top-2 left-14 px-2 py-1 shadow rounded lowercase text-xs font-semibold pointer-events-none bg-light/80 backdrop-blur-xs text-dark`}>
        {property.propertyType}
      </div>

      <div className={`absolute z-1 top-2 right-2 px-2 py-1 shadow rounded text-sm font-semibold pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 ${priceInfo.badge}`}>
        <BsArrowUpRight />
      </div>

      {/* <div className={`absolute top-0 right-0 w-full h-full z-1 bg-dark/15 px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300`}>
      </div> */}
      
      <Link to={`/property/${property._id}`} onClick={() => { scrollTo(0,0); }} className='w-full aspect-16/8 md:aspect-16/9 overflow-hidden'>
        <img src={property.images[0]} alt={property.title} className="w-full object-cover object-center scale-[1.06] group-hover:scale-[1.02] transition-transform duration-500 ease-in-out" loading='lazy' />
      </Link>
      <div className='p-4 py-3 w-full space-y-1'>
        <div className='w-full flex items-center justify-between'>
          <div>
            <h3 className="text-lg font-extrabold"> 
              {priceInfo.formatted}
              {priceInfo.suffix && (
                <span className='text-dark/80 text-sm font-normal'> {priceInfo.suffix} </span>
              )}
            </h3>
          </div>
          <button 
            className={`btn-secondary p-1 rounded-full ${isFavorite(property._id) ? 'text-red-500' : ''}`}
            onClick={handleFavoriteClick}
          >
            {isFavorite(property._id) ? <HiHeart className="text-lg" /> : <HiOutlineHeart className="text-lg" />}
          </button>
        </div>
        <p className='text-sm uppercase font-bold line-clamp-1 truncate'> {property.title} </p>
        <p className='text-sm text-dark/60 space-x-2 font-semibold flex items-center line-clamp-1 text-nowrap truncate'> 
          <span className=''> 
            {property.location} 
          </span>
          <span> • </span> 
          <span className='text-xs flex items-center gap-1'> 
            {property.bedrooms} beds 
            {/* <LiaBedSolid className='text-sm' />  */}
          </span>
          <span> • </span> 
          <span className='text-xs flex items-center gap-1'> 
            {property.bathrooms} baths 
            {/* <LiaBathSolid  className='text-sm' />  */}
          </span>
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;