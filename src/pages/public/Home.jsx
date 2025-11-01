import React from 'react';
import Hero from '../../components/home/Hero.jsx';
import FeaturedProperties from '../../components/home/FeaturedProperties.jsx';
import Partners from '../../components/home/Partners.jsx';
import Articles from '../../components/home/Articles.jsx';
import Newsletter from '../../components/home/Newsletter.jsx';

const Home = () => {
  return (
    <div className="">
      <Hero />
      <FeaturedProperties />
      <Partners />
      <Articles />
      <Newsletter />
    </div>
  );
};

export default Home;