import ManageMeals from '@/components/modules/provider';
import { getAllMeal } from '@/services/meal';
import React from 'react';

const ManageMeal = async () => {
  const { data: meal } = await getAllMeal();

  const { meals } = meal;

  return (
    <div>
      <ManageMeals meals={meals} />
    </div>
  );
};

export default ManageMeal;
