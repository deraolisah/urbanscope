import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Partners = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    gsap.to(section, {
      backgroundColor: '#fff',
      color: '#1d1d1b',
      scrollTrigger: {
        trigger: section,
        start: 'center center',
        end: 'bottom center',
        scrub: true,
      },
    });
  }, []);

  return (
    <section ref={sectionRef} className='container py-10 bg-dark text-light transition-colors duration-0 relative'>
      <h2 className='text-2xl md:text-4xl lg:text-5xl font-bold text-center leading-tight mb-4 md:mb-8'> Better together. </h2>
      <p className='text-center'>
        UrbanScopre partners with industry leaders. 
        Our premier partnership program assembles top professionals to deliver comprehensive expertise & support.
      </p>
    </section>
  )
}

export default Partners;