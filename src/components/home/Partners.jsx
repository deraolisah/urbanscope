import LogoTicker from './LogoTicker.jsx';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

const Partners = () => {
  // const sectionRef = useRef(null);

  // useEffect(() => {
  //   const section = sectionRef.current;

  //   gsap.to(section, {
  //     backgroundColor: '#fff',
  //     color: '#1d1d1b',
  //     scrollTrigger: {
  //       trigger: section,
  //       start: 'center center',
  //       end: 'bottom center',
  //       scrub: true,
  //     },
  //   });
  // }, []);

  return (
    <section className='container py-10 transition-colors duration-0 relative'>
      <h2 className='text-2xl md:text-4xl lg:text-5xl font-bold text-center leading-tight uppercase mb-4'> Better together </h2>
      <p className='text-center max-w-xl mx-auto'>
        We partner with industry leaders. 
        Our premier partnership program assembles top professionals to deliver comprehensive expertise & support.
      </p>
      <LogoTicker />
    </section>
  )
}

export default Partners;