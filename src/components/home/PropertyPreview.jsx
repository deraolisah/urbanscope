import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HiMiniArrowRight } from "react-icons/hi2";
import { PropertyContext } from '../../contexts/PropertyContext';

const PropertyPreview = ({ property }) => {
  const { getFormattedPrice } = useContext(PropertyContext);
  const priceInfo = getFormattedPrice(property);

  return (
    <div className="lg:min-w-full min-w-[320px] transition-colors duration-200 rounded-lg m-0 group">
      <h3 className="font-medium text-base capitalize whitespace-nowrap overflow-hidden text-ellipsis w-full mb-1">{property.title}</h3>
      

      <div className="flex flex-col justify-between items-start gap-0 relative overflow-hidden rounded">
        {/* Transaction Type Badge */}
        <div className={`absolute top-2 left-2 z-10 px-2 py-1 shadow rounded text-xs font-semibold pointer-events-none h-fit ${priceInfo.badge}`}>
          {priceInfo.transactionType}
        </div>

        <div className='relative h-full'>
          <div className='bg-dark/30 w-full h-full rounded absolute z-1 inset-0 select-none'></div>
          <Link to={`/property/${property._id}`} className="flex btn border-0 text-light bg-light/20 backdrop-blur-xs !p-2.5 w-fit rounded-full absolute z-2 bottom-2 right-2 shadow" onClick={() => { scrollTo(0,0)}}>
            {/* View details  */}
            <HiMiniArrowRight />
          </Link>

          {property.images && (
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded z-0">
              <Link to={`/property/${property._id}`} onClick={() => scrollTo(0, 0)} className="block w-full h-full">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover scale-[1.08] group-hover:scale-[1] transition-transform duration-500 ease-in-out"
                  loading="lazy"
                />
              </Link>
            </div>
          )}

          {property.price && (
            <p className="text-xl md:text-2xl font-extrabold absolute bottom-2 left-2 z-2 text-light bg-light/20 border border-light/5 backdrop-blur-xs rounded px-2 shadow"> 
              {priceInfo.formatted}
              {priceInfo.suffix && (
                <span className='font-normal text-base'> {priceInfo.suffix} </span>
              )}
            </p>
          )}
        </div>
        <div className='mt-2'>
          <p className="font-medium text-xs"> {property.location} </p>
          <p className="text-sm"> {property.description.slice(0,68) + "..."} </p>        
        </div>
      </div>
    </div>
  );
};

export default PropertyPreview;