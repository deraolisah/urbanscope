// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-6"> About UrbanScope </h2>
      <p className="text-lg text-gray-700 leading-relaxed">
        We are dedicated to helping you find your perfect home with over 1,000 apartments 
        available across the city. Our experienced agents are committed to providing 
        exceptional service.
      </p>

      <hr className='w-full border-dark/10 my-12 mx-auto' />

      <section className="bg-dark/5 p-4 py-8 rounded-xl flex flex-col md:flex-row items-start gap-y-8 gap-x-10">
        <div className='w-full'>
          <h6 className='text-sm'> By the Numbers </h6>
          {/* <h2 className="text-3xl md:text-4xl font-bold mt-4"> Fueling Urban <br className='hidden md:flex' /> Growth </h2> */}
          <p className="text-gray-700 max-w-lg my-4">
            <span className='text-2xl md:text-3xl text-dark font-bold'> Fueling Urban Growth </span>
            and smart living, using deals run through the platform. UrbanScope Realty connects thousands of home seekers with properties that match their lifestyle and goals. Our deep market insight allows us to identify housing gaps and deliver innovative solutions that bridge them.
          </p>
          <div className='w-full md:w-1/2 h-32 md:h-24 bg-dark rounded flex '></div>
        </div>

        <div className="w-full md:w-3/4">
          <div>
            <h3 className="text-8xl font-extrabold text-dark leading-[0.8]"> ₦1.2B+ </h3>
            <p className="text-sm text-gray-600 mt-2"> Property Value Listed </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-6 mt-12 border-t border-dark/10 pt-8">
            <div className='flex flex-col'>
              <h3 className="text-5xl font-extrabold text-dark"> 35+ </h3>
              <p className="text-sm text-gray-600 mt-2"> Verified Listings </p>
            </div>
            <div className='flex flex-col'>
              <h3 className="text-5xl font-extrabold text-dark"> 100+ </h3>
              <p className="text-sm text-gray-600 mt-2"> Happy Clients </p>
            </div>
            <div className='flex flex-col'>
              <h3 className="text-5xl font-extrabold text-dark"> 15+ </h3>
              <p className="text-sm text-gray-600 mt-2"> Active Agents </p>
            </div>
            <div className='flex flex-col'>
              <h3 className="text-5xl font-extrabold text-dark"> 98% </h3>
              <p className="text-sm text-gray-600 mt-2"> Client Satisfaction Rate </p>
            </div>
          </div>

        </div>
      </section>
    </section>
  );
};

export default About;