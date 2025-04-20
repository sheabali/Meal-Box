import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/ui/core/CategoryCard';

import NMContainer from '@/components/ui/core/MBContainer';

import Link from 'next/link';

const Category = async () => {
  const categories = [
    {
      name: 'Breakfast',
      icon: 'https://i.ibb.co.com/DfJ6mkfD/24459.jpg',
    },
    {
      name: 'Lunch',
      icon: 'https://i.ibb.co.com/0pdGd8KJ/4415.jpg',
    },
    {
      name: 'Dinner',
      icon: 'https://i.ibb.co.com/DjtXKSx/7043.jpg',
    },
    {
      name: 'Dessert',
      icon: 'https://i.ibb.co.com/pgMjHYK/15452.jpg',
    },
    {
      name: 'Salad',
      icon: 'https://i.ibb.co.com/vCLG2gtV/20128.jpg',
    },
    {
      name: 'Drink',
      icon: 'https://i.ibb.co.com/kVdJMMjY/44206.jpg',
    },
  ];
  return (
    <NMContainer>
      <div className=" mx-auto my-20">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Category</h2>
          <Link href="/products">
            <Button variant="outline" className="rounded-full">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-6 gap-8 my-5">
          {categories.map((category, idx: number) => (
            <CategoryCard key={idx} category={category} />
          ))}
        </div>
      </div>
    </NMContainer>
  );
};

export default Category;
