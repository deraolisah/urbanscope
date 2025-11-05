import React, { useState, useEffect, useRef } from 'react';
import hero from '../../assets/hero.png';
import heroImg from '../../assets/hero-img.png';
import heroImg1 from '../../assets/hero-img-1.png';
import heroImg2 from '../../assets/hero-img-2.png';
import heroImg3 from '../../assets/hero-img-3.png';
import { HiMiniArrowRight } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import gsap from 'gsap';


const images = [ heroImg1, heroImg, heroImg2, heroImg3 ]; // Replace with actual image imports

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  

  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const formRef = useRef(null);
  const imageRef = useRef(null);
  

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    
    tl.fromTo(headingRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power3.out' })
    .fromTo(paragraphRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, "-=0.4")
    .fromTo(formRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, "-=0.4");

    tl.fromTo(imageRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, "-=0.6");
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const nextSlide = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prevSlide = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex]);




  return (
    <section className="container py-10 overflow-x-hidden">
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8'>
        <h1 ref={headingRef} className='text-4xl md:text-5xl lg:text-7xl font-extrabold -mb-2'>
          FIND YOUR<br />PERFECT HOME
        </h1>
        <div className='flex flex-col gap-4 md:max-w-md'>
          <p ref={paragraphRef} className='text-md md:pr-[20%]'>
            UrbanScope provides investors and innovators with the opportunity to grow... You are guaranteed to find a property that suits you.
          </p>
          <Link ref={formRef} to="/explore" className='flex gap-0'>
            <input
              type='search'
              placeholder='Enter country, city or region'
              className='w-fit flex-1 px-4 py-3 border border-dark/20 border-r-0 rounded-l-lg focus:outline-none focus:border-dark'
            />
            <button className='btn w-fit rounded-l-none rounded-r-lg'>
              <HiMiniArrowRight />
            </button>
          </Link>
        </div>
      </div>

      {/* HERO IMAGE */}
      <div className='overflow-hidden rounded-lg shadow-lg mt-6 md:mt-8'>
        <img
          ref={imageRef}
          src={hero}
          alt='Modern apartment building'
          className='w-full cursor-pointer hover:scale-[1.008] transition-all duration-300'
          loading='lazy'
          onClick={() => openLightbox(0)}
          />
      </div>

      {/* LIGHTBOX MODAL */}
      {isOpen && (
        <div className="fixed inset-0 w-full h-full bg-light flex flex-col items-center justify-center z-50">
          <button className="absolute top-4 right-4 text-dark text-3xl font-bold cursor-pointer z-10 bg-dark/20 rounded-full w-8 h-8 flex items-center justify-center hover:bg-dark/40 transition-colors" onClick={closeLightbox}> &times; </button>
          <div className="relative max-w-3xl mx-auto w-full px-4">
            <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="rounded-lg w-full max-h-100 object-cover shadow-lg" loading='lazy' />
            <div className="absolute w-8 h-8 top-1/2 left-0 transform -translate-y-1/2 text-dark bg-light rounded-full shadow text-xl flex items-center justify-center cursor-pointer" onClick={prevSlide}>&#10094;</div>
            <div className="absolute w-8 h-8 top-1/2 right-0 transform -translate-y-1/2 text-dark bg-light rounded-full shadow text-xl flex items-center justify-center cursor-pointer" onClick={nextSlide}>&#10095;</div>
          </div>
          <div className='flex items-center justify-center gap-3 my-4'>
            {images.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-8 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                  currentIndex === index ? 'bg-dark scale-120' : 'bg-dark/20 hover:bg-dark/40'
                }`}
              ></span>
            ))}
          </div>
          <p className="text-dark mt-2 text-sm">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </section>
  );
};

export default Hero;