import AppBanner from '@/components/modules/home/AppBanner';
import Category from '@/components/modules/home/Category';
import FeaturedMeals from '@/components/modules/home/FeaturedMeals';
import HeroSection from '@/components/modules/home/HeroSection';
import React from 'react';
export const dynamic = 'force-dynamic';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <Category />
      <FeaturedMeals />
      <AppBanner />
    </div>
  );
};

export default HomePage;
