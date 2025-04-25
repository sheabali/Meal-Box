import ProductCard from '@/components/ui/core/ProductCard';
import React from 'react';
import FilterSidebar from '../filterSidebar';
import { IMeal } from '@/types/meal';

const AllProducts = ({ meal }: { meal: IMeal[] }) => {
  return (
    <div className="flex gap-8 my-21">
      <div className="w-full max-w-sm ">
        <FilterSidebar />
      </div>
      <div className="grid grid-cols-3 gap-8 ">
        {meal?.map((meal: IMeal, idx: number) => (
          <ProductCard key={idx} product={meal} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
