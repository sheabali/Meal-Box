import ProductBanner from '@/components/modules/products/banner';
import MealDetails from '@/components/modules/products/productDetails';
import NMContainer from '@/components/ui/core/MBContainer';
import { getSingleMeal } from '@/services/meal';

import React from 'react';

const MealDetailsPage = async ({
  params,
}: {
  params: Promise<{ mealsId: string }>;
}) => {
  const { mealsId } = await params;
  const { data: meal } = await getSingleMeal(mealsId);

  return (
    <NMContainer>
      <ProductBanner title="Meal - Details" path="Home - Meal - Meal Details" />
      <MealDetails meal={meal} />
    </NMContainer>
  );
};

export default MealDetailsPage;
