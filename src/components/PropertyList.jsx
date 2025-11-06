import React, { useContext } from 'react';
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { FavoritesContext } from "../contexts/FavoritesContext";
import { PropertyContext } from '../contexts/PropertyContext';
import { LiaBedSolid } from "react-icons/lia";
import { LiaBathSolid } from "react-icons/lia";

const PropertyList = ({ property }) => {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const { getFormattedPrice } = useContext(PropertyContext);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(property._id);
  };

  const priceInfo = getFormattedPrice(property);

  return (
    <div className='w-full flex items-center hover:shadow-md rounded-sm overflow-hidden bg-light relative group'>
      {/* Property Type Badge */}
      <div className={`absolute z-1 top-2 left-2 px-2 py-1 shadow rounded Capitalize text-xs font-medium pointer-events-none bg-light/80 backdrop-blur-xs text-dark`}>
        {property.propertyType}
      </div>

      {/* Transaction Type Badge */}
      <div className={`absolute z-1 top-9.5 left-2 px-2 py-1 shadow rounded text-xs font-semibold pointer-events-none ${priceInfo.badge}`}>
        {priceInfo.transactionType}
      </div>


      <Link to={`/property/${property._id}`} onClick={() => { scrollTo(0,0); }} className='w-[50%] h-full overflow-hidden'>
        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover aspect-8/10 md:aspect-5/4 scale-[1.04] group-hover:scale-[1] transition-all duration-500" loading='lazy' />
      </Link>
      <div className='p-4 py-3 w-full space-y-1'>
        <div className='w-full flex items-center justify-between'>
          <h3 className="text-lg font-extrabold"> 
            {priceInfo.formatted}
            {priceInfo.suffix && (
              <span className='text-dark/80 text-sm font-normal'> {priceInfo.suffix} </span>
            )}
          </h3>
          <button className={`btn-secondary p-1 rounded-full ${isFavorite(property._id) ? 'text-red-500' : ''}`}
            onClick={handleFavoriteClick}>
            {isFavorite(property._id) ? <HiHeart className="text-lg" /> : <HiOutlineHeart className="text-lg" />}
          </button>
        </div>
        <p className='text-sm uppercase font-bold'> {property.title} </p>
        <p className='text-sm text-dark/60 font-semibold'> {property.location} </p>
        <p className='text-dark/80 text-xs mt-2 hidden sm:flex'> {property.description.slice(0,60) + "..."} </p>
        <p className='space-x-2 text-dark/80 flex items-center'>
          {property.bedrooms > 1 && (
            <span className='text-xs md:text-sm flex items-center gap-2'> 
              {property.bedrooms} beds 
              <LiaBedSolid className='hidden sm:flex' /> 
            </span>
          )}

          {property.bathrooms > 1 && (
            <span className='text-xs md:text-sm flex items-center gap-2'>
              • &nbsp;
              {property.bathrooms} baths 
              <LiaBathSolid className='hidden sm:flex' /> 
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default PropertyList;