import { Button } from '@/components/ui/button';
import NMContainer from '@/components/ui/core/MBContainer';
import ProductCard from '@/components/ui/core/ProductCard';

import { getAllMeals } from '@/services/meal';

import { IMeal } from '@/types/meal';
import Link from 'next/link';

const FeaturedMeals = async () => {
  const { data: products } = await getAllMeals();
  const { meals } = products;

  return (
    <NMContainer>
      <div className="bg-white bg-opacity-50 py-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl">Featured Meals</h2>
            <Link href="/meals">
              <Button variant="outline" className="rounded-full">
                All Collection
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-8 my-5">
            {meals?.slice(0, 5)?.map((product: IMeal, idx: number) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        </div>
      </div>
    </NMContainer>
  );
};

export default FeaturedMeals;
